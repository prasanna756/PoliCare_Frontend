import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Claims } from 'src/app/models/claims.model';
import { ClaimService } from 'src/app/service/claim.service';
import { NavigationService } from 'src/app/service/navigation.service';

@Component({
  selector: 'app-claims',
  templateUrl: './claims.component.html',
  styleUrls: ['./claims.component.css']
})
export class ClaimsComponent implements OnInit {
  claims: Claims[] = [];
  editClaimForm!: FormGroup;
  showEditForm: boolean = false;
  selectedClaim!: Claims;
  userPolicyId!:number;
  selectedFilter: string = '';
  claimAmount: number | null = null;
  claimStatus: string = '';
  claimId: number | null = null;
  currentPage: number = 1;
  pageSize: number = 7;

  constructor(
    private formBuilder: FormBuilder,
    private claimsService: ClaimService,
    private navigationService: NavigationService
  ) { }

  ngOnInit(): void {
    this.navigationService.disableBackButton();
    if(this.isUserLoggedIn())
    {
      this.getClaimsByUserId();
    }
    else if(this.isAdminLoggedIn()){
      this.getAllClaims();
    }
   
      this.editClaimForm = this.formBuilder.group({
        userPolicyId: [null, Validators.required],
        claimDate: [null, Validators.required],
        claimAmount: [null, Validators.required],
        claimStatus: ['Pending', Validators.required]
      });
  }

  isAdminLoggedIn() {
    return localStorage.getItem('token') !== null && localStorage.getItem('userType') === 'Admin';
  }

  isUserLoggedIn() {
    return localStorage.getItem('token') !== null && localStorage.getItem('userType') === 'User';
  }

  editClaim(claim: Claims) {
  
    this.selectedClaim = claim;
    this.editClaimForm.patchValue({
      userPolicyId: claim.userPolicy ? claim.userPolicy.userPolicyId : null,
      claimDate: claim.claimDate,
      claimAmount: claim.claimAmount,
      claimStatus: claim.claimStatus
    });
    this.showEditForm = true;
  }

  onSubmit() {
    if (this.editClaimForm.valid) {
      const updatedClaim: Claims = {
        userPolicyId:this.editClaimForm.value.userPolicyId,
        claimId: this.selectedClaim.claimId,
        claimDate: this.editClaimForm.value.claimDate,
        claimAmount: this.editClaimForm.value.claimAmount,
        claimStatus: this.editClaimForm.value.claimStatus,
      };

      this.claimsService.updateClaim(updatedClaim).subscribe(
        () => {
          this.showEditForm = false;
          this.getAllClaims();
          alert("Claim updated successfully");
        },
        (        error: any) => {
          console.error('Error updating claim', error);
          alert("Error updating claim");
        }
      );
    }
  }

  get f(){
    return this.editClaimForm.controls;
  }
  
  getAllClaims(): void {
    this.claimsService.getAllClaims().subscribe(
      (data) => {
        this.claims = data;
      },
      (error) => {
        console.error('Error fetching claims', error);
        alert("Error fetching claims");
      }
    );
  }
  get paginatedClaims(): Claims[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.claims.slice(startIndex, startIndex + this.pageSize);
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
    return Math.ceil(this.claims.length / this.pageSize);
  }

  deleteClaim(claimId: number) {
    this.claimsService.deleteClaim(claimId).subscribe(
      () => {
        alert("Claim deleted successfully");
        this.getAllClaims(); 
        window.location.reload();
      },
      (error: any) => {
        console.error('Error deleting claim', error);
        alert("Error deleting claim");
      }
    );
  }
  searchClaims() {
    switch (this.selectedFilter) {
      case 'claimAmount':
        this.claimsService.getAllClaimsByClaimAmount(this.claimAmount || 0).subscribe(
          (data) => {
            this.claims = data;
          },
          (error) => {
            if(error.status===404){
              alert("No Claims found for the specified amount");
            }
            else{
              console.log(error);
          }
        }
        );
        break;

      case 'claimStatus':
        this.claimsService.getAllClaimsByClaimStatus(this.claimStatus).subscribe(
          (data) => {
            this.claims = data;
          },
          (error) => {
            if(error.status===404){
              alert("No records found for the slected Claims status");
            }
            else{
              console.log(error);
          }
        }
        );
        break;
      case 'claimId':
        if (this.claimId) {
          this.claimsService.getClaimsById(this.claimId).subscribe(
            (data) => {
              this.claims = [data];
            },
            (error) => {
              if(error.status===404){
                alert("No Claims found for the specified claimId");
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
  getClaimsByUserId() {
    this.claimsService.getClaimsByUserId(localStorage.getItem('userId')).subscribe(
      (response) => {
        this.claims= response;
      },
      (error) => {
        console.log('Error fetching user policies:', error);
        alert('Error fetching user policies');
        this.claims = [];
      }
    );
  }
}