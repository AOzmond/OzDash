type WeatherKind = "clear" | "partly-cloudy" | "cloudy" | "fog" | "rain" | "snow" | "storm"

type WeatherCondition = {
  kind: WeatherKind
  label: string
}

function getWeatherCondition(code: number): WeatherCondition {
  if (code === 0) return { kind: "clear", label: "Clear sky" }
  if (code === 1 || code === 2) return { kind: "partly-cloudy", label: "Partly cloudy" }
  if (code === 3) return { kind: "cloudy", label: "Overcast" }
  if (code === 45 || code === 48) return { kind: "fog", label: "Foggy" }
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) {
    return { kind: "snow", label: "Snow" }
  }
  if (code >= 95) return { kind: "storm", label: "Thunderstorm" }
  return { kind: "rain", label: "Rain" }
}

function Cloud() {
  return <path d="M17 47h31a9 9 0 0 0 1-17.9A15 15 0 0 0 20.5 27 10 10 0 0 0 17 47Z" />
}

export function WeatherIcon({ code }: { code: number }) {
  const condition = getWeatherCondition(code)

  return (
    <svg
      className="temperature-icon weather-icon"
      viewBox="0 0 64 64"
      role="img"
      aria-label={condition.label}
      fill="none"
      stroke="currentColor"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {condition.kind === "clear" ? (
        <>
          <circle cx="32" cy="32" r="10" />
          <path d="M32 8v7M32 49v7M8 32h7M49 32h7M15 15l5 5M44 44l5 5M49 15l-5 5M20 44l-5 5" />
        </>
      ) : null}
      {condition.kind === "partly-cloudy" ? (
        <>
          <circle cx="24" cy="23" r="9" />
          <path d="M24 7v5M8 23h5M12.5 11.5l3.5 3.5" />
          <Cloud />
        </>
      ) : null}
      {condition.kind === "cloudy" ? <Cloud /> : null}
      {condition.kind === "fog" ? (
        <>
          <Cloud />
          <path d="M14 53h38M20 59h28" />
        </>
      ) : null}
      {condition.kind === "rain" ? (
        <>
          <Cloud />
          <path d="M24 52l-2 5M34 52l-2 5M44 52l-2 5" />
        </>
      ) : null}
      {condition.kind === "snow" ? (
        <>
          <Cloud />
          <path d="M24 52v6M21 55h6M40 52v6M37 55h6" />
        </>
      ) : null}
      {condition.kind === "storm" ? (
        <>
          <Cloud />
          <path d="M35 48l-6 8h6l-3 6" />
        </>
      ) : null}
    </svg>
  )
}
