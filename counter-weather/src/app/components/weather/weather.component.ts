import { Component, OnInit } from '@angular/core';
import { WeatherService } from './weather.service';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']
})
export class WeatherComponent implements OnInit {

  cityName: string = '';
  recentLocations: any[] = [];
  errorMessage: string = '';
  selectedCity: string = '';
  firstForecast: any = null;
  dailyForecasts: any[] = [];
  isLoadingAdd: boolean = false;
  //isLoadingRefresh: boolean = false;
  weatherIconMapping: { [key: string]: string } = {
    'Clear': 'day',
    'Clouds': 'cloudy',
    'Rain': 'rainy',
    'Drizzle': 'drizzle',
    'Thunderstorm': 'thunder',
    'Snow': 'snowy',
    'Mist': 'foggy'
    // Add more mappings as needed based on weather conditions
  };

  
  constructor(private weatherService: WeatherService) { }
  

  ngOnInit(): void {
    this.recentLocations.forEach(location => {
      location.loading = false; // Initialize loading state to false
    });
  }

  
  fetchWeatherData(cityName: string) {
    return new Promise((resolve, reject) => {
      if (cityName.trim() !== '') {
        this.weatherService.getCityCoords(cityName).subscribe({
          next: (coords) => {
            if (coords.length > 0) {
              const lat = coords[0].lat;
              const lon = coords[0].lon;
              this.weatherService.getWeatherByCoords(lat, lon)
                .subscribe(              
                  (weatherData) => {
                    resolve(weatherData);
                  },
                  (error) => {
                    reject('Error fetching weather data');
                  }
               );
            } else {
              reject('No coordinates found for the city');
            }
          },
            error: (error: any) => {
              this.errorMessage = 'Error fetching coordinates';
            }
        });    
      }
    });
  }
 
  addCity(cityName: string) {
     this.isLoadingAdd = true;
    this.fetchWeatherData(cityName)
    .then((weatherData: any) => {
      const existingCityIndex = this.recentLocations.findIndex(location => location.name === cityName);
      if (existingCityIndex !== -1) {
        // Update existing entry with new weather data
        this.recentLocations[existingCityIndex].temperature = weatherData.main.temp;
        this.recentLocations[existingCityIndex].weather = weatherData.weather[0].main;
        this.recentLocations[existingCityIndex].weatherIcon = this.getWeatherIcon(weatherData.weather[0].main);       
      } else {
        this.recentLocations.unshift({
          name: cityName,
          temperature: weatherData.main.temp,
          weather: weatherData.weather[0].main,
          weatherIcon : this.getWeatherIcon(weatherData.weather[0].main),
          loading : false
        });
        if (this.recentLocations.length > 8) {
          this.recentLocations.pop(); // Remove the oldest location from the bottom
        }
        this.cityName = ''
        this.errorMessage = ''; 
      }
     
    })
    .catch((error) => {
      this.errorMessage = error;
    })
    .finally(() => {
      this.isLoadingAdd = false;
    });
  }

  refreshCity(cityName: string) {
    // this.isLoadingRefresh = true;
    const cityIndex = this.recentLocations.findIndex(location => location.name === cityName);
    const city = this.recentLocations[cityIndex];
    this.fetchWeatherData(cityName)
      .then((weatherData: any) => {
        this.recentLocations[cityIndex].temperature = weatherData.main.temp;
        this.recentLocations[cityIndex].weather = weatherData.weather[0].main;
        this.recentLocations[cityIndex].weatherIcon = this.getWeatherIcon(weatherData.weather[0].main);
        // this.isLoadingRefresh = false;
      })
      .catch((error) => {
        this.errorMessage = error;
        // this.isLoadingRefresh = false;
      })
      .finally(() => {
        // this.isLoadingRefresh = false;
      });
    
  }

  getWeatherIcon(weatherCondition: string): string {
    // Determine weather icon based on weather condition
    return this.weatherIconMapping[weatherCondition] || 'default'; // Default icon if not found
  }
  
  deleteCity(index: number) {
    // Remove the city from the recentLocations array
    this.recentLocations.splice(index, 1);
  }

  getForecast(cityName: string) {
    this.selectedCity = cityName;
    const city = this.recentLocations.find(location => location.name === cityName);
    if(city) {
      this.weatherService.getCityCoords(cityName).subscribe(
        (coords) => {
          const lat = coords[0].lat;
          const lon = coords[0].lon;
        this.weatherService.getForecastByCoords(lat, lon).subscribe(
        (forecastData:any) => {
            if (forecastData.list && forecastData.list.length > 0) {
              // Separate the first forecast
              this.firstForecast = forecastData.list[0];
              console.log(" this.firstForecast",this.firstForecast);
              this.firstForecast.weatherIcon = this.getWeatherIcon(this.firstForecast.weather[0].main);
              const filteredForecasts = this.filterDailyForecasts(forecastData.list);
              console.log(" filteredForecasts",filteredForecasts)
              this.dailyForecasts = filteredForecasts.slice(0); // Skip the first forecast
            }
      },
        (error:any) => {
          this.errorMessage = 'Error fetching forecast data';
        }
      );
    },
      (error:any) => {
        this.errorMessage = 'Error fetching coordinates';
      }
    );
    }
  }

  // Helper method to filter daily forecasts (one per day)
  filterDailyForecasts(forecastList: any[]): any[] {
    const dailyForecasts = forecastList.filter((item: any) => new Date(item.dt_txt).getUTCHours() === 12);
    return dailyForecasts.map((forecast: any) => ({
      date: forecast.dt_txt,
      temperature: forecast.main.temp,
      weather: forecast.weather[0].main,
      weatherIcon: this.getWeatherIcon(forecast.weather[0].main)
    }));


    // const dailyForecasts: any[] = [];
    // const forecastMap = new Map<string, any>();

    // forecastList.forEach((forecast) => {
    //   const date = forecast.dt_txt.split(' ')[0];
    //   //const weatherIcon = this.getWeatherIcon(forecast.weather[0].main);
    //   if (!forecastMap.has(date)) {
    //     forecastMap.set(date, forecast);
    //   }
    //   // if(!forecastMap.has(weatherIcon)) {
    //   //   forecastMap.set(weatherIcon, forecast);
    //   // }
    // });

    // forecastMap.forEach((value) => {
    //   dailyForecasts.push(value);
    // });

    // console.log("dailyForecasts",dailyForecasts)

    // return dailyForecasts;
  }

  refreshForecast() {
    this.getForecast(this.selectedCity); // Reload forecast data
  }

  clearLocations() {
    // Remove all locations from the list
    this.recentLocations = [];
  }
 
}
