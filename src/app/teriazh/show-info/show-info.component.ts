import { Component, OnInit } from '@angular/core';
import { GetByTriageIdService} from "./../../services/getById/get-by-triage-id.service";
import { TeriajItemsService} from "./../../services/teriajItems/teriaj-items.service";

import {ActivatedRoute, Router} from '@angular/router';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { AdmissionKindListService} from "../../services/admission-kind-list.service";
import { AVPUService} from'../../services/AVPU/avpu.service';
import { threadId } from 'worker_threads';
import {ApiConfigService} from "../../services/apiConfig/api-config.service";



@Component({
  selector: 'app-show-info',
  templateUrl: './show-info.component.html',
  styleUrls: ['./show-info.component.scss']
})
export class ShowInfoComponent implements OnInit {
  hide:boolean=true;
    pracInfo=[]
    Time=""
    pracID=""
    foodAllergy=new Array()
    otherMAin=new Array()
    foodAllerguValue=new Array()
    AlleryDrug=new Array()
    drugListFinalArray=new Array()
    drugListArray=new Array()
    aleryDrugFinaly:Array<any>=[]
    allergyDrugVAlue=new Array()
  drugCode=""
  drugCodeArray=new Array()
    mainDesaseValue=""
    transporterValue=""
    DrugHistrotyList:any[]
    bp:number
    pr:number
    rr:number
    t:number
    spo2:number;
    nurseFirstName=""
    nurstLastName=""
    painPrint:number
  ddd="2"
  triazhInfo:any[];
  triageID ="";
  trasporter=new Array();
  lastDay:any[];
  saeed="";
  MainDiseaseList:any[];
  AdmissionKindList:any[]
  Encounter24HoursAgoList:any[];
  AllergyDrugList:any[];
    AllergyDrugListSepas:any[]
  AVPUlist:any[];
  departure:any;
  SeparationByInfectionList:any[];
    foodLIst:any[]
    hospital:any[]
  constructor(  private _service: GetByTriageIdService,
                private route: ActivatedRoute,
                private _item :TeriajItemsService,
                private _admissionList:AdmissionKindListService,
                private _AVPU:AVPUService,
                private router: Router,
                private  i:ApiConfigService,

  ) {


      this._item.seturl(this.i.config.API_URL);
      this._service.seturl(this.i.config.API_URL);
      this._AVPU.seturl(this.i.config.API_URL);
      this._admissionList.seturl(this.i.config.API_URL);
  }
    edit(){
    localStorage.setItem('edit','1');

        this.router.navigate(['/teriazh/Patient-Triage']);
    }
  ngOnInit() {
        console.log(this.aleryDrugFinaly)

    this._item.getHospitalName().subscribe(res=>{
        this.hospital=res
    })

      this.nurseFirstName=localStorage.getItem('nurseFirstName');
      this.nurstLastName=localStorage.getItem('nurseLastName');
    

    this.triageID=localStorage.getItem('teriazhid');
    // this._item.GetSepasList().subscribe(res=>{
    //   this.AllergyDrugListSepas=res;
    //   console.log(this.AllergyDrugListSepas);
    // })

    this._item.getDepartureList().subscribe(res=>{
      this.departure=res
    })
    


    this._service.ByID(this.triageID).subscribe(res=>{
      this.triazhInfo=res;
        this.pracID=this.triazhInfo['item']['triage_PracID']
        console.log("attatatatatata",this.pracID)
      console.log(this.triazhInfo);
        console.log('mainId',this.triazhInfo['item']['triage_MainDisease'][0]['mainDiseaseID'])
        for(let a of this.triazhInfo['item']['triageAllergyDrugs'] ){
            console.log("dugHistory",a.sepas_ERXCode)
            this.AlleryDrug.push(a.sepas_ERXCode);
            console.log(this.AlleryDrug);
        }
        for (let i of this.triazhInfo['item']['triageFoodSensitivity']){
            this.foodAllergy.push(i.foodSensitivityValue)
        }
        for(let i of this.triazhInfo['item']['triageOtherCasesMainDisease']){
          this.otherMAin.push(i.description)
        }

       for(let i of this.triazhInfo['item']['triageDrugHistory']){
         console.log("saeed mnc",i.strDrugCode)
         this.drugCode=i.strDrugCode;
         this.drugCode=this.drugCode.trim();
         this.drugCodeArray.push(this.drugCode)
         console.log(this.drugCodeArray)
       }

        this.bp= parseInt(this.triazhInfo['item']['bp'])
        this.bp=Math.round(this.bp)
        this.pr=parseInt(this.triazhInfo['item']['pr'])
        this.pr=Math.round(this.pr);
        this.rr=parseInt(this.triazhInfo['item']['rr'])
        this.rr=Math.round(this.rr)
        this.t=parseInt(this.triazhInfo['item']['t'])
        this.t=Math.round(this.t)
        this.spo2=parseInt(this.triazhInfo['item']['spo2'])
        this.spo2=Math.round(this.spo2)
        this.painPrint=parseInt(this.triazhInfo['item']['intensityOfPain']);
        this.painPrint=Math.round(this.painPrint)
        this.Time=this.triazhInfo['item']['entranceTime'];
       this.Time=this.Time.substr(this.Time.length - 5)
        this._item.postPracID(this.pracID).subscribe(res=>{
            this.pracInfo=res;
            console.log("نام پرستار",res)
        })
    })


      this._item.getFoodSensitivityList().subscribe(res=>{
          this.foodLIst=res;
          for (let a of this.foodLIst){
              for (let q of this.foodAllergy){
                  if (q==a.Key) {
                      this.foodAllerguValue.push(a.Value)
                  }
              }
          }
      })
    this._item.getTransportList().subscribe(res=>{
      this.trasporter=res;
      this.trasporter.forEach(i=>{
        if (i.Key.toString()==this.triazhInfo['item']['arrival_Transport']) {
            console.log("sopdfij",i.Value)
            this.transporterValue=i.Value
        }

    })
  })
    this._item.getEncounter24HoursAgoList().subscribe(res=>{
      this.Encounter24HoursAgoList=res
    })
    
   
    this._item.getEncounter24HoursAgoList().subscribe(res=>{
      this.lastDay=res;

    })
    this._admissionList.getAdmissionKindList().subscribe(res=>{
      this.AdmissionKindList=res;
      console.log(this.AdmissionKindList)
    })
    this._item.getMainDiseaseList().subscribe(res=>{
      this.MainDiseaseList=res;
      console.log(this.MainDiseaseList)
      this.MainDiseaseList.forEach(i=>{
        if (i.id.toString()==this.triazhInfo['item']['triage_MainDisease'][0]['mainDiseaseID']) {
            console.log("sopdfij",i.mainDiseaseValue)
            this.mainDesaseValue=i.mainDiseaseValue
        }

    })
    })
    this._item.getTriageAllergyDrugs().subscribe(res=>{
      this.AllergyDrugList=res;
      console.log(this.AllergyDrugList)

    })
    this._AVPU.getAVPU().subscribe(res=>{
      this.AVPUlist=res}) 
      this._item.GetSeparationByInfectionList().subscribe(res=>{
        this.SeparationByInfectionList=res
      })
      this._item.GetSepasList().subscribe(res=>{
          this.AllergyDrugListSepas=res;
          for (let i of  this.AllergyDrugListSepas['items']){
              for (let x of this.AlleryDrug ) {
                  if (i.code==x){
                      this.allergyDrugVAlue.push(i.value);


                  }
              }
              for( let q of this.drugCodeArray){
                  if (i.code==q){
                      this.drugListArray.push(i.value)
                  }
              }
          }
          console.log( this.allergyDrugVAlue)
          this.allergyDrugVAlue.forEach(item=>{
             this.aleryDrugFinaly.push(item.substr(0,item.indexOf(' ')))
              console.log(this.aleryDrugFinaly)
          })
          this.drugListArray.forEach(item=>{
              this.drugListFinalArray.push(item.substr(0,item.indexOf(' ')))
          })


      })





  }
}
