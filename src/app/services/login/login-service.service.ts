import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {
  public  LoginUrl = '/api/Authenticate/login'
    baseurl: any;
    seturl(url: any) {
        this.baseurl = url;
    }
  constructor( private http:HttpClient) { }
  doctor(username: string, password: string) {
    const data = {
      'username': username,
      'password': password,
      'type': '0',
    };
    const body = JSON.stringify(data );
    const headers = {  'Content-Type': 'application/json' };
    const headerDict = {
      'Content-Type': 'application/json',
    }
    const requestOptions = {
      headers: new Headers(headerDict),
    };
    return this.http.post<any>(this.baseurl+ this.LoginUrl, body, {
      headers: headerDict
    });
  }

}
