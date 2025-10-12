# MobaXterm Password Decoder
# Based on the encryption format: _@[base64encoded]

function Decode-MobaPassword {
    param([string]$encoded)
    
    if ($encoded -notmatch '^_@(.+)$') {
        return "Invalid format"
    }
    
    $base64 = $matches[1]
    
    try {
        # MobaXterm uses a custom encryption, but let's try basic decoding
        $bytes = [System.Convert]::FromBase64String($base64)
        
        # MobaXterm XOR key
        $key = [System.Text.Encoding]::ASCII.GetBytes("MobaXterm")
        
        $decoded = for ($i = 0; $i -lt $bytes.Length; $i++) {
            $bytes[$i] -bxor $key[$i % $key.Length]
        }
        
        [System.Text.Encoding]::ASCII.GetString($decoded)
    }
    catch {
        "Decryption failed: $_"
    }
}

Write-Host "=== MobaXterm Saved Passwords ===" -ForegroundColor Cyan
Write-Host ""

# Get the encrypted password for MuscleSports
$encPass = (Get-ItemProperty "HKCU:\Software\Mobatek\MobaXterm\P").'ssh22:root@137.74.157.17'

Write-Host "Encrypted: $encPass" -ForegroundColor Yellow
Write-Host "Attempting to decode..." -ForegroundColor Yellow
Write-Host ""

$decoded = Decode-MobaPassword $encPass
Write-Host "Decoded password: $decoded" -ForegroundColor Green
