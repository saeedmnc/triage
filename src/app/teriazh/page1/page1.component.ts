import { Content } from '@angular/compiler/src/render3/r3_ast';
import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { TemplateRef, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormArray } from '@angular/forms';
import {FormControl, FormGroup} from "@angular/forms";
import{ AdmissionKindListService} from './../../services/admission-kind-list.service';
import{ MainDiseaseService} from './../../services/mainDisease/main-disease.service';
import { TeriajFilterService} from "./../../services/teriajFilter/teriaj-filter.service";
import { TeriajItemsService} from '../../services/teriajItems/teriaj-items.service';
import {ActivatedRoute, Route, Router} from '@angular/router';
import {ApiConfigService} from "../../services/apiConfig/api-config.service";





@Component({
  selector: 'app-page1',
  templateUrl: './page1.component.html',
  styleUrls: ['./page1.component.scss']
})
export class Page1Component implements OnInit {
  dateObject='';
  dateObject1='';
    teriajID:any;
  signupForm: FormGroup;
  AdmissionKindList:any[];
  MainDiseaseList:any[];
  result:any[];
  list1:any[];
  triageLocationID="";
  transportList:any[];
  DepartureList:any[];
  EntranceTypeList:any[];
  TriageLevelList:any[];
  ageTypeLst:any[];
  sTriageAdmissionKind="";
  sTriage_MainDisease="";
  id="";
  @ViewChild('content', { static: true }) content: TemplateRef<any>;
  constructor( private modalService: NgbModal,
    private _admissionList:AdmissionKindListService,
    private _MainDisease:MainDiseaseService,
    private _TeriajFilter:TeriajFilterService,
    private _item:TeriajItemsService,
    private router: Router,
    private  i:ApiConfigService,

   
    ) {
      this._item.seturl(this.i.config.API_URL);
      this._admissionList.seturl(this.i.config.API_URL)
      this._MainDisease.seturl(this.i.config.API_URL)
      this._TeriajFilter.seturl(this.i.config.API_URL)
  }
  resetList(event:any){
this.signupForm.reset()    
  }
  onSubmit(){
    console.log(this.signupForm);
    console.log(this.signupForm.value.toDate);
  this._TeriajFilter.postPractitioner(
    this.signupForm.value.teriazhID,
    this.signupForm.value.firstName,
    this.signupForm.value.LastName,
    this.signupForm.value.fromAge,
    this.signupForm.value.toAge,
    this.signupForm.value.fromDate,
    this.signupForm.value.toDate,
    this.signupForm.value.entrnaceType,
    this.signupForm.value.triageLevel,
    this.signupForm.value.departure,
    this.signupForm.value.triageStatus,
    this.signupForm.value.admissionKind,
    this.signupForm.value.prac,
    this.triageLocationID=localStorage.getItem('locationID'),
    this.sTriageAdmissionKind=this.sTriageAdmissionKind,
    this.sTriage_MainDisease=this.sTriage_MainDisease
  ).subscribe(res=>{
    this.result=res;
    console.log(res)

  })
  this.modalService.dismissAll();
}
getDatail(id:any){
this.id=id;
localStorage.setItem('teriazhid',this.id);
this.router.navigate(['/teriazh/showInfo', this.id]);

}
  ngOnInit() {
    this.modalService.open(this.content,{ size: 'lg' ,backdrop:'static',keyboard  : false});
   this.signupForm = new FormGroup({
      'teriazhID': new FormControl('',),
      'firstName':new FormControl(''),
      'LastName':new FormControl(''),
      'fromAge':new FormControl(''),
      'toAge':new FormControl(''),
      'fromDate':new FormControl('',[ Validators.required ]),
      'toDate':new FormControl('',[ Validators.required ]),
      'entrnaceType':new FormControl(''),
      'triageLevel':new FormControl(''),
      'departure':new FormControl(''),
      'triageStatus':new FormControl(''),
      'admissionKind':new FormControl(''),
      'prac':new FormControl(''),
  });

  this._admissionList.getAdmissionKindList().subscribe(res=>{
    this.AdmissionKindList=res;
    console.log(this.AdmissionKindList)
  });
  this._MainDisease.getMainDiseaseList().subscribe(res=>{
    this.MainDiseaseList=res;
    console.log(this.MainDiseaseList)
  });
  this._item.getDepartureList().subscribe(res =>{
    this.DepartureList=res;
    console.log(this.DepartureList)
  })
  this._item.getEntranceTypeList().subscribe(res =>{
    this.EntranceTypeList=res;
  })
  this._item.getTriageLevelList().subscribe(res=>{
    this.TriageLevelList=res;
  })
  this._item.getAgeTypeList().subscribe(res=>{
    this.ageTypeLst=res
  })
      this._item.getTransportList().subscribe(res=>{
        this.transportList=res;
        console.log(this.transportList)
      })
}}
