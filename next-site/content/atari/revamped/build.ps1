param([switch]$Check, [string]$Assembler = 'dasm')

$ErrorActionPreference = 'Stop'
$roms = Join-Path $PSScriptRoot '..\..\..\public\atari\roms'
$temp = [IO.Path]::GetTempFileName()
try {
    foreach ($id in 'super-step-bros-revamped', 'skateboard-steve-revamped', 'simon-says-revamped') {
        & $Assembler "$PSScriptRoot\$id.dasm" "-I$PSScriptRoot\include" -f3 "-o$temp"
        if ($LASTEXITCODE -ne 0) { throw "Assembly failed: $id" }
        if ((Get-Item -LiteralPath $temp).Length -ne 4096) { throw "Expected a 4 KiB cartridge: $id" }

        $rom = Join-Path $roms "$id.bin"
        if ($Check) {
            if ((Get-FileHash $temp).Hash -ne (Get-FileHash $rom).Hash) {
                throw "Published ROM does not match its source: $id"
            }
            Write-Output "Verified $id"
        } else {
            Copy-Item -LiteralPath $temp -Destination $rom
        }
    }
} finally {
    Remove-Item -LiteralPath $temp
}
