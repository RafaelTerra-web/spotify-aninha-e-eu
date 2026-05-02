Add-Type -AssemblyName System.Drawing
$dir = "C:\Users\rafae\OneDrive\Área de Trabalho\03-Projetos\Spotify Aninha e Eu\public\images"
Get-ChildItem -Path $dir -Include *.jpeg,*.jpg,*.png -Recurse | ForEach-Object {
    $img = [System.Drawing.Image]::FromFile($_.FullName)
    $w = $img.Width
    $h = $img.Height
    $ratio = [math]::Round($w/$h, 2)
    Write-Host "$($_.Name) => ${w}x${h} ratio=$ratio"
    $img.Dispose()
}
