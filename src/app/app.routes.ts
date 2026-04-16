// import { Routes } from '@angular/router';
// import {Home} from '@components/home/home';
// import {LocationDetails} from '@components/location-details/location-details'
// export const routes: Routes = [
//   {
//     path: '',
//     component: Home,
//     title: 'Home page',
//   },
//   {
//     path: 'details/:id',
//     component: LocationDetails,
//     title: 'Home details',
//   },
// ];

// //export default routeConfig;

import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { LocationDetails } from './components/location-details/location-details';
import { Counter } from './components/counter/counter';

export const routes: Routes = [
  {
    path: '',
    component: Home,
    title: 'Home page',
  },
  {
    path: 'details/:id',
    component: LocationDetails,
    title: 'Home details',
  },
  {
    path: 'counter',
    component: Counter,
    title: "Counter"
  }
];