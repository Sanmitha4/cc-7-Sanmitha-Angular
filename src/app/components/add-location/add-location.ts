import { Component, inject, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HousingLocationInfo } from '../../models/housing-location-info';

@Component({
  selector: 'app-add-location',
  imports: [ReactiveFormsModule],
  templateUrl: './add-location.html',
  styleUrl: './add-location.css',
})
export class AddLocation {
  formBuilder = inject(FormBuilder);

  onSave = output<Omit<HousingLocationInfo, 'id' | 'photo'>>();
  onCancel = output<void>();

  addLocationForm = this.formBuilder.group({
    name: ['', Validators.required],
    city: ['', Validators.required],
    state: ['', Validators.required],
    availableUnits: [0, [Validators.required, Validators.min(0)]],
    wifi: [false],
    laundry: [false],
  });

  submit() {
    if (this.addLocationForm.valid) {
      const v = this.addLocationForm.value;
      this.onSave.emit({
        name: v.name ?? '',
        city: v.city ?? '',
        state: v.state ?? '',
        availableUnits: v.availableUnits ?? 0,
        wifi: v.wifi ?? false,
        laundry: v.laundry ?? false,
      });
      this.reset();
    }
  }

  cancel() {
    this.reset();
    this.onCancel.emit();
  }

  private reset() {
    this.addLocationForm.reset({ availableUnits: 0, wifi: false, laundry: false });
  }
}
