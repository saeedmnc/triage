import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import $ from "jquery";
import { TeriajItemsService} from '../../services/teriajItems/teriaj-items.service';
import{ CreatNewTeriageService} from'../../services/CreatTeriage/creat-new-teriage.service';
import{ MainDiseaseService} from'../../services/mainDisease/main-disease.service';
import { AVPUService} from'../../services/AVPU/avpu.service';
import {ActivatedRoute, Router} from '@angular/router';
import  { GetByTriageIdService} from '../../services/getById/get-by-triage-id.service';
import {EndOfTriageService} from '../../services/end-of-triage.service'
import {Location} from '@angular/common';
import {ApiConfigService} from "../../services/apiConfig/api-config.service";


@Component({
  selector: 'app-page4',
  templateUrl: './page4.component.html',
  styleUrls: ['./page4.component.scss']
})
export class Page4Component implements OnInit {
    pracID=""
    Time=""
    triageIDEdit=""
    pracInfo:any[]
    FoodcodeArray=new Array()
    foodAllerguValue=new Array()
    AlleryDrug=new Array()
    mainVAlueArray=new Array()
    MainIDArray=new Array()
    drugListArray=new Array()
    allergyDrugVAlue=new Array()
    aleryDrugFinaly=new Array()
    hospital:any[]

    transporterValue=""
    mainDeaseValue=""
    nurseFirstName=""
    nurstLastName=""
    ISsubmitOK=false
    printTransport=""
    mainDiseaseArray=new Array()
  Alert = "";
  verbal="";
  painful="";
  Unresponsive="";
  defaultValue="";
  airWay="";
  Distress="";
  Cyanosis="";
  Mental="";
  Spo="";
  list:any[];
  SeparationByInfectionList:any[];
  departureList:any[];
  Separation="";
  departure="";
  level1Form: FormGroup;
  sss="1";
  name="";
  lastName="";
  birthDate="";
  nationalCode="";
  gender="";
  age="";
  ageType="";
  TransportList="";
  entrnaceType="";
  lastDay="";
  admissionKind=new Array();
  admissionKindText="";
  MainDisease=new Array();
    eOtherCasesMainDisease=new Array();
  drugList=new Array();
    admissionKindTextList=new Array()
  MainDiseaseText="";
  sensetiveFoodType="";
  AVPUlist:any[];
  AVPU="";
  teriazhLevel="1"
  t="";
  rr="";
  pr='';
  bs='';
  bp='';
  pregnant="";
  telNo="";
  referDAte="1400-01-01";
  entranceTime="";
  bP2="";
  pracId="1125";
  locid="";
  pregmentType="";
  patientIsNotIdentity="";
  hasDrugAllery="";
    FoodSensitivity="";
    triageID="";
    idter:any;
    idterTXT="";
    hide:boolean=false;
    triazhInfo:any[];
    toggle = false;
    toggle1=false;
    toggle2=false;
    toggle3=false;
    toggle4=false;
    FoodSensitivityObjList=new Array();
    printOK=false;
    succsess:boolean;
    result="";
    showResult=false;
    isSubmitError=false;
    AvpuValid=false;
    LifeValid=false;
    bpprint:number
    prprint:number
    rrprint:number
    tprint:number
    spo2print:number
    painPrint:number
    AllergyDrugListSepas:any[]
    foodLIst:any[]
    nurseReport=""
    transportArray=new Array()
    refeValid=false
    triazhInfoEdit:any[]
    constructor( private _item:TeriajItemsService,
    private _service:CreatNewTeriageService,
    private _example:MainDiseaseService,
    private _AVPU:AVPUService,
    private route: ActivatedRoute,
    private  _Save:GetByTriageIdService,
    private _End:EndOfTriageService,
    private router: Router,
     private  i:ApiConfigService,
   private _location: Location) {
        this._item.seturl(this.i.config.API_URL);
        this._service.seturl(this.i.config.API_URL);
        this._AVPU.seturl(this.i.config.API_URL);
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
  getAirway(){
       this.LifeValid=true
    this.airWay="1"
      this.toggle4 = !this.toggle4;
  }
  getDistress(){
      this.LifeValid=true
      this.Distress="1"
      this.toggle3 = !this.toggle3;
  }
  getCyanosis(){
      this.LifeValid=true
      this.Cyanosis="1"
      this.toggle2 = !this.toggle2;
    // this.toggle=false;
    // this.toggle1=false;
    // this.toggle3=false;
    // this.toggle4=false
  }
  getMental()
  {
      this.LifeValid=true

      this.Mental="1"
      this.toggle1 = !this.toggle1;
  }
  send(){
    this._Save.ByID(this.triageID).subscribe(res=>{
    this.triazhInfo=res;

    });
    this._End.endTtiazh(this.triageID).subscribe(res=>{
    });
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
    print(){
    }
  getSpo(){
    this.Spo="1";
      this.toggle = !this.toggle;
  }
  getAPUV(id:any,i:any){
        this.AvpuValid=true;
    this.AVPU=id.toString();
      for (let myChild of this.AVPUlist) {
          myChild.BackgroundColour = "white";
          i.BackgroundColour = "#44b5b7";
          myChild.color = "black";
          i.color='white'
      }
  }
  onSubmit(){

      this.list[0]["AVPU"]=this.AVPU;
      this.list[0]["Separation"]=this.Separation;
      this.list[0]["Separation"]=this.Separation;
      this.list[0]["Departure"]=this.departure.toString();

    if(this.airWay.length>0){
      this.list[0]["airWay"]= this.airWay;
      this.list[0]["Distress"]="0";
      this.list[0]["Cyanosis"]="0";
      this.list[0]["Mental"]="0";
      this.list[0]["spo2"]="0";     
    }
    if(this.Distress.length>0){
      this.list[0]["Distress"]= this.Distress;
      this.list[0]["airWay"]="0";
      this.list[0]["Cyanosis"]="0";
      this.list[0]["Mental"]="0";
      this.list[0]["spo2"]="0";     
    }
    if(this.Cyanosis.length>0){
      this.list[0]["Cyanosis"]= this.Cyanosis;
      this.list[0]["airWay"]="0";
      this.list[0]["Distress"]="0";
      this.list[0]["Mental"]="0";
      this.list[0]["spo2"]="0";  
    }
    if(this.Mental.length>0){
      this.list[0]["Mental"]= this.Mental;
      this.list[0]["airWay"]="0";
      this.list[0]["Distress"]="0";
      this.list[0]["Cyanosis"]="0";
      this.list[0]["spo2"]="0";  
    }
    if(this.Spo.length>0){
      this.list[0]["spo2"]= this.Spo;
      this.list[0]["airWay"]="0";
      this.list[0]["Distress"]="0";
      this.list[0]["Cyanosis"]="0";
      this.list[0]["Mental"]="0";
    }
      console.log("nameSUbmit",this.name);
      // this.nurseReport=  "بیمار با  نام و نام خانوادگی " +this.name+" "+this.lastName+" "+"با کد ملی"+" " +this.nationalCode + "  به وسیله " + this.printTransport+"در سطح تریاژ یک به اورژانس منتقل شد"
    this._service.createTriage(this.sensetiveFoodType,this.AVPU,this.airWay,this.Distress,
      this.Cyanosis,this.Spo,this.departure,this.Separation,
      this.gender,this.age,this.ageType,this.name,this.lastName,this.nationalCode,
      this.TransportList,this.birthDate,this.lastDay,this.admissionKind,this.MainDisease,this.patientIsNotIdentity,
        this.hasDrugAllery,this.drugList,this.FoodSensitivityObjList,this.eOtherCasesMainDisease,this.admissionKindTextList
      ).subscribe(res=>{
          console.log(res);
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
        this._Save.ByID(this.triageID).subscribe(res=>{
            this.triazhInfo=res;
            console.log(this.triazhInfo)
            this.pracID=this.triazhInfo['item']['triage_PracID']
            this.Time=this.triazhInfo['item']['entranceTime'];
            this.Time=this.Time.substr(this.Time.length - 5)
            this.bpprint= parseInt(this.triazhInfo['item']['bp'])
            this.bpprint=Math.round(this.bpprint)
            this.prprint=parseInt(this.triazhInfo['item']['pr'])
            this.prprint=Math.round(this.prprint);
            this.rrprint=parseInt(this.triazhInfo['item']['rr'])
            this.rrprint=Math.round(this.rrprint)
            this.tprint=parseInt(this.triazhInfo['item']['t'])
            this.tprint=Math.round(this.tprint)
            this.spo2print=parseInt(this.triazhInfo['item']['spo2'])
            this.spo2print=Math.round(this.spo2print)
            this.painPrint=parseInt(this.triazhInfo['item']['intensityOfPain']);
            this.painPrint=Math.round(this.painPrint);
            for(let a of this.triazhInfo['item']['triageAllergyDrugs'] ){
                this.AlleryDrug.push(a.sepas_ERXCode);
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
            })
            this._item.postPracID(this.pracID).subscribe(res=>{
                this.pracInfo=res;
                console.log("نام پرستار",res)
            })
        });
    })

      localStorage.setItem('triageID',this.idterTXT);
   localStorage.setItem('item',JSON.stringify(this.list));
  // this.router.navigate(['/teriazh/Patient-Triage']);

}
    close(){
        this.showResult=false;
        this.printOK=true
    }
  ngOnInit() {




      this.nurseFirstName=localStorage.getItem('nurseFirstName')
      this.nurstLastName=localStorage.getItem('nurseLastName');
      this._item.getHospitalName().subscribe(res=>{
          this.hospital=res

      })
    this._AVPU.getAVPU().subscribe(res=>{
this.AVPUlist=res;
// if (localStorage.getItem('teriazhid')) {
//     this._Save.ByID(localStorage.getItem('teriazhid')).subscribe(res=>{
//         this.triazhInfoEdit=res['item']
//         this.AvpuValid=true;
//        for(let i of this.AVPUlist){
//            if (this.triazhInfoEdit['stateOfAlertIS']===i.Key.toString()) {
//                this.AVPU=i.Key.toString();
//                for (let myChild of this.AVPUlist) {
//                    myChild.BackgroundColour = "white";
//                    i.BackgroundColour = "#44b5b7";
//                    myChild.color = "black";
//                    i.color='white'
//                }
//            }
//        }
//
//
//
//     })
// }
     


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
      this._item.GetSepasList().subscribe(res=>{
          this.AllergyDrugListSepas=res;
      })
      this._item.getTransportList().subscribe(res=>{
          this.transportArray=res;
         this.transportArray.forEach(i=>{
          if (i.Key==this.TransportList) {
            this.transporterValue=i.Value;
          }
      })
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


    this.level1Form= new FormGroup({
      'AVPU': new FormControl(''),
      'airWay': new FormControl(''),
      'Distress': new FormControl(''),
      'Cyanosis': new FormControl(''),
      'Mental': new FormControl(''),
      'Spo': new FormControl(''),
      'Departure':new FormControl(''),
      'Separation':new FormControl(''),
    })
    this._item.GetSeparationByInfectionList().subscribe(res=>{
      this.SeparationByInfectionList=res
        this._Save.ByID(localStorage.getItem('teriazhid')).subscribe(res=>{
            this.triazhInfoEdit=res['item'];
            for (let i of this.SeparationByInfectionList){
                if (this.triazhInfoEdit['separationByInfection']===i.Key.toString())
                    this.Separation=i.Key.toString();
                for (let myChild of this.SeparationByInfectionList) {
                    myChild.BackgroundColour = "white";
                    i.BackgroundColour = "#44b5b7";
                    myChild.color = "black";
                    i.color='white'
                }

            }
        })
    })
    this._item.getDepartureList().subscribe(res=>{
      this.departureList=res;
        this._Save.ByID(localStorage.getItem('teriazhid')).subscribe(res=>{
            this.triazhInfoEdit=res['item'];
            for (let i of this.departureList){
                if (this.triazhInfoEdit['departure']===i.Key.toString())
                    this.Separation=i.Key.toString();
                for (let myChild of this.departureList) {
                    myChild.BackgroundColour = "white";
                    i.BackgroundColour = "#44b5b7";
                    myChild.color = "black";
                    i.color='white'
                }

            }
        })

    })
      // this._service.removeTodoes()
      console.log(this._service.gettodos())


     this.list=this._service.gettodos();
      // console.log("getList",this.list)
     this.lastDay=this.list[0]["24Hourses"];
 
     this.MainDisease=this.list[0]["MainDisease"];
     for (let i of this.MainDisease){
         this.MainIDArray.push(i.mainDiseaseID)
     }
  
     this.TransportList=this.list[0]["TransportList"];
     this.admissionKind=this.list[0]["admissionKind"];
     this.drugList=this.list[0]["DrugSensitive"]
      console.log("دارررررررررررررر",this.drugList)
     this.age=this.list[0]["age"];
     this.ageType=this.list[0]["ageType"];
     this.birthDate=this.list[0]["birthDate"];
     this.entrnaceType=this.list[0]["entrnaceType"];
     this.gender=this.list[0]["gender"];
     this.lastName=this.list[0]["lastName"];
     this.name=this.list[0]["name"];
      console.log("name",this.name);
      this.FoodSensitivityObjList=this.list[0]["FoodSensitivity"];
     for (let i of this.FoodSensitivityObjList){

         this.FoodcodeArray.push(i.foodSensitivityValue)
     }
     this.nationalCode=this.list[0]["nationalCode"];
     this.pregmentType=this.list[0]["pregmentType"] 
     this.sensetiveFoodType=this.list[0]["sensetiveFoodType"];
     this.hasDrugAllery=this.list[0]["Allergy"];
     this.admissionKindText=this.list[0]["admissionKindText"];
     this.MainDiseaseText=this.list[0]["MainDiseaseText"];
     this.patientIsNotIdentity=this.list[0]["patientIsNotIdentity"];
     console.log("l[i,g4",this.patientIsNotIdentity)
     this.eOtherCasesMainDisease=this.list[0]['othermainDeseasePush'];

      this.admissionKindTextList=this.list[0]['admissionKindTextList']
      if(this.patientIsNotIdentity==="1"){
          this.birthDate=""
      }

    // $('#initialdataloadForm').submit(function(e:any) {
    //   e.preventDefault()})
    //   this.level1Form.controls.proof.setValue(this.defaultValue);
      this.triageIDEdit=localStorage.getItem("teriazhid")

      this.locid=localStorage.getItem("locationID")
      // if (localStorage.getItem("teriazhid")) {
      //     this._Save.ByID(this.triageIDEdit).subscribe(res=>{
      //         this.triazhInfoEdit=res['item']
      //         console.log(this.triazhInfoEdit);
      //         if (this.triazhInfoEdit['sianosis']==="True"){
      //             this.LifeValid=true
      //             this.Cyanosis="1"
      //             this.toggle2 = !this.toggle2;
      //
      //         }
      //         if (this.triazhInfoEdit['spo2LowerThan90']==="True"){
      //             this.LifeValid=true
      //             this.Spo="1";
      //             this.toggle = !this.toggle;
      //
      //         }
      //         if (this.triazhInfoEdit['spo2LowerThan90']==="True"){
      //             this.LifeValid=true
      //             this.Spo="1";
      //             this.toggle = !this.toggle;
      //
      //         }
      //         if (this.triazhInfoEdit['dangerousRespire']==="True"){
      //             this.LifeValid=true
      //             this.airWay="1"
      //             this.toggle4 = !this.toggle4;
      //
      //         }
      //         if (this.triazhInfoEdit['respireDistress']==="True"){
      //             this.LifeValid=true
      //             this.Distress="1"
      //             this.toggle3 = !this.toggle3;
      //
      //         }
      //         if (this.triazhInfoEdit['respireDistress']==="True"){
      //             this.LifeValid=true
      //             this.Mental="1"
      //             this.toggle1 = !this.toggle1;
      //
      //
      //         }
      //
      //     })
      //
      //
      //
      //
      //
      //
      // }

  };
  }
