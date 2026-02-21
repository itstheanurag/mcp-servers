export interface NWSGridPoint {
  properties: {
    forecast: string;
    forecastHourly: string;
    forecastGridData: string;
    observationStations: string;
    relativeLocation: {
      properties: {
        city: string;
        state: string;
      };
    };
  };
}

export interface NWSForecastPeriod {
  number: number;
  name: string;
  temperature: number;
  temperatureUnit: string;
  windSpeed: string;
  windDirection: string;
  shortForecast: string;
  detailedForecast: string;
  isDaytime: boolean;
  startTime: string;
  endTime: string;
}

export interface NWSForecast {
  properties: {
    periods: NWSForecastPeriod[];
    updated: string;
  };
}

export interface WeatherData {
  location: string;
  state: string;
  current: {
    temperature: number;
    unit: string;
    forecast: string;
    wind: string;
  };
  forecast: Array<{
    day: string;
    temperature: number;
    unit: string;
    forecast: string;
    wind: string;
  }>;
}

export interface ToolArguments {
  latitude: number;
  longitude: number;
}
