import { Component, signal, inject, viewChild, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsDemo } from '../forms-demo/forms-demo';
import { LocationService } from '../../services/location-service';
import { HousingLocationInfo } from '../../models/housing-location-info';
@Component({
  selector: 'app-location-form',
  imports: [FormsDemo],
  templateUrl: './location-form.html',
  styleUrl: './location-form.css',
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

  ngOnInit() {
    const routeId =
      this.route.snapshot.paramMap.get('id') ?? this.route.parent?.snapshot.paramMap.get('id');
    this.editLocationId.set(routeId === null ? null : Number(routeId));
    this.showPanel();
  }
  showPanel() {
    this.shouldShowPanel.set(true);
  }

  hidePanel(forceClose = false) {
    if (!forceClose && !this.canCloseForm()) {
      return;
    }
    this.shouldShowPanel.set(false);
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
    return confirm('Your form has some incomplete changes.Do you want to still exit?');
  }
}
