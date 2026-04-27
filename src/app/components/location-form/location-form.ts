import { Component, signal, inject, viewChild, computed, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsDemo } from '../forms-demo/forms-demo';
import { LocationService } from '../../services/location-service';
import { HousingLocationInfo } from '../../models/housing-location-info';
import { hidden } from '@angular/forms/signals';
import { CdkTrapFocus } from '@angular/cdk/a11y';
@Component({
  selector: 'app-location-form',
  standalone: true,
  imports: [FormsDemo, CdkTrapFocus],
  templateUrl: './location-form.html',
  styleUrl: './location-form.css',
  host: {
    '(document:keydown.escape)': 'handleEscape()',
  },
})
export class LocationForm {
  shouldShowPanel = signal<boolean>(false);
  router = inject(Router);
  route = inject(ActivatedRoute);
  locationService = inject(LocationService);

  formComponent = viewChild(FormsDemo);

  editLocationId = signal<number | null>(null);

  locationToEdit = computed<HousingLocationInfo | null>(() => {
    const id = this.editLocationId();
    if (id === null) {
      return null;
    }

    return this.locationService.getLocationForId(id) ?? null;
  });

  panelTitle = computed(() => (this.editLocationId() === null ? 'Add Location' : 'Edit Location'));
  private originalOverflow: string = '';

  private setBodyOverflow(hidden: boolean): void {
    if (hidden) {
      // ONLY save if we haven't already saved a value (avoid overwriting 'hidden')
      if (this.originalOverflow === '') {
        this.originalOverflow = window.getComputedStyle(document.body).overflow;
      }
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = this.originalOverflow;
      this.originalOverflow = '';
    }
  }

  ngOnInit() {
    const routeId =
      this.route.snapshot.paramMap.get('id') ?? this.route.parent?.snapshot.paramMap.get('id');
    this.editLocationId.set(routeId === null ? null : Number(routeId));
    this.showPanel();
  }
  showPanel() {
    this.shouldShowPanel.set(true);
    this.setBodyOverflow(true);
  }

  handleEscape() {
    if (this.shouldShowPanel()) {
      this.hidePanel();
    }
  }

  hidePanel(forceClose = false) {
    if (!forceClose && !this.canCloseForm()) {
      return;
    }
    this.shouldShowPanel.set(false);
    this.setBodyOverflow(false);

    const editId = this.editLocationId();
    if (editId === null) {
      this.router.navigate(['home']);
      return;
    }
    return this.router.navigate(['details', editId]);
  }

  private canCloseForm(): boolean {
    const childForm = this.formComponent();
    if (!childForm || !childForm.shouldConfirmClose()) {
      return true;
    }

    return confirm('Your form has some incomplete changes. Do you want to still exit?');
  }
}
