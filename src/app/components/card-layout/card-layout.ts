import { Component, contentChild, input, TemplateRef } from '@angular/core';
import { CommonModule, NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-card-layout',
  standalone: true,
  // Using NgTemplateOutlet specifically for our dynamic template
  imports: [CommonModule, NgTemplateOutlet], 
  templateUrl: './card-layout.html',
  styleUrls: ['./card-layout.css'],
})
export class CardLayoutComponent {
  /**
   * input() creates a Signal. These are read-only from inside the component
   * and update automatically when the parent change the value.
   */
  items = input<any[]>([]); 
  isDesktop = input<boolean>(false);

  /**
   * contentChild() is the Signal-based seeker. 
   * It will automatically update if the template reference changes.
   */
  tableTemplate = contentChild<TemplateRef<any>>('desktopTable');
}