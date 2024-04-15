import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CounterComponent } from './components/counter/counter.component';
import { WeatherComponent } from './components/weather/weather.component';

const routes: Routes = [
  { path: 'counter', component: CounterComponent },
  { path: 'vatavaran', component: WeatherComponent },
  { path: '',   redirectTo: '/counter', pathMatch: 'full' }  // redirects to counterApp
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
