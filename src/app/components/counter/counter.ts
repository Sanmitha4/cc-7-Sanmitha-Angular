import { Component, input, output, signal, OnInit } from '@angular/core';

@Component({
  selector: 'app-counter',
  standalone: true,
  imports: [],
  templateUrl: './counter.html',
  styleUrl: './counter.css',
})
export class Counter implements OnInit { 
  initialCount = input<number>(0);
  countChange = output<number>();
  count = signal(0);

  ngOnInit() {
    this.count.set(this.initialCount());
  }

  increment() {
    this.count.update(value => value + 1);
    this.countChange.emit(this.count());
  }

  decrement() {
    this.count.update(value => value - 1);
    this.countChange.emit(this.count());
  }
}