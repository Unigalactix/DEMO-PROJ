# Enterprise AI Demo - Startup Script

Write-Host "Starting Enterprise AI Demo..." -ForegroundColor Cyan

# 1. Start Backend in a new window
Write-Host "Launching Backend API..." -ForegroundColor Green
Start-Process -FilePath "dotnet" -ArgumentList "run --project Backend/EnterpriseAI.API/EnterpriseAI.API.csproj"

# 2. Start Frontend in a new window
# Note: On Windows, npm is npm.cmd. We use 'cmd /c' to ensure it runs correctly.
Write-Host "Launching Frontend..." -ForegroundColor Green
Start-Process -FilePath "cmd" -ArgumentList "/c cd Frontend && npm run dev"

Write-Host "Both services launched in separate windows." -ForegroundColor Cyan
Write-Host "Wait a moment for them to start..."
Write-Host "Backend: http://localhost:5222"
Write-Host "Frontend: http://localhost:5173"
