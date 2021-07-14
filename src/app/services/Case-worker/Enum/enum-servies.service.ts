import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class EnumServiesService {
    public getGenderListUrl="http://rw80:900/api/Triage/Get_GenderList";
    private GetCaseWorkerStatusListUrl="http://rw80:900/api/CaseWorker/Get_CaseWorkerStatusList\n"

  constructor(private http:HttpClient) { }
    getGenderList(): Observable<any>{
        const headerDict = {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
        const requestOptions = {
            headers: new Headers(headerDict),
        };
        return this.http.get<any>(this.getGenderListUrl,{
            headers:headerDict
        })
    }
    GetCaseWorkerStatusList(): Observable<any>{
        const headerDict = {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
        const requestOptions = {
            headers: new Headers(headerDict),
        };
        return this.http.get<any>(this.GetCaseWorkerStatusListUrl,{
            headers:headerDict
        })
    }

}
