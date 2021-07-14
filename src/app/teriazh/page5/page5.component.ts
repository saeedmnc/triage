import { Component, OnInit } from '@angular/core';
import{ CreatNewTeriageService} from'../../services/CreatTeriage/creat-new-teriage.service';
import {FormControl, FormGroup} from "@angular/forms";
import { TeriajItemsService} from '../../services/teriajItems/teriaj-items.service';
import { CreatLevel2Service} from '../../services/CreatTeriage/creat-level2.service';
import{ drugHistroy} from "./../../drugHistory";
import {ActivatedRoute, Router} from '@angular/router';
import {GetByTriageIdService} from "../../services/getById/get-by-triage-id.service";
import {EndOfTriageService} from "../../services/end-of-triage.service";
import {ApiConfigService} from "../../services/apiConfig/api-config.service";




@Component({
  selector: 'app-page5',
  templateUrl: './page5.component.html',
  styleUrls: ['./page5.component.scss']
})
export class Page5Component implements OnInit {
    pracID=""
    pracInfo:any[]


    mainVAlueArray=new Array()
    foodAllerguValue=new Array()
    FoodcodeArray=new Array()
    MainIDArray=new Array()
    mainDiseaseArray=new Array()
    Time=""

    AlleryDrug=new Array()
    drugListFinalArray=new Array()
    drugListArray=new Array()
    drugCodeArray=new Array()
    allergyDrugVAlue=new Array()
    aleryDrugFinaly=new Array()
  TransportArray=new Array()
    hospital:any[]

    transporterValue=""
    nurseFirstName=""
    nurstLastName=""
    AllergyDrugListSepas:any[]
  id1=""
  list:any[];
  level2Form: FormGroup;
  lastDay="";
  MainDisease=new Array();
  TransportList="";
  admissionKind=new Array();
  age="";
  ageType="";
  birthDate="";
  entrnaceType='';
  gender="";
  lastName="";
  name="";
  nationalCode='';
  pregmentType='';
  sensetiveFoodType='';
  SeparationByInfectionList:any[];
  departureList:any[];
  Separation="";
  departure="";
  HighRiskSituation="";
  Confused="";
  Distress="";
  PainScale="";
  spO2="";
  bPMax="";
  bPMin="";
  PR="";
  RR="";
  Temperature='';
  patientIsNotIdentity="";
  DrugHistrotyList:any[];
  searchText="";
  show:boolean=false;
drugName='';
drugCode="";
drugHistoryList=new Array();
hasDrugAllery="";
drugList=new Array();
FoodSensitivity=""
serchlist = new Array();
ShowDrugList=new Array();
FoodSensitivityObjList=new Array();
eOtherCasesMainDisease=new Array();
admissionKindTextList=new Array();
Spo2Input:number;
PRInput:number;
RRInput:number;
T:number;
BPmin:number;
BPmax:number;
painPrint:number
val:any;
    triageID="";
    idter="";
    idterTXT="";
    triazhInfo:any[];
    printOK=false;
    ISsubmit=false;
    succsess="";
    showResult=false;
    ISsubmitOK=false;
    isSubmitError=false;
    result="";
    dangerConditionValid=false
    bpPrint:number
    prPrint:number
    rrPrint:number
    tPrint:number
    spo2Print:number
    foodLIst:any[]
    refeValid=false

    length: 0;
    domEles;




    constructor( private _service: CreatNewTeriageService,
                private _lvl2:CreatLevel2Service,
            private _item:TeriajItemsService,
            private route: ActivatedRoute,
            private router: Router,
               private  _Save:GetByTriageIdService,
               private _End:EndOfTriageService,
                 private  i:ApiConfigService,

  ) {
        this._item.seturl(this.i.config.API_URL);
        this._lvl2.seturl(this.i.config.API_URL);
        this._Save.seturl(this.i.config.API_URL);
        this._End.seturl(this.i.config.API_URL);
   
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
  getDeparture(id:any,i:any){
     this.refeValid=true
    this.departure=id.toString();
      for (let myChild of this.departureList) {
          myChild.BackgroundColour = "white";
          i.BackgroundColour = "#44b5b7";
          myChild.color = "black";
          i.color='white'
      }

  }
  getHighRiskSituationValue(){
        this.dangerConditionValid=true
    this.HighRiskSituation="true";
  }
  getConfused(){
      this.dangerConditionValid=true
    this.Confused="true"
  }
  getDistress(){
      this.dangerConditionValid=true
    this.Distress="true"
  }
  onSearch(event:any){
    this.show=true;

  }
    onSearchChange(event: any) {

        const key = event.target.value;

        this.serchlist=[];
        this.DrugHistrotyList['items'].forEach(item => {
            if(key == ""){
                this.serchlist=[];
            }
            if (key != '' ) {
                const f =  item.value.toLowerCase().substring(0, key.length);

                if (key === f) {
                    this.serchlist.push({'value':item.value,'code':item.code})
                }
            }
        });

    }
    set(i:any){
      this.drugCode=i['code'];
      this.val=i['value'];
      this.ShowDrugList.push(this.val);
        let customObj = new drugHistroy();
        customObj.triageID= '';
        customObj.strDrugCode=this.drugCode;
        customObj.strRouteCode="";
        this.drugHistoryList.push(customObj);
      this.serchlist=[];
        this.searchText="";
    }
  // getDrug(id:any,name:any){
  //   this.drugName=name;
  //   this.drugCode=id;
  //   alert(this.drugCode);
  //   let customObj = new drugHistroy();
  //   customObj.triageID= localStorage.getItem('locationID');
  //   customObj.strDrugCode=this.drugCode;
  //   customObj.strRouteCode="";
  //   this.drugHistoryList.push(customObj)
  //
  //   this.show=false;
  //   this.searchText=this.drugName
  // }

  onSubmit(){
    this.PainScale=this.level2Form.value['PainScale'].toString();
    this.spO2=this.level2Form.value['spO2'];
    this.bPMax=this.level2Form.value['bPMax'];
    this.bPMin=this.level2Form.value['bPMin'];
    this.PR=this.level2Form.value['PR']
    this.RR=this.level2Form.value['RR']
    this.Temperature=this.level2Form.value['Temperature'];
    this._lvl2.createTriage(this.sensetiveFoodType,this.departure,this.Separation,this.gender,this.age,
      this.ageType,this.name,this.lastName,this.nationalCode,this.TransportList,this.birthDate,this.lastDay,this.admissionKind,this.MainDisease,
      this.patientIsNotIdentity,this.HighRiskSituation,this.Confused,this.Distress,this.PainScale,this.spO2,this.bPMax,this.bPMin,this.PR,this.RR,this.Temperature,this.drugHistoryList,
        this.hasDrugAllery,this.drugList,this.FoodSensitivityObjList,this.eOtherCasesMainDisease,this.admissionKindTextList
      ).subscribe(res=>{
      console.log(res)
        this.showResult=true
        if (res.success===true){
            this.succsess=res.success
            this.ISsubmitOK=true;
            this.triageID=res.trackingNumber;
            // this.result=res.errorMessage
        }if(res.success===false){
            this.isSubmitError=true
            this.result=res.errorMessage;
        }
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

        this._Save.ByID(this.triageID).subscribe(res=>{
            this.triazhInfo=res;
            this.pracID=this.triazhInfo['item']['triage_PracID']

            this.bpPrint= parseInt(this.triazhInfo['item']['bp'])
            this.bpPrint=Math.round(this.bpPrint)
            this.prPrint=parseInt(this.triazhInfo['item']['pr'])
            this.prPrint=Math.round(this.prPrint);
            this.rrPrint=parseInt(this.triazhInfo['item']['rr'])
            this.rrPrint=Math.round(this.rrPrint)
            this.tPrint=parseInt(this.triazhInfo['item']['t'])
            this.tPrint=Math.round(this.tPrint)
            this.spo2Print=parseInt(this.triazhInfo['item']['spo2'])
            this.spo2Print=Math.round(this.spo2Print)
            this.painPrint=parseInt(this.triazhInfo['item']['intensityOfPain']);
            this.painPrint=Math.round(this.painPrint)
            this.Time=this.triazhInfo['item']['entranceTime'];
            this.Time=this.Time.substr(this.Time.length - 5)
            for(let a of this.triazhInfo['item']['triageAllergyDrugs'] ){
                this.AlleryDrug.push(a.sepas_ERXCode);
            }
            for(let i of this.triazhInfo['item']['triageDrugHistory']){
                this.drugCode=i.strDrugCode;
                this.drugCode=this.drugCode.trim();
                this.drugCodeArray.push(this.drugCode)
            }
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
            this.allergyDrugVAlue.forEach(item=>{
                this.aleryDrugFinaly.push(item.substr(0,item.indexOf(' ')))
            })
            this.drugListArray.forEach(item=>{
                this.drugListFinalArray.push(item.substr(0,item.indexOf(' ')))
            })
            this._item.postPracID(this.pracID).subscribe(res=>{
                this.pracInfo=res;
                console.log("نام پرستار",res)
            })


        });
    })
    // this.router.navigate(['/teriazh/page2']);


  }
    send(){

        this._End.endTtiazh(this.triageID).subscribe(res=>{
        })
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
    }
    close(){
        this.showResult=false;
        this.printOK=true
    }

    ngOnInit() {

      // this.PRInput=0;
        this._item.getHospitalName().subscribe(res=>{
            this.hospital=res
        })
        this.nurseFirstName=localStorage.getItem('nurseFirstName')
        this.nurstLastName=localStorage.getItem('nurseLastName');
        this._item.GetSepasList().subscribe(res=>{
            this.AllergyDrugListSepas=res;
        })
        this._item.getFoodSensitivityList().subscribe(res=>{
            this.foodLIst=res
        })
        this._item.GetSepasList().subscribe(res=>{
            this.DrugHistrotyList=res;

        })
      
      this.list=this._service.gettodos();

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
     this._item.GetSeparationByInfectionList().subscribe(res=>{

      this.SeparationByInfectionList=res;
    })
    this._item.getDepartureList().subscribe(res=>{
      this.departureList=res;

    })
    this._item.getTransportList().subscribe(res=>{
      this.TransportArray=res
      this.TransportArray.forEach(i=>{
        if (i.Key==this.TransportList) {
          this.transporterValue=i.Value;
        }
    })
    })
     this.level2Form= new FormGroup({
        'Separation':new FormControl(''),
        'Departure':new FormControl(''),
        'HighRiskSituation':new FormControl(''),
        'Confused':new FormControl(''),
        'Distress':new FormControl(''),
        'PainScale':new FormControl(''),
        'spO2':new FormControl(''),
        'bPMax':new FormControl(''),
        'bPMin':new FormControl(''),
        'PR':new FormControl(''),
        'RR':new FormControl(''),
        'Temperature':new FormControl(''),
      })
      this.lastDay=this.list[0]["24Hourses"];
     this.MainDisease=this.list[0]["MainDisease"];
        for (let i of this.MainDisease){
            this.MainIDArray.push(i.mainDiseaseID)
        }
     this.TransportList=this.list[0]["TransportList"];
     this.admissionKind=this.list[0]["admissionKind"];
     this.age=this.list[0]["age"];
     this.ageType=this.list[0]["ageType"];
     this.birthDate=this.list[0]["birthDate"];
     this.entrnaceType=this.list[0]["entrnaceType"];
     this.gender=this.list[0]["gender"];
     this.lastName=this.list[0]["lastName"];
     this.name=this.list[0]["name"];
     this.nationalCode=this.list[0]["nationalCode"];
     this.pregmentType=this.list[0]["pregmentType"] ;
     this.FoodSensitivity=this.list[0]["FoodSensitivity"];
     this.sensetiveFoodType=this.list[0]["sensetiveFoodType"];
     this.FoodSensitivityObjList=this.list[0]["FoodSensitivity"];
        for (let i of this.FoodSensitivityObjList){

            this.FoodcodeArray.push(i.foodSensitivityValue)
        }
     this.hasDrugAllery=this.list[0]["Allergy"];
     this.drugList=this.list[0]["DrugSensitive"];
     this.eOtherCasesMainDisease=this.list[0]['othermainDeseasePush'];
        this.admissionKindTextList=this.list[0]['admissionKindTextList']


     this.patientIsNotIdentity=this.list[0]["patientIsNotIdentity"]
        if(this.patientIsNotIdentity==="1"){
            this.birthDate=""
        }
    }
    

   }

 
  

 


