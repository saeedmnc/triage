import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AVPUService {
  public AVPUlistUrl="/api/Triage/Get_AVPUList";

    baseurl: any;
    seturl(url: any) {
        this.baseurl = url;
    }

  constructor( private http:HttpClient) { }
  getAVPU(){
    const headerDict = {
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    }
    const requestOptions = {
      headers: new Headers(headerDict),
    };
    return this.http.get<any>(this.baseurl+this.AVPUlistUrl,{
      headers:headerDict
    })
  }
}
