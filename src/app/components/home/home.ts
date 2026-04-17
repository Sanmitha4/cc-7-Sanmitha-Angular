// // import {Component,inject, signal} from '@angular/core';
// // import { HousingLocation} from '@components/housing-location/housing-location';
// // import { HousingLocationInfo } from '../../models/housing-location-info';
// // import {LocationService} from '../../services/location-service'
// // import { Router } from '@angular/router';

// // @Component({
// //   selector: 'app-home',
// //   imports: [HousingLocation],
// //   templateUrl: './home.html',
// //   styleUrl: './home.css',
// //   //providers:[{LocationService}],
// // })
// // export class Home {
// //   locationService:LocationService=inject(LocationService);
// //   router=inject(Router);
// //   mode=signal<'normal'|'edit'>('normal');

// //   handleLocationClick(housingLocationInfo:HousingLocationInfo){
// //     console.log(`Home:${housingLocationInfo.name}is clicked`);
// //     this.router.navigate(['details',housingLocationInfo.id])
// //   }
  
// //   handleCheckBox(event:Event){
// //     console.log('Checked is clicked',(event.target as HTMLInputElement).checked)
// //     this.mode.update(prev=>prev==='normal'?'edit':'normal');
// //   }
// //   handleCountUpdate(count: number) {
// //     console.log('Current selection count:', count);
// //   }
//   // handleLocationClick(location: HousingLocationInfo) {
//   //   const otherItems = this.housingLocationList.filter(item => item.id !== location.id);
//   //   this.housingLocationList = [location, ...otherItems];
//   //   console.log(`${location.name} moved to top `);
//   // // }


//   // handleLocationClick(location: HousingLocationInfo) {
//   // const index = this.housingLocationList.findIndex(item => item.id === location.id);
//   // if (index !== -1) {
//   //   const removedItems = this.housingLocationList.splice(index, 1);
//   //   const clickedItem=removedItems[0];

//   //   this.housingLocationList.unshift(clickedItem);
//   //   console.log(`${clickedItem.name} moved to top`);
//   // }

// // // housingLocationList: any;
// // handleLocationClick(location: HousingLocationInfo){
// //   console.log(`${location.name} was clicked`);
// // }

// import { Component, inject, signal } from '@angular/core';
// import { HousingLocation } from '../housing-location/housing-location';
// import { HousingLocationInfo } from '../../models/housing-location-info';
// import { LocationService } from '../../services/location-service';
// import { MockLocationService } from '../../services/mock-location-service';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-home',
//   imports: [HousingLocation],
//   templateUrl: './home.html',
//   styleUrl: './home.css',
// })
// export class Home {
//   locationService: LocationService = inject(LocationService);
//   router = inject(Router)

//   mode = signal<"normal" | "edit">('normal')
  
//   //housingLocationList: any;
//   selectedIds=signal<Set<number>>(new Set());

//   constructor() {
//     console.log("Constro init")
//   }

//   handleLocationClick(housingLocationInfo: HousingLocationInfo) {
//     if (this.mode() === 'normal') {
//       // Normal mode: navigate to details
//       this.router.navigate(['details', housingLocationInfo.id]);
//     } else {
//       // Edit mode: toggle selection
//       this.selectedIds.update(prev => {
//         const next = new Set(prev);
//         if (next.has(housingLocationInfo.id)) {
//           next.delete(housingLocationInfo.id);
//         } else {
//           next.add(housingLocationInfo.id);
//         }
//         return next;
//       });
//     }

//     //console.log(`Home ${housingLocationInfo.name} is clicked`);
//     // const index = this.housingLocationList.findIndex((location: { id: number; }) => location.id === housingLocationInfo.id);

//     // if (index !== -1) {
//     //   const [item] = this.housingLocationList.splice(index, 1);

//     //   this.housingLocationList = [item[0], ...this.housingLocationList];
//     // }
//     // // this.locationService = inject(LocationService)

//     // If we locked in the  normal mode navigate the user card ti ckicked property details screen

//     // this.router.navigate(['details', housingLocationInfo.id])
//     // console.log("Routing to: ", housingLocationInfo.id)
//   }
//    isSelected(id: number): boolean {
//     return this.selectedIds().has(id);
//   }
//   handleCheckbox(event: Event) {
//     const checked = (event.target as HTMLInputElement).checked;
//     this.mode.set(checked ? 'edit' : 'normal');
 
//     // Clear all selections when switching back to normal mode
//     if (!checked) {
//       this.selectedIds.set(new Set());
//     }
//   }

//   // handleCheckbox(event: Event) {
//   //   console.log(`MODE: ${this.mode()}\nCheckbox: ${(event.target as HTMLInputElement).checked}`)

//   //   // GOOD: If you want to compute new value based on its previous value
//   //   this.mode.update(prev => prev === "normal" ? 'edit' : "normal")
//   //   // BAD
//   //   // this.mode.set(this.mode() === "normal" ? 'edit' : "normal")



//   // }

//   ngOnInit() {
//     console.log("home instanciated")
//   }

//   ngOnDestroy() {
//     console.log("destro")
//   }
// }



import { Component, inject, signal } from '@angular/core';
import { HousingLocation } from '../housing-location/housing-location';
import { HousingLocationInfo } from '../../../models/housing-location-info';
import { LocationService } from '../../../services/location-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [HousingLocation],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  locationService: LocationService = inject(LocationService);
  router = inject(Router);

  mode = signal<'normal' | 'edit'>('normal');
  selectedIds = signal<Set<number>>(new Set());

  handleLocationClick(housingLocationInfo: HousingLocationInfo) {
    if (this.mode() === 'normal') {
      this.router.navigate(['details', housingLocationInfo.id]);
    } else {
      this.selectedIds.update(prev => {
        const next = new Set(prev);
        if (next.has(housingLocationInfo.id)) {
          next.delete(housingLocationInfo.id);
        } else {
          next.add(housingLocationInfo.id);
        }
        return next;
      });
    }
  }

  isSelected(id: number): boolean {
    return this.selectedIds().has(id);
  }

  handleCheckbox(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.mode.set(checked ? 'edit' : 'normal');
    if (!checked) {
      this.selectedIds.set(new Set());
    }
  }
}