import { useEffect, useState, type FormEvent } from "react"
import "./App.css"

type SenseHatReading = {
  timestampUtc: string
  temperature1C: number
  temperature2C: number
  pressureHpa: number
  humidityPercent: number
}

type OpenMeteoWeatherReading = {
  zipCode: string
  name: string
  countryCode: string
  temperatureC: number
  humidityPercent: number
}

const SENSE_HAT_API_URL = "/api/sensehat"
const WEATHER_API_URL = "/api/weather/current"
const ZIP_CODE_STORAGE_KEY = "ozdash.lastZipCode"

function App() {
  const [temperatureUnit, setTemperatureUnit] = useState<"F" | "C">("F")
  const [reading, setReading] = useState<SenseHatReading | null>(null)
  const [senseHatError, setSenseHatError] = useState<string | null>(null)
  const [weather, setWeather] = useState<OpenMeteoWeatherReading | null>(null)
  const [weatherError, setWeatherError] = useState<string | null>(null)
  const [zipCodeInput, setZipCodeInput] = useState(() => {
    if (typeof window === "undefined") {
      return ""
    }

    return window.localStorage.getItem(ZIP_CODE_STORAGE_KEY) ?? ""
  })
  const [submittedZipCode, setSubmittedZipCode] = useState<string | null>(() => {
    if (typeof window === "undefined") {
      return null
    }

    return window.localStorage.getItem(ZIP_CODE_STORAGE_KEY)
  })

  const convertTemperature = (temperatureC: number) =>
    temperatureUnit === "F" ? (temperatureC * 9) / 5 + 32 : temperatureC

  const temperatureSuffix = temperatureUnit === "F" ? "°F" : "°C"

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch(SENSE_HAT_API_URL)

        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`)
        }

        const data: SenseHatReading = await response.json()
        setReading(data)
        setSenseHatError(null)
      } catch (err) {
        setSenseHatError(err instanceof Error ? err.message : "Failed to load Sense HAT data")
      }
    }

    load()
    const intervalId = window.setInterval(load, 1000)

    return () => window.clearInterval(intervalId)
  }, [])

  useEffect(() => {
    if (!submittedZipCode) {
      setWeather(null)
      setWeatherError(null)
      return
    }

    const load = async () => {
      try {
        const response = await fetch(`${WEATHER_API_URL}?zipCode=${encodeURIComponent(submittedZipCode)}`)

        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`)
        }

        const data: OpenMeteoWeatherReading = await response.json()
        setWeather(data)
        setWeatherError(null)
      } catch (err) {
        setWeatherError(err instanceof Error ? err.message : "Failed to load local weather")
      }
    }

    load()
    const intervalId = window.setInterval(load, 10 * 60 * 1000)

    return () => window.clearInterval(intervalId)
  }, [submittedZipCode])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmed = zipCodeInput.trim()
    if (trimmed.length === 0) {
      setSubmittedZipCode(null)
      setWeather(null)
      setWeatherError("Enter a ZIP code.")
      window.localStorage.removeItem(ZIP_CODE_STORAGE_KEY)
      return
    }

    window.localStorage.setItem(ZIP_CODE_STORAGE_KEY, trimmed)
    setSubmittedZipCode(trimmed)
  }

  return (
    <main className="app-shell">
      <div className="app-header">
        <button
          type="button"
          className="unit-toggle"
          onClick={() => setTemperatureUnit((current) => (current === "F" ? "C" : "F"))}
        >
          Show {temperatureUnit === "F" ? "Celsius" : "Fahrenheit"}
        </button>
      </div>

      <div className="panels">
        <section className="panel">
          <h2>Sense HAT</h2>
          {senseHatError ? <p>{senseHatError}</p> : null}
          {!reading ? (
            <p>Loading Sense HAT data…</p>
          ) : (
            <>
              <p>Last update: {new Date(reading.timestampUtc).toLocaleTimeString()}</p>
              <ul>
                <li>
                  Temperature 1: {convertTemperature(reading.temperature1C).toFixed(1)} {temperatureSuffix}
                </li>
                <li>
                  Temperature 2: {convertTemperature(reading.temperature2C).toFixed(1)} {temperatureSuffix}
                </li>
                <li>Pressure: {reading.pressureHpa.toFixed(2)} hPa</li>
                <li>Humidity: {reading.humidityPercent.toFixed(1)}%</li>
              </ul>
            </>
          )}
        </section>

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
          {weatherError ? <p>{weatherError}</p> : null}
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
              <li>
                Temperature: {convertTemperature(weather.temperatureC).toFixed(1)} {temperatureSuffix}
              </li>
              <li>Humidity: {weather.humidityPercent.toFixed(0)}%</li>
            </ul>
          )}
        </section>
      </div>
    </main>
  )
}

export default App
