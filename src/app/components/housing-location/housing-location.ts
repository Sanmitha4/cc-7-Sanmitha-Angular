// import { Component, inject, input, output } from '@angular/core';
// import { HousingLocationInfo } from '../../models/housing-location-info';
// import { BASE_URL, LocationService } from '../../services/location-service';

// @Component({
//   selector:'app-housing-child',
//   template:`<p>{{baseURL}}</p>`,
// })

// export class HousingChild{
//   baseURL=inject(BASE_URL);

// }



// @Component({
//   selector: 'app-housing-location',
//   templateUrl: './housing-location.html',
//   styleUrls: ['./housing-location.css'],
//   providers:[{provide:BASE_URL,useValue:'blah blah'}],
  
// })
// export class HousingLocation {
//   housingLocation = input.required<HousingLocationInfo>();
//   onLocationClick =output<HousingLocationInfo>();
//   locationService=inject(LocationService);
//   baseURL=inject(BASE_URL);

//   handleButtonClick(event:MouseEvent){
//     console.log(`${this.housingLocation().name} is clicked`);
//     this.onLocationClick.emit(this.housingLocation());
//     console.log("The base url:",this.baseURL);
//   }
// }

// import { Component, inject, input, output } from '@angular/core';
// import { HousingLocationInfo } from '../../models/housing-location-info';
// import { BASE_URL, LocationService } from '../../services/location-service';
// import { MockLocationService } from '../../services/mock-location-service';

// @Component({
//   selector: 'app-housing-location',
//   imports: [],
//   templateUrl: './housing-location.html',
//   styleUrl: './housing-location.css',
//   providers: [{ provide: BASE_URL, useValue: "hehe hehe heee"}]
// })
// export class HousingLocation {
//   housingLocation = input.required<HousingLocationInfo>();
//   mode = input<'normal' | 'edit'>('normal');
//   isSelected = input<boolean>(false);
//   onLocationClick = output<HousingLocationInfo>();

//   showWifi = false;

//   handleClick(event: MouseEvent) {
//     if (this.housingLocation().wifi) {
//       this.showWifi = !this.showWifi;
//     }

//     console.log(event.target);

//     console.log(`${this.housingLocation().name} is clicked`);
//     this.onLocationClick.emit(this.housingLocation());
//   }

//   // ngOnInit(){
//   //   console.log(this.housingLocation())
//   // }
// }

import { Component, input, output } from '@angular/core';
import { HousingLocationInfo } from '../../../models/housing-location-info';
 
@Component({
  selector: 'app-housing-location',
  imports: [],
  templateUrl: './housing-location.html',
  styleUrl: './housing-location.css',
})
export class HousingLocation {
  housingLocation = input.required<HousingLocationInfo>();
  mode = input<'normal' | 'edit'>('normal');
  isSelected = input<boolean>(false);
 
  onLocationClick = output<HousingLocationInfo>();
 
  handleClick(event: MouseEvent) {
    console.log(`${this.housingLocation().name} clicked in ${this.mode()} mode`);
    this.onLocationClick.emit(this.housingLocation());
  }
}
 