import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { AdmissionKindListService} from '../../services/admission-kind-list.service'

@Component({
  selector: 'app-page3',
  templateUrl: './page3.component.html',
  styleUrls: ['./page3.component.scss']
})
export class Page3Component implements OnInit {
  options:any[];
  searchText="";


 


  constructor( private _service:AdmissionKindListService) { }

  ngOnInit() {
  
    this._service.getAdmissionKindList().subscribe(res=>{
      this.options=res
      
    })
      
  }
 

}
