import { Component, OnInit } from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {CaseWorkerListService} from "./../../services/Case-worker/Case-woeker-patientList/case-worker-list.service";
import { EnumServiesService} from "./../../services/Case-worker/Enum/enum-servies.service"
import {Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ApiConfigService} from "../../services/apiConfig/api-config.service";


@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.scss']
})
export class PatientListComponent implements OnInit {
    patientList:any[];
    StatueList:any[];
    caseWorkerId:any;
    nationalCode="";
    filterForm: FormGroup;
    patientID="";
    startDate=""
    endDate=""
    //......date.....................
    persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g];
    arabicNumbers  = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g];
    today = new Date().toLocaleDateString('fa-IR');
    date: Date;
    tomarrow:any;
  constructor(private modalService: NgbModal,
              private _service:CaseWorkerListService,
              private _Enum:EnumServiesService,
              private router: Router,
              private  i:ApiConfigService,) {


      this._service.seturl(this.i.config.API_URL);
  }

    fixNumbers = function (str:any)
    {
        if(typeof str === 'string')
        {
            for(var i=0; i<10; i++)
            {
                str = str.replace(this.persianNumbers[i], i).replace(this.arabicNumbers[i], i);
            }
        }
        return str;
    };
    GetDetails(content ) {
        this.modalService.open(content, { size: 'lg' ,backdrop:'static',keyboard  : false}).result.then((result) => {
        }, (reason) => {
        });


    }
    getId(id){
      this.caseWorkerId=id;
        localStorage.setItem('caseWorkerId',id);
        this.router.navigate(['/Help/Patient-Info', this.caseWorkerId]);
    }
    onSubmit(){
      console.log(this.filterForm.value);
      this.endDate=this.filterForm.value.endDate;
      this.nationalCode=this.filterForm.value.nationalCode;
      this.patientID=this.filterForm.value.patinetID;
      this.startDate=this.filterForm.value.startDate
      this._service.postPatient(this.nationalCode,this.patientID, this.startDate,this.endDate).subscribe(res=>{
          this.patientList=res;
      })
        this.modalService.dismissAll()
    }

  ngOnInit() {
      this.date = new Date();
      this.date.setDate( this.date.getDate() + 1 );
      console.log(this.date)


      this.tomarrow=this.date.toLocaleDateString('fa-IR');
      this.today=this.fixNumbers(this.today)
      this.tomarrow=this.fixNumbers(this.tomarrow)
      console.log('day',this.today)
      console.log('tommarrow',this.tomarrow)
      this._service.getDayPatient(this.today,this.tomarrow).subscribe(res=>{
          console.log(res)
          this.patientList=res
          console.log(this.patientList)
      })

      // this._service.postPatient(this.nationalCode,this.patientID, this.startDate).subscribe(res=>{
      //     this.patientList=res;
      //     console.log(res)
      // })
      this._Enum.GetCaseWorkerStatusList().subscribe(res=>{
              this.StatueList=res;

          }
          )
        this.filterForm = new FormGroup({
            'nationalCode':new FormControl(''),
            'patinetID':new FormControl(''),
            'startDate':new FormControl(''),
            'endDate':new FormControl('')
      });


  }

}
