import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { JwtService } from 'src/app/service/jwt.service';
import { NavigationService } from 'src/app/service/navigation.service';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent {
  public loggedIn=true;
  public UserloggedIn=false;
  public AdminloggedIn=false;
  constructor(private router:Router,private jwtService:JwtService,private navigationService: NavigationService){}
ngOnInit():void{
  this.navigationService.disableBackButton();
  // this.router.navigate(['/profile']);
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