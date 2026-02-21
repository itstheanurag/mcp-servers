import { WEATHER_URL, WEATHER_USER_AGENT } from "./constant";
import type {
  NWSGridPoint,
  NWSForecast,
  WeatherData,
  NWSForecastPeriod,
} from "./types";

async function fetchNWS<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: {
      "User-Agent": WEATHER_USER_AGENT,
      Accept: "application/geo+json",
    },
  });

  if (!response.ok) {
    throw new Error(`NWS API error: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

export async function getGridPoint(
  latitude: number,
  longitude: number,
): Promise<NWSGridPoint> {
  // NWS API uses points endpoint with lat,lon
  const url = `${WEATHER_URL}/points/${latitude},${longitude}`;
  return fetchNWS<NWSGridPoint>(url);
}

export async function getForecast(forecastUrl: string): Promise<NWSForecast> {
  return fetchNWS<NWSForecast>(forecastUrl);
}

export async function getWeatherByCoordinates(
  latitude: number,
  longitude: number,
): Promise<WeatherData> {
  // Step 1: Get grid point data
  const gridPoint = await getGridPoint(latitude, longitude);

  const { properties } = gridPoint;
  const location = properties.relativeLocation.properties;
  const state = location.state;

  // Step 2: Get forecast
  const forecast = await getForecast(properties.forecast);

  // Step 3: Parse the forecast data
  const periods = forecast.properties.periods;

  // Current conditions (first period)
  const currentPeriod = periods[0];

  if (!currentPeriod) {
    throw new Error("No forecast data available");
  }

  const current = {
    temperature: currentPeriod.temperature,
    unit: currentPeriod.temperatureUnit,
    forecast: currentPeriod.shortForecast,
    wind: `${currentPeriod.windSpeed} ${currentPeriod.windDirection}`,
  };

  // Get next 5 forecast periods
  const forecastDays = periods.slice(0, 5).map((period: NWSForecastPeriod) => ({
    day: period.name,
    temperature: period.temperature,
    unit: period.temperatureUnit,
    forecast: period.shortForecast,
    wind: `${period.windSpeed} ${period.windDirection}`,
  }));

  return {
    location: location.city,
    state,
    current,
    forecast: forecastDays,
  };
}
