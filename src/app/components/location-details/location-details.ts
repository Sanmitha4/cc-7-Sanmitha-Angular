
import { Component, inject, signal, computed } from '@angular/core';
import { Injectable, InjectionToken } from '@angular/core';
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
  route: ActivatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  //id=input.required<number>();
  locationService: LocationService = inject(LocationService);
  location: HousingLocationInfo | undefined;

  housingLocationId = signal<number>(-1);
 

  isFirst = computed(() => this.housingLocationId() === 0);

  isLast = computed(() => {
    const total = this.locationService.getAllLocation().length;
    return this.housingLocationId() === total - 1;
  });

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.housingLocationId.set(Number(params['id']));
      this.location = this.locationService.getLocationForId(this.housingLocationId());
    });
  }
  ngAfterViewInit() {
    console.log('Component is now rendered');
  }

  handlePrev() {
    if (!this.isFirst()) {
      this.router.navigate(['details', this.housingLocationId() - 1]);
    }
  }

  handleNext() {
    if (!this.isLast()) {
      this.router.navigate(['details', this.housingLocationId() + 1]);
    }
  }
  //console.log(housingLocationInfo);
  static count = 0;
}
