import type { TemperatureUnit } from "../../../shared/temperature"
import { formatTemperature } from "../../../shared/temperature"
import type { SenseHatReading } from "../types"

type SenseHatPanelProps = {
  temperatureUnit: TemperatureUnit
  reading: SenseHatReading | null
  error: string | null
}

export function SenseHatPanel({ temperatureUnit, reading, error }: SenseHatPanelProps) {
  const averageTemperatureC = reading ? (reading.temperature1C + reading.temperature2C) / 2 : null

  return (
    <section className="panel">
      <header className="panel-header">
        <h2>Sense HAT</h2>
      </header>

      {error ? <p className="panel-message">{error}</p> : null}
      {!reading || averageTemperatureC === null ? (
        <p className="panel-message">Loading Sense HAT data…</p>
      ) : (
        <div className="panel-stats">
          <p
            className="temperature-stat"
            aria-label={`Temperature ${formatTemperature(averageTemperatureC, temperatureUnit)}`}
          >
            {formatTemperature(averageTemperatureC, temperatureUnit)}
          </p>
          <div className="secondary-stats">
            <div className="humidity-stat">
              <span className="stat-value">{reading.humidityPercent.toFixed(1)}%</span>
              <span className="stat-label">Humidity</span>
            </div>
            <div className="pressure-stat">
              <span className="stat-value">{reading.pressureHpa.toFixed(2)} hPa</span>
              <span className="stat-label">Pressure</span>
            </div>
          </div>
          <p className="last-updated">Last updated {new Date(reading.timestampUtc).toLocaleTimeString()}</p>
        </div>
      )}
    </section>
  )
}
