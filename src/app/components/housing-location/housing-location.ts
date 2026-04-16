import { Component, input, output } from '@angular/core';
import { HousingLocationInfo } from '../../models/housing-location-info';
import { LocationService } from '../../services/location-service';

@Component({
  selector: 'app-housing-location',
  templateUrl: './housing-location.html',
  styleUrls: ['./housing-location.css'],
  
})
export class HousingLocation {
  housingLocation = input.required<HousingLocationInfo>();
  onLocationClick =output<HousingLocationInfo>();
  locationService=inject(LocationService);

  handleButtonClick(event:MouseEvent){
    console.log(`${this.housingLocation().name} is clicked`);
    this.onLocationClick.emit(this.housingLocation());
  }
}