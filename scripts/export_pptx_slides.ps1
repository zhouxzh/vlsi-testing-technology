param(
    [string]$ReferenceDir = "reference",
    [string]$OutputRoot = "reference/materials-v1/assets",
    [int[]]$Chapters = 1..12,
    [int]$Width = 1600,
    [int]$Height = 900
)

$ErrorActionPreference = "Stop"
$referencePath = (Resolve-Path -LiteralPath $ReferenceDir).Path
$outputPath = [System.IO.Path]::GetFullPath((Join-Path (Get-Location) $OutputRoot))
$powerPoint = $null
$presentation = $null

try {
    $powerPoint = New-Object -ComObject PowerPoint.Application
    foreach ($chapter in $Chapters) {
        $sourceName = "{0}{1}{2}.pptx" -f ([char]0x7B2C), $chapter, ([char]0x7AE0)
        $source = Join-Path $referencePath $sourceName
        if (-not (Test-Path -LiteralPath $source)) {
            throw "Missing deck: $source"
        }

        $chapterDir = Join-Path $outputPath ("ch{0:D2}" -f $chapter)
        New-Item -ItemType Directory -Force -Path $chapterDir | Out-Null
        $presentation = $powerPoint.Presentations.Open($source, $true, $false, $false)
        $count = $presentation.Slides.Count
        for ($index = 1; $index -le $count; $index++) {
            $target = Join-Path $chapterDir ("page-{0:D3}.jpg" -f $index)
            $presentation.Slides.Item($index).Export($target, "JPG", $Width, $Height)
        }
        $presentation.Close()
        [System.Runtime.InteropServices.Marshal]::ReleaseComObject($presentation) | Out-Null
        $presentation = $null
        Write-Output ("chapter {0}: exported {1} slides" -f $chapter, $count)
    }
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
