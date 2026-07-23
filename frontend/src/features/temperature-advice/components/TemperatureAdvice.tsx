import { celsiusToFahrenheit } from "../../../shared/temperature"
import { getTemperatureAdvice } from "../getTemperatureAdvice"

type TemperatureAdviceProps = {
  insideTemperatureC: number | null
  outsideTemperatureC: number | null
}

export function TemperatureAdvice({ insideTemperatureC, outsideTemperatureC }: TemperatureAdviceProps) {
  const advice = getTemperatureAdvice(
    insideTemperatureC === null ? null : celsiusToFahrenheit(insideTemperatureC),
    outsideTemperatureC === null ? null : celsiusToFahrenheit(outsideTemperatureC)
  )

  if (!advice) {
    return null
  }

  return (
    <aside className={`temperature-advice temperature-advice--${advice.tone}`} role="status">
      {advice.text}
    </aside>
  )
}
