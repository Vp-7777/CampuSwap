# CampuSwap - Automated Setup and Run Script
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "   🎓 CampuSwap - Starting Setup" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Set Maven Path
$env:Path += ";C:\maven\apache-maven-3.9.11\bin"
Write-Host "✅ Maven configured" -ForegroundColor Green

# Create Database
Write-Host ""
Write-Host "📊 Creating database..." -ForegroundColor Yellow
Write-Host "Please enter your PostgreSQL password when prompted:" -ForegroundColor Yellow

$createDB = & "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -c "CREATE DATABASE IF NOT EXISTS campuswap;" 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Database created successfully!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Database might already exist or check password" -ForegroundColor Yellow
}

# Start Backend
Write-Host ""
Write-Host "🚀 Starting Backend (this will take 2-5 minutes first time)..." -ForegroundColor Yellow
Write-Host "Opening new window for backend..." -ForegroundColor Cyan

Start-Process powershell -ArgumentList @"
-NoExit
-Command
`$env:Path += ';C:\maven\apache-maven-3.9.11\bin';
cd C:\Users\VISHAL\CampuSwap\backend;
Write-Host '🔨 Building and starting backend...' -ForegroundColor Yellow;
mvn spring-boot:run
"@

Write-Host "✅ Backend starting in new window..." -ForegroundColor Green

# Wait for backend
Write-Host ""
Write-Host "⏳ Waiting 30 seconds for backend to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# Start Frontend
Write-Host ""
Write-Host "🎨 Starting Frontend..." -ForegroundColor Yellow
Write-Host "Opening new window for frontend..." -ForegroundColor Cyan

Start-Process powershell -ArgumentList @"
-NoExit
-Command
cd C:\Users\VISHAL\CampuSwap\frontend;
Write-Host '📦 Installing dependencies (first time only)...' -ForegroundColor Yellow;
npm install --silent;
Write-Host '🎨 Starting React app...' -ForegroundColor Yellow;
npm start
"@

Write-Host "✅ Frontend starting in new window..." -ForegroundColor Green

# Show Success Message
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "   ✅ CampuSwap is Starting!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend:  http://localhost:8080" -ForegroundColor White
Write-Host "Frontend: http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "Browser will open automatically in ~30 seconds!" -ForegroundColor Yellow
Write-Host ""
Write-Host "📝 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Register at http://localhost:3000" -ForegroundColor White
Write-Host "2. Create your first product" -ForegroundColor White
Write-Host "3. Login as admin to approve it" -ForegroundColor White
Write-Host ""
Write-Host "Admin credentials (create manually):" -ForegroundColor Yellow
Write-Host "Email: admin@college.edu" -ForegroundColor White
Write-Host "Password: admin123" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to exit this window..." -ForegroundColor Gray
Read-Host
