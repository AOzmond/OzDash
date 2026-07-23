import { useState, type FormEvent } from "react"
import type { TemperatureUnit } from "../../../shared/temperature"
import { formatTemperature } from "../../../shared/temperature"
import { ZIP_CODE_STORAGE_KEY } from "../constants"
import type { WeatherReading } from "../types"
import { WeatherIcon } from "./WeatherIcon"

type WeatherPanelProps = {
  temperatureUnit: TemperatureUnit
  submittedZipCode: string
  onZipCodeSubmit: (zipCode: string) => void
  weather: WeatherReading | null
  error: string | null
  updatedAt: Date | null
}

export function WeatherPanel({
  temperatureUnit,
  submittedZipCode,
  onZipCodeSubmit,
  weather,
  error,
  updatedAt,
}: WeatherPanelProps) {
  const [zipCodeInput, setZipCodeInput] = useState(submittedZipCode)
  const [validationError, setValidationError] = useState<string | null>(null)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const zipCode = zipCodeInput.trim()
    if (!zipCode) {
      window.localStorage.removeItem(ZIP_CODE_STORAGE_KEY)
      onZipCodeSubmit("")
      setValidationError("Enter a ZIP code.")
      return
    }

    window.localStorage.setItem(ZIP_CODE_STORAGE_KEY, zipCode)
    onZipCodeSubmit(zipCode)
    setValidationError(null)
  }

  const zipCodeForm = (
    <form onSubmit={handleSubmit} className={`zip-form${weather ? " zip-form--dropdown" : ""}`}>
      <input
        aria-label="ZIP code"
        inputMode="numeric"
        pattern="[0-9]{5}(-[0-9]{4})?"
        placeholder="ZIP code"
        value={zipCodeInput}
        onChange={(event) => setZipCodeInput(event.target.value)}
        className="zip-input"
      />
      <button type="submit" className="zip-submit">
        Load
      </button>
    </form>
  )

  return (
    <section className="panel">
      <header className="panel-header">
        {weather ? (
          <details className="zip-disclosure">
            <summary className="location-summary">{weather.name}</summary>
            {zipCodeForm}
          </details>
        ) : (
          <>
            <h2>Local weather</h2>
            {zipCodeForm}
          </>
        )}
      </header>

      {validationError || error ? <p className="panel-message">{validationError ?? error}</p> : null}
      {!submittedZipCode ? (
        <p className="panel-message">Enter a ZIP code to load local weather.</p>
      ) : !weather ? (
        <p className="panel-message">Loading local weather…</p>
      ) : (
        <div className="panel-stats">
          <div className="temperature-row">
            <p
              className="temperature-stat"
              aria-label={`Temperature ${formatTemperature(weather.temperatureC, temperatureUnit)}`}
            >
              {formatTemperature(weather.temperatureC, temperatureUnit)}
            </p>
            <WeatherIcon code={weather.weatherCode} />
          </div>
          <div className="secondary-stats weather-secondary-stats">
            <div className="humidity-stat">
              <span className="stat-value">{weather.humidityPercent.toFixed(0)}%</span>
              <span className="stat-label">Humidity</span>
            </div>
            <div className="rain-stat">
              <span className="stat-value">{weather.precipitationProbabilityPercent.toFixed(0)}%</span>
              <span className="stat-label">Chance of rain</span>
            </div>
            <div className="wind-stat">
              <span className="stat-value">{weather.windSpeedMph.toFixed(1)} mph</span>
              <span className="stat-label">Wind</span>
            </div>
          </div>
          {updatedAt ? <p className="last-updated">Last updated {updatedAt.toLocaleTimeString()}</p> : null}
        </div>
      )}
    </section>
  )
}
