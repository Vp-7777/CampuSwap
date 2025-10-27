Write-Host "CampuSwap Starting..." -ForegroundColor Cyan

# Set Maven Path
$env:Path += ";C:\maven\apache-maven-3.9.11\bin"

# Start Backend in new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "`$env:Path += ';C:\maven\apache-maven-3.9.11\bin'; cd C:\Users\VISHAL\CampuSwap\backend; mvn spring-boot:run"

Write-Host "Backend starting... waiting 30 seconds"
Start-Sleep -Seconds 30

# Start Frontend in new window  
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd C:\Users\VISHAL\CampuSwap\frontend; npm install; npm start"

Write-Host "Done! Check the new windows."
Write-Host "Frontend will open at http://localhost:3000"
pause
