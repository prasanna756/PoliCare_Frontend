import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { JwtService } from 'src/app/service/jwt.service';
import { NavigationService } from 'src/app/service/navigation.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent {
  public loggedIn=false;
  public UserloggedIn=false;
  public AdminloggedIn=false;

  constructor(private jwtService:JwtService,private router:Router,private navigationService: NavigationService
   ){}

  ngOnInit(): void 
  {
    this.navigationService.disableBackButton();
    this.loggedIn = this.jwtService.isUserLoggedIn() || this.jwtService.isAdminLoggedIn();
    this.UserloggedIn =this.jwtService.isUserLoggedIn();
    this.AdminloggedIn = this.jwtService.isAdminLoggedIn();
    // this.router.navigate(['/manage-users']);
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
  

}