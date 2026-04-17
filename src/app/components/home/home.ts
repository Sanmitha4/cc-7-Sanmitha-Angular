import { Component, inject, signal ,computed} from '@angular/core';
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
  selectedIds = signal<Set<number>>(new Set());

  selectionCount = computed(() => this.selectedIds().size);
  hasSelection = computed(() => this.selectedIds().size > 0);

  


  handleLocationClick(housingLocationInfo: HousingLocationInfo) {
    if (this.mode() === 'normal') {
      this.router.navigate(['details', housingLocationInfo.id]);
    } else {
      this.selectedIds.update(prev => {
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
  //ngOnInit() {
//     console.log("home instanciated")
//   }

//   ngOnDestroy() {
//     console.log("destro")
//   }
}