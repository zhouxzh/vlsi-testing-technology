param(
    [Parameter(Mandatory = $true)]
    [string]$SourcePath,
    [Parameter(Mandatory = $true)]
    [string]$OutputDir,
    [int]$Width = 1600,
    [int]$Height = 900
)

$ErrorActionPreference = "Stop"
$source = (Resolve-Path -LiteralPath $SourcePath).Path
New-Item -ItemType Directory -Force -Path $OutputDir | Out-Null
$output = (Resolve-Path -LiteralPath $OutputDir).Path
$powerPoint = $null
$presentation = $null

try {
    $powerPoint = New-Object -ComObject PowerPoint.Application
    $presentation = $powerPoint.Presentations.Open($source, $true, $false, $false)
    for ($index = 1; $index -le $presentation.Slides.Count; $index++) {
        $target = Join-Path $output ("page-{0:D3}.jpg" -f $index)
        $presentation.Slides.Item($index).Export($target, "JPG", $Width, $Height)
    }
    Write-Output ("Exported {0} slides to {1}" -f $presentation.Slides.Count, $output)
}
finally {
    if ($null -ne $presentation) {
        $presentation.Close()
        [System.Runtime.InteropServices.Marshal]::ReleaseComObject($presentation) | Out-Null
    }
    if ($null -ne $powerPoint) {
        $powerPoint.Quit()
        [System.Runtime.InteropServices.Marshal]::ReleaseComObject($powerPoint) | Out-Null
    }
    [GC]::Collect()
    [GC]::WaitForPendingFinalizers()
}
