

export class TargetGroupDiv {
    targetGroup1:string;
    targetGroup2:string;
    groupCode:string;
    prcentGropu:number

}
// add(){
//     let objectSelected=new CaseWorkerRand;
//     objectSelected.caseWorkerRandID="";
//     objectSelected.psychologicalStatus=this.PsychologicalconditionsID;
//     objectSelected.economicStatus=this.EconomicSituationID;
//     objectSelected.socialDysfunction=this.DisorderID;
//     objectSelected.legalIssues=this.LegalID;
//     objectSelected.fewDescription=this.SummeryText;
//     objectSelected.totalDescription=this.FinalExplain;
//     objectSelected.caseWorkerID= "";
//     this.supurtNetworkRand.forEach(item=>{
//         let supportNetwork =new CaseWorkerSupportNetwork;
//         supportNetwork.caseWorkerRandID="";
//         supportNetwork.caseWorkerSupportNetworkID="";
//         supportNetwork.supportNetwork=item
//         this.supportNetworkArray.push(supportNetwork)
//     })
//     this.dataRand['caseWorkerSupportNetwork']=[]
//     this.supportNetworkArray.forEach(i=>{
//         objectSelected.caseWorkerSupportNetwork.push({
//             caseWorkerSupportNetworkID :"",
//             supportNetwork:i.supportNetwork,
//             caseWorkerRandID:"",
//         })
//     })
//
//     this.dangerRandGroup.forEach(item=>{
//         let obj =new HighRiskDangerRandGroup
//         obj.caseWorkerHighRiskGroupForRandID="";
//         obj.caseWorkerRandID="";
//         obj.highRiskGroup=item;
//         this.arraaaay.push(obj);
//     })
//     this.dataRand['caseWorkerHighRiskGroupForRand']=[];
//     console.log(this.dataRand['caseWorkerHighRiskGroupForRand'])
//     this.arraaaay.forEach(i=>{
//         objectSelected.caseWorkerHighRiskGroupForRand.push({
//             highRiskGroup:i.highRiskGroup,
//             caseWorkerRandID:"",
//             caseWorkerHighRiskGroupForRandID:""
//         })
//     })
//     console.log(objectSelected.caseWorkerHighRiskGroupForRand)
//     this.showHtmlHightRIskRandGroupArray.push(objectSelected.caseWorkerHighRiskGroupForRand);
//     this.dataRand.push(objectSelected);
//     this.arraaaay=[]
//     this.supportNetworkArray=[]
//     this.EconomicSituationID=""
//     console.log(this.dataRand);
//     this.containers.push({'div':this.containers.length,'active':this.Active});
//     console.log(this.containers)
//     this.modalService.dismissAll();
//     this.ShowRand=false;
//
//
// }