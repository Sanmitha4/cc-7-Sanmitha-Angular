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
  shippingOptions = signal<string[]>(['Air', 'Sea', 'Ground']);
  //userSelectedShippingOption = linkedSignal(() => this.shippingOptions()[0]);

  userSelectedShippingOption = linkedSignal<string[], string>({
    source: this.shippingOptions,
    computation: (newDependencyValue, myPreviousValue): string => {
      if (newDependencyValue.includes(myPreviousValue?.value as string)) {
        return myPreviousValue?.value ?? '';
      } else {
        return newDependencyValue[0];
      }
    },
  });

  changeShippingOptions() {
    this.shippingOptions.set(['Courier', 'Sea', 'Postal Service']);
  }
  handleUserInput(event: Event) {
    const userSelectedValue = event.target as HTMLInputElement;
    console.log((event.target as HTMLInputElement).value);
    this.userSelectedShippingOption.set(userSelectedValue.value);
  }
}
