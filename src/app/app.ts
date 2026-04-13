import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Home } from './components/home/home';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet,Home],
  //templateUrl: './app.html',
  template:`<h1>Hello Angular</h1>`,
  styleUrl: './app.css'
})
export class App {
  //protected readonly title = signal('property-app');
  protected readonly title=("property-qpp");

  //setTimeout ,event listener is fired or a promise got resolved /rejected,network call
  // ngOnInit(){
  //   console.log('App component was instantiated!');
  //   this.title='propert app reloaded'
  // }
}
