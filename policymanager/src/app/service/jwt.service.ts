import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JwtService {

  constructor(private http:HttpClient) { }


    baseURL:string = 'http://localhost:8080/api/v1/';

    getGeneratedToken(requestBody: any)
    {
      return this.http.post(this.baseURL+"login/authenticate",requestBody,{responseType:'json'});

    }

    loginUser(response: any): boolean {
      if (this.isLoggedIn()) {
        alert('You are already logged in. Please Logout before logging in as different user');
        return false;
      }
    
      else{
        localStorage.setItem("token", response.token);
        localStorage.setItem("userType", response.userType);
        localStorage.setItem("userId", response.userId);
        localStorage.setItem("userName", response.userName);
        localStorage.setItem("employerType", response.employerType);
      
        return true;
      }
      
    }
    

    logout()
    {
      localStorage.removeItem('token');
      localStorage.removeItem("userType");
      localStorage.removeItem("userId");
      localStorage.removeItem("userName");
      localStorage.removeItem("employerType");

      return true;
    }

    isUserLoggedIn()
    {
      let token=localStorage.getItem('token');
      if(token==undefined || token==='' || token==null)
      {
        return false;
      }
      else if(localStorage.getItem('userType')==='User')
      {
        return true;
      }
      else
      {
        return false;
      }
    }
    isAdminLoggedIn()
    {
      let token=localStorage.getItem('token');
      if(token==undefined || token==='' || token==null)
      {
        return false;
      }
      else if(localStorage.getItem('userType')==='Admin')
      {
        return true;
      }
      else
      {
        return false;
      }
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
    getToken()
    {
      return localStorage.getItem('token');
    }
    
}