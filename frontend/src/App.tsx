import { useEffect, useState } from "react"

type SenseHatReading = {
  timestampUtc: string
  temperature1C: number
  temperature2C: number
  pressureHpa: number
  humidityPercent: number
}

const API_URL = "/api/sensehat"

function App() {
  const [reading, setReading] = useState<SenseHatReading | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch(API_URL)

        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`)
        }

        const data: SenseHatReading = await response.json()
        setReading(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load Sense HAT data")
      }
    }

    load()
    const intervalId = window.setInterval(load, 1000)

    return () => window.clearInterval(intervalId)
  }, [])

  if (error) {
    return <div>{error}</div>
  }

  if (!reading) {
    return <div>Loading Sense HAT data…</div>
  }

  return (
    <main style={{ padding: 24, textAlign: "left" }}>
      <h1>Sense HAT</h1>
      <p>Last update: {new Date(reading.timestampUtc).toLocaleTimeString()}</p>
      <ul>
        <li>Temperature 1: {reading.temperature1C.toFixed(1)} °C</li>
        <li>Temperature 2: {reading.temperature2C.toFixed(1)} °C</li>
        <li>Pressure: {reading.pressureHpa.toFixed(2)} hPa</li>
        <li>Humidity: {reading.humidityPercent.toFixed(1)}%</li>
      </ul>
    </main>
  )
}

export default App
