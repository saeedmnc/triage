import { Injectable } from '@angular/core';
import {Config} from "./../../config/congif"
import {HttpClient} from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ApiConfigService {
    config:Config
  constructor(private http: HttpClient) { }
    loadConfig() {
        return this.http
            .get<Config>('assets/Config/config.json')
            .toPromise()
            .then(config => {
                this.config = config;
            });
    }
}
