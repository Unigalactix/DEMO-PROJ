# Enterprise AI Demo - Startup Script

Write-Host "Starting Enterprise AI Demo..." -ForegroundColor Cyan

# 1. Start Backend in a new window
Write-Host "Launching Backend API..." -ForegroundColor Green
Start-Process -NoNewWindow -FilePath "dotnet" -ArgumentList "run --project Backend/EnterpriseAI.API/EnterpriseAI.API.csproj"

# 2. Start Frontend in the current window
Write-Host "Launching Frontend..." -ForegroundColor Green
Set-Location "Frontend"
npm run dev
