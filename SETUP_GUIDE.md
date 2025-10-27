# 🚀 CampuSwap - Quick Setup Guide

## Step-by-Step Installation

### Prerequisites Check
```pwsh
# Check Java version (need 17+)
java -version

# Check Node.js version (need 16+)
node --version

# Check PostgreSQL
psql --version

# Check Maven
mvn --version
```

### Step 1: Database Setup

```pwsh
# Start PostgreSQL service
# Windows: Services -> PostgreSQL -> Start
# Or via command:
net start postgresql-x64-14

# Connect to PostgreSQL
psql -U postgres

# In psql terminal:
CREATE DATABASE campuswap;
\c campuswap
\q
```

### Step 2: Backend Configuration

1. Navigate to backend folder:
```pwsh
cd C:\Users\VISHAL\CampuSwap\backend
```

2. Edit `src/main/resources/application.properties`:
   - Update database credentials
   - Update email configuration (for Gmail, use App Password)

3. Build and run:
```pwsh
# Clean and install dependencies
mvn clean install -DskipTests

# Run the application
mvn spring-boot:run
```

**Backend should start on: http://localhost:8080**

### Step 3: Frontend Setup

```pwsh
# Open new terminal
cd C:\Users\VISHAL\CampuSwap\frontend

# Install dependencies
npm install

# Start development server
npm start
```

**Frontend should open at: http://localhost:3000**

### Step 4: Create Admin Account

1. Open browser: http://localhost:3000
2. Click "Register"
3. Use email: `admin@college.edu`
4. Fill in details and register
5. (Optional) Verify email if email service is configured

To manually set as admin in database:
```sql
-- Connect to database
psql -U postgres -d campuswap

-- Update user role
UPDATE users SET role = 'ADMIN' WHERE email = 'admin@college.edu';

-- Verify
SELECT email, role FROM users;
```

### Step 5: Test Features

1. **Login** as student
2. **Create a product** listing
3. **Login as admin** 
4. **Approve the product**
5. **Test chat** between users
6. **Add to wishlist**
7. **Create transaction** request

## Troubleshooting

### Backend won't start

**Error: Could not connect to database**
```pwsh
# Ensure PostgreSQL is running
net start postgresql-x64-14

# Check if database exists
psql -U postgres -c "\l"
```

**Error: Port 8080 already in use**
```pwsh
# Find process using port 8080
netstat -ano | findstr :8080

# Kill the process (replace PID)
taskkill /PID <PID> /F

# Or change port in application.properties:
# server.port=8081
```

**Error: Maven dependencies not downloading**
```pwsh
# Clear Maven cache
mvn dependency:purge-local-repository

# Force update
mvn clean install -U
```

### Frontend won't start

**Error: npm ERR! code ELIFECYCLE**
```pwsh
# Delete node_modules and reinstall
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

**Error: Port 3000 in use**
```pwsh
# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Error: Cannot connect to backend**
- Ensure backend is running on port 8080
- Check `frontend/src/config/api.js` for correct API URL
- Disable browser CORS extensions if any

### Email not sending

1. For Gmail:
   - Enable 2-Step Verification
   - Generate App Password: https://myaccount.google.com/apppasswords
   - Use App Password in `application.properties`

2. Update configuration:
```properties
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-16-char-app-password
```

### WebSocket connection fails

- Ensure both frontend and backend are running
- Check browser console for errors
- WebSocket URL should be: `ws://localhost:8080/ws`

## Quick Commands Reference

### Backend
```pwsh
cd backend
mvn clean install          # Build project
mvn spring-boot:run        # Run application
mvn test                   # Run tests
mvn package                # Create JAR file
```

### Frontend
```pwsh
cd frontend
npm install                # Install dependencies
npm start                  # Start dev server
npm run build              # Create production build
npm test                   # Run tests
```

### Database
```pwsh
# Connect to database
psql -U postgres -d campuswap

# Backup database
pg_dump -U postgres campuswap > backup.sql

# Restore database
psql -U postgres -d campuswap < backup.sql

# Reset database (WARNING: Deletes all data)
DROP DATABASE campuswap;
CREATE DATABASE campuswap;
```

## Default Test Data

After setup, you can add test products:

1. **Sample Product - Textbook**
   - Title: "Data Structures and Algorithms"
   - Category: BOOKS
   - Price: $25
   - Description: "Gently used CS textbook"

2. **Sample Product - Laptop**
   - Title: "Dell Latitude i5"
   - Category: ELECTRONICS
   - Price: $450
   - Description: "Good condition, 8GB RAM"

3. **Sample Product - Desk Chair**
   - Title: "Ergonomic Study Chair"
   - Category: FURNITURE
   - Price: $60
   - Description: "Comfortable office chair"

## Production Deployment

### Backend (Railway/Heroku)
```pwsh
# Create production properties file
# backend/src/main/resources/application-prod.properties

# Build JAR
mvn clean package -DskipTests

# Deploy JAR file to hosting service
```

### Frontend (Vercel/Netlify)
```pwsh
# Build production files
npm run build

# Deploy build folder
# Or connect GitHub repo for automatic deployment
```

## Next Steps

1. ✅ Complete setup following this guide
2. 📝 Customize branding and colors
3. 🎨 Add custom product images
4. 🔐 Configure production security
5. 📧 Set up email templates
6. 📊 Test all features
7. 🚀 Deploy to production

## Need Help?

- Check logs in `backend/logs/` (if configured)
- Browser Developer Tools -> Console (for frontend errors)
- Enable debug logging in `application.properties`:
  ```properties
  logging.level.com.campuswap=DEBUG
  ```

## Feature Testing Checklist

- [ ] User Registration
- [ ] Email Verification
- [ ] User Login
- [ ] Product Creation
- [ ] Image Upload
- [ ] Admin Approval
- [ ] Product Search
- [ ] Category Filter
- [ ] Wishlist Add/Remove
- [ ] Real-time Chat
- [ ] Transaction Request
- [ ] Transaction Accept/Reject
- [ ] Review Submission
- [ ] Rating Display
- [ ] QR Code Generation
- [ ] Dark Mode Toggle
- [ ] Notifications
- [ ] Admin Dashboard

---

**Setup complete! Happy coding! 🎉**
