import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-forms-demo',
  imports: [ReactiveFormsModule],
  templateUrl: './forms-demo.html',
  styleUrl: './forms-demo.css',
})
export class FormsDemo {
  
  name=new FormControl('');
  profileForm=new FormGroup({
    firstName:new FormControl(''),
    lastName:new FormControl(''),
  });

  handleChange(event:Event){
    console.log(this.name.value);
    //console.log((event.target as HTMLInputElement).value)
  }
  updateName(){
    this.name.setValue("Bob");
  }

  onSubmit(){
    console.log(this.profileForm.value)
  }
}


