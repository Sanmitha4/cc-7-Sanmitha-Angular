// import { Component, effect, inject, input, output, computed, InjectionToken } from '@angular/core';
// import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
// import { LocationService } from '../../services/location-service';
// import { HousingLocationInfo } from '../../models/housing-location-info';

// export const BASE_URL = new InjectionToken<string>('base url', {
//   providedIn: 'root',
//   factory: () => 'https://angular.dev/assets/images/tutorials/common',
// });
// @Component({
//   selector: 'app-forms-demo',
//   imports: [ReactiveFormsModule],
//   templateUrl: './forms-demo.html',
//   styleUrl: './forms-demo.css',
// })
// export class FormsDemo {
//   private readonly formBuilder = inject(FormBuilder);
//   private readonly locationService = inject(LocationService);

//   locationToEdit = input<HousingLocationInfo | null>(null);
//   editLocationId = input<number | null>(null);

//   locationSaved = output<void>();

//   private readonly baseUrl = inject(BASE_URL);

//   locationForm = this.formBuilder.group({
//     name: ['', [Validators.required, Validators.minLength(5)]],
//     city: ['', [Validators.required]],
//     state: ['', [Validators.required]],
//     photo: [''],
//     availableUnits: [1, [Validators.required, Validators.min(0)]],
//     wifi: [false],
//     laundry: [false],
//   });

//   readonly defaultPhoto = `${this.baseUrl}/saru-robert-9rP3mxf8qWI-unsplash.jpg`;

//   // readonly defaultPhoto =
//   //   'https://angular.dev/assets/images/tutorials/common/bernard-hermant-CLKGGwIBTaY-unsplash.jpg';

//   readonly submitLabel = computed(() =>
//     this.editLocationId() === null ? 'Add location' : 'Save changes',
//   );

//   constructor() {
//     effect(() => {
//       const location = this.locationToEdit();

//       if (!location) {
//         this.locationForm.reset({
//           name: '',
//           city: '',
//           state: '',
//           photo: '',
//           availableUnits: 1,
//           wifi: false,
//           laundry: false,
//         });
//         this.locationForm.markAsPristine();
//         this.locationForm.markAsUntouched();
//         return;
//       }

//       this.locationForm.reset({
//         name: location.name,
//         city: location.city,
//         state: location.state,
//         photo: location.photo,
//         availableUnits: location.availableUnits,
//         wifi: location.wifi,
//         laundry: location.laundry,
//       });
//       this.locationForm.markAsPristine();
//       this.locationForm.markAsUntouched();
//     });
//   }

//   shouldConfirmClose(): boolean {
//     return this.locationForm.dirty || (this.locationForm.touched && this.locationForm.invalid);
//   }

//   onSubmit() {
//     if (this.locationForm.invalid) {
//       this.locationForm.markAllAsTouched();
//       return;
//     }

//     const locationValue = this.locationForm.getRawValue();

//     const formLocation = {
//       name: locationValue.name ?? '',
//       city: locationValue.city ?? '',
//       state: locationValue.state ?? '',
//       photo: locationValue.photo || this.defaultPhoto,
//       availableUnits: Number(locationValue.availableUnits ?? 0),
//       wifi: !!locationValue.wifi,
//       laundry: !!locationValue.laundry,
//     };

//     const locationId = this.editLocationId();

//     if (locationId === null) {
//       this.locationService.addLocation(formLocation);
//     } else {
//       this.locationService.updateLocation(locationId, formLocation);
//     }

//     this.locationForm.reset({
//       name: '',
//       city: '',
//       state: '',
//       photo: '',
//       availableUnits: 1,
//       wifi: false,
//       laundry: false,
//     });
//     this.locationForm.markAsPristine();
//     this.locationForm.markAsUntouched();

//     this.locationSaved.emit();
//   }
// }
import { Component, effect, inject, input, output, computed, InjectionToken } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { LocationService } from '../../services/location-service';
import { HousingLocationInfo } from '../../models/housing-location-info';

export const BASE_URL = new InjectionToken<string>('base url', {
  providedIn: 'root',
  factory: () => 'https://angular.dev/assets/images/tutorials/common',
});

@Component({
  selector: 'app-forms-demo',
  imports: [ReactiveFormsModule],
  templateUrl: './forms-demo.html',
  styleUrl: './forms-demo.css',
})
export class FormsDemo {
  private readonly formBuilder = inject(FormBuilder);
  private readonly locationService = inject(LocationService);
  private readonly baseUrl = inject(BASE_URL);

  locationToEdit = input<HousingLocationInfo | null>(null);
  editLocationId = input<number | null>(null);
  locationSaved = output<void>();

  private readonly INITIAL_STATE = {
    name: '', city: '', state: '', photo: '', 
    availableUnits: 1, wifi: false, laundry: false
  };

  locationForm = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(5)]],
    city: ['', [Validators.required]],
    state: ['', [Validators.required]],
    photo: [''],
    availableUnits: [1, [Validators.required, Validators.min(0)]],
    wifi: [false],
    laundry: [false],
  });

  readonly defaultPhoto = `${this.baseUrl}/saru-robert-9rP3mxf8qWI-unsplash.jpg`;

  readonly submitLabel = computed(() => 
    this.editLocationId() === null ? 'Add location' : 'Save changes'
  );

  constructor() {
    effect(() => {
      const location = this.locationToEdit();
      // Using patchValue is cleaner than reset() for updates
      location ? this.locationForm.patchValue(location) : this.resetForm();
    });
  }

  private resetForm(): void {
    this.locationForm.reset(this.INITIAL_STATE);
  }

  shouldConfirmClose(): boolean {
    return this.locationForm.dirty || (this.locationForm.touched && this.locationForm.invalid);
  }

  onSubmit() {
    if (this.locationForm.invalid) {
      this.locationForm.markAllAsTouched();
      return;
    }

    const formLocation = this.getFormData();
    const id = this.editLocationId();

    id === null 
      ? this.locationService.addLocation(formLocation) 
      : this.locationService.updateLocation(id, formLocation);

    this.resetForm();
    this.locationSaved.emit();
  }

  private getFormData() {
    const v = this.locationForm.getRawValue();
    return {
      name: v.name ?? '',
      city: v.city ?? '',
      state: v.state ?? '',
      photo: v.photo || this.defaultPhoto,
      availableUnits: Number(v.availableUnits ?? 0),
      wifi: !!v.wifi,
      laundry: !!v.laundry,
    };
  }
}