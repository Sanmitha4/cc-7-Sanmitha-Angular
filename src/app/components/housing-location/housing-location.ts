import { Component, inject, input, output } from '@angular/core';
import { HousingLocationInfo } from '../../models/housing-location-info';
import { BASE_URL, LocationService } from '../../services/location-service';
import { MockLocationService } from '../../services/mock-location-service';
 
@Component({
  selector: 'app-housing-location',
  imports: [],
  templateUrl: './housing-location.html',
  styleUrl: './housing-location.css',
  //providers: [{ provide: BASE_URL, useValue: "ohhh"}]
// })
})
export class HousingLocation {
  housingLocation = input.required<HousingLocationInfo>();
  mode = input<'normal' | 'edit'>('normal');

  isSelected = input<boolean>(false);

  onLocationClick = output<HousingLocationInfo>();
 
  handleClick(event: MouseEvent) {
    console.log(`${this.housingLocation().name} clicked in ${this.mode()} mode`);
    this.onLocationClick.emit(this.housingLocation());
    //console.log("The base url:",this.baseURL);
  }
  //ngOnInit(){
//   console.log(this.housingLocation())
//   }
}
 