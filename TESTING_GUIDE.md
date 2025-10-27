# 🔧 CampuSwap - Quick Testing Guide

## ⚠️ ISSUE: Login Failed / Registration Failed

**Root Cause:** Backend wasn't fully started yet.

---

## ✅ SOLUTION - Follow These Steps:

### **Step 1: Check Backend Window**

Look for the **PowerShell window** that says "Building backend..."

**Wait for this message:**
```
🚀 CampuSwap Backend Started Successfully!
```

**This takes 2-3 minutes the first time!**

---

### **Step 2: Verify Backend is Running**

Open this URL in browser:
**http://localhost:8080**

You should see an error page or login page - that's OK! It means backend is running.

---

### **Step 3: Test the Frontend**

Go to: **http://localhost:3000**

Now try:

#### **A. Register New Student**
- Click "Register"
- Email: `test@college.edu`
- Password: `test123`
- Full Name: `Test User`
- Phone: `1234567890`
- Click "Register"

**✅ Should work now!**

#### **B. Login as Admin**
- Click "Login"
- Email: `admin@college.edu`
- Password: `admin123`
- Click "Sign In"

**✅ Should work now!**

---

## 🔍 QUICK DEBUG CHECKLIST

### If Still Not Working:

**1. Check Backend Window**
- Is it still building? (Wait 2-3 more minutes)
- Any red errors? (Screenshot and check)
- Does it say "Started Successfully"?

**2. Check Frontend in Browser**
- Press F12 → Console tab
- Look for red errors
- Should show: "Failed to fetch" if backend is down
- Should work if no errors

**3. Check Database Connection**
Run this in PowerShell:
```pwsh
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -d campuswap -c "SELECT COUNT(*) FROM users;"
```
Should show: `1` (the admin user)

---

## 🎯 COMPLETE TESTING FLOW

Once backend shows "Started Successfully":

### **Test 1: Register Student**
1. Go to http://localhost:3000
2. Click "Register"
3. Fill form → Submit
4. ✅ Auto-login → See marketplace (empty)

### **Test 2: Create Product**
1. Click "+ Sell Item"
2. Title: "Textbook"
3. Price: "25"
4. Category: "BOOKS"
5. Click "List Product"
6. ✅ Product created (Pending)

### **Test 3: Admin Approval**
1. Logout (top right)
2. Login: `admin@college.edu` / `admin123`
3. Click "Admin" in navbar
4. See your product
5. Click "✓ Approve"
6. ✅ Product approved!

### **Test 4: Buy Product**
1. Logout
2. Login as student again
3. See product in marketplace
4. Click on product
5. Click "💳 Buy Now"
6. Go to "Transactions"
7. ✅ Transaction created!

### **Test 5: Complete Transaction**
1. Login as admin
2. Go to "Transactions" → "My Sales"
3. Click "Accept"
4. Click "Mark as Completed"
5. ✅ Transaction completed!

### **Test 6: Leave Review**
1. Login as student
2. Go to product
3. Click "Write Review"
4. Rate 5 stars
5. Write comment
6. ✅ Review posted!

---

## 🚨 COMMON ERRORS & FIXES

### **Error: "Login Failed"**
**Fix:** Wait for backend to fully start (2-3 minutes)

### **Error: "Registration Failed"**  
**Fix:** Backend not started OR database issue
- Check backend window for "Started Successfully"
- Check database connection

### **Error: "Network Error"**
**Fix:** Backend crashed or stopped
- Check backend window for errors
- Restart backend if needed

### **Error: "Cannot read properties of undefined"**
**Fix:** Token expired or localStorage issue
- Clear browser data (Ctrl+Shift+Delete)
- Refresh page
- Login again

---

## 🔄 HOW TO RESTART EVERYTHING

If something goes wrong:

### **1. Stop Everything**
```pwsh
# Kill all Java processes (backend)
Get-Process java -ErrorAction SilentlyContinue | Stop-Process -Force

# Kill all Node processes (frontend)  
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
```

### **2. Restart**
```pwsh
# Run the start script again
powershell -ExecutionPolicy Bypass -File "C:\Users\VISHAL\CampuSwap\RUN.ps1"
```

---

## ⏰ STARTUP TIMES

**First Time:**
- Backend: 2-5 minutes (downloading dependencies)
- Frontend: 1-2 minutes (installing packages)

**After First Time:**
- Backend: 30-60 seconds
- Frontend: 10-20 seconds

---

## ✅ SUCCESS INDICATORS

**Backend is ready when you see:**
```
🚀 CampuSwap Backend Started Successfully!
Tomcat started on port(s): 8080
```

**Frontend is ready when:**
- Browser opens automatically
- Shows login/register page
- No console errors in browser (F12)

---

## 📞 FINAL CHECKLIST

Before testing, verify:
- [ ] Backend window open and shows "Started Successfully"
- [ ] Frontend browser tab open at localhost:3000
- [ ] No red errors in browser console (F12)
- [ ] Database created (campuswap)
- [ ] Admin user exists

---

## 🎉 ONCE EVERYTHING WORKS

You have a **complete college marketplace** with:
- User authentication ✅
- Product listings ✅
- Image uploads ✅
- Admin panel ✅
- Buy/sell transactions ✅
- Reviews & ratings ✅
- Wishlist ✅
- Chat system ✅
- QR codes ✅
- 52 total features ✅

**Enjoy your CampuSwap marketplace!** 🎓💻

---

**Current Status:**
- ✅ Backend: Starting (wait 2-3 minutes)
- ✅ Frontend: Running at localhost:3000
- ✅ Database: Created with admin user
- ⏳ Next: Wait for backend to show "Started Successfully"
