import type { TemperatureUnit } from "../../../shared/temperature"
import { formatTemperature } from "../../../shared/temperature"
import { useSenseHatReading } from "../hooks/useSenseHatReading"

type SenseHatPanelProps = {
  temperatureUnit: TemperatureUnit
}

export function SenseHatPanel({ temperatureUnit }: SenseHatPanelProps) {
  const { reading, error } = useSenseHatReading()

  return (
    <section className="panel">
      <h2>Sense HAT</h2>
      {error ? <p>{error}</p> : null}
      {!reading ? (
        <p>Loading Sense HAT data…</p>
      ) : (
        <>
          <p>Last update: {new Date(reading.timestampUtc).toLocaleTimeString()}</p>
          <ul>
            <li>Temperature 1: {formatTemperature(reading.temperature1C, temperatureUnit)}</li>
            <li>Temperature 2: {formatTemperature(reading.temperature2C, temperatureUnit)}</li>
            <li>Pressure: {reading.pressureHpa.toFixed(2)} hPa</li>
            <li>Humidity: {reading.humidityPercent.toFixed(1)}%</li>
          </ul>
        </>
      )}
    </section>
  )
}
