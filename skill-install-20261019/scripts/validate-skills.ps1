param(
  [Parameter(Mandatory = $true)][string]$SkillsRoot
)

$ErrorActionPreference = 'Stop'
$names = @('mg-motion-design', 'weilanx-video-studio', 'video-production-playbook', 'lemo-opuscar', 'ancient-rap-battle')
$fail = 0
$results = @()

function Fail([string]$skill, [string]$message) {
  $script:fail++
  $script:results += [pscustomobject]@{ skill = $skill; check = 'FAIL'; detail = $message }
}

function Pass([string]$skill, [string]$message) {
  $script:results += [pscustomobject]@{ skill = $skill; check = 'PASS'; detail = $message }
}

foreach ($name in $names) {
  $dir = Join-Path $SkillsRoot $name
  if (-not (Test-Path -LiteralPath $dir)) { Fail $name 'directory missing'; continue }
  $sm = Join-Path $dir 'SKILL.md'
  if (-not (Test-Path -LiteralPath $sm)) { Fail $name 'SKILL.md missing'; continue }

  $text = Get-Content -LiteralPath $sm -Raw
  if ($text -notmatch '(?s)^---\r?\n(.*?)\r?\n---') { Fail $name 'frontmatter missing'; continue }
  $fm = $Matches[1]
  $declared = if ($fm -match '(?m)^name:\s*(.+?)\s*$') { $Matches[1].Trim() } else { '' }
  $desc = if ($fm -match '(?m)^description:\s*(.+?)\s*$') { $Matches[1].Trim() } else { '' }
  if ($declared -ne $name) { Fail $name "frontmatter name '$declared' != directory" } else { Pass $name 'frontmatter name matches' }
  if ($desc.Length -lt 40) { Fail $name 'description too short' } else { Pass $name "description $($desc.Length) chars" }

  $required = switch ($name) {
    'mg-motion-design' { @('references\prompts\09-bauhaus.md', 'references\rubric.md', 'references\template.md', 'assets\harness\render.mjs', 'assets\lib\audio\mgaudio\__init__.py', 'assets\package.json', 'examples\09-bauhaus\film.js', 'scripts\setup-project.ps1') }
    'weilanx-video-studio' { @('assets\project\package.json', 'assets\project\AGENTS.md', 'assets\project\src\Root.tsx', 'assets\project\.claude\skills\weilanx-creator-vox-video\SKILL.md') }
    'video-production-playbook' { @('references\docs\prompt-playbook.zh-CN.md', 'references\docs\production-brief.zh-CN.md', 'data\collection-index.csv', 'data\collection-summary.json') }
    'lemo-opuscar' { @('assets\library\AGENTS.md', 'assets\library\DIRECTOR.md', 'assets\library\TECHNIQUE.md', 'assets\library\core\render\video.mjs', 'assets\library\styles\README.md', 'scripts\setup.ps1') }
    'ancient-rap-battle' { @('scripts\analyze_song.py', 'scripts\seedance_packs.py', 'scripts\package.py', 'references\lyrics-guide.md', 'examples\zhugeliang-vs-simayi\episode.json') }
  }
  foreach ($rel in $required) {
    if (Test-Path -LiteralPath (Join-Path $dir $rel)) { Pass $name "present: $rel" } else { Fail $name "missing: $rel" }
  }

  if ($name -eq 'mg-motion-design') {
    $count = (Get-ChildItem -LiteralPath (Join-Path $dir 'references\prompts') -Filter '*.md').Count
    if ($count -eq 15) { Pass $name 'prompt files = 15' } else { Fail $name "prompt files = $count (expected 15)" }
  }
}

$results | Format-Table -AutoSize
if ($fail -gt 0) { Write-Output "RESULT: FAIL ($fail)"; exit 1 }
Write-Output "RESULT: PASS"
exit 0
