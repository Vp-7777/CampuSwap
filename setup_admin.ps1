Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  CampuSwap - Database & Admin Setup" -ForegroundColor Cyan  
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$pgPath = "C:\Program Files\PostgreSQL\18\bin\psql.exe"

# Get password
$password = Read-Host "Enter PostgreSQL password" -AsSecureString
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($password)
$plainPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

Write-Host ""
Write-Host "Step 1: Creating database..." -ForegroundColor Yellow

# Create database
$env:PGPASSWORD = $plainPassword
$result = & $pgPath -U postgres -c "CREATE DATABASE campuswap;" 2>&1

if ($result -like "*already exists*" -or $LASTEXITCODE -eq 0) {
    Write-Host "✅ Database ready!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Check: $result" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Step 2: Creating admin user..." -ForegroundColor Yellow

# Create admin using SQL script
$result = & $pgPath -U postgres -d campuswap -f "C:\Users\VISHAL\CampuSwap\setup_database.sql" 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Admin user created!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Check: $result" -ForegroundColor Yellow
}

# Clear password from memory
$env:PGPASSWORD = ""

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ✅ Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Admin Login Credentials:" -ForegroundColor Yellow
Write-Host "Email:    admin@college.edu" -ForegroundColor White
Write-Host "Password: admin123" -ForegroundColor White
Write-Host ""
Write-Host "You can now login at http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
pause
