import { useState } from "react"
import cogIcon from "../features/settings/assets/icons/cog.svg"
import { SettingsPanel } from "../features/settings/components/SettingsPanel"
import { SenseHatPanel } from "../features/sense-hat/components/SenseHatPanel"
import { useSenseHatReading } from "../features/sense-hat/hooks/useSenseHatReading"
import { TemperatureAdvice } from "../features/temperature-advice/components/TemperatureAdvice"
import { WeatherPanel } from "../features/weather/components/WeatherPanel"
import { ZIP_CODE_STORAGE_KEY } from "../features/weather/constants"
import { useCurrentWeather } from "../features/weather/hooks/useCurrentWeather"
import { SvgIcon } from "../shared/components/SvgIcon"
import type { TemperatureUnit } from "../shared/temperature"
import "./App.css"

export function App() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "settings">("dashboard")
  const [temperatureUnit, setTemperatureUnit] = useState<TemperatureUnit>("F")
  const [zipCode, setZipCode] = useState(() => window.localStorage.getItem(ZIP_CODE_STORAGE_KEY) ?? "")
  const { reading, error: senseHatError } = useSenseHatReading()
  const { weather, error: weatherError, updatedAt } = useCurrentWeather(zipCode)
  const insideTemperatureC = reading ? (reading.temperature1C + reading.temperature2C) / 2 : null

  return (
    <main className="app-shell">
      <header className="app-header">
        <nav className="tabs" role="tablist" aria-label="Application sections">
          <button
            type="button"
            id="dashboard-tab"
            className="tab-button"
            role="tab"
            aria-selected={activeTab === "dashboard"}
            aria-controls="dashboard-panel"
            onClick={() => setActiveTab("dashboard")}
          >
            Dashboard
          </button>
          <button
            type="button"
            id="settings-tab"
            className="tab-button"
            role="tab"
            aria-label="Settings"
            aria-selected={activeTab === "settings"}
            aria-controls="settings-panel"
            title="Settings"
            onClick={() => setActiveTab("settings")}
          >
            <SvgIcon src={cogIcon} className="tab-icon" />
          </button>
        </nav>
      </header>

      <div
        id="dashboard-panel"
        className="tab-panel dashboard-tab-panel"
        role="tabpanel"
        aria-labelledby="dashboard-tab"
        hidden={activeTab !== "dashboard"}
      >
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
      </div>

      <div
        id="settings-panel"
        className="tab-panel"
        role="tabpanel"
        aria-labelledby="settings-tab"
        hidden={activeTab !== "settings"}
      >
        <SettingsPanel
          showCelsius={temperatureUnit === "C"}
          onShowCelsiusChange={(showCelsius) => setTemperatureUnit(showCelsius ? "C" : "F")}
        />
      </div>
    </main>
  )
}
