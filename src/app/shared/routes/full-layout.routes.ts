import { Routes, RouterModule } from '@angular/router';

//Route for content layout with sidebar, navbar and footer.

export const Full_ROUTES: Routes = [

  {
    path: 'pages',
    loadChildren: () => import('../../pages/full-pages/full-pages.module').then(m => m.FullPagesModule)
  },
  {
    path: 'teriazh',
    loadChildren: () => import('../../teriazh/teriazh.module').then(m => m.TeriazhModule)
  },
 {
        path: 'Help',
        loadChildren: () => import('../../help/help.module').then(m => m.HelpModule)
},


];
