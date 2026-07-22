#!/usr/bin/env bash
set -euo pipefail

resolve_dotnet() {
  if [ -n "${DOTNET_ROOT:-}" ] && [ -x "${DOTNET_ROOT}/dotnet" ]; then
    printf '%s\n' "${DOTNET_ROOT}/dotnet"
    return 0
  fi

  if command -v dotnet >/dev/null 2>&1; then
    command -v dotnet
    return 0
  fi

  for candidate in \
    "$HOME/.dotnet/dotnet" \
    /usr/share/dotnet/dotnet \
    /usr/local/share/dotnet/dotnet
  do
    if [ -x "$candidate" ]; then
      printf '%s\n' "$candidate"
      return 0
    fi
  done

  return 1
}

dotnet_bin="$(resolve_dotnet)" || {
  echo "dotnet not found. Set DOTNET_ROOT or install the .NET SDK." >&2
  exit 127
}

exec "$dotnet_bin" "$@"
