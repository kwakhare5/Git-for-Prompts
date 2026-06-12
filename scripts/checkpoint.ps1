# Global Checkpoint Protocol
# Automates staging, committing, and pushing changes.

param (
    [string]$CustomMessage
)

$branch = git branch --show-current
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

# If no message provided, prompt the user
if (-not $CustomMessage) {
    Write-Host ">>> No commit message provided." -ForegroundColor Gray
    $CustomMessage = Read-Host ">>> Please enter a commit message (or press Enter for timestamp)"
}

$message = if ($CustomMessage) { $CustomMessage } else { "Pulse Checkpoint: $timestamp" }

Write-Host ">>> Initiating Global Checkpoint..." -ForegroundColor Cyan

$status = git status --porcelain
if (-not $status) {
    Write-Host "[OK] No changes to save." -ForegroundColor Green
    exit 0
}

Write-Host "[STAGING] Staging all changes..." -ForegroundColor Yellow
git add .

Write-Host "[COMMIT] Committing changes..." -ForegroundColor Yellow
git commit -m "$message"

Write-Host "[PUSH] Pushing to $branch..." -ForegroundColor Yellow
git push origin $branch

if ($LASTEXITCODE -eq 0) {
    Write-Host "[SUCCESS] Progress saved successfully!" -ForegroundColor Green
} else {
    Write-Host "[ERROR] Push failed." -ForegroundColor Red
    exit 1
}
