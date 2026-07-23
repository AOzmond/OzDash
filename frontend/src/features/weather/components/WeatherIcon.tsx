import { SvgIcon } from "../../../shared/components/SvgIcon"
import clearIcon from "../assets/icons/clear.svg"
import cloudyIcon from "../assets/icons/cloudy.svg"
import fogIcon from "../assets/icons/fog.svg"
import partlyCloudyIcon from "../assets/icons/partly-cloudy.svg"
import rainIcon from "../assets/icons/rain.svg"
import snowIcon from "../assets/icons/snow.svg"
import stormIcon from "../assets/icons/storm.svg"

type WeatherCondition = {
  icon: string
  label: string
}

function getWeatherCondition(code: number): WeatherCondition {
  if (code === 0) return { icon: clearIcon, label: "Clear sky" }
  if (code === 1 || code === 2) return { icon: partlyCloudyIcon, label: "Partly cloudy" }
  if (code === 3) return { icon: cloudyIcon, label: "Overcast" }
  if (code === 45 || code === 48) return { icon: fogIcon, label: "Foggy" }
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) {
    return { icon: snowIcon, label: "Snow" }
  }
  if (code >= 95) return { icon: stormIcon, label: "Thunderstorm" }
  return { icon: rainIcon, label: "Rain" }
}

export function WeatherIcon({ code }: { code: number }) {
  const condition = getWeatherCondition(code)
  return <SvgIcon src={condition.icon} className="temperature-icon weather-icon" label={condition.label} />
}
