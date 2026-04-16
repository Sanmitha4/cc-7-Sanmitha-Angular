import {Component,inject, signal} from '@angular/core';
import { HousingLocation} from '@components/housing-location/housing-location';
import { HousingLocationInfo } from '../../models/housing-location-info';
import {LocationService} from '../../services/location-service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [HousingLocation],
  templateUrl: './home.html',
  styleUrl: './home.css',
  //providers:[{LocationService}],
})
export class Home {
  locationService:LocationService=inject(LocationService);
  router=inject(Router);
  mode=signal<'normal'|'edit'>('normal');

  handleLocationClick(housingLocationInfo:HousingLocationInfo){
    console.log(`Home:${housingLocationInfo.name}is clicked`);
    this.router.navigate(['details',housingLocationInfo.id])
  }
  
  handleCheckBox(event:Event){
    console.log('Checked is clicked',(event.target as HTMLInputElement).checked)
    this.mode.update(prev=>prev==='normal'?'edit':'normal');
  }
  handleCountUpdate(count: number) {
    console.log('Current selection count:', count);
  }
  // handleLocationClick(location: HousingLocationInfo) {
  //   const otherItems = this.housingLocationList.filter(item => item.id !== location.id);
  //   this.housingLocationList = [location, ...otherItems];
  //   console.log(`${location.name} moved to top `);
  // // }
}

  // handleLocationClick(location: HousingLocationInfo) {
  // const index = this.housingLocationList.findIndex(item => item.id === location.id);
  // if (index !== -1) {
  //   const removedItems = this.housingLocationList.splice(index, 1);
  //   const clickedItem=removedItems[0];

  //   this.housingLocationList.unshift(clickedItem);
  //   console.log(`${clickedItem.name} moved to top`);
  // }

// // housingLocationList: any;
// handleLocationClick(location: HousingLocationInfo){
//   console.log(`${location.name} was clicked`);
// }
