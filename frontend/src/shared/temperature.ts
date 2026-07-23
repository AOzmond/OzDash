export type TemperatureUnit = "F" | "C"

export function formatTemperature(temperatureC: number, unit: TemperatureUnit) {
  const value = unit === "F" ? (temperatureC * 9) / 5 + 32 : temperatureC
  return `${value.toFixed(1)} °${unit}`
}
