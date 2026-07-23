import { useState, type FormEvent } from "react"
import type { TemperatureUnit } from "../../../shared/temperature"
import { formatTemperature } from "../../../shared/temperature"
import { ZIP_CODE_STORAGE_KEY } from "../constants"
import type { WeatherReading } from "../types"

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

  return (
    <section className="panel">
      <header className="panel-header">
        <h2>{weather?.name ?? "Local weather"}</h2>
        <form onSubmit={handleSubmit} className="zip-form">
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
      </header>

      {validationError || error ? <p className="panel-message">{validationError ?? error}</p> : null}
      {!submittedZipCode ? (
        <p className="panel-message">Enter a ZIP code to load local weather.</p>
      ) : !weather ? (
        <p className="panel-message">Loading local weather…</p>
      ) : (
        <div className="panel-stats">
          <p
            className="temperature-stat"
            aria-label={`Temperature ${formatTemperature(weather.temperatureC, temperatureUnit)}`}
          >
            {formatTemperature(weather.temperatureC, temperatureUnit)}
          </p>
          <div className="humidity-stat">
            <span className="stat-value">{weather.humidityPercent.toFixed(0)}%</span>
            <span className="stat-label">Humidity</span>
          </div>
          {updatedAt ? <p className="last-updated">Last updated {updatedAt.toLocaleTimeString()}</p> : null}
        </div>
      )}
    </section>
  )
}
