import { Component, inject, signal, computed, linkedSignal } from '@angular/core';
import { HousingLocation } from '../housing-location/housing-location';
import { HousingLocationInfo } from '../../models/housing-location-info';
import { LocationService, BASE_URL } from '../../services/location-service';
import { Router, RouterOutlet, ActivatedRoute } from '@angular/router';
import { HousingLocationInfoViewModel } from '../../models/housing-location-info';
import { FormsDemo } from '@components/forms-demo/forms-demo';

@Component({
  selector: 'app-home',
  imports: [HousingLocation, RouterOutlet],
  templateUrl: './home.html',
  styleUrl: './home.css',
  //providers:[{LocationService}],
})
export class Home {
  locationService: LocationService = inject(LocationService);

  activatedRoute = inject(ActivatedRoute);

  router = inject(Router);
  baseUrl: string = inject(BASE_URL);

  mode = signal<'normal' | 'edit'>('normal');
  modeString = computed(() =>
    this.mode() === 'edit' ? 'Select items' : 'Click on a card to see details',
  );

  selectedIds = signal<Set<number>>(new Set());
  selectionCount = computed(() => this.selectedIds().size);

  // locationToDisplay=linkedSignal<HousingLocationInfoViewModel[]>(()=>{
  // const locationsSignal=this.locationService.getAllLocation();
  // const viewLocations=locationsSignal().map((hl)=>{
  //   return{...hl,selected:false}
  // });
  // return viewLocations});

  //we should derive the value of locationsToDisplay by accounting the current values of 'selected'attributes too
  //check if this loaction is already in selected state.
  //we can figure that out by finding the model in the prev location models,and use that models's selected value, and set it to the new model we are creating

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
    // console.log(housingLocationInfo);

    if (this.mode() === 'normal') {
      this.router.navigate(['details', 'housingLocationInfo.id']);
      const viewModels = this.locationsToDisplay().map((vm) => {
        const newVm = { ...vm };
        newVm.selected = false;
        return newVm;
      });
      this.locationsToDisplay.set(viewModels);
    } else {
      const viewModel = this.locationsToDisplay().map((vm) => {
        if (vm.id === housingLocationInfo.id) {
          const newVm = { ...vm };
          newVm.selected = !newVm.selected;
          return newVm;
        }
        return vm;
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
    // const aLocation = {
    //   id: 0,
    //   name: 'A new home',
    //   city: 'delhi',
    //   state: 'India',
    //   photo: `${this.baseUrl}/saru-robert-9rP3mxf8qWI-unsplash.jpg`,
    //   availableUnits: 10,
    //   wifi: false,
    //   laundry: false,
    // };
    // this.locationService.addLocation(aLocation);
    this.router.navigate(['edit'], { relativeTo: this.activatedRoute });
  }
}
