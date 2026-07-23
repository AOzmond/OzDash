import { useState } from "react"
import { SenseHatPanel } from "../features/sense-hat/components/SenseHatPanel"
import { useSenseHatReading } from "../features/sense-hat/hooks/useSenseHatReading"
import { TemperatureAdvice } from "../features/temperature-advice/components/TemperatureAdvice"
import { WeatherPanel } from "../features/weather/components/WeatherPanel"
import { ZIP_CODE_STORAGE_KEY } from "../features/weather/constants"
import { useCurrentWeather } from "../features/weather/hooks/useCurrentWeather"
import type { TemperatureUnit } from "../shared/temperature"
import "./App.css"

export function App() {
  const [temperatureUnit, setTemperatureUnit] = useState<TemperatureUnit>("F")
  const [zipCode, setZipCode] = useState(() => window.localStorage.getItem(ZIP_CODE_STORAGE_KEY) ?? "")
  const { reading, error: senseHatError } = useSenseHatReading()
  const { weather, error: weatherError, updatedAt } = useCurrentWeather(zipCode)
  const insideTemperatureC = reading ? (reading.temperature1C + reading.temperature2C) / 2 : null

  const toggleTemperatureUnit = () => {
    setTemperatureUnit((current) => (current === "F" ? "C" : "F"))
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <button type="button" className="unit-toggle" onClick={toggleTemperatureUnit}>
          Show {temperatureUnit === "F" ? "Celsius" : "Fahrenheit"}
        </button>
      </header>

      <div className="panels">
        <SenseHatPanel temperatureUnit={temperatureUnit} reading={reading} error={senseHatError} />
        <WeatherPanel
          temperatureUnit={temperatureUnit}
          submittedZipCode={zipCode}
          onZipCodeSubmit={setZipCode}
          weather={weather}
          error={weatherError}
          updatedAt={updatedAt}
        />
      </div>

      <TemperatureAdvice
        insideTemperatureC={insideTemperatureC}
        outsideTemperatureC={weather?.temperatureC ?? null}
      />
    </main>
  )
}
