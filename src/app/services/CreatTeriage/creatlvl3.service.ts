import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class Creatlvl3Service {

  constructor(private http:HttpClient) { }
  public CreateLvl3Triage="/api/Triage/Create_New_Triage";
    baseurl: any;
    seturl(url: any) {
        this.baseurl = url;
    }
  creattriage(
    sensetiveFoodType:string,
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
    spO2:string,
    bPMax:string,
    bPMin:string,
    PR:string,
    RR:string,
    Temperature:string,
    hasDrugAllery:string,
    drugList:any,
    FoodSensitivity:any,
    eOtherCasesMainDisease:any,
    admissionKindTextList:any,
  ): Observable <any>{
    const data = {
      "referTypeIS": '',
      "encounter24HoursAgo": lastDay,
      "allergy": hasDrugAllery,
      "stateOfAlertIS":'' ,
    "dangerousRespire":'' ,
      "respireDistress":'' ,
      "sianosis": '',
      "shock": '',
      "highDanger": '',
     "lethargy":'' ,
     "highDistress": '',
      "medicalHistory": '',
    "drugHistory": '',
   "spo2": spO2,
    "t": Temperature,
      "rr": RR,
      "pr": PR,
     "bp": bPMax,
     "bs": '',
     "serviceCountIS": '',
      "triageLevelIS": "3",
     "referDate": '',
      "entranceTime": '',
     "bP2": bPMin,
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
      "spo2LowerThan90": '',
     "birthDate": birthDate,
     "intensityOfPain": '',
      "hasFoodSensitivity": sensetiveFoodType,
      "referCause": '',
      "foodSensitivity": "" ,
      "separationByInfection": Separation,
     "encounter24HoursAgoItems": '',
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
     "triageAllergyDrugs": drugList,
        "triageOtherCasesAdmissionKind":admissionKindTextList,

        "triageOtherCasesMainDisease": eOtherCasesMainDisease,
        "triageFoodSensitivity":FoodSensitivity
 
     }
      const body = JSON.stringify(data );
      console.log(body)
      const headerDict = {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer  ' + localStorage.getItem('token')
      }
      console.log(body);
      return this.http.post<any>(this.baseurl+this.CreateLvl3Triage, body, {
          headers: headerDict
      })


  }
 
}
