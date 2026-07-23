import { fetchJson } from "../../../shared/api/fetchJson"
import type { SenseHatReading } from "../types"

const SENSE_HAT_API_URL = "/api/sensehat"

export function getSenseHatReading(signal?: AbortSignal) {
  return fetchJson<SenseHatReading>(SENSE_HAT_API_URL, { signal })
}
