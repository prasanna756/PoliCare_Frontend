import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Users } from '../models/users.model';
import { Observable } from 'rxjs';
import { Password } from '../models/password.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseUrl:string = 'http://localhost:8080/api/v1/users/';
  
  constructor(private http:HttpClient) { }

  registerUser(user: Users): Observable<any>
    {
      return this.http.post<any>(this.baseUrl+"register",user,{responseType:'json'})
    }
    getUserById(userId:any)
  {
    let tokenString = "Bearer "+localStorage.getItem("token");
    const headers =  new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'http://localhost:4200'
    }).set("Authorization",tokenString);
    return this.http.get<Users>(this.baseUrl+"get-userId/"+userId,{headers,responseType: 'json'});

  }

  updateUser(user:any)
  {
    let tokenString = "Bearer "+localStorage.getItem("token");
    const headers =  new HttpHeaders().set("Authorization",tokenString);
    return this.http.put(this.baseUrl+"update",user,{headers,responseType:'json'});
  }
    getAllUsers()
  {
    let tokenString = "Bearer "+localStorage.getItem("token");
    const headers =  new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'http://localhost:4200'
    }).set("Authorization",tokenString);
    return this.http.get<Users>(this.baseUrl+"get-all",{headers,responseType:'json'});
  }


  getUserByUserType(userType: string) {
    let tokenString = "Bearer "+localStorage.getItem("token");
    const headers =  new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'http://localhost:4200',
      'Authorization': tokenString
    }).set("Authorization",tokenString);
    return this.http.get<Users[]>(this.baseUrl+"get-type/"+ userType,{headers,responseType:'json'});
  }

  getUserByContactNumber(contactNumber: string) {
    let tokenString = "Bearer " + localStorage.getItem("token");
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'http://localhost:4200'
    }).set("Authorization", tokenString);
    return this.http.get<Users[]>(this.baseUrl + "get-contactnumber/" + contactNumber, { headers, responseType: 'json' });
  }
  getUserByEmail(email: string): Observable<Users> {
    let tokenString = "Bearer " + localStorage.getItem("token");
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'http://localhost:4200'
    }).set("Authorization", tokenString);
    return this.http.get<Users>(this.baseUrl + "get-email/" + email, { headers, responseType: 'json' });
  }


  deleteUserById(userId: number): Observable<any> {
    let tokenString = "Bearer " + localStorage.getItem("token");
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'http://localhost:4200'
    }).set("Authorization", tokenString);
    return this.http.delete<any>(this.baseUrl+ "delete/" + userId, { headers });
  }

  updatePassword(password:Password): Observable<any>{
    console.log(password);
    return this.http.put<string>(this.baseUrl+ "updatePassword", password,{ responseType: 'text' as 'json'  });
  }
}


 
