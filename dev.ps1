# Enterprise AI Demo - Startup Script

Write-Host "Starting Enterprise AI Demo..." -ForegroundColor Cyan

# 1. Start Backend in a new window
Write-Host "Launching Backend API..." -ForegroundColor Green
# Load backend environment variables from .env if present
$backendEnvPath = "Backend/EnterpriseAI.API/.env"
if (Test-Path $backendEnvPath) {
	Write-Host "Loading Backend environment vars from .env..." -ForegroundColor Yellow
	Get-Content $backendEnvPath | ForEach-Object {
		if ($_ -match '^\s*#' -or $_ -match '^\s*$') { return }
		$pair = $_ -split '=', 2
		if ($pair.Length -eq 2) {
			$key = $pair[0].Trim()
			$val = $pair[1].Trim()
			$env:$key = $val
		}
	}
}

Start-Process -FilePath "dotnet" -ArgumentList "run --project Backend/EnterpriseAI.API/EnterpriseAI.API.csproj"

# 2. Start Frontend in a new window
# Note: On Windows, npm is npm.cmd. We use 'cmd /c' to ensure it runs correctly.
Write-Host "Launching Frontend..." -ForegroundColor Green
Start-Process -FilePath "cmd" -ArgumentList "/c cd Frontend && npm.cmd run dev"

Write-Host "Both services launched in separate windows." -ForegroundColor Cyan
Write-Host "Wait a moment for them to start..."
Write-Host "Backend: http://localhost:5222"
Write-Host "Frontend: http://localhost:5173"
