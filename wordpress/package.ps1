param([Parameter(Mandatory)][string]$OutputPath)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression.FileSystem
$assets = Join-Path $PSScriptRoot '..\next-site\public\atari'
$zip = [IO.Compression.ZipFile]::Open($ExecutionContext.SessionState.Path.GetUnresolvedProviderPathFromPSPath($OutputPath), 'Create')
try {
    foreach ($name in @('atari-homebrew.php', 'arcade.css', 'play.html', 'javatari/javatari.js', 'javatari/license.txt',
        'icons/super-step-bros.svg', 'icons/skateboard-steve.svg', 'icons/simon-says.svg',
        'roms/super-step-bros.bin', 'roms/skateboard-steve.bin', 'roms/simon-says.bin')) {
        $root = if ($name -eq 'atari-homebrew.php') { $PSScriptRoot } else { $assets }
        $file = Join-Path $root $name
        [IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $file, "atari-homebrew/$name") | Out-Null
    }
} finally {
    $zip.Dispose()
}
