export type TemperatureAdvice = {
  tone: "info" | "warn"
  text: string
}

export function getTemperatureAdvice(
  insideTempF: number | null | undefined,
  outsideTempF: number | null | undefined
): TemperatureAdvice | null {
  if (insideTempF === null || insideTempF === undefined) {
    return null
  }

  if (outsideTempF === null || outsideTempF === undefined) {
    return null
  }

  if (outsideTempF <= 45) {
    return {
      tone: "warn",
      text: "It’s too cold outside to open the windows. Keep them closed and keep the heat on.",
    }
  }

  if (outsideTempF < insideTempF) {
    return {
      tone: "info",
      text: "It’s cooler outside than inside. Open the window to cool the room naturally.",
    }
  }

  if (outsideTempF > insideTempF) {
    return {
      tone: "warn",
      text: "It’s hotter outside than inside. Close the windows and turn on the A/C.",
    }
  }

  return null
}
