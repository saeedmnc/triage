import { Component, OnInit,ViewChild } from '@angular/core';
import { TeriajFilterService} from '../../services/teriajFilter/teriaj-filter.service';
import { GetByTriageIdService} from "./../../services/getById/get-by-triage-id.service";
import {TeriajItemsService} from './../../services/teriajItems/teriaj-items.service'
import { MatMenuTrigger } from '@angular/material';
import {Router} from "@angular/router";
import {ApiConfigService} from "../../services/apiConfig/api-config.service";
import{ AdmissionKindListService} from "../../services/admission-kind-list.service"


@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.scss']
})
export class PatientListComponent implements OnInit {
  hide:boolean=true;
 
persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g];
arabicNumbers  = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g];
  today = new Date().toLocaleDateString('fa-IR');
      teriazhID='';
      firstName='';
      LastName='';
      fromAge='';
      date: Date;
      toAge='';
      fromDate=this.today.toString();
      toDate=this.today;
      entrnaceType='';
      triageLevel='';
      departure='';
      triageStatus='';
      admissionKind='';
      prac='';
      List:any[];
      tomarrow:any;
      triageLocationID="";
      sTriageAdmissionKind="";
      sTriage_MainDisease="";
      id="";
      info:any[];
    transporterList=[];
    depratureList:any[];
    TriageStatusList:any[];
    //sorting
   

    constructor(private _TeriajFilter:TeriajFilterService,
              private _service: GetByTriageIdService,
                private _item:TeriajItemsService,
                private router: Router,
                private _AdmissionKind:AdmissionKindListService,
                private  i:ApiConfigService,
    ) {
        this._item.seturl(this.i.config.API_URL);
        this._service.seturl(this.i.config.API_URL);
        this._TeriajFilter.seturl(this.i.config.API_URL);
        this._AdmissionKind.seturl(this.i.config.API_URL)

    }

  

  reload(){
    window.location.reload()
  }
  fixNumbers = function (str:any)
{
  if(typeof str === 'string')
  {
    for(var i=0; i<10; i++)
    {
      str = str.replace(this.persianNumbers[i], i).replace(this.arabicNumbers[i], i);
    }
  }
  return str;
};
selectPatient(id:any){
  this.id=id;
  console.log(this.teriazhID);
  localStorage.setItem('teriazhid',id);
  this._service.ByID(id).subscribe(res=>{
    this.info=res;
    console.log(this.info)
  })
    this.router.navigate(['/teriazh/showInfo', this.id]);


}


  ngOnInit() {
    this._item.GetTriageStatusList().subscribe(res=>{
       this.TriageStatusList=res;
       console.log(this.TriageStatusList)
    })
    this._item.getDepartureList().subscribe(res=>{
        this.depratureList=res;
        console.log(this.depratureList)
    })
    this._item.getTransportList().subscribe(res=>{
        this.transporterList=res;
        console.log(this.transporterList)
    })
      this._AdmissionKind.getAdmissionKindList().subscribe(res=>{
          console.log(res)
      })




    this.date = new Date();
    this.date.setDate( this.date.getDate() + 1 );
  
    
    this.tomarrow=this.date.toLocaleDateString('fa-IR');
    this.today=this.fixNumbers(this.today)
    this.tomarrow=this.fixNumbers(this.tomarrow)
    this.triageLocationID=localStorage.getItem('locationID');
    console.log(this.triageLocationID);
    this._TeriajFilter.postPractitioner(
      this.teriazhID,
      this.firstName,
      this.LastName,
      this.fromAge,
      this.toAge,
      this.fromDate=this.today.toString(),
      this.toDate= this.tomarrow,
      this.entrnaceType,
      this.triageLevel,
      this.departure,
      this.triageStatus,
      this.admissionKind,
      this.prac,
      this.triageLocationID,
      this.sTriageAdmissionKind=this.sTriageAdmissionKind,
      this.sTriage_MainDisease=this.sTriage_MainDisease
    ).subscribe(res=>{
      this.List=res;

  console.log(this.List);

    })
    console.log(this.today);
  
  }
  

}
export interface Item {
    id: number;
    name: string;
}
