import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Payments } from 'src/app/models/payments.model';
import { NavigationService } from 'src/app/service/navigation.service';
import { PaymentsService } from 'src/app/service/payments.service';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from 'pdfmake/interfaces';

(pdfMake as any).vfs=pdfFonts.pdfMake.vfs;
@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css']
})
export class PaymentsComponent implements OnInit {
  payments:Payments[]=[];
  paymentForm!: FormGroup;
  selectedPayment!: Payments;
  showEditForm: boolean = false;
  selectedFilter: string = '';
  totalAmount: number | null = null;
  paymentStatus: string = '';
  paymentId: number | null = null;
  paymentDate: Date | null = null;
  userPolicyId:number=0;
  currentPage: number = 1;
  pageSize: number = 7;


  constructor(private paymentsService: PaymentsService,private fb:FormBuilder,private datePipe: DatePipe,private navigationService: NavigationService ) { }

  ngOnInit(): void {
    this.navigationService.disableBackButton();
    if(this.isUserLoggedIn())
    {
      this.getPaymentsByUserId();
    }
    else if(this.isAdminLoggedIn()){
      this.getAllPayments();
    }
   
    this.paymentForm = this.fb.group({
      paymentDate: ['', Validators.required],
      paymentStatus: ['', Validators.required],
      totalAmount: ['', Validators.required],
      fine: [''],
      paymentMethod: ['', Validators.required]
    });
  }


  getAllPayments() {
    this.paymentsService.getAllPayments().subscribe(
      (data) => {
        console.log(data);
        this.payments = data;
      },
      (error) => {
        console.error('Error fetching payments:', error);
      }
    );
  }
  get paginatedPayments(): Payments[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.payments.slice(startIndex, startIndex + this.pageSize);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  get totalPages(): number {
    return Math.ceil(this.payments.length / this.pageSize);
  }

  searchPayments() {
    switch (this.selectedFilter) {
      case 'paymentId':
        if (this.paymentId) {
          this.paymentsService.getPaymentById(this.paymentId).subscribe(
            (data) => {
              this.payments = [data];
            },
            (error) => {
              if(error.status===404 || error.status===409){
                alert("No payments found with the specified Id");
              }
              else{
                console.log(error);
            }
            }
          );
        }
        break;

        case 'paymentDate':
          if (this.paymentDate) {
            const formattedDate = this.datePipe.transform(this.paymentDate, 'yyyy-MM-dd') || '';
            const dateObject = new Date(formattedDate);
            this.paymentsService.getPaymentsByDate(dateObject).subscribe(
              (data) => {
                this.payments = data;
              },
              (error) => {
                if(error.status===404 || error.status===409){
                  alert("No payments are done on specified date");
                }
                else{
                  console.log(error);
              }
              }
            );
          }
          break;
  
      default:
        break;
    }
  }
  isAdminLoggedIn() {
    return localStorage.getItem('token') !== null && localStorage.getItem('userType') === 'Admin';
  }

  isUserLoggedIn() {
    return localStorage.getItem('token') !== null && localStorage.getItem('userType') === 'User';
  }
  getPaymentsByUserId() {
    this.paymentsService.getPaymentsByUserId(localStorage.getItem('userId')).subscribe(
      (response) => {
        this.payments= response;
      },
      (error) => {
        console.log('Error fetching user policies:', error);
        this.payments = [];
      }
    );
  }
  generatePDF(payment: Payments) {
    let docDefinition: TDocumentDefinitions = {
      content: [
        { text: 'Invoice', bold: true, alignment: 'center' },
        {
          table: {
            widths: ['auto', '*'],
            body: [
              ['User Policy Id', payment.userPolicies?.userPolicyId || 'N/A'],
              ['User Policy Name', payment.userPolicies?.policy?.policyName || 'N/A'],
              ['Payment ID', payment.paymentId],
              ['Payment Date', payment.paymentDate],
              ['Payment Status', payment.paymentStatus],
              ['Total Amount', payment.totalAmount],
              ['Fine', payment.fine],
              ['Payment Method', payment.paymentMethod],
              
            ]
          }
        }
      ]
    };
  
    pdfMake.createPdf(docDefinition).open();
  }
  
  
  
  
}