import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Payments } from 'src/app/models/payments.model';
import { Policy } from 'src/app/models/policy.model';
import { UserPolicies } from 'src/app/models/userpolicies.model';
import { JwtService } from 'src/app/service/jwt.service';
import { NavigationService } from 'src/app/service/navigation.service';
import { PaymentsService } from 'src/app/service/payments.service';
import { PolicyService } from 'src/app/service/policy.service';
import { UserPoliciesService } from 'src/app/service/user-policies.service';

@Component({
  selector: 'app-explore-policies',
  templateUrl: './explore-policies.component.html',
  styleUrls: ['./explore-policies.component.css']
})
export class ExplorePoliciesComponent implements OnInit {

  policies: Policy[] = [];
  userPolicies: UserPolicies = {
    userPolicyId: 0,
    userId: 0,
    policyId: 0,
    startDate: new Date(),
    durationInYears: 0,
    
  };
  payments: Payments = {
    paymentId: 0,
    paymentDate: new Date(),
    paymentStatus: 'Completed',
    totalAmount: 0,
    fine: 0,
    paymentMethod: '',
    cardNumber: '',
    expiryDate:new Date(),
    cvv:'',
    cardHolder:'',
    bankName:'',
    accountNumber:'',
    userPolicyId: 0,
    userId:0
  }
  policy!: Policy;
  showForm:boolean=false;
  isEdit: boolean = false;
  buyForm: FormGroup;
  showBuyForm: boolean = false;
  policyId: number = 0;
  response: any;
  newPolicyForm!: FormGroup;
  policiesForm!: FormGroup;
  selectedPolicyType: string = '';
  selectedFilterMethod: string = '';
  company: string = '';
  greaterThanAmount: number = 0;
  lessThanAmount: number=0;
  registerForm!:FormGroup;
  cardForm!: FormGroup;
  showCardForm = false;
  netBankingForm!: FormGroup;
  showNetBankingForm = false;
  public loggedIn=false;
  public UserloggedIn=false;
  public AdminloggedIn=false;
  currentPage: number = 1;
  pageSize: number = 5;
  currentDate: Date = new Date();
  constructor(
    private policyService: PolicyService,
    private formBuilder: FormBuilder,
    private userPoliciesService: UserPoliciesService,
    private paymentService: PaymentsService,
    private router: Router,
    private jwtService: JwtService,
    private navigationService: NavigationService
  ) {
    this.buyForm = this.formBuilder.group({
      // startDate: ['', Validators.required],
      durationInYears: ['', Validators.required],
      paymentMethod:['',Validators.required],
    });
    this.cardForm = this.formBuilder.group({
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      expiryDate: ['', [Validators.required, Validators.pattern("^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$")]],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]],
      cardHolder: ['', [Validators.required, Validators.pattern('^[a-zA-Z\\s]+$')]],
    });
    this.netBankingForm = this.formBuilder.group({
      bankName: ['', [Validators.required, Validators.pattern('^[a-zA-Z\\s]+$')]],
      accountNumber: ['', [Validators.required, Validators.pattern(/^\d{9,18}$/)]],
    });
    this.policiesForm = this.formBuilder.group({
      policyName: ['', Validators.required],
      policyDescription: ['', Validators.required],
      company: ['', Validators.required],
      policyType: ['', [Validators.required]],
      initialDeposit: ['', [Validators.required, Validators.min(1)]],
      termPeriod: ['', [Validators.required, Validators.pattern('^(Monthly|Quarterly|Half-Yearly|Annually)$')]],
      termAmount: ['', [Validators.required, Validators.min(1)]],
      interest: ['', [Validators.required, Validators.min(0)]],
      eligibleUserTypes:[[],[Validators.required]]
    });
    this.registerForm=this.formBuilder.group({
      policyName: ['', Validators.required],
      policyDescription: ['', Validators.required],
      company: ['', Validators.required],
      policyType: ['', [Validators.required]],
      initialDeposit: ['', [Validators.required, Validators.min(1)]],
      termPeriod: ['', [Validators.required, Validators.pattern('^(Monthly|Quarterly|Half-Yearly|Annually)$')]],
      termAmount: ['', [Validators.required, Validators.min(1)]],
      interest: ['', [Validators.required, Validators.min(0)]],
      eligibleUserTypes:[[],[Validators.required]]
    })
  }


  toggleFormVisibility() {
    this.showForm = !this.showForm;
    this.isEdit = false; 
    console.log('Form visibility toggled:', this.showForm);
}

onAdding(): void {
  if (this.registerForm.invalid) {
    return;
  }
  const eligibleUserTypesControl = this.registerForm.get('eligibleUserTypes');

  if (!eligibleUserTypesControl) {
    console.error('Eligible user types control not found in the form.');
    return;
  }
  const eligibleUserTypesInput = eligibleUserTypesControl.value;
  const eligibleUserTypesArray = eligibleUserTypesInput.split(',').map((userType: string) => userType.trim());
  const newPolicy = {
    ...this.registerForm.value,
    eligibleUserTypes: eligibleUserTypesArray
  };
  this.policyService.registerPolicy(newPolicy)
    .subscribe(
      (response) => {
        console.log('Policy added successfully', response);
        alert('Policy added successfully');
        this.registerForm.reset();
        this.toggleFormVisibility();
        window.location.reload();
      },
      (error) => {
        console.error('Error adding policy:', error);
        alert('Failed to add policy');
      }
    );
}


  ngOnInit(): void {
    this.loadPolicies();
    this.navigationService.disableBackButton();
  }
  logoutUser()
  {
    this.jwtService.logout();
    this.loggedIn=false;
    this.UserloggedIn=false;
    this.AdminloggedIn=false;
    alert("Logged Out");
    this.router.navigate(['/']);
  }

  isAdminLoggedIn() {
    return localStorage.getItem('token') !== null && localStorage.getItem('userType') === 'Admin';
  }

  isUserLoggedIn() {
    return localStorage.getItem('token') !== null && localStorage.getItem('userType') === 'User';
  }
  isLoggedIn(){
    let token=localStorage.getItem('token');
    if(token==undefined || token==='' || token==null)
    {
      return false;
    }
    else
    {
      return true;
    }
  }


  loadPolicies(): void {
    this.policyService.getAllPolicies().subscribe(
      (data) => {
        this.policies = data;
        console.log(this.policies);
      },
      (error) => {
        console.error('There was an error fetching the policies', error);
        alert('There was an error fetching the policies')
      }
    );
  }
  get paginatedPolicies(): Policy[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.policies.slice(startIndex, startIndex + this.pageSize);
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
    return Math.ceil(this.policies.length / this.pageSize);
  }

  get f() {
    return this.policiesForm.controls;
  }
  get f1() {
    return this.buyForm.controls;
  }
  get f2()
  {
    return this.registerForm.controls;
  }
  get f3() {
    return this.cardForm.controls;
  }
  get f4() {
    return this.netBankingForm.controls;
  }

  buyPolicy(policy: Policy) {
    const userEmployerType = localStorage.getItem('employerType');
    if (userEmployerType && policy.eligibleUserTypes.includes(userEmployerType)) {
      this.showBuyForm = true;
      this.policyId = policy.policyId;
      this.userPolicies.userId = +localStorage.getItem('userId')!;
      this.policy = policy; 
    } else {
      alert("Sorry, You are not eligible to buy this policy.")
    }
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
  onBuyPolicy() {
    
    this.userPolicies.policyId = this.policyId;
    this.userPolicies.userId = +localStorage.getItem('userId')!;
    this.userPolicies.startDate = this.currentDate;
    this.userPolicies.durationInYears = this.buyForm.value.durationInYears;
    
    
    this.userPoliciesService.registerUserPolicies(this.userPolicies).subscribe(
      responseData => {
        console.log('User Policy created successfully:', responseData);
        this.userPolicies = responseData;
        this.makePayment();
      
      },
      error => {
        console.error('Error creating User Policy:', error);
        alert('User policy creation failed');
        window.location.reload();
      }
    );
    
  }
  makePayment()
  {
    this.payments.userPolicyId = this.userPolicies.userPolicyId;
    this.payments.paymentDate=this.currentDate;
    this.payments.totalAmount=this.policy.initialDeposit;
    this.payments.fine=0;
    this.payments.paymentStatus='Completed';
    this.payments.paymentMethod=this.buyForm.value.paymentMethod;
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
    this.payments.userId=localStorage.getItem('userId');
    this.paymentService.makePayment(this.payments).subscribe(
      (response) => {
        console.log('Payment made successfully', response);
        alert('Payment made successfully');
        this.router.navigate(['/user-policies']);
      },
      (error) => {
        console.error('Error making payment:', error);
        alert('Failed to make payment');
      }
    );
  }
  deletePolicy(policyId: number) {
    this.policyService.deletePolicy(policyId).subscribe(
      (response) => {
        console.log(response); 
        alert('Policy deleted successfully');
        this.loadPolicies();  
      },
      (error) => {
        console.log(error);
        alert('Failed to delete policy');
      }
    );
  }
 
  updatePolicy(policies: Policy) {
    this.isEdit = true;
    this.policy = policies;
    this.policiesForm.patchValue({
      policyId: policies.policyId,
      policyName: policies.policyName,
      policyDescription: policies.policyDescription,
      company: policies.company,
      policyType: policies.policyType,
      initialDeposit: policies.initialDeposit,
      termPeriod: policies.termPeriod,
      termAmount: policies.termAmount,
      interest: policies.interest,
      eligibleUserTypes: policies.eligibleUserTypes
    })
  }
 
  
  onUpdate() {
    if (this.policiesForm.invalid) {
      return;
    }
    const eligibleUserTypesControl = this.policiesForm.get('eligibleUserTypes');

  if (!eligibleUserTypesControl) {
    console.error('Eligible user types control not found in the form.');
    return;
  }


  
  let eligibleUserTypesInput = eligibleUserTypesControl.value;
  if (Array.isArray(eligibleUserTypesInput)) {
    eligibleUserTypesInput = eligibleUserTypesInput.join(',');
}
  const eligibleUserTypesArray = eligibleUserTypesInput.split(',').map((userType: string) => userType.trim()); 
    this.policy.policyName = this.policiesForm.value.policyName;
    this.policy.policyDescription = this.policiesForm.value.policyDescription;
    this.policy.company = this.policiesForm.value.company;
    this.policy.initialDeposit = this.policiesForm.value.initialDeposit;
    this.policy.policyType=this.policiesForm.value.policyType;
    this.policy.termPeriod = this.policiesForm.value.termPeriod;
    this.policy.termAmount = this.policiesForm.value.termAmount;
    this.policy.interest = this.policiesForm.value.interest;
    this.policy.eligibleUserTypes = eligibleUserTypesArray;
    

    let response = this.policyService.updatePolicy(this.policy);
    response.subscribe(
      responseData => {
        this.response = responseData;
        console.log(responseData);
        alert("Policy Details Updated!");
        window.location.reload();
      },
      error => {
        console.log(error);
        alert("Error while updating details");
        window.location.reload();
      }
    );
  }
  onFilterMethodChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    if (value === 'getPolicyByPolicyType' || value === 'getPoliciesByCompany' || value=='getByAmountGreaterThan'|| value=='getByAmountLessThan') {
      this.selectedFilterMethod = value;
    }
  }
  onPolicyTypeChange(event: Event): void {
    this.selectedPolicyType = (event.target as HTMLSelectElement).value;
    this.getPoliciesByPolicyType(this.selectedPolicyType);
  }

  getPoliciesByPolicyType(policyType: string): void {

    this.policyService.getPoliciesByPolicyType(policyType).subscribe(
      (response) => {
        if (Array.isArray(response)) {
          this.policies = response;
          console.log(this.policies);
        } else if (typeof response === 'object') {
          this.policies = Object.values(response);
        } else {
          console.error('Unexpected response format');
        }
      },
      (error) => {
      if (error.status === 404) {
        console.log('No results found for the selected policy type');
        alert('Sorry,no policies found for the selected policy type');
      } 
        
      });
  }
  onGetPoliciesByCompany(): void {
    this.getPoliciesByCompany(this.company);
  }


  getPoliciesByCompany(company: string): void {
    this.policyService.getPoliciesByCompany(company).subscribe(
      (response) => {
        if (Array.isArray(response)) {
          this.policies = response;
          console.log(this.policies);
        } else if (typeof response === 'object') {
          this.policies = Object.values(response);
        } else {
          console.error('Unexpected response format');
        }
      },
      (error) => {
        if (error.status === 404) {
          console.log('Sorry,no results found for the selected company.');
          alert('Sorry,no results found for the selected company.');
        } 
      });
  }
  onGetPoliciesByAmountGreaterThan(): void {
    this.getByAmountGreaterThan(this.greaterThanAmount);
  }

  getByAmountGreaterThan(greaterThanAmount: number): void {
    if (this.greaterThanAmount > 0) {
      this.policyService.getByAmountGreaterThan(greaterThanAmount).subscribe(
        (response) => {
          this.policies = response; 
        },
        (error) => {
          if (error.status === 404) {
            console.log('Sorry,no results found for the selected company.');
            alert('Sorry,no results found for the this amount');
          } 
        }
      );
    } else {
      console.error('Please enter a valid amount greater than zero');
    }
  }
  onGetPoliciesByAmountLessThan(): void {
    this.getByAmountLessThan(this.lessThanAmount);
  }

  getByAmountLessThan(lessThanAmount: number): void {
    if (this.lessThanAmount > 0) {
      this.policyService.getByAmountLessThan(lessThanAmount).subscribe(
        (response) => {
          this.policies = response; 
        },
        (error) => {
          if (error.status === 404) {
            console.log('Sorry,no results found for the selected company.');
            alert('Sorry,no results found for the this amount');
          } 
        }
      );
    } else {
      console.error('Please enter a valid amount greater than zero');
    }
  }


}