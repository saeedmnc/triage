import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {Page1Component} from "./page1/page1.component";
import {Page2Component} from "./page2/page2.component";
import {Page3Component} from "./page3/page3.component";
import {Page4Component} from "./page4/page4.component";
import {Page5Component} from "./page5/page5.component";
import {Page6Component} from "./page6/page6.component";
import {Page7Component} from "./page7/page7.component";
import {Page8Component} from "./page8/page8.component";
import { PatientListComponent} from "./patient-list/patient-list.component";
import{PrintAllComponent} from "./print-all/print-all.component";
import { ShowInfoComponent} from "./show-info/show-info.component";



const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'Search',
        component:Page1Component ,
        data: {
          title: 'Page First'
        }
      },
      {
        path: 'Patient-Triage',
        component:Page2Component ,
        data: {
          title: 'Page Second'
        }
      },
      {
        path: 'page3',
        component:Page3Component ,
        data: {
          title: 'Page Third'
        }
      },
      {
        path: 'Triage-level-1',
        component:Page4Component ,
        data: {
          title: 'Page Fourth'
        }
      },
      {
        path: 'Triage-level-2',
        component:Page5Component ,
        data: {
          title: 'Page Fifth'
        }
      },
      {
        path: 'Triage-level-5',
        component:Page6Component ,
        data: {
          title: 'Page Sixth'
        }
      },
      {
        path: 'Triage-level-4',
        component:Page7Component ,
        data: {
          title: 'Page Seventh'
        }
      },
      {
        path: 'Triage-level-3',
        component:Page8Component ,
        data: {
          title: 'Page Eighth'
        }
      },
      {
        path: 'patientList',
        component:PatientListComponent ,
        data: {
          title: 'Patient List '
        }
      },
      {
        path: 'triagePrint',
        component:PrintAllComponent ,
        data: {
          title: 'triage Print '
        }
      },
      {
        path: 'showInfo/:id',
        component:ShowInfoComponent ,
        data: {
          title: 'Show Info '
        }
      },


    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeriazhRoutingModule { }
