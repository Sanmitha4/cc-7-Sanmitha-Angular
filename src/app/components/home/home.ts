import {Component} from '@angular/core';
import { HousingLocation} from '@components/housing-location/housing-location';
import { HousingLocationInfo } from '../../models/housing-location-info';
import { Counter } from '@components/counter/counter';
import {LocationService} from '../../services/location-service'

@Component({
  selector: 'app-home',
  imports: [HousingLocation,Counter],
  templateUrl: './home.html',
  styleUrl: './home.css',
  providers:[{LocationService}],
})
export class Home {
  locationService:LocationService=inject(LocationService)
  
  handleCountUpdate(count: number) {
    console.log('Current selection count:', count);
  }
  handleLocationClick(location: HousingLocationInfo) {
    const otherItems = this.housingLocationList.filter(item => item.id !== location.id);
    this.housingLocationList = [location, ...otherItems];
    console.log(`${location.name} moved to top `);
  // }
}
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
