import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Users } from 'src/app/models/users.model';
import { NavigationService } from 'src/app/service/navigation.service';
import { UserService } from 'src/app/service/user.service';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  usersForm!: FormGroup;
  submitted = false;
  showPassword = true;
  constructor(private formBuilder: FormBuilder, private userService: UserService,private router: Router, private navigationService: NavigationService) { }

  ngOnInit(): void {
    this.navigationService.disableBackButton();
    this.usersForm = this.formBuilder.group({
      userId: [],
      emailAddress: ['', [Validators.required, Validators.email]],
      contactNumber: ['', [Validators.required, Validators.pattern('^[6789]\\d{9}$')]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)]],

      firstName: ['', [Validators.required, Validators.pattern('^[a-zA-Z\\s]+$')]],
      lastName: ['', [Validators.required, Validators.pattern('^[a-zA-Z\\s]+$')]],
      dateOfBirth: ['', Validators.required],
      panNumber: ['', [Validators.required, Validators.pattern('^[A-Z]{5}\\d{4}[A-Z]{1}$')]],
      employerName: [],
      salary: ['', Validators.min(0)],
      userType: ['', [Validators.required, Validators.pattern('^(Admin|User)$')]],
      address: this.formBuilder.group({
        addressLine: ['', Validators.required],
        city: ['', Validators.required],
        cityPincode: ['', Validators.required],
        state: ['', Validators.required]
      }),
      userPolicies: this.formBuilder.array([])
    });
  }
  get f() {
    return this.usersForm.controls;
  }
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    this.submitted = true;
    console.log('Password:', this.usersForm.get('password')?.value);
    if (this.usersForm.invalid) {
      return;
    }

    this.userService.registerUser(this.usersForm.value)
      .subscribe({
        next: data => {
          console.log('Registration successful');
          alert('Registration successful');
          this.router.navigate(['/login']);
        },
        error: error => {
          console.error('Error registering User', error);
          alert('Registration failed');
        }
      });
    }
  }