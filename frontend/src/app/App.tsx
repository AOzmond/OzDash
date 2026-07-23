import { useState } from "react"
import { SenseHatPanel } from "../features/sense-hat/components/SenseHatPanel"
import { WeatherPanel } from "../features/weather/components/WeatherPanel"
import type { TemperatureUnit } from "../shared/temperature"
import "./App.css"

export function App() {
  const [temperatureUnit, setTemperatureUnit] = useState<TemperatureUnit>("F")

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
        <SenseHatPanel temperatureUnit={temperatureUnit} />
        <WeatherPanel temperatureUnit={temperatureUnit} />
      </div>
    </main>
  )
}
