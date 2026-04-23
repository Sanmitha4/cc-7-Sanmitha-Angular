import { Component, inject, signal, computed, linkedSignal } from '@angular/core';
import { HousingLocation } from '../housing-location/housing-location';
import { HousingLocationInfo } from '../../models/housing-location-info';
import { LocationService, BASE_URL } from '../../services/location-service';
import { Router } from '@angular/router';
import { HousingLocationInfoViewModel } from '../../models/housing-location-info';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [HousingLocation, ReactiveFormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
  //providers:[{LocationService}],
})
export class Home {
  locationService: LocationService = inject(LocationService);
  router = inject(Router);
  baseUrl: string = inject(BASE_URL);
  formBuilder = inject(FormBuilder);

  mode = signal<'normal' | 'edit'>('normal');
  modeString = computed(() =>
    this.mode() === 'edit' ? 'Select items' : 'Click on a card to see details',
  );

  selectedIds = signal<Set<number>>(new Set());
  selectionCount = computed(() => this.selectedIds().size);

  showAddForm = signal(false);

  addLocationForm = this.formBuilder.group({
    name: ['', Validators.required],
    city: ['', Validators.required],
    state: ['', Validators.required],
    availableUnits: [0, [Validators.required, Validators.min(0)]],
    wifi: [false],
    laundry: [false],
  });

  locationsToDisplay = linkedSignal<HousingLocationInfo[], HousingLocationInfoViewModel[]>({
    source: this.locationService.getAllLocation(),

    computation: (newDependencyHouseLocationsInfoArray, prevValue) => {
      const prevLocationViewModels = (prevValue?.value as HousingLocationInfoViewModel[]) ?? [];
      const viewLocation = newDependencyHouseLocationsInfoArray.map((hl) => {
        const matchedModel = prevLocationViewModels.find(
          (prevLocation) => prevLocation.id === hl.id,
        );
        return {
          ...hl,
          selected: matchedModel?.selected ?? false,
        };
      });
      return viewLocation;
    },
  });

  handleLocationClick(housingLocationInfo: HousingLocationInfoViewModel) {
    console.log(`Home:${housingLocationInfo}is clicked`);

    if (this.mode() === 'normal') {
      this.router.navigate(['details', housingLocationInfo.id]);
      const viewModels = this.locationsToDisplay().map((vm) => {
        const newVm = { ...vm };
        newVm.selected = false;
        return newVm;
      });
      this.locationsToDisplay.set(viewModels);
    } else {
      const viewModels = this.locationsToDisplay().map((vm) => {
        if (vm.id === housingLocationInfo.id) {
          const newVm = { ...vm };
          newVm.selected = !newVm.selected;
          return newVm;
        }
        return vm;
      });
      this.locationsToDisplay.set(viewModels);

      this.selectedIds.update((prev) => {
        const next = new Set(prev);
        if (next.has(housingLocationInfo.id)) {
          next.delete(housingLocationInfo.id);
        } else {
          next.add(housingLocationInfo.id);
        }
        return next;
      });
    }
  }

  isSelected(id: number): boolean {
    return this.selectedIds().has(id);
  }

  handleCheckbox(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.mode.set(checked ? 'edit' : 'normal');
    if (!checked) {
      this.selectedIds.set(new Set());
      const viewModels = this.locationsToDisplay().map((vm) => ({ ...vm, selected: false }));
      this.locationsToDisplay.set(viewModels);
    }
  }

  deleteSelected() {
    const count = this.selectionCount();
    if (confirm(`Are you sure you want to delete ${count} items?`)) {
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
    this.showAddForm.set(true);
  }

  submitAddLocation() {
    if (this.addLocationForm.valid) {
      const formValue = this.addLocationForm.value;
      const aLocation = {
        id: 0,
        name: formValue.name ?? '',
        city: formValue.city ?? '',
        state: formValue.state ?? '',
        photo: `${this.baseUrl}/saru-robert-9rP3mxf8qWI-unsplash.jpg`,
        availableUnits: formValue.availableUnits ?? 0,
        wifi: formValue.wifi ?? false,
        laundry: formValue.laundry ?? false,
      };
      this.locationService.addLocation(aLocation);
      this.addLocationForm.reset({ availableUnits: 0, wifi: false, laundry: false });
      this.showAddForm.set(false);
    }
  }

  cancelAddLocation() {
    this.addLocationForm.reset({ availableUnits: 0, wifi: false, laundry: false });
    this.showAddForm.set(false);
  }
}
