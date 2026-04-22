import { Component, inject, signal, computed, linkedSignal } from '@angular/core';
import { HousingLocation } from '../housing-location/housing-location';
import { HousingLocationInfo } from '../../models/housing-location-info';
import { LocationService } from '../../services/location-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [HousingLocation],
  templateUrl: './home.html',
  styleUrl: './home.css',
  //providers:[{LocationService}],
})
export class Home {
  locationService: LocationService = inject(LocationService);
  router = inject(Router);

  mode = signal<'normal' | 'edit'>('normal');


  // modeString=computed(()=>
  //   this.mode()==='edit'?'Selct items':'Click on a card to see details')

  selectedIds = signal<Set<number>>(new Set());
  selectionCount = computed(() => this.selectedIds().size);
//location ServiceDisplay=linkedSignal<Ho
  


  handleLocationClick(housingLocationInfo: HousingLocationInfo) {
    if (this.mode() === 'normal') {
      this.router.navigate(['details', housingLocationInfo.id]);
    } else {
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
    }
    // GOOD: If you want to compute new value based on its previous value
    //mode.update.this(prev => prev === "normal" ? 'edit' : "normal")
    // BAD
    //this.mode.set(this.mode() === "normal" ? 'edit' : "normal")
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
}



//ngOnInit() {
//     console.log("home instanciated")
//   }

//   ngOnDestroy() {
//     console.log("destro")
//   }
