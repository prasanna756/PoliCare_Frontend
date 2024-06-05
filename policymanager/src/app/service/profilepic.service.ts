import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtService } from './jwt.service';

@Injectable({
  providedIn: 'root'
})
export class ProfilepicService {
  response!:string;
  constructor(private http:HttpClient,private jwtservice:JwtService) { }
  async uploadProfilePicture(profilepic:any){
    let tokenString = "Bearer "+localStorage.getItem("token");

    const formData = new FormData();
    formData.append('profilepic',profilepic);


    const headers =  new HttpHeaders({
      'Access-Control-Allow-Origin': 'http://localhost:4200'
    }).set("Authorization",tokenString);

    await this.http.post<string>("http://localhost:8080/api/v1/profilepic/upload",formData,{headers})
    .subscribe(
      (res)=>{
        this.response = res
      });

    return this.response;
  }
  getProfilePic(){
    let tokenString = "Bearer "+localStorage.getItem("token");

    const headers =  new HttpHeaders({
      'Access-Control-Allow-Origin': 'http://localhost:4200'
    }).set("Authorization",tokenString);

    return this.http.get('http://localhost:8080/api/v1/profilepic/getpic', { responseType: 'blob', headers});
  }
}