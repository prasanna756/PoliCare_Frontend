import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Claims } from 'src/app/models/claims.model';
import { Payments } from 'src/app/models/payments.model';
import { UserPolicies } from 'src/app/models/userpolicies.model';
import { ClaimService } from 'src/app/service/claim.service';
import { NavigationService } from 'src/app/service/navigation.service';
import { PaymentsService } from 'src/app/service/payments.service';
import { UserPoliciesService } from 'src/app/service/user-policies.service';

@Component({
  selector: 'app-user-policies',
  templateUrl: './user-policies.component.html',
  styleUrls: ['./user-policies.component.css']
})
export class UserPoliciesComponent implements OnInit {
  userPolicies: UserPolicies[] = [];
  response: any;
  editUPForm!: FormGroup;
  showEditForm = false;
  selectedUP!: UserPolicies;
  selectedFilterMethod: string = '';
  userPolicyId: number = 0;
  userId: number = 0;
  claimForm!: FormGroup;
  showClaimForm = false;
  payForm!: FormGroup;
  showPayForm = false;
  cardForm!: FormGroup;
  showCardForm = false;
  netBankingForm!: FormGroup;
  showNetBankingForm = false;
  currentPage: number = 1;
  pageSize: number = 5;
  currentDate: Date = new Date();

  claims: Claims = {
    claimId: 0,
    claimDate: new Date(),
    claimAmount: 0,
    claimStatus: '',
    userPolicyId: 0,
    userId: 0
  };
  payments: Payments = {
    paymentId: 0,
    paymentDate: new Date(),
    paymentStatus: 'Completed',
    totalAmount: 0,
    fine: 0,
    paymentMethod: '',
    cardNumber: '',
    expiryDate: new Date(),
    cvv: '',
    cardHolder: '',
    bankName: '',
    accountNumber: '',
    userPolicyId: 0,
    userId: 0
  }
  payment: Payments[] = [];



  constructor(private userPoliciesService: UserPoliciesService, private router: Router, private formbuilder: FormBuilder, private claimService: ClaimService,
    private paymentService: PaymentsService, private navigationService: NavigationService) {

  }

  ngOnInit(): void {
    this.navigationService.disableBackButton();
    this.claimForm = this.formbuilder.group({
      claimId: [],
      // claimDate: ['', Validators.required],
      claimAmount: [ , [Validators.required,Validators.min(0)]],
      claimStatus: ['Pending' || 'Approved' || 'Rejected']
    });
    this.payForm = this.formbuilder.group({
      paymentId: [],
      paymentStatus: ['Completed'],
      totalAmount: [0, Validators.required],
      fine: [0, Validators.required],
      paymentMethod: ['', Validators.required],
    });
    this.cardForm = this.formbuilder.group({
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      expiryDate: ['', [Validators.required, Validators.pattern("^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$")]],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]],
      cardHolder: ['', [Validators.required, Validators.pattern('^[a-zA-Z\\s]+$')]],
    });
    this.netBankingForm = this.formbuilder.group({
      bankName: ['', [Validators.required, Validators.pattern('^[a-zA-Z\\s]+$')]],
      accountNumber: ['', [Validators.required, Validators.pattern(/^\d{9,18}$/)]],
    });

    if (this.isUserLoggedIn()) {
      this.getUserPoliciesByUserId();
    } else if (this.isAdminLoggedIn()) {
      this.getAllUserPolicies();
      this.editUPForm = this.formbuilder.group({
        startDate: ['', Validators.required],
        durationInYears: ['', Validators.required],
        policyId: ['', Validators.required]
      });
    }
    this.updatePageSize();
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    // Call function to update page size based on screen size
    this.updatePageSize();
  }

  // Update page size based on screen width
  updatePageSize() {
    if ( window.innerWidth >= 710 && window.innerWidth <= 1024) {
      this.pageSize = 15; // Set page size for smaller screens
    } 
    else if(window.innerWidth <= 710) {
      this.pageSize = 15; 
    }
    else {
      this.pageSize = 5; // Set default page size for larger screens
    }
  }

  registerClaim(userPolicy: UserPolicies): void {
    this.showClaimForm = true;
    this.selectedUP = userPolicy;
  }

  makePayment(userPolicies: UserPolicies): void {
    this.showPayForm = true;
    this.selectedUP = userPolicies;
    this.calculateFine(this.currentDate, this.selectedUP);
}
onPaymentMethodChange(event: Event): void {
  const value = (event.target as HTMLSelectElement).value;
    if (value === 'Card' || value === 'Net Banking') {
      this.selectedFilterMethod = value;
    }
      if (this.selectedFilterMethod === 'Card') {
          this.showCardForm = true;
          this.showNetBankingForm = false;
      } else if (this.selectedFilterMethod === 'Net Banking') {
          this.showCardForm = false;
          this.showNetBankingForm = true;
      } else {
          this.showCardForm = false;
          this.showNetBankingForm = false;
      }
  
}


  onPay(): void {
    this.payments.userPolicyId = this.selectedUP.userPolicyId;
    this.payments.userId = localStorage.getItem('userId');
    this.payments.paymentDate = this.currentDate;
    this.payments.paymentMethod = this.payForm.value.paymentMethod;
    this.payments.paymentStatus = "Completed";
    if (this.payments.paymentMethod === 'Card') {
      this.payments.cardNumber = this.cardForm.value.cardNumber;
      this.payments.expiryDate = this.cardForm.value.expiryDate;
      this.payments.cvv = this.cardForm.value.cvv;
      this.payments.cardHolder = this.cardForm.value.cardHolder;
    }
    else if (this.payments.paymentMethod === 'Net Banking') {
      this.payments.bankName = this.netBankingForm.value.bankName;
      this.payments.accountNumber = this.netBankingForm.value.accountNumber;
    }
    this.paymentService.makePayment(this.payments).subscribe(data => {
      this.showPayForm = false;
      console.log('Payment made successfully', data);
      alert('Payment made successfully');
      this.router.navigate(['/payments'])
    }, error => {
      console.error('Error making payment:', error);
      alert('Failed to make payment');
    });
  }

  onRegister() {
    this.claims.userPolicyId = this.selectedUP.userPolicyId;
    this.claims.userId = localStorage.getItem('userId');
    this.claims.claimDate = this.currentDate;
    this.claims.claimAmount = this.claimForm.value.claimAmount;
    this.claims.claimStatus = "Pending";
    this.claimService.registerClaim(this.claims).subscribe(
      responseData => {
        console.log(responseData);
        alert("Claim Registered Success");
        this.router.navigate(['/claims']);
      },
      error => {
        console.log(error);
        console.log("failed to register");
        alert("Claim Registration failed");
        window.location.reload();
      }
    );
  }

  editUserPolicy(userPolicy: UserPolicies) {
    this.selectedUP = userPolicy;
    this.editUPForm.patchValue({
      startDate: userPolicy.startDate,
      durationInYears: userPolicy.durationInYears,
      policyId: userPolicy.policy?.policyId
    });
    this.showEditForm = true;
  }

  onSubmit() {
    if (this.editUPForm.valid) {
      const updateUserPolicy: UserPolicies = {
        userPolicyId: this.selectedUP.userPolicyId,
        startDate: this.editUPForm.value.startDate,
        durationInYears: this.editUPForm.value.durationInYears,
        policyId: this.editUPForm.value.policyId,
        userId: this.selectedUP.userId
      };

      this.userPoliciesService.updateUserPolicies(updateUserPolicy).subscribe(
        () => {
          this.showEditForm = false;
          this.getAllUserPolicies();
        },
        (error: any) => {
          console.error('Error updating user policy', error);
          alert('Failed to update user policy');
        }
      );
    }
  }

  get f() {
    return this.editUPForm.controls;
  }
  get f1() {
    return this.claimForm.controls;
  }
  get f2() {
    return this.payForm.controls;
  }
  get f3() {
    return this.cardForm.controls;
  }
  get f4() {
    return this.netBankingForm.controls;
  }
  getUserPoliciesByUserId() {
    this.userPoliciesService.getUserPoliciesbyUserId(localStorage.getItem('userId')).subscribe(
      (response) => {
        this.userPolicies = response;
      },
      (error) => {
        if (error.status === 404 || error.status === 409) {
          alert("You haven't registered for any policy yet");
        }
        else {
          console.log(error);
        }
        this.userPolicies = [];
      }
    );
  }

  getAllUserPolicies() {
    this.userPoliciesService.getAllUserPolicies().subscribe(
      (response) => {
        this.userPolicies = response;
      },
      (error) => {
        console.log('Error fetching user policies:', error);
        alert('Failed to fetch user policies');
        this.userPolicies = [];
      }
    );
  }
  get paginatedUserPolicies(): UserPolicies[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.userPolicies.slice(startIndex, startIndex + this.pageSize);
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
    return Math.ceil(this.userPolicies.length / this.pageSize);
  }


  isAdminLoggedIn() {
    return localStorage.getItem('token') !== null && localStorage.getItem('userType') === 'Admin';
  }

  isUserLoggedIn() {
    return localStorage.getItem('token') !== null && localStorage.getItem('userType') === 'User';
  }

  onFilterMethodChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    if (value === 'getUserPolicyByUserPolicyId' || value === 'getUserPolicyByUserId') {
      this.selectedFilterMethod = value;
    }
  }

  onGetUserPolicyByUserPolicyId(): void {
    this.getUserPolicyByUserPolicyId(this.userPolicyId);
  }

  getUserPolicyByUserPolicyId(userPolicyId: number): void {
    if (userPolicyId > 0) {
      this.userPoliciesService.getUserPolicyByUserPolicyId(userPolicyId).subscribe(
        (response: UserPolicies) => { // Expecting a single UserPolicies object
          this.userPolicies = [response]; // Wrap the single object in an array
        },
        (error) => {
          if (error.status === 404 || error.status === 409) {
            alert("There are no policies registered with this Id");
          }
          else {
            console.log(error);
          }
        }
      );
    } else {
      console.error('Please enter a valid Id');
    }
  }

  onGetUserPolicyByUserId(): void {
    this.getUserPolicyByUserId(this.userId);
  }

  getUserPolicyByUserId(userId: number): void {
    if (this.userId > 0) {
      this.userPoliciesService.getUserPoliciesbyUserId(userId).subscribe(
        (response) => {
          this.userPolicies = response; // Update policies array with the fetched policies
        },
        (error) => {
          if (error.status === 404 || error.status === 409) {
            alert("There are no policies registered for this user");
          }
          else {
            console.log(error);
          }
        }
      );
    } else {
      console.error('Please enter a valid Id');
    }
  }



  calculateFine(paymentDate: Date, userPolicies: UserPolicies): void {
    const policy = userPolicies.policy;
    if (!policy) {
      console.error('Policy is undefined');
      return;
    }

    const termPeriod = policy.termPeriod;
    const startDate = new Date(userPolicies.startDate);
    let dueDate: Date | null = null;

    if (termPeriod === "Monthly") {
      dueDate = new Date(startDate.setMonth(startDate.getMonth() + 1));
    } else if (termPeriod === "Quarterly") {
      dueDate = new Date(startDate.setMonth(startDate.getMonth() + 3));
    } else if (termPeriod === "Half-Yearly") {
      dueDate = new Date(startDate.setMonth(startDate.getMonth() + 6));
    } else if (termPeriod === "Annually") {
      dueDate = new Date(startDate.setFullYear(startDate.getFullYear() + 1));
    }

    if (dueDate && paymentDate > dueDate) {
      const daysPastDue = Math.ceil((paymentDate.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
      this.payments.fine = daysPastDue * policy.termAmount * 0.001;
    } else {
      this.payments.fine = 0;
    }

    this.payments.totalAmount = policy.termAmount + this.payments.fine;
  }

}