import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class CaseWorkerListService {
  private  getCaseWorkerListURl="/api/CaseWorker/Get_CaseWorkerList"
  private  getCaseWorkerByIDURl="/api/CaseWorker/Get_CaseWorkerByID"
  constructor( private  http: HttpClient) { }
    baseurl: any;
    seturl(url: any) {
        this.baseurl = url;
    }
    postPatient(
        nationalcode : string,
        patinetID:string,
        startDate:string,
        endDate:string

    ) {
        const data = {
            "caseWorkerID": "",
            "nationalcode": nationalcode,
            "patientID": patinetID,
            "fromDate": "",
            "toDate": "",
            "statusIS": "",
            "fromStartDate": startDate,
            "toStartDate": endDate

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

        return   this.http.post<any>( this.baseurl + this.getCaseWorkerListURl, body, {
            headers: headerDict
        });
    }
    getDayPatient(
        fromDate:string,
        toDate:string

    ) {
        const data = {
            "caseWorkerID": "",
            "nationalcode": "",
            "patientID": "",
            "fromDate": fromDate,
            "toDate": toDate,
            "statusIS": "",
            "fromStartDate": "",
            "toStartDate": ""

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

        return   this.http.post<any>( this.baseurl + this.getCaseWorkerListURl, body, {
            headers: headerDict
        });
    }

    getPatientByID(
        caseWorkerID : string,
        // nationalcode : string, patientID:string, fromDate:string,toDate:string,statusIS:string,
        // fromStartDate:string,toStartDate:string,
    ) {
        const data = {
            "caseWorkerID": caseWorkerID,
            "nationalcode": "",
            "patientID": "",
            "fromDate": "",
            "toDate": "",
            "statusIS": "",
            "fromStartDate": "",
            "toStartDate": ""

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

        return   this.http.post<any>( this.baseurl+  this.getCaseWorkerByIDURl, body, {
            headers: headerDict
        });
    }



}
