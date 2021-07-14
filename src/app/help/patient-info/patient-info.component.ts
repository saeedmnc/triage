import { Component, OnInit } from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {CaseWorkerListService} from "../../services/Case-worker/Case-woeker-patientList/case-worker-list.service";
import { DangerGroup} from "../../help/interFace/DangerGroup"
import {eOtherCasesMainDisease} from "../../eOtherCasesMainDisease";
import{ modakhele} from './../interFace/modakheleInterface';
import { targetArray} from './../interFace/targetArray';
import{NewCaseWorkerService} from "./../../services/Case-worker/New-Case-Worker-Service/new-case-worker.service"
//clasees....

import {caseWorkerTargetGroup} from "./../Classes/caseWorkerTargetGroup"
import {highRiskGroup} from "./../Classes/highRiskGroup";
import { caseWorkerAction } from "./../Classes/caseWorkerAction"
import { InterventionGroup } from "./../Classes/InterventionGroup"
import {CaseWorkerRand} from "./../Classes/caseWorkerRand"
import {HighRiskRandGroup} from './../Classes/highRiskRandGroup';
import {HighRiskDangerRandGroup } from './../Classes/highRiskDangerRandGroup';
import {CaseWorkerSupportNetwork } from './../Classes/caseWorkerSupportNetwork';
import {TargetGroupDiv } from './../Classes/targetGroupDiv';
import { CaseWorkerIntervationTitle} from "./../Classes/caseWorkerIntervationTitle"
import { EditCaseWorkerServiceService} from "./../../services/Case-worker/Edit-Case-worker-Service/edit-case-worker-service.service"
import {number} from "ng2-validation/dist/number";
import {stringify} from "querystring";
import {error} from "selenium-webdriver";
import Swal from 'sweetalert2'
import {ApiConfigService} from "../../services/apiConfig/api-config.service";
import {TeriajItemsService} from "../../services/teriajItems/teriaj-items.service";
@Component({
  selector: 'app-patient-info',
  templateUrl: './patient-info.component.html',
  styleUrls: ['./patient-info.component.scss']
})
export class PatientInfoComponent implements OnInit {
    sendRAndARray:any[]
    showEdit=false
    target2:any
    relationVAlue=""
    showExplain=false
    info2:any[]
    educationVAlue=""
    selectedCity5 = null;
    relationAttended=""
    selectedPersonId=""
    hospital:any[]
    nurseFirstName=""
    nurseLAstName=""
    FirstPrsnet:number=0
    //validation....................
    behdashtVAlueDisable=false
    behdashtPersentDisable=false
    DolatiVAlueDisable=false
    DolatiPrsentDisable=false
    notDolatiPersentDisable=false
    notDolatiValidDisable=false
    getKheyriePrsentDisable=false
    getKheyrieVAlueDisable=false
    nikValueDisable=false
    nikPrsentDisable=false

    arrayyyyyyyyy:Array<any>=[]
    TargetInputValueToShow:Array<any>=[]
    persentToshow:Array<any>=[]
    codeToshoow:Array<any>=[]
    //Edit Intervation..............................................
    editIntervationIndex:any
    interVAtionDateEdit=""
    interventionDescriptionEdit=""
    caseWorkerInterventionTitleEdit=new Array()





    //Edit Rand.......................................................
    indexEditRAnd:any
    psychologicalStatusEdit=""
    economicStatusEdit=""
    fewDescriptionEdit=""
    socialDysfunctionEdit=""
    legalIssuesEdit=""
    caseWorkerHighRiskGroupForRandEdit=new Array()
    caseWorkerSupportNetworkEdit=new Array()





    //...............................................................


    number=0
    intervationArray=new Array()
    targetRow=new Array()
    caseWorkerTargetGroup:Array<any>=[{
        caseWorkerTargetGroupID:"",
    targetGroup1:[],
    targetGroup2:[],
    groupCode:[],
    groupPercent:"",
    caseWorkerID:""
    }]


    Confirm=""
    triageLevel=""
    triageLevelInput=""
    trigeScore:number
    dangerGroupScore:number
    showFinal=false
    calcvalid=true
    testArray=[]
    CaseWorkerIntervationArray=new Array()
    showHtmlHightRIskRandGroupArray=new Array()
    intervationDiscription2=""
    hasFllow=""
    persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g];
    arabicNumbers  = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g];
    today = new Date().toLocaleDateString('fa-IR');
    day=new Date()
    patinetHasRelatieveValue=""
    FinallParsent:number;
    shortExplain=""
    children=""
    behdashPersent:number
    kheyriePersent:number
    suggestionAfter=""
    nikPersent:number
    nikMoney:number
    kheyrieMoney:number
    notDolatiPersent:number
    notDolatiMoney:number
    behdashtMoney:number
    dolatiPersent:number
    dolatiMoney:number
    relativeName=""
    interanceCode=""
    Targetnumberofarray=0
    colorID:number
    HelpPersent:number
    showDanger=false;
    color:number
    Level="الویت چهارم"
    finalScore:number;
    hasRelative:boolean=false;
    ShowRand:boolean=true
    containers= [];
    expalinIDea=""
    hasIntervention:boolean=false;
    InterventionContainer=[];
    interventionDescription="";
    parvandeMadadkariContainer=[];
    hasFallowUp=false;
    hasSuppoortOK=true;
    hasSupportValue="";
    graay=false;
    CaseworkerId="";
    info:any[];
    FinalExplain=""
    MOdakheleDate=""
    id="";
    persent=0;
    code='';
    FinalInterventionSecondValue="";
    FinalInterventionThirdValue="";
    dangerLenght:number;
    netwokSuport=""
    dangerInput=new Array();
    InterventionArray:Array<any>=[];
    FinalInterventionFirstArray=new Array();
    FinalInterventionSecondArray=new Array();
    FinalInterventionThirdArray=new Array();
    FinalInterventionArray=new Array();
    TargetArray=[]
    eghdamat="اقدامات"
    showGruopMain=false;
    eghdamatShow=true
    showChildAbouse=true;
    dangerValue="";
    dangerScore:number;
    Interventioncode="";
    dangerValue2="";
    dangerInput2:Array<any>=[];
    array:Array<any>=[]
    showDanger2=false
    InsurancecoverageScore:number;
    InsurancecoverageCode=""
    ESIScore:number;
    supportNetworkCode=""
    EffectiveCompanionInput="";
    EffectiveCompanionCode=""
    InsurancecoverageInput="";
    FinalInterventionFirstValue=""
    supportNetworkInput:Array<any>=[];
    ESIInput=""
    ESICode=""
    EffectiveCompanionScore:number
    ShowInsurancecoverage=false
    ShowEffectiveCompanion=false;
    ShowIntervention=false;
    ShowESI=false;
    ShowSupportNetwork=false;
    TargetInputValue=""
    SummeryText="";
    FallowProgram=""
    PsychologicalconditionsValue=""
    PsychologicalconditionsID="";
    EconomicSituationID=""
    DisorderValue="";
    array1:Array<any>=[]
    dangergroupsNew:Array<any>=[]
    DisorderID="";
    EconomicSituationValue="";
    LegalValue="";
    JObsCode=""
    jobsValue=""
    desableJobsInput=false
    desableEducationInput=false
    disabledElem=false
    hasRelativeInput=false
    howToEnterBtn=false
    targetDisabled1=false
    targetDisabled2=false
    childrenDisable=false
    LegalID="";
    InterventionValue=""
    FinalInterventionSelect='';
    FinalInterventionID="";
    showFinalIntervention=false;
    ShowFinalInterventionFirst=false;
    ShowFinalInterventionSecond=false;
    ShowFinalInterventionThird=false;
    targetItemInputValue="";
    time=new Date();
    finalTime:any;
    numberofarray : number = 0;
    numberofarrayY:number= 0;
    arraaaay=new Array();
    supportNetworkArray=new Array();
    TitleArray=new Array();
    numberofTragetArray=0;
    Active=false;
    InteranceValue='';
    relatedTel='';
    educationCode="";
    maritalValue="";
    maritalCode="";





    //

    defaultBindingsList = [
        { value: 1, label: 'Vilnius' },
        { value: 2, label: 'Kaunas' },
        { value: 3, label: 'Pavilnys', disabled: true }
    ];
    relatedPerson=[
        {code:'1',value:'پدر'},
        {code:'2',value:'مادر'},
        {code:'3',value:'پدر بزرگ'},
        {code:'4',value:'مادر بزرگ'},
        {code:'5',value:'خواهر'},
        {code:'6',value:'برادر'},
        {code:'7',value:'همسر'},
        {code:'8',value:'فرزند'},
        {code:'9',value:'فامیل'},
        {code:'10',value:'دوست'},
        {code:'11',value:'آشنا'},
        {code:'12',value:'همسایه'},
        {code:'13',value:'همکار'},
        {code:'14',value:'سایر'},
        ]
    targetGroupMAin=[
        {id:"1",value:"کودک آزاری",score:"5"},
        {id:"2",value:"سوءرفتار یا خشونت",score:"5"},
        {id:"3",value:"اختالالت سایکوتیک",score:"5"},
        {id:"4",value:"مشکل سرپرستی خانواده",score:"5"},
        {id:"5",value:"نابسامانی خانواده",score:"5"},
        {id:"6",value:"شرایط بحرانی",score:"5"},
        {id:"7",value:"مدارک هویتی و بیمه",score:"5"},
        {id:"8",value:"سایر گروه های پرخطر",score:"5"},
        {id:"9",value:"بیماری های حاد و مزمن",score:"5"},

    ]
    childAbuse=[
        {id:"1",code:'Z25028',value:'خشونت فیزیکی علیه کودکان (تنبیه بدنی)',persent:20},
        {id:"2",code:'Z25027',value:'خشونت جنسی (تجاوز به کودکان)',persent:20},
        {id:"3",code:'Z19008',value:'کودک رها شده (خیابانی)',persent:20},
        {id:"4",code:'Z22005',value:'کودک کار',persent:20},
        {id:"5",code:'Z16001',value:'خشونت عاطفی روانی',persent:5},
        {id:"6",code:'Z16001',value:'غفلت از کودک',persent:5},
        ]
    Violence=[
        {id:"1",code:'Z13007',value:'خشونت علیه زنان (فیزیکی)',persent:20},
        {id:"2",code:'Z13008',value:'خشونت علیه زنان (جنسی)',persent:20},
        {id:"3",code:'Z13002',value:'خشونت علیه زنان (روانی، از بین بردن استقلال مالی، محرومیت و محدودیت)',persent:5},
        {id:"4",code:'Z25040',value:'خشونت فیزیکی علیه شریک زندگی',persent:20},
        {id:"5",code:'Z25042',value:'خشونت جنسی علیه شریک زندگی',persent:20},
        {id:"6",code:'Z25020',value:'خشونت علیه سالمندان و معلولین',persent:0},
    ]
    sycotik=[
        {id:"1",code:'P72012',value:'اختلالات هذیانی',persent:0},
        {id:"2",code:'P73004',value:'دوقطبی',persent:0},
        {id:"3",code:'P74004',value:'اختلالات اضطرابی',persent:0},
        {id:"4",code:'P76004',value:'افسردگی',persent:0},
        {id:"5",code:'P79004',value:'سایر اختلالات روان',persent:0},
        {id:"6",code:'P19024',value:'سوء مصرف مواد',persent:0},
    ]
    parentProblem=[
        {id:"1",code:'Z15004',value:'متارکه',persent:20},
        {id:"2",code:'Z15012',value:'فوت همسر',persent:20},
        {id:"3",code:'Z15001',value:'طلاق',persent:20},
        {id:"4",code:'Z13001',value:'همسر الکلی',persent:20},
        {id:"5",code:'Z13002',value:'همسر پرخاشگر',persent:20},
        {id:"6",code:'Z13003',value:'همسر قمار باز',persent:20},
        {id:"7",code:'Z13004',value:'همسر روابط فرازناشویی',persent:20},
        {id:"8",code:'Z13006',value:'همسر معتاد',persent:20},
    ]
    DisorderFamily=[
        {id:"1",code:'Z03011',value:'خانواده دارای عضو معلول، بیماری خاص، صعب العلاج و سایر بیماری های مزمن',persent:20},
        {id:"2",code:'A58010',value:'خانواده های تحت پوشش سازمان های حمایتی (کمیته امداد و سازمان بهزیستی)',persent:20},
        {id:"3",code:'Z03006',value:'بی خانمان (کارتن خواب)',persent:20},
        {id:"4",code:'Z01003',value:'مشکل مالی',persent:20},
        {id:"5",code:'Z04002',value:'مشکل فرهنگی اجتماعی',persent:20},
        {id:"6",code:'Z05003',value:'مشکل شغل',persent:20},
        {id:"7",code:'Z06004',value:'مشکل بیکاری',persent:20},
        {id:"8",code:'Z07004',value:'مشکل تحصیلی',persent:20},
        {id:"9",code:'Z08002',value:'مشکل رفاه',persent:20},
    ]
    Criticalconditions=[
        {id:"1",code:'A80007',value:'حوادث غیرمترقبه (سقوط، زورگیری و ...)',persent:20},
        {id:"2",code:'P77006',value:'افکار خودکشی',persent:5},
        {id:"3",code:'P77004',value:'اقدام به خودکشی',persent:20},
        {id:"4",code:'Z09001',value:'نزاع و درگیری (ضرب و جرح)',persent:20},
        {id:"5",code:'Z23004',value:'ناپدید شدن و مرگ والدین',persent:20},
        {id:"6",code:'Z15012',value:'ناپدید شدن و مرگ همسر',persent:20},
        {id:"7",code:'Z19006',value:'ناپدید شدن و مرگ کودک',persent:20},
        {id:"8",code:'A80006',value:'تصادفات رانندگی',persent:0},
        {id:"9",code:'P02021',value:'حوادث و بلایای طبیعی',persent:70},
    ]
    Insurancedocuments=[
        {id:"1",code:'A80007',value:'ایرانی فاقد مدارک هویتی و بیمه',persent:20},
        {id:"2",code:'P77006',value:'ایرانی فاقد والدین یا قیم قانونی',persent:20},
        {id:"3",code:'P77004',value:'اتباع فاقد کدآمایش',persent:20},
        {id:"4",code:'Z09001',value:'مجهول الهویه',persent:70},
        {id:"5",code:'Z23004',value:'نوزادان متولد از ازدواج های غیرثبتی',persent:70},

    ]
    other=[
        {id:"1",code:'A23011',value:'زنان ویژه',persent:20},
        {id:"2",code:'W84004',value:'بارداری پر خطر',persent:70},
        {id:"3",code:'W84012',value:'بارداری نیازمند مراقبت ویژه',persent:20},
        {id:"4",code:'B90004',value:'بیمار HIV مثبت',persent:20},
        {id:"5",code:'D72002',value:'بیمار دارای هپاتیت',persent:20},
        {id:"6",code:'Z09001',value:'متهمین، محکومین یا مجرمین بیمار',persent:20},


    ]
    Acutedisease=[
        {id:"1",code:'B78005',value:'تالاسمی',persent:0},
        {id:"2",code:'B83010',value:'هموفیلی',persent:0},
        {id:"3",code:'P99005',value:'اتیسم',persent:0},
        {id:"4",code:'T99074',value:'متابولیک',persent:0},
        {id:"5",code:'U59008',value:'بیماری خاص (دیالیز)',persent:0},
        {id:"6",code:'U28001',value:'پیوند',persent:0},
        {id:"7",code:'A79001',value:'سرطان',persent:0},
        {id:"8",code:'A28008',value:'معلولیت جسمی',persent:20},
        {id:"9",code:'W15001',value:'ناباروری',persent:0},
        {id:"10",code:'L19015',value:'SMA',persent:0},
        {id:"11",code:'T99053',value:'CF',persent:0},
        {id:"12",code:'K82001',value:'PPH',persent:0},
        {id:"13",code:'S83001',value:'EB',persent:0},
    ]
    dangerGroups=[
        {code:'B78005',value:'کودک آزاری',score:15},
        {code:'B83010',value:'سوءرفتار یا خشونت',score:15},
        {code:'P99005',value:'سوء مصرف مواد',score:15},
        {code:'T99074',value:'نزاع و درگیری (ضرب و جرح)',score:15},
        {code:'U59008',value:'اقدام به خودکشی',score:15},
        {code:'U28001',value:'مادران باردار پرخطر',score:15},
        {code:'A79001',value:'ختلالات سایکوتیک',score:15},
        {code:'A28008',value:'بی خانمانی',score:15},
        {code:'W15001',value:'مجهول الهویه',score:15},
        {code:'L19015',value:'بیماری خاص',score:15},
        {code:'T99053',value:'صعب العلاج',score:15},

    ]
    selectedCityIds=new Array()
    dangerRandGroup: string[]
    supurtNetworkRand: string[]
    FinalArray= new Array()

    EffectiveCompanion =[
        {code:'35.9.2',value:'فاقد همراه مؤثر است ',score:5},
        {code:'B83010',value:'اطلاعات دارد، می تواند رضایت قانونی بدهد اما مشارکت خوبی ندارد',score:4},
        {code:'P99005',value:'اطلاعات کافی دارد، مشارکت دارد اما مجاز به ارائه رضایت قانونی نیست',score:3},
        {code:'T99074',value:'اطلاعات ندارد، مشارکت می کند و می تواند رضایت قانونی بدهد',score:2},
        {code:'U59008',value:' همراه مؤثر حضور دارد',score:1},


    ]
    Insurancecoverage =[
        {code:'35.9.2',value:'بیمار تبعه غیرایرانی و فاقد بیمه است:',score:5},
        {code:'B83010',value:'بیمار فرد ایرانی و فاقد مدارک هویتی است',score:4},
        {code:'P99005',value:'بیمار تبعه غیرایرانی و دارای بیمه است',score:3},
        {code:'T99074',value:'یمار فرد ایرانی و دارای مدارک هویتی فاقد بیمه است:',score:2},
        {code:'U59008',value:'بیمار فرد ایرانی دارای بیمه است',score:1},
    ]
    ESI =[
        {code:'35.9.2',value:'فاقد پاسخدهی (سطح یک)',score:5},
        {code:'B83010',value:'وضعیت پرخطر (سطح دو)',score:4},
        {code:'P99005',value:' تعداد تسهیالت مورد نیاز، 2 یا بیشتر (سطح سه)',score:3},
        {code:'T99074',value:'تعداد تسهیالت مورد نیاز، 1( سطح چهار)',score:2},
        {code:'U59008',value:'عدم نیاز به تسهیالت (سطح پنج)',score:1},
    ]
    supportNetwork =[
        {code:'1.9.2.1',value:'کمیته امداد',},
        {code:'1.9.2.2',value:'بهزیستی'},
        {code:'1.9.2.3',value:'هلال احمر'},
        {code:'1.9.2.4',value:'بنیاد شهید و امور ایثارگران'},
        {code:'1.9.2.5',value:'سازمان اوقاف'},
        {code:'1.9.2.6',value:'کمیساریای عالی امور پناهندگان'},
        {code:'1.9.2.7',value:'موسسات خیریه'},
        {code:'1.9.2.8',value:'سازمان مردم نهاد (NGO)'},
        {code:'1.9.2.9',value:'خانواده'},
        {code:'1.9.2.10',value:'دوستان'},
        {code:'1.9.2.11',value:'خویشاوندان'},
        {code:'1.9.2.12',value:'آشنایان'},
        {code:'1.9.2.13',value:'عدم عضویت'},
    ]
    Intervention =[
        {code:'1.9.3.1',value:'ارزیابی روانی اجتماعی',},
        {code:'1.9.3.2',value:'مشاوره فردی'},
        {code:'1.9.3.3',value:'مشاوره گروهی'},
        {code:'1.9.3.4',value:'مشاوره خانوادگی'},
        {code:'1.9.3.5',value:'آموزش فردی'},
        {code:'1.9.3.6',value:'آموزش گروهی'},
        {code:'1.9.3.9',value:'آموزش خانوادگی'},
        {code:'1.9.3.8',value:'حمایت یابی درون سازمانی (اقتصادی)'},
        {code:'1.9.3.9',value:'حمایت یابی درون سازمانی (روانی- اجتماعی)'},
        {code:'1.9.3.10',value:'حمایت یابی برون سازمانی (اقتصادی)'},
        {code:'1.9.3.11',value:'حمایت یابی برون سازمانی (روانی- اجتماعی)'},
        {code:'1.9.3.12',value:'ارجاع درون سازمانی'},
        {code:'1.9.3.13',value:'ارجاع برون سازمانی (به کمیته امداد)'},
        {code:'1.9.3.14',value:'ارجاع برون سازمانی (به اورژانس اجتماعی بهزیستی)'},
        {code:'1.9.3.15',value:'ارجاع برون سازمانی (مراکز کاهش آسیب بهزیستی)'},
        {code:'1.9.3.16',value:'ارجاع برون سازمانی (مراکز مراقبتی بهزیستی)'},
        {code:'1.9.3.17',value:'ارجاع برون سازمانی (مراکز توانبخشی بهزیستی)'},
        {code:'1.9.3.18',value:'ارجاع برون سازمانی (مراکز نگهداری بهزیستی)'},
        {code:'1.9.3.19',value:'ارجاع برون سازمانی (هلال احمر)'},
        {code:'1.9.3.20',value:'ارجاع برون سازمانی (بنیاد شهید و امور ایثارگران)'},
        {code:'1.9.3.21',value:'ارجاع برون سازمانی (مراجع قضایی- دادسرا)'},
        {code:'1.9.3.22',value:'ارجاع برون سازمانی (مراجع قضایی- نیروی انتظامی 110)'},
        {code:'1.9.3.23',value:'ارجاع برون سازمانی (شهرداری)'},
        {code:'1.9.3.24',value:'ارجاع برون سازمانی (سازمان اوقاف)'},
        {code:'1.9.3.25',value:'ارجاع برون سازمانی (کمیساریای امور پناهندگان)'},
        {code:'1.9.3.26',value:'ارجاع برون سازمانی (ریاست جمهوری)'},
        {code:'1.9.3.27',value:'ارجاع برون سازمانی (سازمان زندان ها)'},
        {code:'1.9.3.28',value:'ارجاع برون سازمانی (شبکه بهداشت)'},
        {code:'1.9.3.29',value:'ارجاع برون سازمانی (پزشکی قانونی)'},
        {code:'1.9.3.30',value:'ارجاع برون سازمانی (ثبت احوال)'},
        {code:'1.9.3.31',value:'ارجاع برون سازمانی (سایر دانشگاه های علوم پزشکی)'},
        {code:'1.9.3.32',value:'ارجاع برون سازمانی (وزارت بهداشت)'},
        {code:'1.9.3.33',value:'ارجاع برون سازمانی (سازمان فنی حرفه ای)'},
        {code:'1.9.3.34',value:'ارجاع برون سازمانی (مراکز بیمه)'},
        {code:'1.9.3.35',value:'ارجاع برون سازمانی (موسسات خیریه)'},
        {code:'1.9.3.36',value:'ارجاع برون سازمانی (سازمان مردم نهاد )'},
        {code:'1.9.3.37',value:'مداخله در بحران'},
        {code:'1.9.3.38',value:'پیگیری پس از ترخیص'},
        {code:'1.9.3.39',value:'بازدید منزل'},
        {code:'1.9.3.40',value:'مراجعه مددکار اجتماعی به سازمان های حمایتی یا قانونی'},
        {code:'1.9.3.41',value:'سایر مداخلات'},
    ]
    FinalIntervention =[
        {value:'دستیابی موفق به اهداف مداخله و ترخیص ایمن بیمار',id:'1'},
        {value:'دستیابی نسبی به اهداف مداخله و ترخیص بیمار',id:'2'},
        {value:'عدم دستیابی به اهداف مداخله و عدم ترخیص بیمار',id:'3'},


    ]
    FinalInterventionFirst =[
        {value:'همکاری و همراهی بیمار در پیشبرد مداخالت',id:'1'},
        {value:'همکاری همراهان موثر و خانواده بیمار در پیشبرد مداخالت',id:'2'},
        {value:'استفاده موثر از منابع موجود',id:'3'},
        {value:'همکاری موثر سازمانهای برونبخشی',id:'4'},
    ]
    FinalInterventionSecond =[
        {value:'نداشتن همراهان موثر',id:'1'},
        {value:'عدم همکاری موثر بیمار',id:'2'},
        {value:'ضعف همکاری سازمانهای برونبخشی',id:'3'},
        {value:'نتیجه مداخالت منوط به اقدامات سایر سازمانهای برونبخشی',id:'4'},
        {value:'کمبود منابع و امکانات موجود',id:'5'},
    ]
    FinalInterventionThird =[
        {value:'امتناع بیمار از پیشبرد مداخالت',id:'1'},
        {value:'امتناع خانواده یا همراهان بیمار از پیشبرد مداخالت',id:'2'},
        {value:' عدم موفقیت در جذب منابع',id:'3'},
        {value:'نتیجه مداخالت منوط به اقدامات سایر سازمانهای برونبخشی',id:'4'},
        {value:'ترخیص بیمار مشروط به اقدامات سایر سازمانهای متولی',id:'5'},
    ]
    Jobs =[
        {code:'24043',value:'کارمند'},
        {code:'24032',value:'کارگر'},
        {code:'99994',value:'آزاد'},
        {code:'99996',value:'بازنشسته'},
        {code:'99995',value:'از کار افتاده'},
        {code:'99993',value:'خانه دار'},
        {code:'99992',value:'محصل'},
        {code:'99991',value:'بیکار'},
        {code:'24039',value:'سایر مشاغل'},
    ]
    InteranceType=[
        {code:'1.9.1.1',value:'خود ارجاع'},
        {code:'1.9.1.2',value:'راند'},
        {code:'1.9.1.3',value:'تریاژ'},
        {code:'1.9.1.4',value:'ارجاع از کادر درمان'},
        {code:'1.9.1.5',value:'ارجاع از سازمان های دولتی'},
        {code:'1.9.1.6',value:'ارجاع از سازمان های غیردولتی'},
        {code:'1.9.1.7',value:'سایر'}
        ]
    education=[
        {code:'1',value:'بی سواد'},
        {code:'2',value:'ابتدايی'},
        {code:'3',value:'راهنمايی'},
        {code:'4',value:'متوسطه'},
        {code:'6',value:'دیپلم'},
        {code:'100',value:'دانشجوي کاردانی'},
        {code:'101',value:'کاردانی'},
        {code:'110',value:'دانشجوي کارشناسی'},
        {code:'111',value:' کارشناسی'},
        {code:'140',value:'دانشجوي کارشناسی ارشد'},
        {code:'141',value:'کارشناسی ارشد'},
        {code:'150',value:' دانشجوي دکتراي حرفه اي'},
        {code:'151',value:'دکتراي حرفه اي'},
        {code:'170',value:'دانشجوي تخصص'},
        {code:'171',value:'تخصص'},
        {code:'200',value:'دانشجوي فوق تخصص'},
        {code:'201',value:'فوق تخصص'},
        {code:'210',value:'دانشجوي فلوشیپ'},
        {code:'211',value:'فلوشیپ'},
        {code:'190',value:'دانشجوي دکتري تخصصی'},
        {code:'191',value:' دکتراي تخصصی'},
    ]
        MaritalStatus=[
            {code:'1',value:'طلاق گرفته'},
            {code:'2',value:'متاهل'},
            {code:'3',value:'مجرد'},
            {code:'4',value:'همسر فوت شده'},

        ]
    calcFinalScore(){
        this.showFinal=true;
        this.calcvalid=true
        if (this.selectedCityIds.length>0){
            this.dangerGroupScore=15;
            console.log("امتیاز گروه خطر ",this.dangerGroupScore)
        }
        this.finalScore=this.dangerGroupScore + this.EffectiveCompanionScore + this.InsurancecoverageScore + this.trigeScore;
        console.log(this.finalScore)
        if (this.finalScore>14){
            this.Level="الویت اول ";
            this.color=1;
            console.log(this.color)
        } if (this.finalScore>9 && this.finalScore<15){
            this.Level="الویت سوم"
            this.color=2
        } if (this.finalScore>6 && this.finalScore<10){
            this.Level="الویت سوم "
            this.color=3
        }if (this.finalScore>2 && this.finalScore<7){
            this.Level="الویت چهارم"
            this.color=4
        }


    }

    data:Array<any>=[];
    dataRand:Array<any>=[]
    constructor(private modalService: NgbModal,
              private _service:CaseWorkerListService,
                private _new:NewCaseWorkerService,
                private  i:ApiConfigService,
                private _item:TeriajItemsService,
                private _edit:EditCaseWorkerServiceService

    ) {
        this._new.seturl(this.i.config.API_URL);
        this._service.seturl(this.i.config.API_URL);
        this._edit.seturl(this.i.config.API_URL);
    }
    getnikPresent(event){
        console.log(typeof this.nikPersent)
        if (this.nikPersent>100){
            this.nikPersent=100
        }
        if (this.nikPersent>0){
            this.nikValueDisable=true
        }
        else {
            this.nikValueDisable=false
        }
    }
    getnikMoney(){
        if (this.nikMoney>0){
            this.nikPrsentDisable=true
        }
        else {
            this.nikPrsentDisable=false
        }
    }
    getbehdashPersent(){
        if (this.behdashPersent>100){
            this.behdashPersent=100
        }
        if (this.behdashPersent>0){
            this.behdashtVAlueDisable=true
        }
        else {
            this.behdashtVAlueDisable=false
        }
    }
    getbehdashVAlue(){
        if (this.behdashtMoney>0){
            this.behdashtPersentDisable=true
        }
        else {
            this.behdashtPersentDisable=false
        }
    }

    getKheyriePrsent(){
        if (this.kheyriePersent>100){
            this.kheyriePersent=100
        }
        if (this.kheyriePersent>0){
            this.getKheyriePrsentDisable=true
        }
        else {
            this.getKheyriePrsentDisable=false
        }

    }
    getKheyrieMoney(){
        if (this.kheyrieMoney>0){
            this.getKheyrieVAlueDisable=true
        }
        else {
            this.getKheyrieVAlueDisable=false
        }
    }
    getnotDolatiPersent(){
        if (this.notDolatiPersent>100){
            this.notDolatiPersent=100
        }
        if (this.notDolatiPersent>0){
            this.notDolatiPersentDisable=true
        }
        else {
            this.notDolatiPersentDisable=false
        }
    }
    getnotDolatiVAlue(){
        if (this.notDolatiMoney>0){
            this.notDolatiValidDisable=true
        }
        else {
            this.notDolatiValidDisable=false
        }
    }
    getdolatiPersent(){
        if (this.dolatiPersent>100){
            this.dolatiPersent=100
        }
        if (this.dolatiPersent>0){
            this.DolatiVAlueDisable=true
        }
        else {
            this.DolatiVAlueDisable=false
        }
    }
    getdolatiVAlue(){
        if (this.dolatiMoney>0){
            this.DolatiPrsentDisable=true
        }
        else {
            this.DolatiPrsentDisable=false
        }
    }
    getMaritalStatus(code,value,i){
        this.maritalCode=code;
        this.maritalValue=value
        for (let myChild of this.MaritalStatus) {
            myChild['BackgroundColour']='white';
            myChild['color']='black'
            i.BackgroundColour = "#44b5b7";
            i.color='white'
        }
    }
    getChildren(event){
        this.children=event.target.value;
        this.children.toString();
    }
    relationAttandet(event){
        this.relationAttended=event.target.value;

    }
    getEducation(event){
        this.educationCode=event.target.value;
        console.log(this.educationCode)
    }
    getINteranceType(code,value,i){
        this.InteranceValue=value;
        this.interanceCode=code;
        for (let myChild of this.InteranceType) {
            myChild['BackgroundColour']='white';
            myChild['color']='black'
            i.BackgroundColour = "#44b5b7";
            i.color='white'
        }
    }
    getJobs(event){
        this.JObsCode=event.target.value;
        console.log(this.JObsCode);
    }
    Computing(){
        if (this.HelpPersent>30) {
            this.HelpPersent=30

        }
        if (this.FirstPrsnet>100){
            this.FirstPrsnet=100
        }
        this.FinallParsent=this.HelpPersent + Number(this.FirstPrsnet)

        console.log(this.FinallParsent);
        if (this.FinallParsent<0){
            this.FinallParsent=0
        }
        if (this.FinallParsent>100){
            this.FinallParsent=100
        }
    }
    InsurancecoverageList(){
        this.ShowInsurancecoverage=true
    }
    getFinalIntervention(id:any,value:any){
        this.FinalInterventionArray=[]
        this.FinalInterventionID=""
        console.log("empty",this.FinalInterventionID);
        this.FinalInterventionSelect=value
        this.FinalInterventionID=id;
        console.log(this.FinalInterventionID)
        if (this.FinalInterventionID==="1"){

            console.log("firstWorked",this.FinalInterventionID)
            this.ShowFinalInterventionFirst=true;
            this.ShowFinalInterventionSecond=false
            this.ShowFinalInterventionThird=false


        }
        else if (this.FinalInterventionID==="2"){
            console.log("secondWorked",this.FinalInterventionID)

            this.ShowFinalInterventionSecond=true
            this.ShowFinalInterventionFirst=false
            this.ShowFinalInterventionThird=false
        }
       else if (this.FinalInterventionID==="3"){
            console.log("Thired",this.FinalInterventionID)
            this.ShowFinalInterventionThird=true
            this.ShowFinalInterventionSecond=false
            this.ShowFinalInterventionFirst=false;

        }

        console.log(this.FinalInterventionID)
        this.showFinalIntervention=false;
    }
    supportNetworkList(){
        this.ShowSupportNetwork=true
    }
    showFinalInterventionList(){
        this.showFinalIntervention=true
    }
    focuseInput(i,event:any){
        console.log(i)
        this.showGruopMain=true;
       document.getElementById('id'+i).style.visibility='visible'
        console.log("idddddd",event.target.attributes)

      console.log(this.arrayyyyyyyyy[0])
        // this.numberofTragetArray=this.numberofTragetArray+1
    }
    EffectiveCompanionList(){
        this.ShowEffectiveCompanion=true
    }
    ShowFinalInterventionFirstList(){

        this.eghdamatShow=false
       this.ShowFinalInterventionFirst=true
    }
    ShowFinalInterventionSecondList(){
        this.eghdamatShow=false
        this.ShowFinalInterventionSecond=true
    }
    ShowFinalInterventionThirdList(){
        this.eghdamatShow=false
        this.ShowFinalInterventionThird=true
    }
    ESIList(){
        this.ShowESI=true;
    }
    getPsychologicalconditionsTrue(){
        this.PsychologicalconditionsValue="نیاز به مداخله"
        this.PsychologicalconditionsID="1"
        this.psychologicalStatusEdit="1"
    }
    getPsychologicalconditionsFalse(){
        this.PsychologicalconditionsValue="عدم نیاز به مداخله";
        this.PsychologicalconditionsID="2"
        this.psychologicalStatusEdit="2"
    }
    getPsychologicalconditionsNone(){
        this.PsychologicalconditionsValue="ارزیابی نشده";
        this.PsychologicalconditionsID="3"
        this.psychologicalStatusEdit="3"
    }
    getEconomicSituationTrue(){
        this.EconomicSituationValue="نیاز به مداخله"
        this.EconomicSituationID="1"
        this.economicStatusEdit="1"
    }
    getEconomicSituationFalse(){
        this.EconomicSituationValue="عدم نیاز به مداخله"
        this.EconomicSituationID="2"
        this.economicStatusEdit="2"
    }
    getEconomicSituationNone(){
        this.EconomicSituationValue="ارزیابی نشده";
        this.EconomicSituationID="3"
        this.economicStatusEdit="3"
    }
    getDisorderTrue(){
        this.DisorderValue="نیاز به مداخله";
        this.DisorderID="1"
        this.socialDysfunctionEdit="1"
    }
    getDisorderFalse(){
        this.DisorderValue="عدم نیاز به مداخله";
        this.DisorderID="2"
        this.socialDysfunctionEdit="2"
    }
    getDisorderNone(){
        this.DisorderValue="ارزیابی نشده";
        this.DisorderID="3"
        this.socialDysfunctionEdit="3"
    }
    getLegalTrue(){
        this.LegalValue="نیاز به مداخله";
        this.LegalID="1"
        this.legalIssuesEdit="1"
    }
    getLegalFalse(){
        this.LegalValue="عدم نیاز به مداخله";
        this.legalIssuesEdit="2"
        this.LegalID="2"
    }
    getLegalNone(){
        this.LegalValue="ارزیابی نشده";
        this.legalIssuesEdit="3"
        this.LegalID="3"
    }
    getEffectiveCompanion(value:any,score:any,code:any){
        this.calcvalid=false
        this.ShowEffectiveCompanion=false;
        this.EffectiveCompanionScore=score;
        console.log(this.EffectiveCompanionScore)
        this.EffectiveCompanionCode=code;
        // this.finalScore=this.finalScore + this.EffectiveCompanionScore;
        this.EffectiveCompanionInput=value;
        if (this.finalScore>14){
            this.Level="الویت اول ";
            this.color=1;
            console.log(this.color)
        } if (this.finalScore>9 && this.finalScore<15){
            this.Level="الویت سوم"
            this.color=2
        } if (this.finalScore>6 && this.finalScore<10){
            this.Level="الویت سوم "
            this.color=3
        }if (this.finalScore>2 && this.finalScore<7){
            this.Level="الویت چهارم"
            this.color=4
        }
    }
    getESI(value:any,score:any,code:any){
        this.ShowESI=false;
        this.ESIScore=score;
        console.log(this.ESIScore)
        this.ESIInput=value;
        this.ESICode=code
        this.finalScore=this.finalScore + this.ESIScore;
        if (this.finalScore>14){
            this.Level="الویت اول ";
            this.color=1;
            console.log(this.color)
        } if (this.finalScore>9 && this.finalScore<15){
            this.Level="الویت سوم"
            this.color=2
        } if (this.finalScore>6 && this.finalScore<10){
            this.Level="الویت سوم "
            this.color=3
        }if (this.finalScore>2 && this.finalScore<7){
            this.Level="الویت چهارم"
            this.color=4
        }
    }
    getSupportNetwork(value:any,code:any){
        this.netwokSuport=value
        // this.supportNetworkInput.push(this.netwokSuport);
        this.supportNetworkCode=code;
        this.ShowSupportNetwork=false;
        //
        let customOBj2=new DangerGroup();
        customOBj2.value=this.netwokSuport;
        this.supportNetworkInput.push(this.netwokSuport);
    }

    getInsurancecoverage(value:any,score:any,code:any){
        this.calcvalid=false
        this.ShowInsurancecoverage=false;
        this.InsurancecoverageScore=score;
        console.log(" this.InsurancecoverageScore", this.InsurancecoverageScore)
        this.InsurancecoverageInput=value;
        this.InsurancecoverageCode=code;
        // this.finalScore=this.finalScore + this.InsurancecoverageScore;
        if (this.finalScore>14){
            this.Level="الویت اول ";
            this.color=1;
            console.log(this.color)
        } if (this.finalScore>9 && this.finalScore<15){
            this.Level="الویت سوم"
            this.color=2
        } if (this.finalScore>6 && this.finalScore<10){
            this.Level="الویت سوم "
            this.color=3
        }if (this.finalScore>2 && this.finalScore<7){
            this.Level="الویت چهارم"
            this.color=4
        }
    }
    removeDanger(index){
        console.log(index)
        this.dangerInput.splice(index,1);
        this.dangerScore=0;
        this.finalScore=this.finalScore  - 15;
        console.log(this.finalScore);
        this.showDanger=false;
        console.log(this.showDanger)
    }
    removeDanger2(index){
        this.dangerInput2.splice(index,1);
    }
    removeFinalInterventionsecond(index){
        this.FinalInterventionSecondArray.splice(index,1);
    }
    removeFinalInterventionThird(index){
        this.FinalInterventionThirdArray.splice(index,1)
    }
    removeInterventionItem(index){
        this.InterventionArray.splice(index,1);
    }
    removeInterventionAll(){
        this.InterventionArray=[]
        this.ShowIntervention=false
    }
    removeFinalInterventionSecondAll(){
        this.FinalInterventionSecondArray=[];
        this.ShowFinalInterventionSecond=false
    }
    removeFinalInterventionThirdAll(){
        this.FinalInterventionThirdArray=[];
        this.ShowFinalInterventionThird=false
    }
    removeDangerAll(){
        this.dangerInput=[]
        this.showDanger=false;
        this.finalScore= this.finalScore - (this.dangerLenght *15);
    }
    removeDangerAll2(){
        this.dangerInput2=[];
        this.showDanger2=false
    }
    removeFinalInterventionFirst(index){
        this.FinalInterventionFirstArray.splice(index,1);
    }
    removeFinalInterventionFirstAll(){
        this.FinalInterventionFirstArray=[];
        this.ShowFinalInterventionFirst=false
        this.eghdamatShow=true
    }
    getDangerItem(value:any,score:any){
       this.dangerScore=score;
        this.finalScore=20;
        this.dangerValue=value;
        let customObj2 = new DangerGroup();
        customObj2.value=this.dangerValue;
        this.dangerInput.push(customObj2);
        console.log(this.dangerInput.length);
        this.dangerLenght=this.dangerInput.length
        this.showDanger=false;
        if (this.finalScore>14){
            this.Level="الویت اول ";
            this.color=1;
            console.log(this.color)
        } if (this.finalScore>9 && this.finalScore<15){
            this.Level="الویت سوم"
            this.color=2
        } if (this.finalScore>6 && this.finalScore<10){
            this.Level="الویت سوم "
            this.color=3
        }if (this.finalScore>2 && this.finalScore<7){
            this.Level="الویت چهارم"
            this.color=4
        }
    }
    // getFinalInterventionFirst(id:any){
    //     let customObj2 = new caseWorkerAction;
    //     customObj2.caseWorkerAction=id;
    //     customObj2.caseWorkerActionsID="";
    //     customObj2.caseWorkerID=""
    //     this.FinalInterventionArray.push(customObj2);
    //     console.log(this.FinalInterventionArray)
    //     this.ShowFinalInterventionFirst=false
    // }
    // getFinalInterventionThird(id:any){
    //     let customObj4 = new caseWorkerAction;
    //     customObj4.caseWorkerAction=id;
    //     customObj4.caseWorkerActionsID="",
    //         customObj4.caseWorkerID=""
    //     this.FinalInterventionArray.push(customObj4);
    //     console.log(this.FinalInterventionArray)
    //     this.ShowFinalInterventionThird=false
    // }
    // getFinalInterventionsecond(id){
    //     let customObj3 = new caseWorkerAction;
    //     customObj3.caseWorkerAction=id;
    //     customObj3.caseWorkerActionsID="";
    //     customObj3.caseWorkerID=""
    //     this.FinalInterventionArray.push(customObj3);
    //     console.log(this.FinalIntervention)
    //     this.ShowFinalInterventionSecond=false
    // }
    getDangerItem2(value:any){
        this.dangerValue2=value;
        console.log(this.dangerValue2)
        let customOBj=new DangerGroup();
        customOBj.value=this.dangerValue2;
        this.dangerInput2.push(this.dangerValue2);
        console.log(this.dangerInput2)
        this.showDanger2=false
    }
    getTargetItem(id,value,index,myIndex){
        this.id=id;
        console.log("گروه هدف",index)
        console.log("ردیف",myIndex)
        this.arrayyyyyyyyy.push(value);
        console.log(this.arrayyyyyyyyy);
        this.showGruopMain=false;
        this.showChildAbouse=true;
        // let obj=new targetArray();
        // obj.targetvalue=this.targetItemInputValue;
        // obj.targetCOde=this.id;
        // this.array1.push(obj)
        console.log(this.array1)
    }
    getIntervention(value:any,code:any , id:number){
        // this.Interventioncode=code;
        // this.InterventionValue=value
        // this.intervationArray.push(value)
        let selected = new InterventionGroup;
        selected.caseWorkerID="";
        selected.interventionDate=this.MOdakheleDate;
        selected.interventionDescription=this.intervationDiscription2;
        selected.caseWorkerInterventionGroupID="";


            this.testArray.forEach(item=>{
                let newObj=new CaseWorkerIntervationTitle;
                newObj.caseWorkerInterventionGroupID="";
                newObj.caseWorkerInterventionTitleID="";
                newObj.interventionTitle=item;
                this.CaseWorkerIntervationArray.push(newObj)

            })




        selected.caseWorkerInterventionTitle=this.CaseWorkerIntervationArray;


        this.InterventionArray.push( selected);
        console.log("twwwwwwwwwwwwww",this.InterventionArray)
        console.log(this.InterventionArray);
        this.ShowIntervention=false;
    }
    showdangerList(){
        this.showDanger=true
    }
    ShowInterventionList(i :number){
        this.ShowIntervention=true
    }
    showdangerList2(){
        this.showDanger2=true
    }
 patinetHasRelatieve(){
    this.hasRelative=true;
    console.log(this.hasRelative)
    this.patinetHasRelatieveValue="1"
 }
    patinetDosentHasRelatieve(){
        this.hasRelative=false
        this.patinetHasRelatieveValue="0"
    }
    openRandModal(content){
        this.EconomicSituationID='',
            console.log(this.EconomicSituationID)
        this.dangerRandGroup=[]
        this.supurtNetworkRand=[]
        this.dangerInput2=[];
        this.numberofarrayY=this.numberofarrayY+1;
        console.log(this.numberofarrayY)
        console.log(this.dangerInput2);
        this.PsychologicalconditionsValue='';
        this.PsychologicalconditionsID=null;
        this.EconomicSituationID=null;
        this.EconomicSituationValue='';
        this.DisorderValue='';
        this.LegalValue='';
        this.DisorderID=null;
        this.LegalID=null;
        this.SummeryText=''
        this.modalService.open(content, { size: 'lg' ,backdrop:'static',keyboard  : false}).result.then((result) => {
        }, (reason) => {
        });
    }
    editIntervation(index,content4){
        this.interVAtionDateEdit=""
        this.editIntervationIndex=index
        let editIntervation =this.InterventionArray[index];
        console.log(editIntervation);
        this.interVAtionDateEdit=""
        // this.interVAtionDateEdit=editIntervation['interventionDate']
        this.interventionDescriptionEdit=editIntervation['interventionDescription']
        for (let i of editIntervation['caseWorkerInterventionTitle']){
            this.caseWorkerInterventionTitleEdit.push(i.interventionTitle)
        }


        this.modalService.open(content4, { size: 'lg' ,backdrop:'static',keyboard  : false}).result.then((result) => {
        }, (reason) => {
        });
    }
    edit(index,content){
        this.indexEditRAnd=index
       let arrau=this.dataRand[index];
       this.caseWorkerHighRiskGroupForRandEdit=[]
        this.caseWorkerSupportNetworkEdit=[]
       console.log(arrau)
      this.psychologicalStatusEdit=arrau['psychologicalStatus']
        this.economicStatusEdit=arrau['economicStatus']
        this.fewDescriptionEdit=arrau['fewDescription']
        this.socialDysfunctionEdit=arrau['socialDysfunction']
        this.legalIssuesEdit=arrau['legalIssues']
        for(let i of arrau['caseWorkerHighRiskGroupForRand']){
            this.caseWorkerHighRiskGroupForRandEdit.push(i.highRiskGroup)
            console.log(i.highRiskGroup)
        }
        for(let i of arrau['caseWorkerSupportNetwork']){
            this.caseWorkerSupportNetworkEdit.push(i.supportNetwork)
            console.log(i.highRiskGroup)
        }
       this.modalService.open(content, { size: 'lg' ,backdrop:'static',keyboard  : false}).result.then((result) => {
    }, (reason) => {
    });
    }
    saveINtervationEdit(){
        this.InterventionArray.splice(this.editIntervationIndex,1)
        let objectSelected=new InterventionGroup;
        objectSelected.caseWorkerID="";

        objectSelected.interventionDate=this.interVAtionDateEdit;
        objectSelected.interventionDescription=this.interventionDescriptionEdit;
        this.caseWorkerInterventionTitleEdit.forEach(item=>{
            let title =new CaseWorkerIntervationTitle;
            title.caseWorkerInterventionTitleID="";
            title.caseWorkerInterventionGroupID="";
            title.interventionTitle=item;
            this.TitleArray.push(title)

        })
        this.InterventionArray['caseWorkerInterventionTitle']=[]

        this.TitleArray.forEach(i=>{
            objectSelected.caseWorkerInterventionTitle.push({
                caseWorkerInterventionTitleID:"",
                interventionTitle:i.interventionTitle,
                caseWorkerInterventionGroupID:""

            })
        })
        this.InterventionArray.push(objectSelected);
        console.log(this.InterventionArray)
        this.modalService.dismissAll()

    }
    saveEditRand(){
        this.dataRand.splice(this.indexEditRAnd,1)
        console.log(this.dataRand);
        let objectSelected=new CaseWorkerRand;
        objectSelected.caseWorkerRandID="";
        objectSelected.psychologicalStatus=this.psychologicalStatusEdit;
        objectSelected.economicStatus=this.economicStatusEdit;
        objectSelected.socialDysfunction=this.socialDysfunctionEdit;
        objectSelected.legalIssues=this.legalIssuesEdit;
        objectSelected.fewDescription=this.fewDescriptionEdit;
        objectSelected.totalDescription="";
        objectSelected.caseWorkerID= "";

        this.caseWorkerSupportNetworkEdit.forEach(item=>{
            let supportNetwork =new CaseWorkerSupportNetwork;
            supportNetwork.caseWorkerRandID="";
            supportNetwork.caseWorkerSupportNetworkID="";
            supportNetwork.supportNetwork=item
            this.supportNetworkArray.push(supportNetwork)
        })
        this.dataRand['caseWorkerSupportNetwork']=[]
        this.supportNetworkArray.forEach(i=>{
            objectSelected.caseWorkerSupportNetwork.push({
                caseWorkerSupportNetworkID :"",
                supportNetwork:i.supportNetwork,
                caseWorkerRandID:"",
            })
        })
        this.caseWorkerHighRiskGroupForRandEdit.forEach(item=>{
            let obj =new HighRiskDangerRandGroup
            obj.caseWorkerHighRiskGroupForRandID="";
            obj.caseWorkerRandID="";
            obj.highRiskGroup=item;
            this.arraaaay.push(obj);
        })
        this.dataRand['caseWorkerHighRiskGroupForRand']=[];
        this.arraaaay.forEach(i=>{
            objectSelected.caseWorkerHighRiskGroupForRand.push({
                highRiskGroup:i.highRiskGroup,
                caseWorkerRandID:"",
                caseWorkerHighRiskGroupForRandID:""
            })
        })
        this.dataRand.push(objectSelected);
        console.log(this.dataRand)
        this.modalService.dismissAll()

    }
    add(){
                let objectSelected=new CaseWorkerRand;
                objectSelected.caseWorkerRandID="";
                objectSelected.psychologicalStatus=this.PsychologicalconditionsID;
                objectSelected.economicStatus=this.EconomicSituationID;
                objectSelected.socialDysfunction=this.DisorderID;
                objectSelected.legalIssues=this.LegalID;
                objectSelected.fewDescription=this.SummeryText;
                objectSelected.totalDescription="";
                objectSelected.caseWorkerID= "";
                this.supurtNetworkRand.forEach(item=>{
                    let supportNetwork =new CaseWorkerSupportNetwork;
                    supportNetwork.caseWorkerRandID="";
                    supportNetwork.caseWorkerSupportNetworkID="";
                    supportNetwork.supportNetwork=item
                    this.supportNetworkArray.push(supportNetwork)
                })
        this.dataRand['caseWorkerSupportNetwork']=[]
        this.supportNetworkArray.forEach(i=>{
            objectSelected.caseWorkerSupportNetwork.push({
                caseWorkerSupportNetworkID :"",
                supportNetwork:i.supportNetwork,
                caseWorkerRandID:"",
            })
        })


        this.dangerRandGroup.forEach(item=>{
            let obj =new HighRiskDangerRandGroup
            obj.caseWorkerHighRiskGroupForRandID="";
            obj.caseWorkerRandID="";
            obj.highRiskGroup=item;
            this.arraaaay.push(obj);
            })
        this.dataRand['caseWorkerHighRiskGroupForRand']=[];
        console.log(this.dataRand['caseWorkerHighRiskGroupForRand'])
        this.arraaaay.forEach(i=>{
            objectSelected.caseWorkerHighRiskGroupForRand.push({
                highRiskGroup:i.highRiskGroup,
                caseWorkerRandID:"",
                caseWorkerHighRiskGroupForRandID:""
            })
        })
        console.log(objectSelected.caseWorkerHighRiskGroupForRand)
        this.showHtmlHightRIskRandGroupArray.push(objectSelected.caseWorkerHighRiskGroupForRand);
        console.log(this.showHtmlHightRIskRandGroupArray)
        this.dataRand.push(objectSelected);
        this.arraaaay=[]
        this.supportNetworkArray=[]
        this.EconomicSituationID=""
        console.log(this.dataRand);
        this.containers.push({'div':this.containers.length,'active':this.Active});
        console.log(this.containers)
        this.modalService.dismissAll();
        this.ShowRand=false;


    }

    saveINtervation(){
      let objectSelected=new InterventionGroup;
      objectSelected.caseWorkerID="";
      objectSelected.interventionDate=this.MOdakheleDate;
      objectSelected.interventionDescription=this.intervationDiscription2;
      this.testArray.forEach(item=>{
          let title =new CaseWorkerIntervationTitle;
          title.caseWorkerInterventionTitleID="";
          title.caseWorkerInterventionGroupID="";
          title.interventionTitle=item;
          this.TitleArray.push(title)

      })
        this.InterventionArray['caseWorkerInterventionTitle']=[]
        console.log(this.InterventionArray['caseWorkerInterventionTitle']);
        console.log("first",this.InterventionArray)
        this.TitleArray.forEach(i=>{
            objectSelected.caseWorkerInterventionTitle.push({
                caseWorkerInterventionTitleID:"",
                interventionTitle:i.interventionTitle,
                caseWorkerInterventionGroupID:""

            })
        })
        this.InterventionArray.push(objectSelected);
      console.log(this.InterventionArray)
        this.modalService.dismissAll()

    }



    addToTarget(){
        let Obj=new TargetGroupDiv;
        Obj.targetGroup1=this.targetItemInputValue
        Obj.targetGroup2=this.TargetInputValue;
        Obj.groupCode=this.code;
        Obj.prcentGropu=this.persent;
        this.targetRow.push(Obj);
        console.log(this.targetRow)
        let portion = 2;
        this.TargetArray.push(this.TargetArray.length)
        this.Targetnumberofarray=this.Targetnumberofarray+1;
        console.log(this.Targetnumberofarray)
        console.log(this.array1)
        for ( let i=0;i<this.targetRow.length;i++){
            for (let j=0;j<portion;j++) {
                document.getElementById("id"+i).innerHTML=this.targetRow[i]['targetGroup1']
                console.log(this.targetRow[i]['targetGroup1'])
            }
        }
   }
    addIntervention(content3){
        this.TitleArray=[]
        this.MOdakheleDate=""
        this.InterventionArray['caseWorkerInterventionTitle']=[]

        this.modalService.open(content3, { size: 'lg' ,backdrop:'static',keyboard  : false}).result.then((result) => {
        }, (reason) => {
        });
        this.InterventionContainer.push({'div':this.containers.length,'active':this.Active});
        console.log(this.InterventionContainer.length)
        console.log(this.testArray)
        console.log(typeof this.testArray)
        this.testArray=[]
       this.numberofarray=this.numberofarray+1;
    }
    removeIntervention(index){
        this.InterventionContainer.splice(index,1);
        if(this.numberofarray >0){
            this.numberofarray = this.numberofarray -1;
        }
    }
    isHasFaloowUp(){
        this.hasFllow="1"
      this.hasFallowUp=true
    }
    HasnotFallowUp(){
        this.hasFllow="0"

        this.hasFallowUp=false
    }
    hasSuppoort(){
        this.hasSupportValue="1"
      this.hasSuppoortOK=true
    }
    hasNotSuppoort(){
        this.hasSupportValue="0"
        this.hasSuppoortOK=false
    }
    grayClass(i){

        console.log(i)
        i.active=true;
        console.log(i.active)

        // this.dataRand.forEach(item=>{
        //     console.log(item.id)
        //     if (item.id==index){
        //         this.colorID=item.id;
        //         console.log('ColorId',this.colorID)
        //
        //
        //     }
        //
        // })



    }
    isSelected(){



    }
    getChildAbouseDate(code,persent,value,id){



        this.code=code;
        this.persent=persent;
        this.persentToshow.push(persent);
        console.log(this.persentToshow)
        this.codeToshoow.push(code);
        const sum = this.persentToshow.reduce((acc, cur) => acc + cur, 0);
        this.FirstPrsnet=sum
        if (this.FirstPrsnet>100){
            this.FirstPrsnet=100
        }
        console.log(typeof this.persent)
        this.TargetInputValue=value;
        this.TargetInputValueToShow.push(value);
        console.log(this.TargetInputValue)
        this.showChildAbouse=false;
        let obj=new caseWorkerTargetGroup;
        obj.targetGroup1=this.id;
        obj.targetGroup2=id;
        obj.groupCode=this.code;
        obj.groupPercent=persent;
        obj.caseWorkerTargetGroupID="";
        obj.caseWorkerID=""
        this.array1.unshift(obj);
        console.log(this.array1)
    }
    save(){
        console.log(this.selectedCityIds);
        if (this.FinalInterventionArray!=[]){
            this.FinalArray.forEach(item=>{
                console.log(this.FinalArray)
                let customObj2 = new caseWorkerAction;
                customObj2.caseWorkerAction=item.id;
                customObj2.caseWorkerActionsID="";
                customObj2.caseWorkerID="";
                this.FinalInterventionArray.push(customObj2)
            })

        }
        console.log(this.FinalInterventionArray)
        if (this.selectedCityIds!=[]){
            this.selectedCityIds.forEach(item=>{
                let dangerGroup=new highRiskGroup;
                dangerGroup.highRiskGroup=item.code;
                dangerGroup.caseWorkerHighRiskGroupID="";
                dangerGroup.caseWorkerID="";
                this.dangergroupsNew.push(dangerGroup)
                console.log(this.dangergroupsNew)
            })
        }

        console.log(this.day)
        console.log(this.CaseworkerId);
        console.log(typeof this.CaseworkerId)
        console.log(this.today)
        this._new.newCaseWorker(this.CaseworkerId,
            this.maritalCode,
            this.educationCode
            ,this.JObsCode,
            this.children,
            this.patinetHasRelatieveValue,
            this.relativeName,
            this.relatedTel,
            this.interanceCode,
            this.today,
            this.array1,
            this.ESICode,
            this.InsurancecoverageCode,
            this.EffectiveCompanionCode,
            this.dangergroupsNew,
            this.hasSupportValue,
            this.HelpPersent,
            this.expalinIDea,
            this.FinallParsent,
            this.behdashPersent,
            this.behdashtMoney,
            this.dolatiPersent,
            this.dolatiMoney,
            this.notDolatiPersent,
            this.notDolatiMoney,
            this.kheyriePersent,
            this.kheyrieMoney,
            this.nikPersent,
            this.nikMoney,
            this.suggestionAfter,
            this.hasFllow,
            this.FallowProgram,
            this.FinalInterventionArray,
            this.FinalInterventionID,
            this.interventionDescription,
            this.dataRand,
            this.InterventionArray,
            this.finalScore.toString(),
            this.shortExplain,
            this.relationAttended,
            this.FinalExplain,

            ).subscribe(res=>{
            console.log(res);
            if (res['success']==true){
                Swal.fire('اطلاعات با موفقيت ثبت شد')
            }
            else {
                Swal.fire('با خطا مواجه شدید!!')
            }


        },error1 => {
            Swal.fire('با خطا مواجه شدید!!')
        })
        console.log(this.interventionDescription)

    }
    ngOnInit() {

        this._item.getHospitalName().subscribe(res=>{
            this.hospital=res
        })
        this.nurseFirstName=localStorage.getItem('nurseFirstName');
        this.nurseLAstName=localStorage.getItem('nurseLastName');




        this.finalTime=(this.time.getHours() +1) + ":"+ this.time.getMinutes() + ":" +  this.time.getSeconds()
        this.CaseworkerId=localStorage.getItem('caseWorkerId')
        this._service.getPatientByID(localStorage.getItem('caseWorkerId')).subscribe(res=>{
            this.info=res;

            if (this.info['caseWorkerDetails']!=null){
                this.showEdit=true
                if (this.info['statusIS']==='2'){
                    this.desableJobsInput=true
                    this.desableEducationInput=true
                    this.childrenDisable=true
                    this.hasRelativeInput=true
                    this.howToEnterBtn=true
                    this.targetDisabled1=true
                    this.targetDisabled2=true
                    this.disabledElem=true
                }



                this.relationVAlue=this.info['caseWorkerDetails']['patientAttendantRelation']
                this.relatedTel=this.info['caseWorkerDetails']['patientAttendantPhone']
                for (let i of this.MaritalStatus ) {
                    if (this.info['caseWorkerDetails']['martialStatus']===i.code) {
                        this.maritalCode=i.code;
                        this.maritalValue=i.value
                        for (let myChild of this.MaritalStatus) {
                            myChild['BackgroundColour']='white';
                            myChild['color']='black'
                            i['BackgroundColour'] = "#44b5b7";
                            i['color']='white'
                        }
                    }
                }
                this.children=this.info['caseWorkerDetails']['countOfChild']
                console.log(this.children);
                if (this.info['caseWorkerDetails']['isPatientAttendant']==="False"){
                    this.hasRelative=false
                } else {
                    this.hasRelative=true
                }
                for (let i of this.Insurancecoverage ) {
                    if (this.info['caseWorkerDetails']['insuranceCoverage']==i.code) {
                        this.InsurancecoverageInput=i.value
                    }
                    
                }
                for (let i of this.EffectiveCompanion){
                    if (this.info['caseWorkerDetails']['effectiveCompanionPresence']==i.code) {
                        this.EffectiveCompanionInput=i.value
                    }
                }
                this.shortExplain=this.info['caseWorkerDetails']['exclusiveDescription']
                this.FinalExplain=this.info['caseWorkerDetails']['finalDescriptionOfTheEvaluation']
                console.log(this.info['caseWorkerDetails']['finalDescriptionOfTheEvaluation'])
                this.info['caseWorkerDetails']['interventionDescription']=this.interventionDescription

                for (let i of this.FinalIntervention){
                    if (this.info['caseWorkerDetails']['finalResultOfIntervention']===i.id){
                        this.FinalInterventionSelect=i.value
                    }
                }
                this.info['caseWorkerDetails']['caseWorkerOpinionPrecent']=this.HelpPersent
                this.info['caseWorkerDetails']['dischargeRecommendations']=this.suggestionAfter
                if (this.info['caseWorkerDetails']['needToFollow']==='True'){
                    this.hasFallowUp=true

                } else{
                    this.hasFallowUp=false
                }
                this.info['caseWorkerDetails']['needPlan']=this.FallowProgram;
                for (let i of this.Jobs ){
                    if (this.info['caseWorkerDetails']['job']===i.code) {

                        console.log(i.code)
                        this.JObsCode=i.code;
                        this.jobsValue=i.value
                        console.log(this.jobsValue);
                    }
                }


                for (let i of this.InteranceType){
                    if (this.info['caseWorkerDetails']['howToReferCaseWorker']===i.code){
                        this.InteranceValue=i.value;
                        this.interanceCode=i.code;
                        for (let myChild of this.InteranceType) {
                            myChild['BackgroundColour']='white';
                            myChild['color']='black'
                            i['BackgroundColour'] = "#44b5b7";
                            i['color']='white'
                        }

                    }
                }
                for (let i of this.dangerGroups){
                    for (let item of this.info['caseWorkerHighRiskGroup'])
                    if (item.highRiskGroup===i.code){
                        for (let i of this.dangerGroups){
                            for (let item of this.info['caseWorkerHighRiskGroup'])
                                if (item.highRiskGroup===i.code){
                                    this.selectedCityIds.push(i)

                                }

                        }
                    }
                }
                for (let i of this.education){
                    if (this.info['caseWorkerDetails']['levelOfEducation']===i.code) {
                        this.educationCode=i.code;
                        this.educationVAlue=i.value
                        console.log(i.value)
                    }
                }
                this.behdashPersent=this.info['caseWorkerDetails']['ministryOfHealthPercent']
                this.behdashtMoney=this.info['caseWorkerDetails']['ministryOfHealthPrice']
                this.dolatiPersent=this.info['caseWorkerDetails']['governmentSupportInstitutionsPercent']
                this.dolatiMoney=this.info['caseWorkerDetails']['governmentSupportInstitutionsPrice']
                this.notDolatiPersent=this.info['caseWorkerDetails']['noneGovernmentSupportInstitutionsPercent']
                this.notDolatiMoney=this.info['caseWorkerDetails']['noneGovernmentSupportInstitutionsPrice']
                this.kheyriePersent=this.info['caseWorkerDetails']['hospitalCharityPercent']
                this.kheyrieMoney=this.info['caseWorkerDetails']['hospitalCharityPrice']
                this.nikPersent=this.info['caseWorkerDetails']['caseWorkerBringPercent']
                this.nikMoney=this.info['caseWorkerDetails']['caseWorkerBringPrice']
                this.FinallParsent=this.info['caseWorkerDetails']['finalEconomicSupportPercent']
                if ( this.info['caseWorkerDetails']['FinalDescriptionOfTheEvaluation']!=null){
                    this.FinalExplain=this.info['caseWorkerDetails']['FinalDescriptionOfTheEvaluation']
                    console.log(this.showExplain)
                    this.showExplain=true

                }


                this.expalinIDea=this.info['caseWorkerDetails']['caseWorkerOpinionDescription']
                if (this.info['caseWorkerDetails']['totalPoint']){
                    this.showFinal=true
                    this.finalScore=Number(this.info['caseWorkerDetails']['totalPoint'])
                    if (this.finalScore>14){
                        this.Level="الویت اول ";
                        this.color=1;
                        console.log(this.color)
                    } if (this.finalScore>9 && this.finalScore<15){
                        this.Level="الویت دوم"
                        this.color=2
                    } if (this.finalScore>6 && this.finalScore<10){
                        this.Level="الویت سوم "
                        this.color=3
                    }if (this.finalScore>2 && this.finalScore<7){
                        this.Level="الویت چهارم"
                        this.color=4
                    }

                }
                for (let i of this.FinalInterventionSecond ){
                    for (let item of this.info['caseWorkerActions']) {
                        if (item.caseWorkerAction===i.id) {
                            this.FinalArray.push(i)
                            this.ShowFinalInterventionSecond=true


                        }

                    }

                }
                // for (let i of this.FinalInterventionFirst ){
                //     for (let item of this.info['caseWorkerActions']) {
                //         if (item.caseWorkerAction===i.id) {
                //             this.FinalArray.push(i)
                //             this.ShowFinalInterventionFirst=true
                //
                //         }
                //
                //     }
                //
                // }
                // for (let i of this.FinalInterventionThird ){
                //     for (let item of this.info['caseWorkerActions']) {
                //         if (item.caseWorkerAction===i.id) {
                //             this.FinalArray.push(i)
                //             this.ShowFinalInterventionThird=true
                //
                //         }
                //
                //     }
                //
                // }
        this._service.getPatientByID(localStorage.getItem('caseWorkerId')).subscribe(res=>{
            console.log("ressssssssssssss",res)
            this.info2=res

            console.log("uuvdscsdhjcbsdhjcbsdj",this.info2['caseWorkerRand'])
            if(this.info2['caseWorkerRand'].length>0){
                this.dataRand=this.info2['caseWorkerRand']
                for (let i of this.dataRand){
                    const index=this.dataRand.indexOf(i.caseWorkerHighRiskGroupForRand_BasCollection)
                    this.dataRand.splice(index,1)

                }

                console.log(this.dataRand)

                for (let i=0;i<this.info2['caseWorkerRand'].length;i++){
                    console.log("iiiiiiiiiiiii",i)
                    this.containers.push(i)}
                this.ShowRand=false


                // for (let i=0;i<this.info2['caseWorkerRand'].length;i++){
                //     console.log("iiiiiiiiiiiii",i)
                //     this.containers.push(i)
                //
                //     console.log(this.info2['caseWorkerRand'])
                //     this.sendRAndARray=this.info2['caseWorkerRand']
                //     console.log("sendData",this.sendRAndARray)
                //     for ( let item of this.info2['caseWorkerRand']){
                //         let objectSelected=new CaseWorkerRand;
                //         objectSelected.caseWorkerRandID="";
                //         objectSelected.psychologicalStatus=item.psychologicalStatus;
                //         objectSelected.economicStatus=item.economicStatus;
                //         objectSelected.socialDysfunction=item.socialDysfunction;
                //         objectSelected.legalIssues=item.legalIssues;
                //         objectSelected.fewDescription=item.fewDescription;
                //         objectSelected.totalDescription=item.totalDescription;
                //         objectSelected.caseWorkerID= "";
                //         console.log(objectSelected)
                //         for ( let x of this.info2['caseWorkerRand'][i]['caseWorkerHighRiskGroupForRand']) {
                //             console.log("cccc",x)
                //
                //             let obj =new HighRiskDangerRandGroup
                //             obj.caseWorkerHighRiskGroupForRandID="";
                //             obj.caseWorkerRandID="";
                //             obj.highRiskGroup=x.highRiskGroup;
                //             this.arraaaay.push(obj);
                //             // this.arraaaay=this.arraaaay.filter((test,index,array)=>{
                //             //     index===array.findIndex((findTest)=>
                //             //     findTest.highRiskGroup===test.highRiskGroup
                //             //     )
                //             // })
                //             console.log(this.arraaaay)
                //             objectSelected.caseWorkerHighRiskGroupForRand=this.arraaaay
                //
                //         }
                //
                //         this.dataRand.push(objectSelected);
                //         console.log("dataRand",this.dataRand)
                //
                //     }
                //
                // }


            }


            this.FallowProgram=this.info2['caseWorkerDetails']['needPlan']
            this.suggestionAfter=this.info2['caseWorkerDetails']['dischargeRecommendations']
            this.interventionDescription=this.info2['caseWorkerDetails']['interventionDescription']
            if (this.info2['caseWorkerInterventionGroup'].length>0   ){
                this.InterventionArray=this.info2['caseWorkerInterventionGroup']
                for (let i=0;i<this.info2['caseWorkerInterventionGroup'].length;i++){
                    this.InterventionContainer.push(i)

                    // if (this.info2['caseWorkerInterventionGroup'][i]['caseWorkerInterventionTitle'].length>0) {

                        // for ( let x of this.info2['caseWorkerInterventionGroup'][i]['caseWorkerInterventionTitle']) {
                        //         let newObj=new CaseWorkerIntervationTitle;
                        //         newObj.caseWorkerInterventionGroupID="";
                        //         newObj.caseWorkerInterventionTitleID="";
                        //         newObj.interventionTitle=x.interventionTitle;
                        //         this.CaseWorkerIntervationArray.push(newObj)
                        //
                        // }
                    // }
                    // for ( let item of this.info2['caseWorkerInterventionGroup']){
                    //     let selected = new InterventionGroup;
                    //     selected.caseWorkerID="";
                    //     selected.interventionDate=item.interventionDate;
                    //     selected.interventionDescription=item.interventionDescription;
                    //     selected.caseWorkerInterventionGroupID="";
                    //     this.InterventionArray.push( selected);
                    //     console.log("twwwwwwwwwwwwww",this.InterventionArray)
                    //     console.log(this.InterventionArray);
                    //     this.ShowIntervention=false;
                    //     selected.caseWorkerInterventionTitle=this.CaseWorkerIntervationArray;
                    // }
                }
            }
            for (let a=0;a<this.info2['caseWorkerTargetGroup'].length;a++) {
                if (this.info2['caseWorkerTargetGroup'].length>0){
                    this.TargetArray.push(a)

                    for (let i of this.info2['caseWorkerTargetGroup']) {
                        console.log("salam",i);
                        this.id=i.targetGroup1;
                        console.log(this.id);
                        console.log(typeof this.id);

                        this.target2=i.targetGroup2
                        this.code=i.groupCode;
                        this.persent=i.groupPercent
                        this.persentToshow.push(i.groupPercent)
                        this.codeToshoow.push(i.groupCode)
                        const sum = this.persentToshow.reduce((acc, cur) => acc + cur, 0);
                        this.FirstPrsnet=sum
                        console.log(this.FirstPrsnet);
                        if (this.FirstPrsnet>100){
                            this.FirstPrsnet=100
                        }
                        for (let target of this.targetGroupMAin){
                            if (this.id==target.id){
                                console.log(target.value)
                                this.arrayyyyyyyyy.push(target.value);

                            }
                        }
                        if (this.id==='1'){
                            for (let target of this.childAbuse) {
                                if (this.target2==target.id){
                                    console.log(this.target2)
                                }
                            }
                        }    if (this.id==='2'){
                            for (let target of this.Violence) {
                                if (this.target2==target.id){
                                    this.TargetInputValueToShow.push(target.value)
                                    console.log(target.value)
                                }
                            }
                        }  if (this.id==='3'){
                            for (let target of this.sycotik) {
                                if (this.target2==target.id){
                                    this.TargetInputValueToShow.push(target.value)
                                    console.log(target.value)
                                }
                            }
                        } if (this.id==='4'){
                            for (let target of this.parentProblem) {
                                if (this.target2==target.id){
                                    this.TargetInputValueToShow.push(target.value)
                                    console.log(target.value)
                                }
                            }
                        }
                        if (this.id==='5'){
                            for (let target of this.DisorderFamily) {
                                if (this.target2==target.id){
                                    this.TargetInputValueToShow.push(target.value)
                                    console.log(target.value)
                                }
                            }
                        }
                        if (this.id==='6'){
                            for (let target of this.Criticalconditions) {
                                if (this.target2==target.id){
                                    this.TargetInputValueToShow.push(target.value)
                                    console.log(target.value)
                                }
                            }
                        }
                        if (this.id==='7'){
                            for (let target of this.Insurancedocuments) {
                                if (this.target2==target.id){
                                    this.TargetInputValueToShow.push(target.value)
                                    console.log(target.value)
                                }
                            }
                        }
                        if (this.id==='8'){
                            for (let target of this.other) {
                                if (this.target2==target.id){
                                    this.TargetInputValueToShow.push(target.value)
                                    console.log(target.value)
                                }
                            }
                        }if (this.id==='9'){
                            for (let target of this.Acutedisease) {
                                if (this.target2==target.id){
                                    this.TargetInputValueToShow.push(target.value)
                                    console.log(target.value)
                                }
                            }
                        }

                        let obj=new caseWorkerTargetGroup;
                        obj.targetGroup1=this.id;
                        obj.targetGroup2=this.target2;
                        obj.groupCode=i.groupCode;
                        obj.groupPercent=i.groupPercent;
                        obj.caseWorkerTargetGroupID="";
                        obj.caseWorkerID=""
                        this.array1.unshift(obj);
                        console.log(this.array1)
                    }


                }

            }



        })
            }
            console.log("triageLevel",res['triageLevel'])
            this.triageLevel=res['triageLevel']
            console.log('ByID',res)
            
            if (this.triageLevel=="1"){
                this.triageLevelInput="فاقد پاسخدهی";
                this.trigeScore=5;
            }
            if (this.triageLevel=="2"){
                this.triageLevelInput="وضعیت پرخطر"
                this.trigeScore=4;

            }
            if (this.triageLevel=="3"){
                this.triageLevelInput="تعداد تسهیلات مورد نظر 2 یا بیشتر"
                this.trigeScore=3;
            }   if (this.triageLevel=="4"){
                this.triageLevelInput="تعداد تسهیلات مورد نظر1"
                this.trigeScore=2;
            }if (this.triageLevel==="5"){
                this.triageLevelInput="عدم نیاز به تسهیلات"
                this.trigeScore=1;
            }if (this.triageLevel==="0"){
                this.triageLevelInput=""
                this.trigeScore=0;
            }
            console.log(this.trigeScore)
            this.finalScore=this.finalScore+this.trigeScore
            console.log(this.finalScore)
        })
        // this._service.getPatientByID("851").subscribe(res=>{
        //     console.log("851",res)
        // })

  }
    confirmCaseWorker(){
        this._new.ConfirmCaseWorker(this.CaseworkerId).subscribe(res=>{
            this.Confirm=res['resultMessage'];
            Swal.fire(this.Confirm)

            console.log(this.Confirm);


        }, (error)=>{
            this.Confirm="با مشکل مواجه است !!"
            Swal.fire(this.Confirm)
        })
    }
    editCaseWorker(){
        // console.log(this.selectedCityIds);
        // if (this.FinalInterventionArray!=[]){
        //     this.FinalArray.forEach(item=>{
        //         console.log(this.FinalArray)
        //         let customObj2 = new caseWorkerAction;
        //         customObj2.caseWorkerAction=item.id;
        //         customObj2.caseWorkerActionsID="";
        //         customObj2.caseWorkerID="";
        //         this.FinalInterventionArray.push(customObj2)
        //     })
        //
        // }
        // console.log(this.FinalInterventionArray)
        // if (this.selectedCityIds!=[]){
        //     this.selectedCityIds.forEach(item=>{
        //         let dangerGroup=new highRiskGroup;
        //         dangerGroup.highRiskGroup=item.code;
        //         dangerGroup.caseWorkerHighRiskGroupID="";
        //         dangerGroup.caseWorkerID="";
        //         this.dangergroupsNew.push(dangerGroup)
        //         console.log(this.dangergroupsNew)
        //     })
        // }

        console.log(this.day)
        console.log(this.CaseworkerId);
        console.log(typeof this.CaseworkerId)
        console.log(this.today)
        this._edit.editCaseWorker(this.CaseworkerId,
            this.maritalCode,
            this.educationCode
            ,this.JObsCode,
            this.children,
            this.patinetHasRelatieveValue,
            this.relativeName,
            this.relatedTel,
            this.interanceCode,
            this.today,
            this.array1,
            this.ESICode,
            this.InsurancecoverageCode,
            this.EffectiveCompanionCode,
            this.dangergroupsNew,
            this.hasSupportValue,
            this.HelpPersent,
            this.expalinIDea,
            this.FinallParsent,
            this.behdashPersent,
            this.behdashtMoney,
            this.dolatiPersent,
            this.dolatiMoney,
            this.notDolatiPersent,
            this.notDolatiMoney,
            this.kheyriePersent,
            this.kheyrieMoney,
            this.nikPersent,
            this.nikMoney,
            this.suggestionAfter,
            this.hasFllow,
            this.FallowProgram,
            this.FinalInterventionArray,
            this.FinalInterventionID,
            this.interventionDescription,
            this.dataRand,
            this.InterventionArray,
            this.finalScore.toString(),
            this.shortExplain,
            this.relationAttended,
            this.FinalExplain,

        ).subscribe(res=>{
            console.log(res);
            if (res['success']==true){
                Swal.fire('اطلاعات با موفقيت ثبت شد')
            }
            else {
                Swal.fire('با خطا مواجه شدید!!')
            }


        },error1 => {
            Swal.fire('با خطا مواجه شدید!!')
        })
        console.log(this.interventionDescription)


    }}
