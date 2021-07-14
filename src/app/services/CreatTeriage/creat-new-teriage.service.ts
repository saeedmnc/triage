import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CreatNewTeriageService {
public creatNewTriageUrl="/api/Triage/Create_New_Triage";
    baseurl: any;
    seturl(url: any) {
        this.baseurl = url;
    }
 comments: any[];

  constructor( private http:HttpClient) { 
    this.comments = new Array;  

  }
  private observableComments: BehaviorSubject<any[]>;  
  private readonly _todos = new BehaviorSubject<any[]>([]);
  readonly todos$ = this._todos.asObservable();
  private empty:any[]
  gettodos(): any[] {

    return this._todos.getValue();
  }
  
   settodos(val: any[]) {
    this._todos.next( this._todos.getValue().concat([val]));
  }
  removeTodoes(){
      this._todos.next(this.empty)

  }

  createTriage(
    sensetiveFoodType:string,
    AVPU:string,
    airWay:string,
    Distress:string,
    Cyanosis:string,
    Spo:string,
    departure:string,
    Separation:string,
    gender:string,
    age:string,
    ageType:string,
    name:string,
    lastName:string,
    nationalCode:string,
    TransportList:string,
    birthDate:string,
    lastDay:string,
    admissionKind:any,
    MainDisease:any,
    patientIsNotIdentity:string,
    hasDrugAllery:string,
    drugList:any,
    FoodSensitivity:any,
    eOtherCasesMainDisease:any,
    admissionKindTextList:any,

  ): Observable <any> {
   const data = {
     "referTypeIS": '',
     "encounter24HoursAgo": '',
     "allergy": hasDrugAllery,
     "stateOfAlertIS": AVPU,
   "dangerousRespire": airWay,
     "respireDistress": Distress,
     "sianosis": Cyanosis,
     "shock": '',
     "highDanger": '',
    "lethargy": '',
    "highDistress": '',
     "medicalHistory": '',
   "drugHistory": '',
  "spo2": '',
   "t": '',
     "rr": '',
     "pr": '',
    "bp": '',
    "bs": '',
    "serviceCountIS": '',
     "triageLevelIS": '1',
    "referDate": '',
     "entranceTime": '',
    "bP2": '',
     "pregnant": '',
  "triageTimeByNurse": '',
     "nurseComment": '',
  "gender": gender,
    "patientIsNotIdentity": patientIsNotIdentity,
    "age": age,
    "ageType": ageType,
     "firstName": name,
    "lastName": lastName,
     "nationalCode": nationalCode,
     "telNo": '',
     "arrival_AdmissionKind": '',
     "arrival_Transport": TransportList,
    "departure": departure,
    "resourceNeeds_Labs": '',
    "resourceNeeds_ECG_XRay_CT_MRI_UltraSound_Angiography": '',
     "resourceNeeds_IVFluids": '',
    "resourceNeeds_IVIM_Nebulized_Medications": '',
     "resourceNeeds_Specialty_Consultation": '',
    "resourceNeeds_SimpleProcedure": '',
     "resourceNeeds_ComplexProcedure": '',
    "decisionPoint": '',
    "locationID":localStorage.getItem("locationID"),
     "spo2LowerThan90": Spo,
    "birthDate": birthDate,
    "intensityOfPain": '',
     "hasFoodSensitivity": sensetiveFoodType,
     "referCause": '',
     "foodSensitivity": '',
     "separationByInfection": Separation,
    "encounter24HoursAgoItems": lastDay,
     "isOutCenter": '',
     "triage_AdmissionKind":admissionKind,
     "triage_MainDisease": MainDisease,
    "triage_MedicalHistory": [
      {
        "triageID": "",
        "medicalHistoryID": ""
      }
    ],
    "triageDrugHistory": [
      {
        "triageID": "",
        "strDrugCode": "",
        "strRouteCode": ""
      }
    ],
    "triageAllergyDrugs":drugList,
       "triageOtherCasesAdmissionKind": admissionKindTextList,
       "triageOtherCasesMainDisease":eOtherCasesMainDisease,
       "triageFoodSensitivity":FoodSensitivity



   }
    const body = JSON.stringify(data );
   console.log(body)
    const headerDict = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer  ' + localStorage.getItem('token')
    }
    console.log(body);
    return this.http.post<any>(this.baseurl+this.creatNewTriageUrl, body, {
        headers: headerDict
    })
}
  }

 
