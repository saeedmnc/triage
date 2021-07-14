import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { LoginServiceService} from '../../../services/login/login-service.service'
import {ApiConfigService} from "../../../services/apiConfig/api-config.service";

@Component({
    selector: 'app-login-page',
    templateUrl: './login-page.component.html',
    styleUrls: ['./login-page.component.scss']
})

export class LoginPageComponent {
    password: any;
    userName: string;
    errorMassage:any;
    constructor(private router: Router,
                private route: ActivatedRoute,
                private _service: LoginServiceService,
                private  i:ApiConfigService,
                ) {
        this._service.seturl(this.i.config.API_URL)
    }


    doctorLogin(event: any) {
        this.userName = event.target.username.value;
        this.password = event.target.password.value;

        this._service.doctor(this.userName, this.password).subscribe(res => {
            localStorage.setItem('token', res.accessToken);
            localStorage.setItem('nurseFirstName',res.firstname)
            localStorage.setItem('nurseLastName',res.lastname)
            localStorage.setItem('type', '0');
            if (res.accessToken.length>0) {
                this.router.navigate(['/pages/TeriazhList']);
            }
            else {
                this.errorMassage = res.errorMassage
            }

        })
    }
    ngOnInit(){
        window.onload=()=>{
            localStorage.removeItem('firstname');
            localStorage.removeItem('AdmissionKind');
            localStorage.removeItem('age');
            localStorage.removeItem('nationalCode');
            localStorage.removeItem('birthDatepatient');
            localStorage.removeItem('genderType');
            localStorage.removeItem('item');
            localStorage.removeItem('LastName');
            localStorage.removeItem('MainDisease');
            localStorage.removeItem('reload');
            localStorage.removeItem('gender');
            localStorage.removeItem('nurseFirstName');
            localStorage.removeItem('nurseLastName');


        }
    }
}
