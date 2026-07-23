import { fetchJson } from "../../../shared/api/fetchJson"
import type { WeatherReading } from "../types"

const CURRENT_WEATHER_API_URL = "/api/weather/current"

export function getCurrentWeather(zipCode: string, signal?: AbortSignal) {
  const searchParams = new URLSearchParams({ zipCode })
  return fetchJson<WeatherReading>(`${CURRENT_WEATHER_API_URL}?${searchParams}`, { signal })
}
