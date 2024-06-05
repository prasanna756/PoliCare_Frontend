import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserPolicies } from '../models/userpolicies.model';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { JwtService } from './jwt.service';

@Injectable({
  providedIn: 'root'
})
export class UserPoliciesService {

  private baseUrl = 'http://localhost:8080/api/v1/userPolicies/';

  constructor(private http: HttpClient, private jwtservice: JwtService) { }

  registerUserPolicies(userPolicies: UserPolicies): Observable<UserPolicies> {
    const token = this.jwtservice.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<UserPolicies>(this.baseUrl + "register", userPolicies, { headers })
      .pipe(
        catchError(error => throwError(error))
      );
  }
  updateUserPolicies(userPolicies: UserPolicies): Observable<UserPolicies> {
    const token = this.jwtservice.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.put<UserPolicies>(this.baseUrl + "update", userPolicies, { headers,  responseType: 'json' })
    .pipe(
        catchError(error => throwError(error))
      );
  }

  getUserPoliciesbyUserId(userId: any): Observable<UserPolicies[]> {
    const tokenString = 'Bearer ' + localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': tokenString
    }).set("Authorization", tokenString);
    return this.http.get<UserPolicies[]>(this.baseUrl + 'get-by-userId/' + userId, { headers, responseType: 'json' })
      .pipe(
        catchError(error => throwError(error))
      );
  }
  getAllUserPolicies():Observable<UserPolicies[]> {
    const tokenString = 'Bearer '+ localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': tokenString
    }).set("Authorization", tokenString);
    return this.http.get<UserPolicies[]>(this.baseUrl + 'get-all', { headers, responseType: 'json' })
    .pipe(
        catchError(error => throwError(error))
      );
  }
  deleteUserPolicy(userPolicyId:number):Observable<any>{
    const tokenString = 'Bearer '+ localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': tokenString
    }).set("Authorization", tokenString);
    return this.http.delete<UserPolicies[]>(this.baseUrl + 'delete/' + userPolicyId, { headers, responseType: 'json' })
  .pipe(
    catchError(error => throwError(error))
  );
  }
  getUserPolicyByUserPolicyId(userPolicyId:number):Observable<UserPolicies> {
    const tokenString = 'Bearer '+ localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': tokenString
    }).set("Authorization", tokenString);
    return this.http.get<UserPolicies>(this.baseUrl + 'get-userPolicyId/' + userPolicyId, { headers, responseType: 'json' })
  .pipe(
    catchError(error => throwError(error))
  );

}
}