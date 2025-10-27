# CampuSwap - Quick Start Guide

## Prerequisites
Before running the application, ensure you have:
1. ✅ **PostgreSQL** - Running on port 5432 (Already installed and running)
2. ✅ **Java 17+** - For backend
3. ✅ **Maven** - For building backend
4. ✅ **Node.js & npm** - For frontend

## Database Setup
The database will be created automatically when you first run the backend.
Default credentials (configured in `backend/src/main/resources/application.properties`):
- Database: `campuswap`
- Username: `postgres`
- Password: `postgres`

If needed, create the database manually:
```sql
CREATE DATABASE campuswap;
```

## Running the Application

### Option 1: Run Both Together (Recommended)
**Double-click**: `START-ALL.bat`

This will open two terminal windows:
- Backend on http://localhost:8080
- Frontend on http://localhost:3000

### Option 2: Run Separately

#### Backend Only:
**Double-click**: `start-backend.bat`

Or manually:
```bash
cd backend
mvn clean install -DskipTests
mvn spring-boot:run
```

#### Frontend Only:
**Double-click**: `start-frontend.bat`

Or manually:
```bash
cd frontend
npm install
npm start
```

## Testing the Application

1. Wait for both servers to start (backend takes ~30 seconds, frontend takes ~20 seconds)
2. Open browser to: http://localhost:3000
3. Try registering a new user:
   - Click "Register"
   - Fill in: Email, Password, Full Name, Phone Number
   - Submit
4. After registration, you'll be automatically logged in
5. Try login with the credentials you created

## Default Admin Account
After first run, you can manually create an admin user in the database:
```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'your-email@example.com';
```

## Troubleshooting

### Backend won't start:
- Check if PostgreSQL is running: `Get-Service postgresql-x64-18`
- Verify database credentials in `backend/src/main/resources/application.properties`
- Check if port 8080 is available

### Frontend won't start:
- Run `npm install` in the frontend folder
- Check if port 3000 is available
- Clear npm cache: `npm cache clean --force`

### Can't login:
- Check browser console (F12) for errors
- Verify backend is running at http://localhost:8080
- Check backend logs for authentication errors

## Features to Test
- ✅ User Registration & Login
- ✅ Product Listing & Search
- ✅ Add/Edit Products
- ✅ Wishlist
- ✅ Reviews & Ratings
- ✅ Real-time Chat
- ✅ Transactions
- ✅ Admin Dashboard
- ✅ QR Code Sharing

## API Endpoints
- Registration: `POST http://localhost:8080/api/auth/register`
- Login: `POST http://localhost:8080/api/auth/login`
- Products: `GET http://localhost:8080/api/products`

## Support
Check the logs in both terminal windows if you encounter any issues.
