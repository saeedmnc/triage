import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
@Injectable({
  providedIn: 'root'
})
export class TeriazhListService {
  public listUrl ='/api/Triage/TriageLocationList';
  public teriazhName="/api/Emergency/SetCurrentTriageLocation";
    baseurl: any;
    seturl(url: any) {
        this.baseurl = url;
    }
  constructor( private http:HttpClient) { }
  getTeriazhLoc():Observable<any>{
    const headerDict = {
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    }
    const requestOptions = {
      headers: new Headers(headerDict),
    };
    return this.http.get<any>( this.baseurl+this.listUrl,{
      headers:headerDict
    })
  }
postCurrentLoc(item:any): Observable<any>{
  const data = {
    'triageLocationID': item,
}
const body = data;
const headerDict = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer  ' + localStorage.getItem('token')
}
console.log(body);
return this.http.post<any>(this.baseurl+this.teriazhName, body, {
    headers: headerDict
})
}
}
 