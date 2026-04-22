import { Component, inject, signal, computed } from '@angular/core';
import { HousingLocation } from '../housing-location/housing-location';
import { HousingLocationInfo } from '../../models/housing-location-info';
import { LocationService, BASE_URL } from '../../services/location-service';
import { Router } from '@angular/router';

// Define the shape for your ViewModel
export interface HousingLocationInfoViewModel extends HousingLocationInfo {
  selected: boolean;
}

@Component({
  selector: 'app-home',
  imports: [HousingLocation],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  locationService = inject(LocationService);
  router = inject(Router);
  baseUrl = inject(BASE_URL);

  mode = signal<'normal' | 'edit'>('normal');
  selectedIds = signal<Set<number>>(new Set());
  selectionCount = computed(() => this.selectedIds().size);

  // Use 'computed' instead of 'linkedSignal' for derived UI state
  locationToDisplay = computed<HousingLocationInfoViewModel[]>(() => {
    const locations = this.locationService.getAllLocation()();
    const currentSelectedIds = this.selectedIds();

    return locations.map((hl) => ({
      ...hl,
      selected: currentSelectedIds.has(hl.id)
    }));
  });

  handleLocationClick(vm: HousingLocationInfo) {
    console.log(`Home: ${vm.name} is clicked`);

    if (this.mode() === 'normal') {
      // Fix: Passing variable, not string
      this.router.navigate(['details', vm.id]); 
    } else {
      // Toggle selection in the Set
      this.selectedIds.update((prev) => {
        const next = new Set(prev);
        if (next.has(vm.id)) {
          next.delete(vm.id);
        } else {
          next.add(vm.id);
        }
        return next;
      });
    }
  }

  handleCheckbox(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.mode.set(checked ? 'edit' : 'normal');
    if (!checked) {
      this.selectedIds.set(new Set());
    }
  }

  deleteSelected() {
    if (confirm(`Are you sure you want to delete ${this.selectionCount()} items?`)) {
      this.locationService.deleteLocations(this.selectedIds());
      this.selectedIds.set(new Set());
    }
  }

  restoreSelected() {
    this.locationService.restoreLastAction();
  }

  canRestore(): boolean {
    return this.locationService.canRestore();
  }

  handleAddLocation() {
    const aLocation: HousingLocationInfo = {
      id: 0, // Service handles proper ID generation
      name: 'A new home',
      city: 'delhi',
      state: 'India',
      photo: `${this.baseUrl}/saru-robert-9rP3mxf8qWI-unsplash.jpg`,
      availableUnits: 10,
      wifi: false,
      laundry: false,
    };
    this.locationService.addLocation(aLocation);
  }
}