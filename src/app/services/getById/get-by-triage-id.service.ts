import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GetByTriageIdService {
  public URl="/api/Triage/Get_TriageInfoByID";
    baseurl: any;
    seturl(url: any) {
        this.baseurl = url;
    }
  constructor(private http:HttpClient) { }
  ByID(id:string){
    const data = {
      'triageID': id,
    };
    const body = JSON.stringify(data );
    console.log(body);
    const headers = {  'Content-Type': 'application/json' };
    const headerDict = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer  ' + localStorage.getItem('token')
    }
    const requestOptions = {
      headers: new Headers(headerDict),
    };
    return this.http.post<any>(this.baseurl+ this.URl, body, {
      headers: headerDict
    });
  }
}
