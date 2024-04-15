import { Component, OnInit } from '@angular/core';
import { CounterService } from 'src/app/components/counter/counter.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  counterLength: number = 0;

  constructor(private counterService: CounterService) { }

  ngOnInit(): void {
    this.counterService.counterLength$.subscribe(length => {
      this.counterLength = length;
    });
  }

}
