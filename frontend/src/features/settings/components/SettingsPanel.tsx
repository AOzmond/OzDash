type SettingsPanelProps = {
  showCelsius: boolean
  onShowCelsiusChange: (showCelsius: boolean) => void
}

export function SettingsPanel({ showCelsius, onShowCelsiusChange }: SettingsPanelProps) {
  return (
    <section className="settings-card">
      <h2>Settings</h2>
      <label className="setting-option">
        <input
          type="checkbox"
          checked={showCelsius}
          onChange={(event) => onShowCelsiusChange(event.target.checked)}
        />
        <span>Show temperatures in Celsius</span>
      </label>
    </section>
  )
}
