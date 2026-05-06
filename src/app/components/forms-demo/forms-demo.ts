import { Component, inject } from '@angular/core';
import {
  FormControl,
  ReactiveFormsModule,
  FormBuilder,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-forms-demo',
  standalone: true, // Needed for modern Angular apps
  imports: [ReactiveFormsModule], // Must include this to use [formGroup] in HTML
  templateUrl: './forms-demo.html',
  styleUrl: './forms-demo.css',
})
export class FormsDemo {
  private readonly formBuilder = inject(FormBuilder);

  // Standalone control
  name = new FormControl('');

  // Form Group using FormBuilder
  profileForm = this.formBuilder.group({
    firstName: ['', [Validators.required, Validators.minLength(6)]],
    lastName: ['', Validators.required], // Added required here
    email: ['', [Validators.required, Validators.email]], // Added required and email validation
    address: this.formBuilder.group({
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
    }),
  });

  // Class methods (declared OUTSIDE the form object)
  handleChange(event: Event) {
    console.log('Standalone name value:', this.name.value);
  }

  updateName() {
    // patchValue is great for updating only specific parts of the form
    this.profileForm.patchValue({
      firstName: 'Sanmitha',
      lastName: 'Surname'
    });
  }

  onSubmit() {
    if (this.profileForm.valid) {
      console.log('Form Submitted!', this.profileForm.value);
      // Logic to send data to a service would go here
    } else {
      // Mark all fields as touched to trigger validation messages in the UI
      this.profileForm.markAllAsTouched();
      console.warn('Form is invalid');
    }
  }
}