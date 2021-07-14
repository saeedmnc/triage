import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import { TeriajItemsService} from '../../services/teriajItems/teriaj-items.service';
import{ CreatNewTeriageService} from'../../services/CreatTeriage/creat-new-teriage.service';
import{ Creatlvl3Service} from'../../services/CreatTeriage/creatlvl3.service';
import {ActivatedRoute, Router} from '@angular/router';
import {GetByTriageIdService} from "../../services/getById/get-by-triage-id.service";
import {EndOfTriageService} from "../../services/end-of-triage.service";
import {ApiConfigService} from "../../services/apiConfig/api-config.service";





@Component({
  selector: 'app-page8',
  templateUrl: './page8.component.html',
  styleUrls: ['./page8.component.scss']
})
export class Page8Component implements OnInit {
    Time=""
    pracID=""
    pracInfo:any[]
    mainDiseaseArray:any[]
    AlleryDrug=new Array()
    foodAllerguValue=new Array()
    FoodcodeArray=new Array()
    mainVAlueArray=new Array()
    MainIDArray=new Array()
    drugListArray=new Array()
    allergyDrugVAlue=new Array()
    aleryDrugFinaly=new Array()
    hospital:any[]
  TransporterArray=new Array()
  transporterValue=""
    nurseFirstName=""
    nurstLastName=""
    AllergyDrugListSepas:any[]
    foodLIst:any[]
  level3Form: FormGroup;
  departureList:any[];
  SeparationByInfectionList:any[];
  list:any[];
  lastDay="";
  MainDisease=new Array();
  TransportList="";
  admissionKind=new Array();
  age="";
  ageType="";
  birthDate="";
  entrnaceType="";
  gender="";
  lastName="";
  name="";
  nationalCode="";
  pregmentType="";
  sensetiveFoodType="";
  patientIsNotIdentity="";
  spO2="";
  bPMax='';
  bPMin="";
  PR="";
  RR="";
  Temperature="";
  departure="";
  Separation="";
  hasDrugAllery="";
  drugList=new Array();
  FoodSensitivity="";
  eOtherCasesMainDisease=new Array();
  admissionKindTextList=new Array();
  FoodSensitivityObjList=new Array();
    RRInput:number;
    PRInput:number;
    T:number;
    painPrint:number
    Spo2Input:number;
    BPmin:number;
    BPmax:number;
    triageID="";
    idter="";
    idterTXT="";
    triazhInfo:any[];
    printOK=false;
    ISsubmit=false;
    succsess=""
    showResult=false;
    isSubmitError=false;
    ISsubmitOK=false;
    result=""
    bpPrint:number
    prPrint:number
    rrPrint:number
    tPrint:number
    spo2Print:number;
    refeValid=false


    constructor(  private _item:TeriajItemsService,
   private _service:CreatNewTeriageService,
   private _lvl3:Creatlvl3Service,
   private route: ActivatedRoute,
   private router: Router,
   private _Save:GetByTriageIdService,
   private _End:EndOfTriageService,
   private  i:ApiConfigService,
    ) {
        this._item.seturl(this.i.config.API_URL);
        this._lvl3.seturl(this.i.config.API_URL);
        this._Save.seturl(this.i.config.API_URL);
        this._End.seturl(this.i.config.API_URL);
    }
    onSubmit(){
      this.spO2=this.level3Form.value.Spo2;
    this.bPMax=this.level3Form.value.BPmax;
    this.bPMin=this.level3Form.value.bPMin;
    this.PR=this.level3Form.value.PR
    this.RR=this.level3Form.value.RR
    this.Temperature=this.level3Form.value.Temperature;
    this._lvl3.creattriage(
      this.sensetiveFoodType,this.departure,this.Separation,this.gender,this.age,
      this.ageType,this.name,this.lastName,this.nationalCode,this.TransportList,this.birthDate,this.lastDay,this.admissionKind,this.MainDisease,
      this.patientIsNotIdentity,this.spO2,this.bPMax,this.bPMin,this.PR,this.RR,this.Temperature,this.hasDrugAllery,this.drugList,this.FoodSensitivityObjList,
        this.eOtherCasesMainDisease,this.admissionKindTextList,
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
        this._Save.ByID(this.triageID).subscribe(res=>{
            this.triazhInfo=res;
            this.pracID=this.triazhInfo['item']['triage_PracID']

            this.Time=this.triazhInfo['item']['entranceTime'];
            this.Time=this.Time.substr(this.Time.length - 5)
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
    // this.router.navigate(['/teriazh/page2']);

    }
    send(){
        // this._Save.ByID(this.idterTXT).subscribe(res=>{
        //     this.triazhInfo=res;
        //     console.log(res)
        //
        //
        // });
        this._End.endTtiazh(this.triageID).subscribe(res=>{
            console.log(res);
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

    getDeparture(id:any,i)
    {
      this.departure=id.toString();
      this.refeValid=true;
        for (let myChild of this.SeparationByInfectionList) {
            myChild.BackgroundColour = "white";
            i.BackgroundColour = "#44b5b7";
            myChild.color = "black";
            i.color='white'
        }

    }
    getSeparationByInfectionList(id:any,i){
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

  ngOnInit() {
      this._item.getHospitalName().subscribe(res=>{
          this.hospital=res
      })
      this.nurseFirstName=localStorage.getItem('nurseFirstName')
      this.nurstLastName=localStorage.getItem('nurseLastName');
      this._item.GetSepasList().subscribe(res=>{
          this.AllergyDrugListSepas=res;
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

    this.list=this._service.gettodos();

    this._item.getDepartureList().subscribe(res=>{
      this.departureList=res;
    })
    this._item.GetSeparationByInfectionList().subscribe(res=>{
      this.SeparationByInfectionList=res
    });
    this._item.getTransportList().subscribe(res=>{
      this.TransporterArray=res
      this.TransporterArray.forEach(i=>{
        if (i.Key==this.TransportList) {
          this.transporterValue=i.Value;
        }
    })
    })
    this.level3Form= new FormGroup({
      'Separation':new FormControl(''),
      'Departure':new FormControl(''),
      'Spo2':new FormControl(''),
      'BPmax':new FormControl(''),
      'bpMin':new FormControl(''),
      'PR':new FormControl(''),
      'RR':new FormControl(''),
      'Temperature':new FormControl(''),
     
    })
    this.lastDay=this.list[0]["24Hourses"];
    this.MainDisease=this.list[0]["MainDisease"];
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
    this.pregmentType=this.list[0]["pregmentType"] 
    this.sensetiveFoodType=this.list[0]["sensetiveFoodType"];
    this.hasDrugAllery=this.list[0]["Allergy"];
    this.FoodSensitivityObjList=this.list[0]["FoodSensitivity"];

      for (let i of this.FoodSensitivityObjList){

          this.FoodcodeArray.push(i.foodSensitivityValue)
      }
    this.eOtherCasesMainDisease=this.list[0]['othermainDeseasePush'];
    this.admissionKindTextList=this.list[0]['admissionKindTextList']
      this.drugList=this.list[0]["DrugSensitive"]
      this.patientIsNotIdentity=this.list[0]["patientIsNotIdentity"]
      if(this.patientIsNotIdentity==="1"){
          this.birthDate=""
      }


  }

}
