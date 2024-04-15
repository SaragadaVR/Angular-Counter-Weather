import { Component, OnInit } from '@angular/core';
import { CounterService } from './counter.service';

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.scss']
})
export class CounterComponent implements OnInit {

 
  rows: any[] = [];
  counters: number[] = [];

  constructor(private counterService: CounterService) { }

  ngOnInit(): void {
  }

  addCounterRow() {
    this.rows.push({});
    this.counters.push(0);
    this.counterService.setCounterLength(this.rows.length)
  }
  

  resetCounters() {
    this.counters = this.counters.map(() => 0);
  }

   incrementCounter(rowIndex: number) {
    this.counters[rowIndex]++;
  }

  decrementCounter(rowIndex: number) {
    if (this.counters[rowIndex] > 0) {
      this.counters[rowIndex]--;
    }
  }

  deleteRow(rowIndex: number) {
    this.rows.splice(rowIndex, 1);
    this.counters.splice(rowIndex, 1);
    this.counterService.setCounterLength(this.rows.length)

  }
}
