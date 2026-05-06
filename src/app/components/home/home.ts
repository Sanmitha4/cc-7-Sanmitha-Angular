import { Component, inject, signal, computed, linkedSignal } from '@angular/core';
import { Router, RouterOutlet, ActivatedRoute } from '@angular/router';
import { Subject, switchMap, startWith } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

import { HousingLocation } from '../housing-location/housing-location';
import { SearchBarComponent } from '../search-bar/search-bar';
import { LocationService, BASE_URL } from '../../services/location-service';
import { HousingLocationInfo, HousingLocationInfoViewModel } from '../../models/housing-location-info';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SearchBarComponent, HousingLocation, RouterOutlet],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private readonly locationService = inject(LocationService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly baseUrl = inject(BASE_URL);

  // --- 1. SEARCH LOGIC ---
  private readonly searchTerms$ = new Subject<string>();

  // This signal updates whenever the API returns new search results
  private readonly rawLocations = toSignal(
    this.searchTerms$.pipe(
      startWith(''), 
      switchMap(term => this.locationService.searchLocationsByCity(term))
    ),
    { initialValue: [] }
  );

  onSearch(term: string) {
    this.searchTerms$.next(term);
  }

  // --- 2. SELECTION & DISPLAY LOGIC ---
  mode = signal<'normal' | 'edit'>('normal');
  selectedIds = signal<Set<number>>(new Set());
  selectionCount = computed(() => this.selectedIds().size);

  // We use the rawLocations() signal as the SOURCE here
  locationsToDisplay = linkedSignal<HousingLocationInfo[], HousingLocationInfoViewModel[]>({
    source: () => this.rawLocations(), // Whenever search results change, this re-runs

    computation: (newLocations, prevValue) => {
      const prevViewModels = (prevValue?.value as HousingLocationInfoViewModel[]) ?? [];
      
      return newLocations.map((hl) => {
        const matched = prevViewModels.find(p => p.id === hl.id);
        return {
          ...hl,
          selected: matched?.selected ?? false,
        };
      });
    },
  });

  // --- 3. EVENT HANDLERS (Keep your existing ones) ---
  handleLocationClick(housingLocationInfo: HousingLocationInfo) {
    if (this.mode() === 'normal') {
      this.router.navigate(['details', housingLocationInfo.id]);
      // Reset selections on navigate
      this.locationsToDisplay.set(this.locationsToDisplay().map(vm => ({...vm, selected: false})));
      this.selectedIds.set(new Set());
    } else {
      const nextSelectedIds = new Set(this.selectedIds());
      nextSelectedIds.has(housingLocationInfo.id) 
        ? nextSelectedIds.delete(housingLocationInfo.id) 
        : nextSelectedIds.add(housingLocationInfo.id);

      this.selectedIds.set(nextSelectedIds);

      // Update the view model signal
      this.locationsToDisplay.set(
        this.locationsToDisplay().map(vm => 
          vm.id === housingLocationInfo.id ? { ...vm, selected: nextSelectedIds.has(vm.id) } : vm
        )
      );
    }
  }

  handleCheckbox(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.mode.set(checked ? 'edit' : 'normal');
    if (!checked) this.selectedIds.set(new Set());
  }

  deleteSelected() {
    if (confirm(`Are you sure you want to delete ${this.selectionCount()} items?`)) {
      this.locationService.deleteLocations(this.selectedIds());
      this.selectedIds.set(new Set());
    }
  }

  restoreSelected() { this.locationService.restoreLastAction(); }
  canRestore(): boolean { return this.locationService.canRestore(); }
  handleAddLocation() { this.router.navigate(['edit'], { relativeTo: this.activatedRoute }); }
}