import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})

export class NewCaseWorkerService {
  private newCaseWorkerUrl="/api/CaseWorker/Create_NewCaseWorker";
  private finalNewCaseWorkerUrl="/api/CaseWorker/Confirm_CaseWorker"
    baseurl: any;
    seturl(url: any) {
        this.baseurl = url;
    }
  constructor(private  http:HttpClient) {}
    newCaseWorker(
        caseWorkerID : string,
        maritalCode:string,
        educationCode:string,
        JObsCode:string,
        children:string,
        patinetHasRelatieve:string,
        relativeName:string,
        relatedTel:string,
        interanceCode:string,
        date:string,
    caseWorkerTargetGroup:any[],
        ESICode:string,
        InsurancecoverageCode:string,
        EffectiveCompanionCode:string,
        dangergroupsNew:any[],
        hasSupportValue:string,
        Opinionpersent:number,
        expalinIDea:string,
        FinallParsent:number,
        behdashPersent:number,
        behdashtMoney:number,
        dolatiPersent:number,
        dolatiPrice:number,
        noneGovermentPrecent:number,
        noneGovermentPrice:number,
        kheyrieHospitalPrecent:number,
        charityHospitalPrice:number,
        nikPrecent:number,
        nikMoney:number,
        dischargeRecommendations:string,
        needToFollow:string,
        fallowProgramm:string,
        caseWorkerActionGroup:any,
        FinalInterventionID:string,
        interventionDescription:string,
        dataRand:any,
        InterventionArray:any,
        finalScore:string,
        shortExplain:string,
        relationAttended:string,
        FinalExplain:string

    ) {
        const data = {
            "caseWorkerID": caseWorkerID,
            "caseWorkerDetails": {
                "caseWorkerDetailsID": "",
                "martialStatus": maritalCode,
                "levelOfEducation": educationCode,
                "job":JObsCode,
                "countOfChild": children,
                "isPatientAttendant": patinetHasRelatieve,
                "patientAttendantFullName": relativeName,
                "patientAttendantRelation": relationAttended,
                "patientAttendantPhone": relatedTel,
                "howToReferCaseWorker": interanceCode,
                "dateDone":"",
                "insuranceCoverage": InsurancecoverageCode,
                "effectiveCompanionPresence": EffectiveCompanionCode,
                "exclusiveDescription": shortExplain,
                "caseWorkerLevel": ESICode,
                "totalPoint": finalScore,
                "caseWorkerID": caseWorkerID,
                "interventionDescription": interventionDescription,
                "finalResultOfIntervention": FinalInterventionID,
                "needForEconomicSupport": hasSupportValue,
                "caseWorkerOpinionPrecent": Opinionpersent,
                "caseWorkerOpinionDescription": expalinIDea,
                "finalEconomicSupportPercent": FinallParsent,
                "dischargeRecommendations": dischargeRecommendations,
                "needToFollow": needToFollow,
                "needPlan": fallowProgramm,
                "ministryOfHealthPercent": behdashPersent,
                "ministryOfHealthPrice": behdashtMoney,
                "governmentSupportInstitutionsPercent": dolatiPersent,
                "governmentSupportInstitutionsPrice": dolatiPrice,
                "noneGovernmentSupportInstitutionsPercent": noneGovermentPrecent,
                "noneGovernmentSupportInstitutionsPrice": noneGovermentPrice,
                "hospitalCharityPercent": kheyrieHospitalPrecent,
                "hospitalCharityPrice": charityHospitalPrice,
                "caseWorkerBringPercent":nikPrecent,
                "caseWorkerBringPrice": nikMoney,
                "FinalDescriptionOfTheEvaluation":FinalExplain
            },
            "caseWorkerHighRiskGroup": dangergroupsNew,
            "caseWorkerTargetGroup":caseWorkerTargetGroup,
            "caseWorkerRand": dataRand,
            "caseWorkerInterventionGroup": InterventionArray,
            "caseWorkerActions": caseWorkerActionGroup
        };

        const body = JSON.stringify(data );
        console.log(body);
        const headers = {  'Content-Type': 'application/json' };
        const headerDict = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer  ' + localStorage.getItem('token')
        }

        const requestOptions = {
            headers: new Headers(headerDict),
        };

        return   this.http.post<any>( this.baseurl+this.newCaseWorkerUrl, body, {
            headers: headerDict
        });
    }
    ConfirmCaseWorker(caseWorkerID:string){
      const data={
            "caseWorkerID":caseWorkerID,
        }
        const body = JSON.stringify(data );
        console.log(body);
        const headers = {  'Content-Type': 'application/json' };
        const headerDict = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer  ' + localStorage.getItem('token')
        }

        const requestOptions = {
            headers: new Headers(headerDict),
        };

        return   this.http.post<any>( this.baseurl+this.finalNewCaseWorkerUrl, body, {
            headers: headerDict
        });

    }
}
