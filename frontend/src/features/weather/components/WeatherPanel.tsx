import { useState, type FormEvent } from "react"
import type { TemperatureUnit } from "../../../shared/temperature"
import { formatTemperature } from "../../../shared/temperature"
import { ZIP_CODE_STORAGE_KEY } from "../constants"
import { useCurrentWeather } from "../hooks/useCurrentWeather"

type WeatherPanelProps = {
  temperatureUnit: TemperatureUnit
}

function getStoredZipCode() {
  return window.localStorage.getItem(ZIP_CODE_STORAGE_KEY) ?? ""
}

export function WeatherPanel({ temperatureUnit }: WeatherPanelProps) {
  const [zipCodeInput, setZipCodeInput] = useState(getStoredZipCode)
  const [submittedZipCode, setSubmittedZipCode] = useState(getStoredZipCode)
  const [validationError, setValidationError] = useState<string | null>(null)
  const { weather, error } = useCurrentWeather(submittedZipCode)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const zipCode = zipCodeInput.trim()
    if (!zipCode) {
      window.localStorage.removeItem(ZIP_CODE_STORAGE_KEY)
      setSubmittedZipCode("")
      setValidationError("Enter a ZIP code.")
      return
    }

    window.localStorage.setItem(ZIP_CODE_STORAGE_KEY, zipCode)
    setSubmittedZipCode(zipCode)
    setValidationError(null)
  }

  return (
    <section className="panel">
      <h2>Local weather</h2>
      <p>Current outdoor conditions from Open-Meteo.</p>
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
      {validationError || error ? <p>{validationError ?? error}</p> : null}
      {!submittedZipCode ? (
        <p>Enter a ZIP code to load local weather.</p>
      ) : !weather ? (
        <p>Loading local weather…</p>
      ) : (
        <ul>
          <li>
            Location: {weather.name}, {weather.countryCode}
          </li>
          <li>ZIP code: {weather.zipCode}</li>
          <li>Temperature: {formatTemperature(weather.temperatureC, temperatureUnit)}</li>
          <li>Humidity: {weather.humidityPercent.toFixed(0)}%</li>
        </ul>
      )}
    </section>
  )
}
