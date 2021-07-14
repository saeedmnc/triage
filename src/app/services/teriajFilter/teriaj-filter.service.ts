import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TeriajFilterService {
  public PostUrl='/api/Triage/Get_TriageList';
    baseurl: any;
    seturl(url: any) {
        this.baseurl = url;
    }
  constructor( private http:HttpClient) { }
  postPractitioner(
    triageID : string, 
    patientFirstName : string, patientLastName:string, fromAge:string,toAge:string,fromDate:string,
    toDate:string,entrnaceType:string,triageLevel:string,departure:string,triageStatus:string,admissionKind:string,prac:string,
    locationID:string,sTriage_AdmissionKind:string,sTriage_MainDisease:string
    ) {
    const data = {
      'triageID': triageID,
      'patientFirstName': patientFirstName,
      'patientLastName': patientLastName,
      'fromAge': fromAge,
      'toAge': toAge,
      'fromDate': fromDate,
      'toDate': toDate,
      'entrnaceType': entrnaceType,
      'triageLevel': triageLevel,
      'departure': departure,
      'triageStatus': triageStatus,
      'admissionKind': admissionKind,
      'prac': prac,
      'locationID':locationID,
      'sTriage_AdmissionKind':sTriage_AdmissionKind,
      'sTriage_MainDisease' :sTriage_MainDisease

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

    return   this.http.post<any>(this.baseurl+this.PostUrl, body, {
        headers: headerDict
    });


}
}
