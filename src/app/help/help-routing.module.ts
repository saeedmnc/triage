import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PatientListComponent} from  "./../help/patient-list/patient-list.component";
import { PatientInfoComponent} from  "./../help/patient-info/patient-info.component";
import { PrintComponent } from "./../help/print/print.component"



const routes: Routes = [
    {
      path:'',
        children:[
            {
              path:'Patient-List',
                component:PatientListComponent,
                data: {
                    title: 'Patient List'
                }
            },
            {
                path:'Patient-Info/:id',
                component:PatientInfoComponent,
                data: {
                    title: 'Patient Info'
                }
            },
            {
              path:'print',
              component:PrintComponent,
              data: {
                  title: 'print'
              }
          }

        ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HelpRoutingModule { }
