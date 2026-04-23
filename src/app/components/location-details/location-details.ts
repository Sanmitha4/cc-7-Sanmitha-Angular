import { Component, inject, signal, computed } from '@angular/core';
import { Injectable, InjectionToken } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { LocationService } from '../../services/location-service';
import { HousingLocationInfo } from '../../models/housing-location-info';

@Component({
  selector: 'app-location-details',
  imports: [RouterOutlet],
  templateUrl: './location-details.html',
  styleUrl: './location-details.css',
})
export class LocationDetails {
  route: ActivatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  //id=input.required<number>();
  locationService: LocationService = inject(LocationService);
  locations = this.locationService.getAllLocation();
  location: HousingLocationInfo | undefined;

  housingLocationId = signal<number>(-1);

  isFirst = computed(() => this.housingLocationId() === 0);

  isLast = computed(() => {
    const locations = this.locations();
    const lastLocation = locations[locations.length - 1];
    return this.housingLocationId() === (lastLocation?.id ?? -1);
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

  handleEdit() {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }
  //console.log(housingLocationInfo);
  static count = 0;
}
