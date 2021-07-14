import { Component, OnInit } from '@angular/core';
import { TeriazhListService} from './../../../services/teriazh-list.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiConfigService} from "../../../services/apiConfig/api-config.service";


@Component({
  selector: 'app-teriazh-list',
  templateUrl: './teriazh-list.component.html',
  styleUrls: ['./teriazh-list.component.scss']
})
export class TeriazhListComponent implements OnInit {
  teriazhList:any[];
  id1='';
  idLoc="";
  constructor(
    private _list:TeriazhListService,
    private route: ActivatedRoute,
    private router: Router,
    private  i:ApiConfigService,
  ) {
    this._list.seturl(this.i.config.API_URL);
  }

  ngOnInit() {
    this._list.getTeriazhLoc().subscribe(res=>{
      this.teriazhList=res,
    console.log(this.teriazhList)})
      
  }
  getID(value: string) {
    this.id1 = value;
    this._list.postCurrentLoc(this.id1).subscribe(res =>{
      this.idLoc=res
      console.log(this.idLoc);
      
    });
    localStorage.setItem('locationID',this.id1);
    this.router.navigate(['/teriazh/Patient-Triage']);

}


}
