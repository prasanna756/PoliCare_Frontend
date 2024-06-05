import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Claims } from '../models/claims.model';

@Injectable({
  providedIn: 'root'
})
export class ClaimService {
  private baseUrl='http://localhost:8080/api/v1/claims/'; 

  constructor(private http: HttpClient) { }

  registerClaim(claim:Claims):Observable<any>{
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<any[]>(this.baseUrl + 'register', claim, { headers,responseType:'json' });
  }

  getAllClaims(): Observable<Claims[]> {
    let tokenString = "Bearer "+localStorage.getItem("token");
    const headers =  new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'http://localhost:4200'
    }).set("Authorization",tokenString);
    return this.http.get<Claims[]>(this.baseUrl + 'get-all',{headers,responseType:'json'});
  }

  updateClaim(claim: Claims): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.put<any[]>(this.baseUrl + 'update', claim, { headers });
  }
  deleteClaim(claimId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete<any>(this.baseUrl + 'delete/' + claimId, { headers});
  }

  getAllClaimsByClaimAmount(claimAmount: number): Observable<Claims[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<Claims[]>(this.baseUrl+"get-by-claim-amount/"+claimAmount,{headers});
  }

  getAllClaimsByClaimStatus(claimStatus: string): Observable<Claims[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<Claims[]>(this.baseUrl+"get-by-claim-status/"+claimStatus,{headers});
  }

  getClaimsById(claimId: number): Observable<Claims> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<Claims>(this.baseUrl+"get-by-id/"+claimId,{headers});
  }
  getClaimsByUserId(userId:any):Observable<Claims[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<Claims[]>(this.baseUrl + 'get-by-userId/'+userId, { headers });
  }

}


