import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { ProfileComponent } from './components/profile/profile.component';
import { UserPoliciesComponent } from './components/user-policies/user-policies.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { ManageUsersComponent } from './components/manage-users/manage-users.component';
import { ExplorePoliciesComponent } from './components/explore-policies/explore-policies.component';
import { ClaimsComponent } from './components/claims/claims.component';
import { PaymentsComponent } from './components/payments/payments.component';
import { AuthGuard } from './service/auth.guard';
import { AdminAuthGuard } from './service/admin-auth.guard';
import { adminUserAuthGuard } from './service/admin-user-auth.guard';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';


const routes: Routes = [
  {path: '', component: HomeComponent,pathMatch:'full' },
  {path: 'login', component: LoginComponent,pathMatch:'full'},
  {path:'registration', component: RegistrationComponent,pathMatch:'full'},
  {path:'forgot-password', component: ForgotPasswordComponent,pathMatch:'full'},
  {path:'user-dashboard', component: UserDashboardComponent,pathMatch:'full',canActivate: [AuthGuard]},
  {path:'profile', component: ProfileComponent,pathMatch:'full', canActivate: [adminUserAuthGuard]},
  {path:'user-policies',component:UserPoliciesComponent,pathMatch:'full',canActivate: [adminUserAuthGuard]},
  {path:'admin-dashboard', component: AdminDashboardComponent,pathMatch:'full',canActivate: [AdminAuthGuard]},
  {path:'manage-users',component:ManageUsersComponent,pathMatch:'full', canActivate: [AdminAuthGuard]},
  {path:"explore-policies",component:ExplorePoliciesComponent,pathMatch:'full'},
  {path:"claims",component:ClaimsComponent,pathMatch:'full',canActivate: [adminUserAuthGuard]},
  {path:"payments",component:PaymentsComponent,pathMatch:'full',canActivate: [adminUserAuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }