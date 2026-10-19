param(
  [string]$LibraryHome = (Join-Path $env:USERPROFILE 'lemo-opuscar'),
  [switch]$SkipDeps
)

$ErrorActionPreference = 'Stop'
$skill = Split-Path -Parent $PSScriptRoot
$bundled = Join-Path $skill 'assets\library'

if (-not (Test-Path -LiteralPath (Join-Path $LibraryHome 'AGENTS.md'))) {
  Write-Output "copying bundled library -> $LibraryHome"
  New-Item -ItemType Directory -Force -Path $LibraryHome | Out-Null
  Copy-Item -Path (Join-Path $bundled '*') -Destination $LibraryHome -Recurse -Force
} else {
  Write-Output "library already present: $LibraryHome"
}

$env:LEMO_OPUSCAR_HOME = $LibraryHome
Push-Location $LibraryHome
try {
  if (-not $SkipDeps) {
    npm install --no-audit --no-fund
    node node_modules/playwright-core/cli.js install chromium-headless-shell

    if (-not (Test-Path -LiteralPath '.venv\Scripts\python.exe')) {
      if (Get-Command uv -ErrorAction SilentlyContinue) {
        uv venv --python 3.12 .venv
      } else {
        py -3.12 -m venv .venv
      }
    }
    if (Get-Command uv -ErrorAction SilentlyContinue) {
      uv pip install --python .venv\Scripts\python.exe -r requirements.txt
    } else {
      .\.venv\Scripts\python.exe -m pip install --disable-pip-version-check -r requirements.txt
    }
  }
} finally {
  Pop-Location
}

Write-Output "LIB=$LibraryHome"
Write-Output "set: `$env:LEMO_OPUSCAR_HOME = `"$LibraryHome`""
Write-Output "render still: cd '$LibraryHome'; node core/render/still.mjs <project> 1.5 3"
