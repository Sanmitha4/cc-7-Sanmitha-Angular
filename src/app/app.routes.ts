import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { LocationDetails } from './components/location-details/location-details';
import { Counter } from './components/counter/counter';
import { LinkedSignalDemo } from '@components/linked-signal-demo/linked-signal-demo';
import { FormsDemo } from '@components/forms-demo/forms-demo';

export const routes: Routes = [
  {
    path:'',
    redirectTo:'home',
    pathMatch:'full',

  },
  {
    path: '',
    component: Home,
    title: 'LocationHome',
    children:[{
      path:'edit',
      component: FormsDemo,
      title:'Home Location'
    }]
  },
  {
    path: 'details/:id',
    //component: LocationDetails,
    loadComponent:()=>import('./components/location-details/location-details').then((m)=>m.LocationDetails),
    title: 'Home details',
  },
  
  {
    path: 'linked-signals',
    component:LinkedSignalDemo,
    title: 'Linked signal demo',
  },
  {
    path: 'counter',
    component: Counter,
    title: "Counter",
  },
  {
    path: 'forms',
    component: FormsDemo,
    title: "FormsDemo"
  }
];
//export default routeConfig;