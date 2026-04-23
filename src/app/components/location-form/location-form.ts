import { Component, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { LocationService } from '../../services/location-service';
import { HousingLocationInfo } from '../../models/housing-location-info';

@Component({
  selector: 'app-location-form',
  imports: [ReactiveFormsModule],
  templateUrl: './location-form.html',
  styleUrl: './location-form.css',
})
export class LocationForm {
  shouldShowPanel = signal<boolean>(false);
  router = inject(Router);
  formBuilder = inject(FormBuilder);
  locationService = inject(LocationService);

  locationForm!: FormGroup;
  isEditMode = signal<boolean>(false);

  ngOnInit() {
    this.initializeForm();
    this.showPanel();
  }

  initializeForm() {
    this.locationForm = this.formBuilder.group({
      id: [0],
      name: ['', [Validators.required, Validators.minLength(3)]],
      city: ['', [Validators.required, Validators.minLength(2)]],
      state: ['', [Validators.required, Validators.minLength(2)]],
      photo: ['', Validators.required],
      availableUnits: [0, [Validators.required, Validators.min(0)]],
      wifi: [false],
      laundry: [false],
    });
  }

  showPanel() {
    this.shouldShowPanel.set(true);
  }

  hidePanel() {
    this.shouldShowPanel.set(false);
    this.router.navigate(['home']);
  }

  onSubmit() {
    if (this.locationForm.valid) {
      const formData = this.locationForm.value;
      if (this.isEditMode()) {
        this.locationService.updateLocation(formData);
      } else {
        this.locationService.addLocation(formData);
      }
      this.locationForm.reset();
      this.hidePanel();
    }
  }

  onCancel() {
    this.locationForm.reset();
    this.hidePanel();
  }
}
