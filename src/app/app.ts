import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet, RouterLinkWithHref } from '@angular/router';
import { Home } from './components/home/home';
import { Form } from '@angular/forms';
import { FormsDemo } from '@components/forms-demo/forms-demo';
import { CardLayoutComponent } from '@components/card-layout/card-layout';

@Component({
  selector: 'app-root',
  imports: [CardLayoutComponent,RouterOutlet, RouterLinkWithHref],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('property-app');
  router = inject(Router);
  ngOnInit() {
    console.log('App component initialized');
  }
}
