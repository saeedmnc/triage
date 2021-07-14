import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class Creatlevel5Service {
  public creatlvlUrl="/api/Triage/Create_New_Triage"
    baseurl: any;
    seturl(url: any) {
        this.baseurl = url;
    }
  constructor(private http:HttpClient) { }
  creatTriageLvl4And5(
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
      hasDrugAllery:string,
      drugList:any,
      FoodSensitivityObjList:any,
      eOtherCasesMainDisease:any,
      admissionKindTextList:any
  ){
    const data={
        "referTypeIS": "",
        "encounter24HoursAgo": lastDay,
        "allergy": hasDrugAllery,
        "stateOfAlertIS": "",
        "dangerousRespire": "",
        "respireDistress": "",
        "sianosis": "",
        "shock": "",
        "highDanger": "",
        "lethargy": "",
        "highDistress": "",
        "medicalHistory": "",
        "drugHistory": "",
        "spo2": "",
        "t": "",
        "rr": "",
        "pr": "",
        "bp": "",
        "bs": "",
        "serviceCountIS": "",
        "triageLevelIS": "5",
        "referDate": "",
        "entranceTime": "",
        "bP2": "",
        "pregnant": "",
        "triageTimeByNurse": "",
        "nurseComment": "",
        "gender": gender,
        "patientIsNotIdentity": patientIsNotIdentity,
        "age": age,
        "ageType": ageType,
        "firstName": name,
        "lastName": lastName,
        "nationalCode": nationalCode,
        "telNo": "",
        "arrival_AdmissionKind": "",
        "arrival_Transport": TransportList,
        "departure":departure,
        "resourceNeeds_Labs": "",
        "resourceNeeds_ECG_XRay_CT_MRI_UltraSound_Angiography": "",
        "resourceNeeds_IVFluids": "",
        "resourceNeeds_IVIM_Nebulized_Medications": "",
        "resourceNeeds_Specialty_Consultation": "",
        "resourceNeeds_SimpleProcedure": "",
        "resourceNeeds_ComplexProcedure": "",
        "decisionPoint": "",
        "locationID": localStorage.getItem("locationID"),
        "spo2LowerThan90": "",
        "birthDate": birthDate,
        "intensityOfPain": "",
        "hasFoodSensitivity": "0",
        "referCause": "",
        "foodSensitivity": "",
        "separationByInfection": Separation,
        "encounter24HoursAgoItems": "",
        "isOutCenter": "",
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
        "triageOtherCasesAdmissionKind": admissionKindTextList,
        "triageOtherCasesMainDisease":eOtherCasesMainDisease,
        "triageFoodSensitivity":FoodSensitivityObjList
    }
      const body = JSON.stringify(data );
      console.log(body)
      const headerDict = {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer  ' + localStorage.getItem('token')
      }
      console.log(body);
      return this.http.post<any>(this.baseurl+this.creatlvlUrl, body, {
          headers: headerDict
      })

    }
}
