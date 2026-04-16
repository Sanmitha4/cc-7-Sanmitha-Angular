import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HousingLocationInfo } from '../../models/housing-location-info';
import { LocationService } from '../../services/location-service';

@Component({
  selector: 'app-location-details',
  imports: [],
  templateUrl: './location-details.html',
  styleUrl: './location-details.css',
})
export class LocationDetails {
  // we need to be able to read the id of the location from window location
  //for that angular can provide us the activated route object and from it we can get the dynamic param from the url
  route:ActivatedRoute=inject(ActivatedRoute);
  housingLocationId=-1;

  locationService:LocationService=inject(LocationService);
  location:HousingLocationInfo|undefined;

  constructor(){
    this.housingLocationId=Number(this.route.snapshot.params["id"]);
    console.log('The id of the location:',this.housingLocationId);

    this.location=this.locationService.getLocationForId(this.housingLocationId)


  }
}
