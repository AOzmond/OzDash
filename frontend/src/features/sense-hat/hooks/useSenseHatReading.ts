import { useEffect, useState } from "react"
import { getErrorMessage } from "../../../shared/errors/getErrorMessage"
import { getSenseHatReading } from "../api/getSenseHatReading"
import type { SenseHatReading } from "../types"

const REFRESH_INTERVAL_MS = 1_000

export function useSenseHatReading() {
  const [reading, setReading] = useState<SenseHatReading | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    const loadReading = async () => {
      try {
        const data = await getSenseHatReading(controller.signal)
        setReading(data)
        setError(null)
      } catch (error) {
        if (!controller.signal.aborted) {
          setError(getErrorMessage(error, "Failed to load Sense HAT data"))
        }
      }
    }

    void loadReading()
    const intervalId = window.setInterval(loadReading, REFRESH_INTERVAL_MS)

    return () => {
      controller.abort()
      window.clearInterval(intervalId)
    }
  }, [])

  return { reading, error }
}
