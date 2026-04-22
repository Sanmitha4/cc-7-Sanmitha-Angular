import { signal, Component, linkedSignal } from '@angular/core';

interface ShippingMethod {
  id: number;
  name: string;
}
@Component({
  selector: 'app-shipping-selection',
  imports: [],
  templateUrl: './shipping-selection.html',
  styleUrl: './shipping-selection.css',
})
export class ShippingSelection {
  shippingOptions = signal<string[]>([
    'Air' ,
    'Sky' ,
    'Ground' 
  ]);
  userSelectedShippingOption = linkedSignal(() => this.shippingOptions()[0]);

  changeShippingOptions() {
    this.shippingOptions.set([
      'Email' ,
      'Sea' ,
      'Postal Service' ,
    ]);
  }
  handleUserInput(event: Event) {
    const userSelectedValue = event.target as HTMLInputElement;
    console.log((event.target as HTMLInputElement).value);
    this.userSelectedShippingOption.set(userSelectedValue.value);
  }
}

