import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private appid = 'd4594364698122bfd1c4b3eb5f2ff19f';
  private geoapiUrl = 'http://api.openweathermap.org/geo/1.0/direct';
  private weatherApiUrl = 'https://api.openweathermap.org/data/2.5/weather';
  private forecastApiUrl = 'https://api.openweathermap.org/data/2.5/forecast';


  

  constructor(private http:HttpClient) { }
  

  getCityCoords(cityName: string): Observable<any> {
    const params = new HttpParams()
    .set('q', cityName)
    .set('appid', this.appid);
    return this.http.get<any>(this.geoapiUrl, { params }).pipe(
      catchError(error => {
        return throwError(() => new Error(error.message || 'City name is Invalid'));
      })
    );
  }

  getWeatherByCoords(lat: number, lon: number): Observable<any> {
    const params = new HttpParams()
      .set('lat', lat.toString())
      .set('lon', lon.toString())
      .set('appid', this.appid)
      .set('units', 'metric'); // Get temperature in Celsius

    return this.http.get<any>(this.weatherApiUrl, { params });
  }

  getForecastByCoords(lat: number, lon: number): Observable<any> {
    const params = new HttpParams()
    .set('lat', lat.toString())
    .set('lon', lon.toString())
    .set('appid', this.appid)
    .set('units', 'metric'); // Get temperature in Celsius


    return this.http.get<any>(this.forecastApiUrl, { params });

  }
}
