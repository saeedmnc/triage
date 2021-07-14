import { RouteInfo } from './sidebar.metadata';

//Sidebar menu Routes and data
export const ROUTES: RouteInfo[] = [
    {
        path: '', title: 'teriazh', icon: 'ft-home', class: 'has-sub', badge: '', badgeClass: 'badge badge-pill badge-danger float-right mr-1 mt-1', isExternalLink: false, submenu: [
            { path: '/teriazh/Patient-Triage', title: 'newTeriazh', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
            { path: '/teriazh/patientList', title: 'patientList', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
            { path: '/teriazh/Search', title: 'searchPatient', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },

        ]
    },
    {
        path: '', title: 'Help', icon: 'ft-list', class: 'has-sub', badge: '', badgeClass: 'badge badge-pill badge-danger float-right mr-1 mt-1', isExternalLink: false, submenu: [
            { path: '/Help/Patient-List', title: 'Patient List', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
            // { path: '/teriazh/patientList', title: 'patientList', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
            // { path: '/teriazh/page1', title: 'searchPatient', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },

        ]
    },

    
 
    
];
