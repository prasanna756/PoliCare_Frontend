import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Policy } from '../models/policy.model';
import { JwtService } from './jwt.service';

@Injectable({
  providedIn: 'root'
})
export class PolicyService {
  private baseUrl = 'http://localhost:8080/api/v1/policies/';

  constructor(private http:HttpClient,private jwtservice:JwtService) { }

  registerPolicy(policy: Policy): Observable<Policy> {
    let tokenString = "Bearer "+localStorage.getItem("token");
    const headers =  new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'http://localhost:4200'
    }).set("Authorization",tokenString);
    return this.http.post<Policy>(this.baseUrl + "register", policy, { headers, responseType: 'json' });
  }
  
  updatePolicy(policy: Policy): Observable<Policy> {
    const token = this.jwtservice.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.put<Policy>(this.baseUrl+"update",policy, { headers});
  }

  getPoliciesByPolicyType(policyType: string): Observable<Policy[]> {
    return this.http.get<Policy[]>(this.baseUrl + 'get-policyType/' + policyType);
  }

  getPoliciesByCompany(company: string): Observable<Policy[]> {
    let tokenString = "Bearer "+localStorage.getItem("token");
    const headers =  new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'http://localhost:4200'
    }).set("Authorization",tokenString);
    return this.http.get<Policy[]>(this.baseUrl + 'get-company/' + company,{headers});
  }

  getByAmountGreaterThan(termAmount: number): Observable<Policy[]> {
    let tokenString = "Bearer "+localStorage.getItem("token");
    const headers =  new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'http://localhost:4200'
    }).set("Authorization",tokenString);
    return this.http.get<Policy[]>(this.baseUrl + 'get-term-amount-greater/' + termAmount,{headers});
  }

  getByAmountLessThan(termAmount: number): Observable<Policy[]> {
    let tokenString = "Bearer "+localStorage.getItem("token");
    const headers =  new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'http://localhost:4200'
    }).set("Authorization",tokenString);
    return this.http.get<Policy[]>(this.baseUrl + 'get-term-amount-lower/' + termAmount,{headers});
  }

  getAllPolicies(): Observable<Policy[]> {
    return this.http.get<Policy[]>(this.baseUrl + 'get-all');
  }
  
  deletePolicy(policyId: number): Observable<any> {
    const token = this.jwtservice.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete(this.baseUrl+ 'delete/'+policyId, { headers });
  }  
}