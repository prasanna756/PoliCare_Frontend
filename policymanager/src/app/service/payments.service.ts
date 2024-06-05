import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Payments } from '../models/payments.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentsService {
  baseUrl = 'http://localhost:8080/api/v1/payments/';

  constructor(private http: HttpClient) { }

  getAllPayments(): Observable<Payments[]> {
    let tokenString = "Bearer " + localStorage.getItem("token");
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'http://localhost:4200'
    }).set("Authorization", tokenString);
    return this.http.get<Payments[]>(this.baseUrl + "get-all", { headers });
  }
  makePayment(payments: Payments): Observable<Payments[]> {
    let tokenString = "Bearer " + localStorage.getItem("token");
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'http://localhost:4200'
    }).set("Authorization", tokenString);
    return this.http.post<Payments[]>(this.baseUrl + "register", payments, { headers });

  }
  getPaymentById(paymentId: number): Observable<Payments> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<Payments>(this.baseUrl+"get-by-id/"+paymentId,{headers});
  }
  getPaymentsByDate(paymentDate: Date): Observable<Payments[]> {
    const formattedDate = this.formatDate(paymentDate);
    const tokenString = 'Bearer ' + localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'http://localhost:4200',
      'Authorization': tokenString
    });
    return this.http.get<Payments[]>(this.baseUrl + 'get-by-payment-Date/' + formattedDate, { headers });
  }
  getPaymentsByUserPolicyId(userPolicyId:number):Observable<Payments[]> {
    const tokenString = 'Bearer'+ localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'http://localhost:4200',
      'Authorization': tokenString
    });
    return this.http.get<Payments[]>(this.baseUrl + 'get-by-userPolicyId/' + userPolicyId, { headers });
  }
  getPaymentsByUserId(userId:any):Observable<Payments[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<Payments[]>(this.baseUrl + 'get-by-userId/'+userId, { headers });
  }


  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}