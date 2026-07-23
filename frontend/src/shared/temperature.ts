export type TemperatureUnit = "F" | "C"

export function celsiusToFahrenheit(temperatureC: number) {
  return (temperatureC * 9) / 5 + 32
}

export function formatTemperature(temperatureC: number, unit: TemperatureUnit) {
  const value = unit === "F" ? celsiusToFahrenheit(temperatureC) : temperatureC
  return `${value.toFixed(1)} °${unit}`
}
