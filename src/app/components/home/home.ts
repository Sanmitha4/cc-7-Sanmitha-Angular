import { Component, inject, signal, computed, linkedSignal } from '@angular/core';
import { Router, RouterOutlet, ActivatedRoute } from '@angular/router';
import { Subject, switchMap, startWith, combineLatest, debounceTime } from 'rxjs';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';

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

  private readonly searchTerms$ = new Subject<string>();

  /*combine the search term with a 'Live' observable of the service data.
   */
  private readonly rawLocations = toSignal(
    combineLatest([   //[Housingloactions,terms]
      toObservable(this.locationService.locations), // Listen for Add/Delete/Update
      this.searchTerms$.pipe(startWith(''),debounceTime(300))         // Listen for Search typing
    ]).pipe(
      // Whenever either changes, re-run the search/filter logic
      switchMap(([_, term]) => this.locationService.searchLocationsByCity(term))
    ),
    { initialValue: [] }
  );

  onSearch(term: string) {
    this.searchTerms$.next(term);
  }

  mode = signal<'normal' | 'edit'>('normal');
  selectedIds = signal<Set<number>>(new Set());
  selectionCount = computed(() => this.selectedIds().size);

  // linkedSignal ensures that even if the search results change, 
  // we can still manually toggle 'selected' status in Edit mode.
  locationsToDisplay = linkedSignal<HousingLocationInfo[], HousingLocationInfoViewModel[]>({
    source: () => this.rawLocations() ?? [], 

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

  // --- 3. EVENT HANDLERS ---
  handleLocationClick(housingLocationInfo: HousingLocationInfo) {
    if (this.mode() === 'normal') {
      this.router.navigate(['details', housingLocationInfo.id]);
      
      // Clear selections on navigation
      this.locationsToDisplay.set(this.locationsToDisplay().map(vm => ({...vm, selected: false})));
      this.selectedIds.set(new Set());
    } else {
      // Toggle selection in Edit mode
      const nextSelectedIds = new Set(this.selectedIds());
      if (nextSelectedIds.has(housingLocationInfo.id)) {
        nextSelectedIds.delete(housingLocationInfo.id);
      } else {
        nextSelectedIds.add(housingLocationInfo.id);
      }

      this.selectedIds.set(nextSelectedIds);

      // Update the view model signal directly to show the checkmark immediately
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
    if (!checked) {
      this.selectedIds.set(new Set());
      // Reset visual checkmarks
      this.locationsToDisplay.set(this.locationsToDisplay().map(vm => ({...vm, selected: false})));
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
    // Navigates to the child route which triggers the LocationForm side panel
    this.router.navigate(['edit'], { relativeTo: this.activatedRoute });
  }
}