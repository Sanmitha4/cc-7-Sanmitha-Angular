import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-forms-demo',
  imports: [ReactiveFormsModule],
  templateUrl: './forms-demo.html',
  styleUrl: './forms-demo.css',
})
export class FormsDemo {
  formBuilder = inject(FormBuilder);

  name = new FormControl('');
  // profileForm = new FormGroup({
  //   firstName: new FormControl(''),
  //   lastName: new FormControl(''),
  //   address: new FormGroup({
  //     street: new FormControl(''),
  //     city: new FormControl(''),
  //     state: new FormControl(''),
  //   }),
  // });

  profileForm = this.formBuilder.group({
    firstName: [''],
    lastName: [''],
    address: this.formBuilder.group({
      street: [''],
      city: [''],
      state: [''],
    }),
  });

  handleChange(event: Event) {
    console.log(this.name.value);
    //console.log((event.target as HTMLInputElement).value)
  }
  updateName() {
    //this.name.setValue('Bob');
    this.profileForm.patchValue({ lastName: 'sanmitha' });
  }

  onSubmit() {
    console.log(this.profileForm.value);
  }
}
