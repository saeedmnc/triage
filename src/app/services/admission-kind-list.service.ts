import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class AdmissionKindListService {
    public postAdmissionKindUrl="/api/Triage/New_AdmissionKind"
  
 public AdmissionKindListUrl="/api/Triage/Get_AdmissionKindList"
    baseurl: any;
    seturl(url: any) {
        this.baseurl = url;
    }
  constructor(private http:HttpClient) { }
  getAdmissionKindList():Observable <any[]>{
    const headerDict = {
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    }
    const requestOptions = {
      headers: new Headers(headerDict),
    };
    return this.http.get<any>(this.baseurl+this.AdmissionKindListUrl,{
      headers:headerDict
    })
  }
  postAdmissionKind(value):Observable <any[]>{
     const data={
         "id":"",
         "admissionKindValue": value

      }
      const body = JSON.stringify(data );
      console.log(body)
      const headerDict = {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer  ' + localStorage.getItem('token')
      }
      console.log(body);
      return this.http.post<any>(this.baseurl+this.postAdmissionKindUrl, body, {
          headers: headerDict
      })

  }
}
