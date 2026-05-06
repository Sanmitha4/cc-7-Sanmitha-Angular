import { Component, OnInit, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { pairs } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.css'
})
export class SearchBarComponent implements OnInit {
  searchChanged = output<string>();

  // This control tracks what the user types
  searchControl = new FormControl('');

  ngOnInit() {
    this.searchControl.valueChanges.pipe(
      debounceTime(400),           //  Wait for typing to stop
      distinctUntilChanged(),      //  Only emit if value actually changed
      // 3. Rule: Emit only if length >= 3 OR if the input is cleared (0)
      filter(val => {
        const text = val ?? '';
        return text.length >= 3 || text.length === 0;
      })
    ).subscribe(value => {
      this.searchChanged.emit(value ?? '');
    });
  }
  emitSearch() {
    this.searchChanged.emit(this.searchControl.value ?? '');
  }
}