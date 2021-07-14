import { Component, OnInit, Output,EventEmitter } from '@angular/core';
import{ CreatNewTeriageService} from'../../services/CreatTeriage/creat-new-teriage.service';
import { TeriajItemsService} from '../../services/teriajItems/teriaj-items.service';
import {FormControl, FormGroup} from "@angular/forms";
import { Creatlevel5Service} from '../../services/CreatTeriage/creatlevel5/creatlevel5.service'
import {GetByTriageIdService} from "../../services/getById/get-by-triage-id.service";
import {EndOfTriageService} from "../../services/end-of-triage.service";
import {Router} from "@angular/router";
import {ApiConfigService} from "../../services/apiConfig/api-config.service";



@Component({
  selector: 'app-page6',
  templateUrl: './page6.component.html',
  styleUrls: ['./page6.component.scss']
})
export class Page6Component implements OnInit {
    list:any[];
    pracID=""
    MainIDArray=new Array()
    mainVAlueArray=new Array()
    Time=""
    transportArray:any[]
    transporterValue=""

    FoodcodeArray=new Array()
    foodAllerguValue=new Array()
    foodLIst:any[]
    aleryDrugFinaly=new Array()
    AlleryDrug=new Array()
    allergyDrugVAlue=new Array()
    mainDiseaseArray=new Array()


    AllergyDrugListSepas:any[]


    hospital:any[];
    pracInfo:any[]

    SeparationByInfectionList:any[];
    Separation='';
    departureList:any[];
    departure="";
    lastDay="";
    MainDisease=new Array();
    TransportList="";
    admissionKind=new Array();
    drugList=new Array();
    age="";
    ageType="";
    birthDate="";
    entrnaceType="";
    gender="";
    lastName="";
    name="";
    FoodSensitivityObjList=new Array();
    nationalCode="";
    pregmentType="";
    sensetiveFoodType="";
    hasDrugAllery="";
    patientIsNotIdentity="";
    eOtherCasesMainDisease=new Array();
    admissionKindTextList=new Array();
    level4Form: FormGroup;
    triageID="";
    idter="";
    idterTXT="";
    triazhInfo:any[];
    printOK=false;
    ISsubmitOK=false;
    succsess="";
    showResult=false;
    isSubmitError=false;
    result="";
    refeValid=false














    constructor(private _service:CreatNewTeriageService,
              private _item:TeriajItemsService,
                private _lvl4:Creatlevel5Service,
                private  _Save:GetByTriageIdService,
                private _End:EndOfTriageService,
                private router: Router,
                private  i:ApiConfigService,
    ) {
        this._item.seturl(this.i.config.API_URL);
        this._lvl4.seturl(this.i.config.API_URL);
        this._Save.seturl(this.i.config.API_URL);
        this._End.seturl(this.i.config.API_URL);
    }
    onSubmit(){
        this.level4Form.value.Departure=this.departure;
        this.level4Form.value.Separation=this.Separation;
        this._lvl4.creatTriageLvl4And5(
            this.sensetiveFoodType,this.departure,this.Separation,this.gender,this.age,
            this.ageType,this.name,this.lastName,this.nationalCode,this.TransportList,this.birthDate,this.lastDay,this.admissionKind,this.MainDisease,
            this.patientIsNotIdentity,this.hasDrugAllery,this.drugList,this.FoodSensitivityObjList,this.eOtherCasesMainDisease,this.admissionKindTextList
        ).subscribe(res=>{
            console.log(res)

            this.showResult=true
            if (res.success===true){
                this.succsess=res.success
                this.ISsubmitOK=true;
                this.triageID=res.trackingNumber;
                console.log(this.triageID)
                // this.result=res.errorMessage
            }if(res.success===false){
                this.isSubmitError=true
                this.result=res.errorMessage;
            }
            this._Save.ByID(this.triageID).subscribe(res=>{
                this.triazhInfo=res
                console.log(this.triazhInfo)
                this.pracID=this.triazhInfo['item']['triage_PracID']
                this.Time=this.triazhInfo['item']['entranceTime'];
                this.Time=this.Time.substr(this.Time.length - 5)


                this._item.postPracID(this.pracID).subscribe(res=>{
                    this.pracInfo=res;
                    console.log("نام پرستار",res)
                })
                for(let a of this.triazhInfo['item']['triageAllergyDrugs'] ){
                    this.AlleryDrug.push(a.sepas_ERXCode);
                    console.log(this.AlleryDrug)
                }
                for (let i of  this.AllergyDrugListSepas['items']){
                    for (let x of this.AlleryDrug ) {
                        if (i.code==x){
                            this.allergyDrugVAlue.push(i.value);
                        }
                    }
                }
                this.allergyDrugVAlue.forEach(item=>{
                    this.aleryDrugFinaly.push(item.substr(0,item.indexOf(' ')))
                    console.log(this.aleryDrugFinaly)
                })
            })



        })




    }

    getSeparationByInfectionList(id:any,i:any){
        this.Separation=id.toString();
        for (let myChild of this.SeparationByInfectionList) {
            myChild.BackgroundColour = "white";
            i.BackgroundColour = "#44b5b7";
            myChild.color = "black";
            i.color='white'
        }
    }
    close(){
        this.ISsubmitOK=false;
        this.printOK=true
    }
    getDeparture(id:any,i:any){
        this.refeValid=true;
        this.departure=id.toString();
        for (let myChild of this.departureList) {
            myChild.BackgroundColour = "white";
            i.BackgroundColour = "#44b5b7";
            myChild.color = "black";
            i.color='white'
        }

    }
    send(){
        this._Save.ByID(this.triageID).subscribe(res=>{
            this.triazhInfo=res;
            localStorage.removeItem('firstname');
            localStorage.removeItem('AdmissionKind');
            localStorage.removeItem('age');
            localStorage.removeItem('nationalCode');
            localStorage.removeItem('birthDatepatient');
            localStorage.removeItem('genderType');
            localStorage.removeItem('item');
            localStorage.removeItem('LastName');
            localStorage.removeItem('MainDisease');
            localStorage.setItem('reload','1');
            this.router.navigate(['/teriazh/Patient-Triage']);
        });
        this._End.endTtiazh(this.triageID).subscribe(res=>{
            console.log(res);
        })
    }

  ngOnInit() {
      this._item.GetSepasList().subscribe(res=>{
          this.AllergyDrugListSepas=res;
      })
      this._item.getFoodSensitivityList().subscribe(res=>{
          this.foodLIst=res
          for (let a of this.foodLIst){
              for (let q of this.FoodcodeArray){
                  if (q==a.Key) {
                      this.foodAllerguValue.push(a.Value)
                  }
              }
          }
      })
      this._item.getMainDiseaseList().subscribe(res=>{
          this.mainDiseaseArray=res
          for (let i of this.mainDiseaseArray){
              for (let q of this.MainIDArray ){
                  if (q==i.id){
                      this.mainVAlueArray.push(i.mainDiseaseValue)
                  }
              }

          }
      })
      this._item.getTransportList().subscribe(res=>{
          this.transportArray=res;
          this.transportArray.forEach(i=>{
              if (i.Key==this.TransportList) {
                  this.transporterValue=i.Value;
              }
          })})
      this._item.getHospitalName().subscribe(res=>{
          this.hospital=res
      })
      this.level4Form= new FormGroup({
          'Departure':new FormControl(''),
          'Separation':new FormControl(''),
      })
      this._item.GetSeparationByInfectionList().subscribe(res=>{

          this.SeparationByInfectionList=res;

      })
      this._item.getDepartureList().subscribe(res=>{
          this.departureList=res;
      })
      this.list=this._service.gettodos();
      this.lastDay=this.list[0]["24Hourses"];
      this.MainDisease=this.list[0]["MainDisease"];
      for (let i of this.MainDisease){
          this.MainIDArray.push(i.mainDiseaseID)
      }
      this.TransportList=this.list[0]["TransportList"];
      this.admissionKind=this.list[0]["admissionKind"];
      this.drugList=this.list[0]["DrugSensitive"]
      console.log(this.drugList)

      this.age=this.list[0]["age"];
      this.ageType=this.list[0]["ageType"];
      this.birthDate=this.list[0]["birthDate"];
      this.entrnaceType=this.list[0]["entrnaceType"];
      this.gender=this.list[0]["gender"];
      this.lastName=this.list[0]["lastName"];
      this.name=this.list[0]["name"];
      this.FoodSensitivityObjList=this.list[0]["FoodSensitivity"];
      for (let i of this.FoodSensitivityObjList){

          this.FoodcodeArray.push(i.foodSensitivityValue)
      }

      this.nationalCode=this.list[0]["nationalCode"];
      this.pregmentType=this.list[0]["pregmentType"]
      this.sensetiveFoodType=this.list[0]["sensetiveFoodType"];
      this.hasDrugAllery=this.list[0]["Allergy"];
      // this.admissionKindText=this.list[0]["admissionKindText"];
      // this.MainDiseaseText=this.list[0]["MainDiseaseText"];
      this.patientIsNotIdentity=this.list[0]["patientIsNotIdentity"];
      this.eOtherCasesMainDisease=this.list[0]['othermainDeseasePush']
      this.admissionKindTextList=this.list[0]['admissionKindTextList']
      if(this.patientIsNotIdentity==="1"){
          this.birthDate=""
      }
    }


}
