import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-forms-demo',
  imports: [ReactiveFormsModule],
  templateUrl: './forms-demo.html',
  styleUrl: './forms-demo.css',
})
export class FormsDemo {
  name = new FormControl('');
  profileForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    address: new FormGroup({
      street: new FormControl(''),
      city: new FormControl(''),
      state: new FormControl(''),
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
