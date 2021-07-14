import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DMainDiseaseInputService {
public  MainDiseaseInputUrl="http://rw80:900/api/Triage/New_MainDisease"
  constructor(private http:HttpClient) { }
  postAddMainDiseaseInput(value:string) :Observable<any>{
    const data = {
        'id': '',
        'mainDiseaseValue': value
    }
      const body = JSON.stringify(data );
      console.log(body)
      const headerDict = {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer  ' + localStorage.getItem('token')
      }
      console.log(body);
      return this.http.post<any>(this.MainDiseaseInputUrl, body, {
          headers: headerDict
      })
  }
}
