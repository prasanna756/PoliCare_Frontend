import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Password } from 'src/app/models/password.model';
import { NavigationService } from 'src/app/service/navigation.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  showPassword = true;
  response: any;
  editForm!: FormGroup;
  showEditForm=false;
 
  constructor(private formBuilder: FormBuilder, private router: Router, private navigationService: NavigationService, private userService:UserService) { }

  ngOnInit(): void {
    this.navigationService.disableBackButton();
    this.editForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)]],
    });
  }

  updatePassword(){
    this.showEditForm=true;
  }
  onSubmit(){
    if (this.editForm.valid) {
      const updatedPassword: Password = {
        email: this.editForm.value.email,
        newPassword: this.editForm.value.password
      };

      this.userService.updatePassword(updatedPassword).subscribe(
        () => {
          this.showEditForm = false;
          alert("Password updated successfully");
          this.router.navigate(['/login']);
        },
        (error: any) => {
          console.error('Error updating password', error);
          alert("Error updating password");
        }
      );
    }
  }
  get f1() {
    return this.editForm.controls;
  }
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
 
}