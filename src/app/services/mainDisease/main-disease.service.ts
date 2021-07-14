import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class MainDiseaseService {

  public MainDiseaseListURL="/api/Triage/Get_MainDiseaseList";
  public newMainDiseaseListURL="/api/Triage/New_MainDisease"
    baseurl: any;
    seturl(url: any) {
        this.baseurl = url;
    }

  constructor(private http:HttpClient) { }

  getMainDiseaseList(){
    const headerDict = {
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    }
    const requestOptions = {
      headers: new Headers(headerDict),
    };
    return this.http.get<any>(this.baseurl+this.MainDiseaseListURL,{
      headers:headerDict
    })
  }
  
  postPractitioner(
   name:string,
   spo:string
    ) {
    const data = {
      'id': spo,
      'mainDiseaseValue':name,
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

    return   this.http.post<any>(this.baseurl+this.newMainDiseaseListURL, body, {
        headers: headerDict
    });


}
}
