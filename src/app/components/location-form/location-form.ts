import { Component, signal, inject, viewChild, computed, HostListener, OnInit, effect } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import {CdkTrapFocus } from '@angular/cdk/a11y';
import { BASE_URL, LocationService } from '../../services/location-service';
import { HousingLocationInfo } from '../../models/housing-location-info';

@Component({
  selector: 'app-location-form',
  standalone: true,
  // We include ReactiveFormsModule here because the form is now in this component's template
  imports: [ReactiveFormsModule, CdkTrapFocus],
  templateUrl: './location-form.html',
  styleUrl: './location-form.css',
  host: {
    '(document:keydown.escape)': 'handleEscape()',
  },
})
export class LocationForm implements OnInit {
  // Services
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly locationService = inject(LocationService);
  private readonly fb = inject(FormBuilder);
  private readonly baseUrl = inject(BASE_URL);

  // State Signals
  readonly shouldShowPanel = signal<boolean>(false);
  readonly editLocationId = signal<number | null>(null);
  readonly defaultPhoto = `${this.baseUrl}/bernard-hermant-CLKGGwIBTaY-unsplash.jpg`;

  // 1. Form Definition
  readonly locationForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    city: ['', [Validators.required]],
    state: ['', [Validators.required]],
    photo: [''],
    availableUnits: [1, [Validators.required, Validators.min(0)]],
    wifi: [false],
    laundry: [false],
  });

  // 2. Computed values for Logic and UI
  readonly locationToEdit = computed<HousingLocationInfo | null>(() => {
    const id = this.editLocationId();
    return id !== null ? this.locationService.getLocationForId(id) ?? null : null;
  });

  readonly panelTitle = computed(() => 
    this.editLocationId() === null ? 'Add Location' : 'Edit Location'
  );

  readonly submitLabel = computed(() => 
    this.editLocationId() === null ? 'Add location' : 'Save changes'
  );

  constructor() {
    // 3. Effect: Sync form whenever locationToEdit changes
    effect(() => {
      const location = this.locationToEdit();

      if (!location) {
        this.locationForm.reset({
          name: '', city: '', state: '', photo: '',
          availableUnits: 1, wifi: false, laundry: false,
        });
      } else {
        this.locationForm.reset({
          name: location.name,
          city: location.city,
          state: location.state,
          photo: location.photo,
          availableUnits: location.availableUnits,
          wifi: location.wifi,
          laundry: location.laundry,
        });
      }
      this.locationForm.markAsPristine();
      this.locationForm.markAsUntouched();
    });
  }

  ngOnInit() {
    const routeId = this.route.snapshot.paramMap.get('id') ?? 
                    this.route.parent?.snapshot.paramMap.get('id');
    
    this.editLocationId.set(routeId ? Number(routeId) : null);
    this.showPanel();
  }

  showPanel() {
    this.shouldShowPanel.set(true);
    this.setBodyOverflow(true);
  }

  @HostListener('document:keydown.escape')
  handleEscape() {
    if (this.shouldShowPanel()) {
      this.hidePanel();
    }
  }
  private setBodyOverflow(shouldHide: boolean) {
    document.body.style.overflow = shouldHide ? 'hidden' : 'auto';
  }

  // 4. Dirty/Invalid check for the Escape/Close logic
 

  hidePanel(forceClose = false) {
    if (!forceClose && !this.canCloseForm()) {
      return;
    }

    this.shouldShowPanel.set(false);
    this.setBodyOverflow(false);

    const editId = this.editLocationId();
    if (editId === null) {
      this.router.navigate(['home']);
    } else {
      this.router.navigate(['details', editId]);
    }
  }

  shouldConfirmClose(): boolean {
    return this.locationForm.dirty || (this.locationForm.touched && this.locationForm.invalid);
  }

  private canCloseForm(): boolean {
    if (!this.shouldConfirmClose()) {
      return true;
    }
    return confirm('Your form has some incomplete changes. Do you want to still exit?');
  }

  onSubmit() {
    if (this.locationForm.invalid) {
      this.locationForm.markAllAsTouched();
      return;
    }

    const val = this.locationForm.getRawValue();
    const locationData: Omit<HousingLocationInfo, 'id'> = {
      name: val.name ?? '',
      city: val.city ?? '',
      state: val.state ?? '',
      photo: val.photo?.trim() ? val.photo : this.defaultPhoto,
      availableUnits: Number(val.availableUnits ?? 0),
      wifi: !!val.wifi,
      laundry: !!val.laundry,
    };

    const id = this.editLocationId();
    if (id === null) {
      this.locationService.addLocation(locationData);
    } else {
      this.locationService.updateLocation(id, locationData);
    }

    // Success! Close panel and navigate away
    this.hidePanel(true);
  }
}