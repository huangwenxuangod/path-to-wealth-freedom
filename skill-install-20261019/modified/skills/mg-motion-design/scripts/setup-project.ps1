param(
  [Parameter(Mandatory = $true)][string]$Target,
  [switch]$SkipInstall
)

$ErrorActionPreference = 'Stop'
$skill = Split-Path -Parent $PSScriptRoot
$assets = Join-Path $skill 'assets'

New-Item -ItemType Directory -Force -Path $Target | Out-Null
$Target = (Resolve-Path -LiteralPath $Target).Path

foreach ($dir in @('harness', 'lib')) {
  Copy-Item -LiteralPath (Join-Path $assets $dir) -Destination $Target -Recurse -Force
}
New-Item -ItemType Directory -Force -Path (Join-Path $Target 'assets') | Out-Null
Copy-Item -LiteralPath (Join-Path $assets 'fonts') -Destination (Join-Path $Target 'assets') -Recurse -Force
Copy-Item -LiteralPath (Join-Path $assets 'textures') -Destination (Join-Path $Target 'assets') -Recurse -Force
Copy-Item -LiteralPath (Join-Path $assets 'package.json') -Destination $Target -Force
Copy-Item -LiteralPath (Join-Path $assets 'requirements.txt') -Destination $Target -Force

$demos = Join-Path $Target 'demos'
New-Item -ItemType Directory -Force -Path $demos | Out-Null
foreach ($demo in @('09-bauhaus', '01-flat-vector', '10-synthwave')) {
  Copy-Item -LiteralPath (Join-Path $skill "examples\$demo") -Destination (Join-Path $demos $demo) -Recurse -Force
}

if (-not $SkipInstall) {
  Push-Location $Target
  try { npm install --no-audit --no-fund } finally { Pop-Location }
}

$chrome = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
Write-Output "workspace: $Target"
Write-Output 'Font files are not bundled. Missing font URLs block document.fonts.ready; either add the fonts listed in assets/fonts/README.md or replace assets/fonts/fonts.css with an empty file to use system fallbacks.'
if (Test-Path -LiteralPath $chrome) {
  Write-Output "set before rendering: `$env:MG_CHROME = `"$chrome`""
} else {
  Write-Output 'Chrome not found at the default path; set $env:MG_CHROME to your chrome.exe'
}
Write-Output "render: node harness/render.mjs demos/09-bauhaus --stills 0.5,3,6,9"
Write-Output "audio:  uv run --python 3.12 --with numpy --with scipy --with soundfile --with numba --with pedalboard --with pyloudnorm --with matplotlib python demos/09-bauhaus/audio.py"
