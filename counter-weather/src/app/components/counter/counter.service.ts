import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CounterService {

  private counterLength: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  counterLength$ = this.counterLength.asObservable();

  constructor() { }

  setCounterLength(length: number) {
    this.counterLength.next(length);
  }
}
