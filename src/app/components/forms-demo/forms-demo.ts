import { Component, inject, output } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { LocationService } from '../../services/location-service';

@Component({
  selector: 'app-forms-demo',
  imports: [ReactiveFormsModule],
  templateUrl: './forms-demo.html',
  styleUrl: './forms-demo.css',
})
export class FormsDemo {
  private readonly formBuilder = inject(FormBuilder);
  private readonly locationService = inject(LocationService);

  locationSaved = output<void>();

  locationForm = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    city: ['', [Validators.required]],
    state: ['', [Validators.required]],
    photo: [''],
    availableUnits: [1, [Validators.required, Validators.min(0)]],
    wifi: [false],
    laundry: [false],
  });

  readonly defaultPhoto =
    'https://angular.dev/assets/images/tutorials/common/bernard-hermant-CLKGGwIBTaY-unsplash.jpg';

  onSubmit() {
    if (this.locationForm.invalid) {
      this.locationForm.markAllAsTouched();
      return;
    }

    const locationValue = this.locationForm.getRawValue();

    this.locationService.addLocation({
      name: locationValue.name ?? '',
      city: locationValue.city ?? '',
      state: locationValue.state ?? '',
      photo: locationValue.photo || this.defaultPhoto,
      availableUnits: Number(locationValue.availableUnits ?? 0),
      wifi: !!locationValue.wifi,
      laundry: !!locationValue.laundry,
    });

    this.locationForm.reset({
      name: '',
      city: '',
      state: '',
      photo: '',
      availableUnits: 1,
      wifi: false,
      laundry: false,
    });

    this.locationSaved.emit();
  }
}
