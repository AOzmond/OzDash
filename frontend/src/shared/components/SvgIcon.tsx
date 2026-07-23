type SvgIconProps = {
  src: string
  className: string
  label?: string
}

export function SvgIcon({ src, className, label }: SvgIconProps) {
  return (
    <img
      src={src}
      className={`svg-icon ${className}`}
      alt={label ?? ""}
      aria-hidden={label ? undefined : true}
    />
  )
}
