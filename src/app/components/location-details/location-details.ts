import { Injectable,InjectionToken } from '@angular/core';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocationService } from '../../services/location-service';
import { HousingLocationInfo } from '../../models/housing-location-info';
@Component({
  selector: 'app-location-details',
  imports: [],
  templateUrl: './location-details.html',
  styleUrl: './location-details.css',
})
export class LocationDetails {
// we need to be able to read the id of the location from window location
// for that angular can provide us the activated route object and from it we can get the dynamic param from the url

  route: ActivatedRoute = inject(ActivatedRoute);
  housingLocationId = -1;

  locationService: LocationService = inject(LocationService);

  location: HousingLocationInfo | undefined;

  router = inject(Router);
  
  constructor() {
    // this.housingLocationId = Number(this.route.snapshot.params['id']);
    // console.log("ID of the location: ",this.housingLocationId)
    // this.location = this.locationService.getLocationForId(this.housingLocationId)
    // LocationDetails.count++;
    // console.log("Number of instances: ", LocationDetails.count)
    
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.housingLocationId = Number(params['id']);
      this.location = this.locationService.getLocationForId(this.housingLocationId);
    });

    LocationDetails.count++;
    console.log("Number of instances: ", LocationDetails.count);
  }

  ngAfterViewInit() {
    console.log("Component is now rendered")
  }

  ngOnDestroy() {
    console.log("On Destroyed")
    LocationDetails.count--;
  }

  handlePrev(housingLocationInfo: HousingLocationInfo | undefined) {
    if(housingLocationInfo && housingLocationInfo.id >= 0) {
      const prevId = housingLocationInfo.id - 1;
      if(prevId >= 0) {
        this.router.navigate(['details', prevId])
        console.log("details/",prevId)
      }
    }
    console.log(housingLocationInfo)
  }

  handleNext(housingLocationInfo: HousingLocationInfo | undefined) {
    if(housingLocationInfo) {
      const nextId = housingLocationInfo.id + 1;
      if(nextId < this.locationService.getAllLocation().length) {
        this.router.navigate(['details', nextId])
        console.log("details/", nextId)
      }
    }
    console.log(housingLocationInfo)
  }
  //ngOnDestroy() {
//     console.log('LocationDetails is destroyed');
//     LocationDetails.count -= 1;
//   }

  static count = 0;

}