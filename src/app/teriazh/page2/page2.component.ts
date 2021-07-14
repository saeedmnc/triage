import { Component,Input,OnInit,ChangeDetectorRef,  } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { value } from 'app/shared/data/dropdowns';
import { from } from 'rxjs';
import{ CreatNewTeriageService} from'../../services/CreatTeriage/creat-new-teriage.service';

import{ AdmissionKindListService} from './../../services/admission-kind-list.service';
import { TeriajItemsService} from '../../services/teriajItems/teriaj-items.service';
import { Validators } from '@angular/forms';
import { FormArray } from '@angular/forms';
import {FormControl, FormGroup} from "@angular/forms";
import{ custom} from './../../anyfile'
import { Imaindesease} from './../../Imaindesease';
import { SensitiveFood} from './../../SensitiveFood';
import {map, startWith} from 'rxjs/operators';
import {Observable} from 'rxjs';
import { drugAllergy} from "./../../dugAllergy";
import { drugTable} from "./../../drugTable"
import {  ViewChild, ElementRef, AfterViewInit, Renderer2, OnDestroy } from '@angular/core';
import { eOtherCasesMainDisease} from "./../../eOtherCasesMainDisease";
import { triageFoodSensitivity} from '../../triageFoodSensitivity';
import {validate} from "codelyzer/walkerFactory/walkerFn";
import {validateEvents} from "angular-calendar/modules/common/util";
import {GetByTriageIdService} from "../../services/getById/get-by-triage-id.service";
import { JalaliDatePipe} from './../../jalali-date.pipe';
import { ProviderServiceService} from '../../services/Provider/provider-service.service';
import {HostListener} from '@angular/core';
import { ApiConfigService} from './../../services/apiConfig/api-config.service'


@Component({
  selector: 'app-page2',
  templateUrl: './page2.component.html',
    providers: [ProviderServiceService],

    styleUrls: ['./page2.component.scss']
})
// @HostListener('document:keydown', ['$event'])
export class Page2Component implements OnInit {
    triageIDEdit=""
    myControl = new FormControl();
  dateObject='';
  filteredOptions: Observable<string[]>;
  options: string[] = ['One', 'Two', 'Three'];
  triageForm: FormGroup;
    testFrom: FormGroup;
  isDisable:boolean=false;
  isShown: boolean = false ;
  name='';
    serchlist = new Array();
    MainDeseaseSearchList=new Array()
  serchlist1=new Array();
    familyName='';
  birthDate='';
  nationalCode='';
  age='';
  transport='';
  Enter='';
  lastDayHours='';
  reson = new Array();
  shekayat1='';
  SensetiveDrug='';
  listItem=new Array;
  resoneList:Array<custom> = [];
  mainDeseasePush:Array<Imaindesease>=[];
  AdmissionKindList: any[];
  transportList:any[];
  DepartureList:any[];
  genderList:any[];
  pragnentList:any[];
  EntranceList:any[];
  Encounter24HoursAgoList:any[];
  FoodSensitivityList:any[];
  ageTypeLst:any[];
  selectAddmisionList=new Array;
  saeed="";
  birthDatepatient='';
  ageType="";
  ENteranceType="";
  lastDayType="";
  genderType="";
  transportType="";
  pregmentType="";
  AllList:any[]=[];
  MainDiseaseList:any[];
  inputValueMainDesease="";
  inputValue1="";
  FoodSensitivity="";
  FoodSensitivityPush: Array<SensitiveFood>=[];
  value="";
  MainDeseaseID="";
    list=new Array();
    text="";
    toggle=false;
    mainDii:any[];
    searchText="";
    show=false;
    AdmissionFrom="";
    mainDiseaseSearch="";
    showMainDeseaseList=false;
    MainDeseaseList=new Array();
    patientIsNotIdentity="0";
    Allergy="";
    DrugHistrotyList:any[];
    drugCode=""
    drugList=new Array();
    drugSearch="";
    showDrug:boolean=false;
    drugname="";
    sepasCode="";
    drugArray=new Array();
    toggle1=false;
    toggle2=false;
    toggle3=false;
   othermainDeseasePush=new Array();
    admissionKindTextList=new Array();
    FoodSensitivityObjList=new Array();
    drugSensitivy=new Array();
    firstname="";
    validGender=false;
    validTranspoerter=false;
    validEnterance=false;
    AdmisionValid=false;
    mainDeseaseValid=false;
    foodSenseValid=false;
    drugAllerguValid=false;
    patientIsNotIdentityValid=false;
    Lastname="";
    genderList2:any[];
    liststring:any;
    MainDeseaseListliststring:any;
    triageInfo:any[];
    date: any;
    persianDate:any;
    farsiDate:any;
    date1=new Date();
    result:number;
    birthDate2:number;
    gender:any[];
    otherMaindeseaseCaseValid=false
    otherAdmissionKindCaseValid=false;
    validAge=false;
    ageTypeValid=false;
    lastDayeTypeValid=false;
    lastNameValid=false;
    firstnameValid=false;
    DateValid=false
  res:any;
    showListAdd=false;
    showListMainDesease=false;
    arrowkeyLocation=0;
    arrowkeyLocation2=0;
    inputsaeed:any;
    foodPAtientValueList=new Array();
    showFood=false;
    index:number;
    indexMAin:number;
    idAddmision="";
    idMain=""
     days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];


    // @ViewChild('search') searchElement: ElementRef;

    constructor(private modalService: NgbModal,
              private _service: CreatNewTeriageService,
              private _admissionList:AdmissionKindListService,
              private _item:TeriajItemsService,
              private renderer: Renderer2,
              private _edit: GetByTriageIdService,
              public persianCalendarService: ProviderServiceService,
              private  cdRef:ChangeDetectorRef,
              private  i:ApiConfigService,
    ) {
        this._item.seturl(this.i.config.API_URL);
        this._admissionList.seturl(this.i.config.API_URL)
        this._edit.seturl(this.i.config.API_URL)

    }
    setKey(event){
        alert("sf")
    }
    showFoodPAtient(){
        this.showFood=true;
        this.modalService.dismissAll();

    }

  disable(){

            this.isDisable=!this.isDisable;
            console.log(this.isDisable)
      if (this.isDisable==false){
          this.patientIsNotIdentity="0";

          this.triageForm.get('name').setValue(" ")
          this.triageForm.get('name').updateValueAndValidity()
          this.triageForm.get('lastName').setValue("")
          this.triageForm.get('lastName').updateValueAndValidity()
      }
      if (this.isDisable==true){
          this.patientIsNotIdentity="1";
          console.log(this.patientIsNotIdentity)
          this.triageForm.get('name').clearValidators();
          this.triageForm.get('name').setValue("بیمار ")
          this.triageForm.get('name').updateValueAndValidity()
          this.triageForm.get('birthDate').clearValidators();
          this.triageForm.get('birthDate').setValue("");
          this.triageForm.get('birthDate').updateValueAndValidity();

          this.triageForm.get('nationalCode').clearValidators()
          this.triageForm.get('nationalCode').setValue("");
          this.triageForm.get('nationalCode').updateValueAndValidity()
          this.triageForm.get('lastName').clearValidators()

          this.triageForm.get('lastName').setValue("مجهول الهویه")
          this.triageForm.get('lastName').updateValueAndValidity()
          // this.triageForm.get('nationalCode').updateValueAndValidity()
          // this.triageForm.get('birthDate').updateValueAndValidity()
          this.firstnameValid=true;
          this.lastNameValid=true;
          this.DateValid=true;
      }




  }
  GetDetails(content ) {
        this.foodSenseValid=true
    this.modalService.open(content, { size: 'lg' ,backdrop:'static',keyboard  : false}).result.then((result) => {
    }, (reason) => {     
    });
    this.FoodSensitivity="1";
      this.toggle = !this.toggle;
      this.toggle1=false

  }

  GetDrugAllergyDetails(content2){
      this.drugAllerguValid=true;
    this.modalService.open(content2, { size: 'lg',backdrop:'static',keyboard  : false }).result.then((result) => {
    }, (reason) => {     
    });
    this.Allergy="1";
      this._item.GetSepasList().subscribe(res=>{
          this.DrugHistrotyList=res;

  })
    this.toggle2=!this.toggle2;
      this.toggle3=false;
    }
    getbirthDate(event:any){
         this.birthDate=event;
         if (this.birthDate.length>0){
             this.DateValid=true;
             this.validAge=true
         } else {
             this.DateValid=false
         }
         const date=new Date(event)
        this.birthDate2=date.getFullYear();
        const date1 = this.persianCalendarService.PersianCalendar(this.date);
        this.farsiDate = date1;
        this.res=this.farsiDate.split(' ');
        let d = new Date();
        let dayName =this.days[d.getDay()];
        console.log(dayName)
        if (dayName==="Tuesday"){
            this.result=this.res[4]-this.birthDate2
        }else {
            this.result=(this.res[3]-this.birthDate2);

        }

        this.age=this.result.toString()
        // this.DateValid=true
    }

    getbirthDate1(){

    }
    onSubmit(){

          this.triageForm.value.name;

      this.triageForm.value.lastName;
      this.triageForm.value.birthDate;
      this.triageForm.value.nationalCode;
      this.triageForm.value.FoodSensitivity;
      this.triageForm.value.gender
      this.triageForm.value.gender.toString();
      this.triageForm.value.age.toString();
      this.triageForm.value.age;
      this.triageForm.value.ageType=this.ageType.toString();
      this.triageForm.value.pregmentType=this.pregmentType.toString();
      this.triageForm.value.TransportList=this.transportType.toString();
      this.triageForm.value.entrnaceType=this.ENteranceType.toString();
      this.triageForm.value.lastDay=this.lastDayType.toString();
      this.triageForm.value.lastDay;
      this.triageForm.value.admissionKind;
      this.triageForm.value.MainDisease;
      this.triageForm.value.sensetiveFoodType;
        this.AllList=this.triageForm.value;
     this.triageForm.get('name').updateValueAndValidity()
    this.AllList["name"]=this.triageForm.value.name;
        console.log("allistNAme",this.AllList["name"]);
        this.AllList["lastName"]=this.triageForm.value.lastName;
    this.AllList["birthDate"]=this.triageForm.value.birthDate;
    this.AllList["nationalCode"]=this.triageForm.value.nationalCode;
    this.AllList["gender"]=this.triageForm.value.gender;
    this.AllList["pregmentType"]=this.triageForm.value.pregmentType;
    this.AllList["age"]=this.triageForm.value.age.toString();
    this.AllList["ageType"]=this.triageForm.value.ageType;
    this.AllList["TransportList"]=this.triageForm.value.TransportList;
    this.AllList["entrnaceType"]=this.triageForm.value.entrnaceType;
    this.AllList["24Hourses"]=this.triageForm.value.lastDay;
    // this.AllList["FoodSensitivity"]=this.triageForm.value.FoodSensitivity;
    if(this.resoneList.length>0){
      this.AllList["admissionKind"]=this.resoneList;
    }else{
      this.AllList["admissionKind"]=new Array()
    }
    if(this.mainDeseasePush.length>0){
      this.AllList["MainDisease"]=this.mainDeseasePush;

    }else{
      this.AllList["MainDisease"]=new Array();

    }
        if(this.drugList.length>0){
            this.AllList["DrugSensitive"]=this.drugList;
            console.log( "دارووو حساس ",this.AllList["DrugSensitive"])
        }else{
            this.AllList["DrugSensitive"]=new Array()
        }
        if (this.othermainDeseasePush.length>0){
          this.AllList["othermainDeseasePush"]=this.othermainDeseasePush
        } else {
          this.AllList["othermainDeseasePush"]=new Array();
        }if (this.admissionKindTextList.length>0){
          this.AllList["admissionKindTextList"]=this.admissionKindTextList
        } else {
          this.AllList["admissionKindTextList"]=new Array()
        }if (this.FoodSensitivityObjList.length>0){
          this.AllList['FoodSensitivity']=this.FoodSensitivityObjList
        } else {
          this.AllList['FoodSensitivity']=new Array()
        }
    // this.AllList["admissionKindText"]=this.triageForm.value.admissionKindText;
    // this.AllList["MainDiseaseText"]=this.triageForm.value.MainDiseaseText;
    this.AllList["sensetiveFoodType"]=this.FoodSensitivity.toString();
    this.AllList["Allergy"]=this.Allergy;


    this.AllList["patientIsNotIdentity"]=this.patientIsNotIdentity;

    this._service.settodos(this.AllList);
    console.log(this._service.settodos(this.AllList))

        console.log("all",this.AllList)
    // this.triageForm.setValue(this.triageForm.value);
  }
    removeItem(i){
        console.log(i)
        this.foodPAtientValueList.splice(i,1);
        console.log(this.foodPAtientValueList)
    }


    onSearch(event: any) {
    this.showListAdd=false
    const key = event.target.value;
    this.serchlist=[];
    this.AdmissionKindList.forEach(item => {
      if(key == ""){
        this.serchlist=[];
      }
      if (key != '' ) {
      const f = item.admissionKindValue.toLowerCase().substring(0, key.length);
      if (key === f) {
        this.serchlist.push({ 'id':item.id,'admissionKindValue':item.admissionKindValue})
      }
      }
    });
   }
    showList(){
        this.showListAdd=true
    }
    showListMain(){
        this.showListMainDesease=true
    }
   onSearchMainDesease(event:any){
       this.showListMainDesease=false
       const key=event.target.value;
      this.MainDeseaseSearchList=[];
       this.MainDiseaseList.forEach(item => {
           if(key == ""){
               this.MainDeseaseSearchList=[];
           }
           if (key != '' ) {
               const f = item.mainDiseaseValue.toLowerCase().substring(0, key.length);
               if (key === f) {
                   this.MainDeseaseSearchList.push({ 'id':item.id,'mainDiseaseValue':item.mainDiseaseValue})
               }
           }
       });


   }
    onSearchDrugSensitivy(event:any){
        const key = event.target.value;

        this.drugSensitivy=[];
        this.DrugHistrotyList['items'].forEach(item => {
            if(key == ""){
                this.drugSensitivy=[];
            }
            if (key != '' ) {
                const f =  item.value.toLowerCase().substring(0, key.length);

                if (key === f) {
                    this.drugSensitivy.push({'value':item.value,'code':item.code})
                }
            }
        });
    }

    onSearchDrug(event:any){
    this.showDrug=true

    }

  seseFood(){
      this.foodSenseValid=true;
    this.FoodSensitivity="0";
    this.toggle1=!this.toggle1;
    this.toggle=false

  }
  getDrugAllergy(){
        this.drugAllerguValid=true
    this.Allergy="0"
      this.toggle3=!this.toggle3;
    this.toggle2=false
  }
    addToDrugArray(name:any,sepasCode:any){
    let selectDrug= new drugTable;
        this.drugCode=sepasCode
    selectDrug.code=this.drugCode
    selectDrug.name=name;
    this.drugArray.push(selectDrug);
    let drugObj=new drugAllergy;
    drugObj.triageID=""
    drugObj.sepas_ERXCode=this.drugCode;
    this.drugList.push(drugObj);

    }
    sendDrug(){

        this.modalService.dismissAll();
    }
  onMainDeseaseSearchChange(event:any){
    this.showMainDeseaseList=true;
  }
   setMainDesease(id:any,value:any){
    this.showListMainDesease=false
    this.MainDeseaseID=id;
    this.inputValueMainDesease=value;
    this.mainDiseaseSearch=this.inputValueMainDesease;
    this.MainDeseaseSearchList=[];
  }
    set(f:any,d:any){
        this.showListAdd=false
        this.inputValue1=f;
        this.value=d;

        this.searchText=this.value;
        this.serchlist=[];
    }
    addToOtherCaseAdmissionKind(){
        let admissionKindTextObj =new eOtherCasesMainDisease();
        admissionKindTextObj.triageID="";
        admissionKindTextObj.description=this.triageForm.value.admissionKindText;
        admissionKindTextObj.typeIS="";
        this.searchText=null;
        // customObj.admissionKindID=""
        this.admissionKindTextList.push(admissionKindTextObj);
        this.triageForm.value.admissionKindText="";

    }
    addToOtherCaseMainDesease(){
        let customObj2 = new eOtherCasesMainDisease();
        customObj2.triageID= '';
        customObj2.description=this.triageForm.value.MainDiseaseText;
        customObj2.typeIS='';
        this.mainDiseaseSearch="";
        // customObj.mainDiseaseID="";
        this.othermainDeseasePush.push(customObj2);
        this.triageForm.value.MainDiseaseText="";

    }
addToResone(){
            this.AdmisionValid=true;
            this.otherAdmissionKindCaseValid=true
            let customObj = new custom();
            customObj.triageID= "";
            customObj.admissionKindID=this.inputValue1;
            this.resoneList.push(customObj);
            this.searchText=null;
            this.list.push(this.value);
            this.value='';
            this.liststring=localStorage.setItem('AdmissionKind',this.list.toString());


}
    getinput(event){
        alert(event.target.value)
    }
    yyyyes(event){
        alert(event)
    }
    set_ch(g:any){
        alert(g)
    }
  get(event:any){

  }

    save(event){
        switch (event.keyCode) {
            case 13:
                this.showListAdd=false;
                this.serchlist=[];

                    // this.searchText=event.target.value;
                    this.searchText=this.AdmissionKindList[this.index +1  ]['admissionKindValue'];
                    this.idAddmision=this.AdmissionKindList[this.index +1 ]['id'];
                    this.AdmisionValid=true;
                    this.otherAdmissionKindCaseValid=true
                    let customObj = new custom();
                    customObj.triageID= "";
                    customObj.admissionKindID=this.idAddmision;
                    this.resoneList.push(customObj);
                    this.list.push(this.searchText);



            break;
            case 38:
                if (this.arrowkeyLocation<1){
                    this.arrowkeyLocation=1
                }
               this.index= this.arrowkeyLocation-- - 2
                document.getElementById('ul').scrollBy(-25,-25);
                document.getElementById('ul2').scrollBy(-30,-30)
                break
            case 40:
           this.index=this.arrowkeyLocation++;
                document.getElementById('ul').scrollBy(25,25);
                document.getElementById('ul2').scrollBy(30,30)
                break
        }


    }
    saveMainDesease(event){
        switch (event.keyCode) {
            case 13:
                this.showListMainDesease=false;
                this.MainDeseaseSearchList=[];
                this.mainDiseaseSearch=this.MainDiseaseList[this.indexMAin + 1]['mainDiseaseValue'];
                this.idMain=this.MainDiseaseList[this.indexMAin +1 ]['id'];
                this.mainDeseaseValid=true;
                this.otherMaindeseaseCaseValid=true
                let customObj = new Imaindesease();
                customObj.triageID= '';
                customObj.mainDiseaseID=this.idMain;
                this.mainDeseasePush.push(customObj);
                this.MainDeseaseList.push(this.mainDiseaseSearch);
                this.mainDiseaseSearch="";
                this.mainDiseaseSearch="";
            // this.searchText=event.target.value;


            // this.inputsaeed=document.getElementById('el').getAttribute('data-name');





            case 38:
                if (this.arrowkeyLocation2<1){
                    this.arrowkeyLocation2=1
                }
               this.indexMAin= this.arrowkeyLocation2-- -2
                document.getElementById('ul4').scrollBy(-30,-30);
                document.getElementById('ul3').scrollBy(-20,-20)
                break
            case 40:
             this.indexMAin=this.arrowkeyLocation2++;
                document.getElementById('ul4').scrollBy(30,30);
                document.getElementById('ul3').scrollBy(20,20)
                break
        }

    }
    addToMainDiseaseList(){
        this.mainDeseaseValid=true;
        this.otherMaindeseaseCaseValid=true

        let customObj = new Imaindesease();
        customObj.triageID= '';
        customObj.mainDiseaseID=this.MainDeseaseID;
        this.mainDeseasePush.push(customObj);
        this.mainDiseaseSearch="";
        this.MainDeseaseList.push(this.inputValueMainDesease);
        this.inputValueMainDesease=""
        this.MainDeseaseListliststring=localStorage.setItem('MainDisease',this.MainDeseaseList.toString());

    }

addAdmissionFromInput(){
//   let customObj = new custom();
//   customObj.triageID= "";
//   customObj.admissionKindID=this.triageForm.value.admissionKindText;
// this.list.push(this.AdmissionFrom);
  this._admissionList.postAdmissionKind(this.triageForm.value.admissionKindText).subscribe(res=>{
})
    this._admissionList.getAdmissionKindList().subscribe(res=>{
this.AdmissionKindList=res;
    })
}
addMainDiseaseInput(){
//   let customObj = new Imaindesease();
//   customObj.triageID= "";
//   customObj.mainDiseaseID=this.triageForm.value.MainDiseaseText;
// this.mainDeseasePush.push(customObj);

    this._item.getMainDiseaseList().subscribe(res=>{
      this.MainDiseaseList=res
    })
this.MainDeseaseList.push(this.triageForm.value.MainDiseaseText);
}
getpatientIsNotIdentity(){
  // this.patientIsNotIdentity="true"
}
  ngOnInit() {




        this.patientIsNotIdentity="0";
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

      }

      this.date = new Date();
      if (localStorage.getItem('reload')==='1'){
          localStorage.removeItem('reload')
          window.location.reload();
      }
      this.MainDeseaseListliststring=localStorage.getItem('MainDisease')
      this.liststring=localStorage.getItem('AdmissionKind')
      // this.genderType=localStorage.getItem('genderType');
      this.age=localStorage.getItem('age')
      this.nationalCode=localStorage.getItem(('nationalCode'))
        this.firstname=localStorage.getItem('firstname');
        this.Lastname=localStorage.getItem('LastName');
    this._admissionList.getAdmissionKindList().subscribe(res=>{
      this.AdmissionKindList=res;
    });
    this._item.getTransportList().subscribe(res =>{
      this.transportList=res;
    })
    this._item.getGenderList().subscribe(res=>{
      this.genderList=res;
    })
    this._item.getPragnentList().subscribe(res=>{
      this.pragnentList=res;
    })
    this._item.getEntranceTypeList().subscribe(res=>{
      this.EntranceList=res
    })
    this._item.getEncounter24HoursAgoList().subscribe(res=>{
      this.Encounter24HoursAgoList=res
    })
    this._item.getFoodSensitivityList().subscribe(res=>{
      this.FoodSensitivityList=res;
    })
    this._item.getAgeTypeList().subscribe(res=>{
      this.ageTypeLst=res
    })
      // this.testFrom=new FormGroup({
      //     'qqq':new FormControl('',[ Validators.required])
      // })

      this.triageForm = new FormGroup({
      'name': new FormControl('',[Validators.required]),
      'lastName':new FormControl('',[Validators.required]),
      'birthDate':new FormControl(null,[Validators.required]),
      'nationalCode':new FormControl(''),
      'gender':new FormControl(''),
      'age':new FormControl('',[Validators.required]),
      'ageType':new FormControl('',),
      'pregmentType':new FormControl(''),
      'TransportList':new FormControl('',),
      'entrnaceType':new FormControl('',),
      'lastDay':new FormControl(''),
      'admissionKind':new FormControl('',),
      'admissionKindText':new FormControl(''),
      'MainDisease':new FormControl('',),
      'MainDiseaseText':new FormControl(''),
      'sensetiveFoodType':new FormControl('',),
      'patientIsNotIdentity':new FormControl(''),
      'FoodSensitivity':new FormControl('',),



    });



      // this.triageForm.controls['name'].updateValueAndValidity();

  this._item.getMainDiseaseList().subscribe(res=>{
    this.MainDiseaseList=res
  })
      if (!localStorage.getItem('foo')) {
          localStorage.setItem('foo', 'no reload')
          location.reload()
      } else {
          localStorage.removeItem('foo')
      }
      if (localStorage.getItem("teriazhid").length>0) {

          alert("isbdvib")
          this.triageIDEdit=localStorage.getItem("teriazhid")
          this._edit.ByID(this.triageIDEdit).subscribe(res=>{
              this.triageInfo=res['item']
              console.log(this.triageInfo)



              this.firstname=this.triageInfo['firstName'];

              // this.triageForm.value.name=this.triageInfo['firstName'];
              this.firstnameValid=true
              this.lastNameValid=true
              this.validAge=true
              this.DateValid=true
              this.validEnterance=true
              // this.triageForm.get('name').clearValidators()
              // this.triageForm.get('name').updateValueAndValidity()
              // this.triageForm.value.name.updateValueAndValidity();
              // this.triageForm.value.lastName=this.triageInfo['lastName']
              // this.triageForm.get('lastName').clearValidators()
              // this.triageForm.get('lastName').updateValueAndValidity()
              //
              // this.triageForm.value.birthDate=this.triageInfo['birthDate']
              // this.triageForm.get('birthDate').clearValidators()
              // this.triageForm.get('birthDate').updateValueAndValidity()
              //
              // this.triageForm.value.age=this.triageInfo['age']
              // this.triageForm.get('age').clearValidators();
              // this.triageForm.get('age').updateValueAndValidity();

              // this.triageForm.status="VALID"
              console.log(this.triageForm)

              // this.birthDatepatient=this.triageInfo['birthDate'];
              this.Lastname=this.triageInfo['lastName'];
              this.nationalCode=this.triageInfo['nationalCode'];
              this.age=this.triageInfo['age']
              if (this.triageInfo["triage_AdmissionKind"]!=null){
                  this.otherAdmissionKindCaseValid=true;
                  this.AdmisionValid=true
                  for ( let i of this.triageInfo["triage_AdmissionKind"]) {
                      for( let item of this.AdmissionKindList){
                          if (i.admissionKindID===item.id){
                              this.list.push(item.admissionKindValue)
                          }
                      }

                  }

              }
              if (this.triageInfo["triage_MainDisease"]!=null){
                  this.mainDeseaseValid=true
                  this.otherMaindeseaseCaseValid=true
                  for ( let i of this.triageInfo["triage_MainDisease"]) {

                      for( let item of this.MainDiseaseList){
                          if (i.mainDiseaseID===item.id){
                              this.MainDeseaseList.push(item.mainDiseaseValue)
                          }
                      }

                  }

              }
            if (this.triageInfo['hasFoodSensitivity']==="True"){
                this.toggle=true;
                this.toggle1=false
                this.foodSenseValid=true
                for (let i of this.triageInfo['triageFoodSensitivity']){
                for (let food of this.FoodSensitivityList){
                    if (i.foodSensitivityValue==food.Key) {
                        this.foodPAtientValueList.push(food.Value)
                        this.showFood=true
                    }
                }
                }
            }
            if (this.triageInfo['allergy']==="1"){
                this.toggle2=true;
                this.toggle3=false
                this.drugAllerguValid=true
                // for (let i of this.triageInfo['triageAllergyDrugs']){
                //     for (let drug of  this.DrugHistrotyList){
                //         if (i.sepas_ERXCode==drug.code) {
                //             this.drugArray.push(drug.value)
                //             // this.showFood=true
                //         }
                //     }
                // }

            }  if (this.triageInfo['allergy']==="0"){
                this.toggle3=true;
                this.toggle2=false
            }
            if (this.triageInfo['hasFoodSensitivity']==="False"){
                this.toggle1=true;
                this.toggle=false
            }
            for (let i of this.ageTypeLst){
                if (this.triageInfo['ageType']===i.Key.toString()){
                    this.ageTypeValid=true
                    // this.ageType=i.Value;
                    // console.log(""this.ageType);
                    for (let myChild of this.ageTypeLst) {
                        myChild.BackgroundColour = "white";
                        i.BackgroundColour = "#44b5b7";
                        myChild.color = "black";
                        i.color='white'
                    }

                    console.log(this.ageType)

                }
            }
            for (let i of this.genderList) {
                if (this.triageInfo['gender']===i.Key.toString()) {
                    // this.genderType=i.Value;
                    this.validGender=true
                    for (let myChild of this.genderList) {

                        myChild.BackgroundColour = "white";
                        i.BackgroundColour = "#44b5b7";
                        myChild.color = "black";
                        i.color='white'
                    }
                }
            }
            for (let i of this.transportList) {
                if (this.triageInfo['arrival_Transport']===i.Key.toString()){
                    // this.transportType=i.Value;
                    this.validTranspoerter=true
                    for (let myChild of this.transportList) {
                        myChild.BackgroundColour = "white";
                        i.BackgroundColour = "#44b5b7";
                        myChild.color = "black";
                        i.color='white'
                    }
                }
            }
            for (let i of this.Encounter24HoursAgoList) {
                if (this.triageInfo['encounter24HoursAgoItems']===i.Key.toString()){
                    // this.lastDayType=i.Value;
                    for (let myChild of this.Encounter24HoursAgoList) {
                        myChild.BackgroundColour = "white";
                        i.BackgroundColour = "#44b5b7";
                        myChild.color = "black";
                        i.color='white'
                    }

                }
            }
            if (this.triageInfo['triageLevelIS']==="1"){
                document.getElementById("level1").style.backgroundColor='gray'

            }
            if (this.triageInfo['triageLevelIS']==="2"){
                document.getElementById("level2").style.backgroundColor='gray'

            }
            if (this.triageInfo['triageLevelIS']==="3"){
                document.getElementById("level3").style.backgroundColor='gray'

            }
            if (this.triageInfo['triageLevelIS']==="4"){
                document.getElementById("level4").style.backgroundColor='gray'

            }
            if (this.triageInfo['triageLevelIS']==="5"){
                document.getElementById("level5").style.backgroundColor='gray'
            }
            if (this.triageInfo["triageOtherCasesAdmissionKind"]!=null){
                this.otherAdmissionKindCaseValid=true;
                this.AdmisionValid=true
                for (let i of this.triageInfo["triageOtherCasesAdmissionKind"]) {
                    let admissionKindTextObj =new eOtherCasesMainDisease();
                    admissionKindTextObj.triageID="";
                    admissionKindTextObj.description=i.description;
                    admissionKindTextObj.typeIS="";
                    // customObj.admissionKindID=""
                    this.admissionKindTextList.push(admissionKindTextObj);

                }
            }
            if (this.triageInfo["triageOtherCasesMainDisease"]!=null){
                this.otherMaindeseaseCaseValid=true;
                this.mainDeseaseValid=true

                for (let i of this.triageInfo["triageOtherCasesMainDisease"]) {
                    let customObj2 = new eOtherCasesMainDisease();
                    customObj2.triageID= '';
                    customObj2.description=i.description;
                    customObj2.typeIS='';
                    this.mainDiseaseSearch="";
                    // customObj.mainDiseaseID="";
                    this.othermainDeseasePush.push(customObj2);

                }

            }



          })
      }


  }
  sendData(id:any,i){
    this.ageType=id;

      for (let myChild of this.ageTypeLst) {
          myChild.BackgroundColour = "white";
          i.BackgroundColour = "#44b5b7";
          myChild.color = "black";
          i.color='white'
      }
      this.ageTypeValid=true;


  }
  getEntrnaceType(id:any,i){
      this.validEnterance=true
    this.ENteranceType=id;
      for (let myChild of this.EntranceList) {
          myChild.BackgroundColour = "white";
          i.BackgroundColour = "#44b5b7";
          myChild.color = "black";
          i.color='white'
      }


  }
  getLastDayType(id:any,i){
    this.lastDayType=id
      for (let myChild of this.Encounter24HoursAgoList) {
          myChild.BackgroundColour = "white";
          i.BackgroundColour = "#44b5b7";
          myChild.color = "black";
          i.color='white'
      }
  }
  getGenderType(id:any,i:any){
      this.validGender=true;
      this.genderType=id;
      this.triageForm.value.gender=this.genderType.toString();
      // localStorage.setItem('genderType', this.triageForm.value.gender);
        if(id==1){
          this.isShown=true;
        }else{
          this.isShown=false;
        }
      // this._service.settodos(this.genderList);

      for (let myChild of this.genderList) {
          localStorage.setItem('gender',myChild)

          myChild.BackgroundColour = "white";
          i.BackgroundColour = "#44b5b7";
          myChild.color = "black";
          i.color='white'
      }




  }
    getOtherMainDesease(event:any){
        this.otherMaindeseaseCaseValid=true;
        this.mainDeseaseValid=true

    }
    getOtherAdmissionKind(event:any){
        this.otherAdmissionKindCaseValid=true;
        this.AdmisionValid=true
    }
  getTransportType(id:any,i){
      this.validTranspoerter=true
    this.transportType=id
      for (let myChild of this.transportList) {
          myChild.BackgroundColour = "white";
          i.BackgroundColour = "#44b5b7";
          myChild.color = "black";
          i.color='white'
      }

  }
  getPregmentType(id:any,i:any){
    this.pregmentType=id;
      for (let myChild of this.pragnentList) {
          myChild.BackgroundColour = "white";
          i.BackgroundColour = "#44b5b7";
          myChild.color = "black";
          i.color='white'
      }
  }
  getFoodSensitivity(id:any,i,value){
        this.foodPAtientValueList.push(value)
    // this.FoodSensitivity=id;
      this.inputsaeed=id
      for (let myChild of this.FoodSensitivityList) {

          // myChild.BackgroundColour = "white"
          i.BackgroundColour = "#44b5b7";
          // myChild.color = "black";
          i.color='white'

      }
      let FoodSensitivityObj = new triageFoodSensitivity;
      FoodSensitivityObj.triageID="";
      FoodSensitivityObj.foodSensitivityValue=this.inputsaeed.toString();
      this.FoodSensitivityObjList.push(FoodSensitivityObj);

  }
    setfirst(event:any){

        this.firstname=event.target.value;
        // this.triageForm.get('name').reset();
        this.triageForm.value.name=event.target.value
        this.triageForm.get('name').updateValueAndValidity()
        console.log("name",this.triageForm.value.name)
        // this.triageForm.get('name').setValue(event.target.value);
        if (this.firstname.length>0){
            this.firstnameValid=true
        } else {
            this.firstnameValid=false
        }
        // localStorage.setItem('firstname',this.firstname)

    }
    setLastName(event:any){
      this.Lastname=event.target.value;
        this.triageForm.value.lastName=event.target.value

        if(this.Lastname.length>0){
          this.lastNameValid=true

      }else {
          this.lastNameValid=false
      }
      localStorage.setItem('LastName',this.Lastname)
    }
    setNationalCOde(event:any){
      this.nationalCode=event.target.value
        localStorage.setItem('nationalCode',this.nationalCode)
    }
    setage(event:any){

      this.age=event.target.value;
      if (this.age.length>0){
          this.validAge=true
      } else {
          this.validAge=false
      }
      localStorage.setItem('age',this.age)
    }
    // ngAfterViewInit() {
    //
    //     this.cdRef.detectChanges();
    // }
    // ngAfterViewInit() {
    //     setTimeout(() => {
    //
    //         const elem = this.renderer.selectRootElement('#myInput',);
    //         const Admission=this.renderer.selectRootElement("#AdmissionInput");
    //         this.renderer.listen(Admission, "focus", () => { this.show=true });
    //
    //         this.renderer.listen(Admission, "blur", () => { this.show=false });
    //         // Admission.focus();
    //
    //         this.renderer.listen(elem, "focus", () => { this.showMainDeseaseList=true });
    //
    //         this.renderer.listen(elem, "blur", () => { this.showMainDeseaseList=false });
    //
    //         // elem.focus();
    //
    //     }, 1000);
    // }

  
  
}
