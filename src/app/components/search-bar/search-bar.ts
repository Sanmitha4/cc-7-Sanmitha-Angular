import { Component, OnInit, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.css'
})
export class SearchBarComponent implements OnInit {
  // Use the modern output API to send data to the parent (Home)
  searchChanged = output<string>();

  // This control tracks what the user types
  searchControl = new FormControl('');

  ngOnInit() {
    this.searchControl.valueChanges.pipe(
      debounceTime(400),           // 1. Wait for typing to stop
      distinctUntilChanged(),      // 2. Only emit if value actually changed
      // 3. Rule: Emit only if length >= 3 OR if the input is cleared (0)
      filter(val => {
        const text = val ?? '';
        return text.length >= 3 || text.length === 0;
      })
    ).subscribe(value => {
      this.searchChanged.emit(value ?? '');
    });
  }
}