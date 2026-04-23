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

  handleLocationClick(housingLocationInfo: HousingLocationInfo) {
    console.log(`Home:${housingLocationInfo}is clicked`);

    if (this.mode() === 'normal') {
      this.router.navigate(['details', housingLocationInfo.id]);
      const viewModels = this.locationsToDisplay().map((vm) => {
        const newVm = { ...vm };
        newVm.selected = false;
        return newVm;
      });
      this.locationsToDisplay.set(viewModels);
      this.selectedIds.set(new Set());
    } else {
      const nextSelectedIds = new Set(this.selectedIds());

      if (nextSelectedIds.has(housingLocationInfo.id)) {
        nextSelectedIds.delete(housingLocationInfo.id);
      } else {
        nextSelectedIds.add(housingLocationInfo.id);
      }

      this.selectedIds.set(nextSelectedIds);

      const viewModel = this.locationsToDisplay().map((vm) =>
        vm.id === housingLocationInfo.id ? { ...vm, selected: nextSelectedIds.has(vm.id) } : vm,
      );

      this.locationsToDisplay.set(viewModel);
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
    
    this.router.navigate(['edit'], { relativeTo: this.activatedRoute });
  }
}
