import { Component, OnInit } from '@angular/core';
import{GetByTriageIdService} from "../../services/getById/get-by-triage-id.service";
import { TeriajItemsService} from "../../services/teriajItems/teriaj-items.service"
import {EndOfTriageService} from "../../services/end-of-triage.service";
import {FormControl, FormGroup} from "@angular/forms";
import {Creatlvl4TriageService} from "../../services/CreatTeriage/creatlevel5/creatlevel4/creatlvl4-triage.service";
import {CreatNewTeriageService} from "../../services/CreatTeriage/creat-new-teriage.service";
import {Router} from "@angular/router";
import {ApiConfigService} from "../../services/apiConfig/api-config.service";

@Component({
  selector: 'app-page7',
  templateUrl: './page7.component.html',
  styleUrls: ['./page7.component.scss']
})
export class Page7Component implements OnInit {
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
    level5Form: FormGroup;
    triazhInfo:any[];
    idterTXT="";
    triageID="";
    idter="";
    printOK=false;
    ISsubmit=false;
    succsess="";
    showResult=false;
    ISsubmitOK=false;
    isSubmitError=false;
    result="";
    refeValid=false;




  constructor(private _service:CreatNewTeriageService,
              private  _item:TeriajItemsService,
              private  _Save:GetByTriageIdService,
              private _End:EndOfTriageService,
              private _lvl4:Creatlvl4TriageService,
              private router: Router,
              private  i:ApiConfigService,

  ) {
      this._item.seturl(this.i.config.API_URL);
      this._lvl4.seturl(this.i.config.API_URL);
      this._Save.seturl(this.i.config.API_URL);
      this._End.seturl(this.i.config.API_URL);
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
    close(){
        this.ISsubmitOK=false;
        this.printOK=true
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
      this.refeValid=true;
        this.departure=id.toString();
        for (let myChild of this.departureList) {
            myChild.BackgroundColour = "white";
            i.BackgroundColour = "#44b5b7";
            myChild.color = "black";
            i.color='white'
        }

    }
    onSubmit(){
        this.level5Form.value.Departure=this.departure;
        this.level5Form.value.Separation=this.Separation;
        console.log(this.level5Form.value.Separation);
        this._lvl4.creatTriageLvl4(
            this.sensetiveFoodType,this.departure,this.Separation,this.gender,this.age,
            this.ageType,this.name,this.lastName,this.nationalCode,this.TransportList,this.birthDate,this.lastDay,this.admissionKind,this.MainDisease,
            this.patientIsNotIdentity,this.hasDrugAllery,this.drugList,this.FoodSensitivityObjList,this.eOtherCasesMainDisease,this.admissionKindTextList
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
      this._item.getHospitalName().subscribe(res=>{
          this.hospital=res
      })
      this._item.getMainDiseaseList().subscribe(res=>{
          this.mainDiseaseArray=res
          for (let i of this.mainDiseaseArray){
              for (let q of this.MainIDArray ){
                  if (q==i.id){
                      this.mainVAlueArray.push(i.mainDiseaseValue)
                      console.log('sdpfohspoi',this.mainVAlueArray)
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
      this.level5Form= new FormGroup({
          'Departure':new FormControl(''),
          'Separation':new FormControl(''),
      })
      this.list=this._service.gettodos();
      console.log(this.list);
      this.lastDay=this.list[0]["24Hourses"];
      this.MainDisease=this.list[0]["MainDisease"];
      for (let i of this.MainDisease){
          this.MainIDArray.push(i.mainDiseaseID)
      }
      console.log(this.MainDisease);
      this.TransportList=this.list[0]["TransportList"];
      this.admissionKind=this.list[0]["admissionKind"];
      this.drugList=this.list[0]["DrugSensitive"]
      console.log(this.drugList)
      console.log(this.admissionKind);

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
      console.log(this.admissionKind)
      this.pregmentType=this.list[0]["pregmentType"]
      this.sensetiveFoodType=this.list[0]["sensetiveFoodType"];
      console.log(this.sensetiveFoodType)
      this.hasDrugAllery=this.list[0]["Allergy"];
      // this.admissionKindText=this.list[0]["admissionKindText"];
      // this.MainDiseaseText=this.list[0]["MainDiseaseText"];
      this.patientIsNotIdentity=this.list[0]["patientIsNotIdentity"];
      this.eOtherCasesMainDisease=this.list[0]['othermainDeseasePush']
      this.admissionKindTextList=this.list[0]['admissionKindTextList']
      console.log(this.list);
      console.log(typeof (this.age))
    this._item.GetSeparationByInfectionList().subscribe(res=>{

      this.SeparationByInfectionList=res;

    })
      this._item.getDepartureList().subscribe(res=>{
        this.departureList=res;
      })
      if(this.patientIsNotIdentity==="1"){
          this.birthDate=""
      }
  }

}
