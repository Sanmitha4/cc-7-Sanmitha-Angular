import { Component, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsDemo } from '../forms-demo/forms-demo';

@Component({
  selector: 'app-location-form',
  imports: [FormsDemo],
  templateUrl: './location-form.html',
  styleUrl: './location-form.css',
})
export class LocationForm {
  shouldShowPanel = signal<boolean>(false);
  router = inject(Router);

  ngOnInit() {
    this.showPanel();
  }

  showPanel() {
    this.shouldShowPanel.set(true);
  }

  hidePanel() {
    this.shouldShowPanel.set(false);
    this.router.navigate(['home']);
  }
}
