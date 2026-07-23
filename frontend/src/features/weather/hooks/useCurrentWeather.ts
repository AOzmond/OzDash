import { useEffect, useState } from "react"
import { getErrorMessage } from "../../../shared/errors/getErrorMessage"
import { getCurrentWeather } from "../api/getCurrentWeather"
import type { WeatherReading } from "../types"

const REFRESH_INTERVAL_MS = 10 * 60 * 1_000

export function useCurrentWeather(zipCode: string) {
  const [weather, setWeather] = useState<WeatherReading | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null)

  useEffect(() => {
    setWeather(null)
    setError(null)
    setUpdatedAt(null)

    if (!zipCode) {
      return
    }

    const controller = new AbortController()

    const loadWeather = async () => {
      try {
        const data = await getCurrentWeather(zipCode, controller.signal)
        setWeather(data)
        setUpdatedAt(new Date())
        setError(null)
      } catch (error) {
        if (!controller.signal.aborted) {
          setError(getErrorMessage(error, "Failed to load local weather"))
        }
      }
    }

    void loadWeather()
    const intervalId = window.setInterval(loadWeather, REFRESH_INTERVAL_MS)

    return () => {
      controller.abort()
      window.clearInterval(intervalId)
    }
  }, [zipCode])

  return { weather, error, updatedAt }
}
