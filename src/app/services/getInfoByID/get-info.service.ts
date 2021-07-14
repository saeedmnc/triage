import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GetInfoService {
  public infoURl="http://rw80:900/Triage/Get_TriageInfoByID"

  constructor(private http:HttpClient) { }
  getInfo( triageID : string){
const data={
  'triageID': triageID,
}
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

return   this.http.post<any>(this.infoURl, body, {
    headers: headerDict
});
  }
 
}
