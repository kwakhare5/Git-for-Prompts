# Global Port Sanitization Protocol
# Scans and kills processes on common project ports
$ports = @(3000, 3001, 8765, 8000, 5173)

Write-Host ">>> Port Sanitization Protocol Initiated..." -ForegroundColor Cyan

foreach ($port in $ports) {
    $processIds = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
    
    if ($processIds) {
        foreach ($targetPid in $processIds) {
            try {
                $process = Get-Process -Id $targetPid -ErrorAction SilentlyContinue
                if ($process) {
                    Write-Host "[KILL] Found $($process.Name) (PID: $targetPid) on port $port. Terminating..." -ForegroundColor Yellow
                    Stop-Process -Id $targetPid -Force
                }
            } catch {
                Write-Host "[WARN] Could not kill process $targetPid on port $port." -ForegroundColor Red
            }
        }
    }
}
Write-Host ">>> Port cleanup complete." -ForegroundColor Green
