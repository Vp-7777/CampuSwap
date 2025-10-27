# 🎓 CampuSwap - College Marketplace System

A comprehensive full-stack Buy, Sell & Exchange platform designed specifically for college students.

## 🚀 Tech Stack

**Backend:**
- Java 17
- Spring Boot 3.2.0
- Spring Security + JWT
- PostgreSQL
- WebSocket (Real-time Chat)
- Maven

**Frontend:**
- React 18
- Tailwind CSS
- WebSocket Client (SockJS)
- Axios
- React Router

## ✨ Features

### Phase 1 - Core Features
- ✅ User Registration & Login with JWT
- ✅ Role-based Access (Admin & Student)
- ✅ Product CRUD Operations
- ✅ Admin Approval System
- ✅ Product Categories (Books, Electronics, Furniture, Fashion, Accessories, Sports)
- ✅ Image Upload for Products
- ✅ Search & Filter Functionality
- ✅ Responsive UI
- ✅ PostgreSQL Database Integration

### Phase 2 - Enhanced Usability
- ✅ User Profile Page
- ✅ Wishlist/Favorites System
- ✅ Transaction Management
- ✅ Transaction Status Flow
- ✅ Sorting & Filtering Options
- ✅ Admin Dashboard
- ✅ Product Details Page
- ✅ Notification System

### Phase 3 - Advanced Features
- ✅ AI-Based Price Suggestion
- ✅ Real-Time Chat (Buyer-Seller)
- ✅ Live Notifications via WebSocket
- ✅ Ratings & Reviews
- ✅ QR Code Sharing
- ✅ Dark/Light Mode Toggle
- ✅ Admin Analytics Dashboard
- ✅ Voice Search
- ✅ Exchange/Barter Option
- ✅ Smart Product Recommendations

### Phase 4 - Security
- ✅ Email Verification
- ✅ College Email Validation
- ✅ 2FA for Admins
- ✅ Product Report & Flagging
- ✅ Spam Word Filter
- ✅ Rate Limiting

### Phase 5 - Premium Features
- ✅ Chatbot Assistant
- ✅ In-App Wallet System
- ✅ Gamification Badges
- ✅ Delivery Tracking Simulation
- ✅ Invoice Generation (PDF)
- ✅ Trending Analytics

## 📋 Prerequisites

- Java 17 or higher
- Node.js 16+ and npm
- PostgreSQL 14+
- Maven 3.6+

## 🔧 Backend Setup

### 1. Install PostgreSQL

```pwsh
# Download from https://www.postgresql.org/download/windows/
# Or use chocolatey:
choco install postgresql
```

### 2. Create Database

```sql
CREATE DATABASE campuswap;
```

### 3. Configure Application Properties

Edit `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/campuswap
spring.datasource.username=YOUR_POSTGRES_USERNAME
spring.datasource.password=YOUR_POSTGRES_PASSWORD

# Email Configuration (for verification)
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
```

### 4. Run Backend

```pwsh
cd CampuSwap\backend
mvn clean install
mvn spring-boot:run
```

Backend will start on `http://localhost:8080`

## 🎨 Frontend Setup

### 1. Install Dependencies

```pwsh
cd CampuSwap\frontend
npm install
```

### 2. Configure API URL

Edit `frontend/src/config/api.js` if needed (default: http://localhost:8080)

### 3. Run Frontend

```pwsh
npm start
```

Frontend will start on `http://localhost:3000`

## 📁 Project Structure

```
CampuSwap/
├── backend/
│   ├── src/main/java/com/campuswap/
│   │   ├── entity/          # Database entities
│   │   ├── repository/      # JPA repositories
│   │   ├── service/         # Business logic
│   │   ├── controller/      # REST APIs
│   │   ├── security/        # JWT & Security config
│   │   ├── config/          # App configurations
│   │   ├── dto/             # Data Transfer Objects
│   │   └── util/            # Utility classes
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── context/         # State management
│   │   ├── hooks/           # Custom hooks
│   │   └── App.js
│   ├── public/
│   └── package.json
└── README.md
```

## 🔑 Default Admin Credentials

After first run, create admin user:
- Email: admin@college.edu
- Password: admin123

## 📝 API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- POST `/api/auth/verify-email` - Verify email
- POST `/api/auth/forgot-password` - Request password reset

### Products
- GET `/api/products` - Get all approved products
- GET `/api/products/{id}` - Get product by ID
- POST `/api/products` - Create new product
- PUT `/api/products/{id}` - Update product
- DELETE `/api/products/{id}` - Delete product
- GET `/api/products/search` - Search products

### Admin
- GET `/api/admin/products/pending` - Get pending products
- PUT `/api/admin/products/{id}/approve` - Approve product
- PUT `/api/admin/products/{id}/reject` - Reject product
- GET `/api/admin/analytics` - Get analytics data

### Transactions
- POST `/api/transactions` - Create transaction request
- GET `/api/transactions/buyer` - Get buyer transactions
- GET `/api/transactions/seller` - Get seller transactions
- PUT `/api/transactions/{id}/accept` - Accept transaction
- PUT `/api/transactions/{id}/reject` - Reject transaction

### Chat (WebSocket)
- `/ws` - WebSocket endpoint
- `/app/chat.send` - Send message
- `/topic/messages/{userId}` - Subscribe to messages

### Wishlist
- POST `/api/wishlist/{productId}` - Add to wishlist
- DELETE `/api/wishlist/{productId}` - Remove from wishlist
- GET `/api/wishlist` - Get user wishlist

### Reviews
- POST `/api/reviews` - Submit review
- GET `/api/reviews/product/{productId}` - Get product reviews

## 🎯 Usage Guide

### For Students:
1. Register with college email
2. Verify email
3. Browse products by category
4. Add products to wishlist
5. Chat with sellers
6. Create buy/exchange requests
7. Post your own items for sale
8. Rate sellers after purchase

### For Admins:
1. Login with admin credentials
2. Review pending products
3. Approve/Reject listings
4. Monitor reports
5. View analytics dashboard
6. Manage users

## 🎨 UI Features

- Modern gradient design
- Dark/Light mode support
- Responsive mobile-first layout
- Real-time chat interface
- Interactive notifications
- Voice search capability
- QR code sharing
- Product image gallery

## 🔒 Security Features

- BCrypt password hashing
- JWT token authentication
- Role-based access control
- Email verification required
- College email domain validation
- 2FA for admin accounts
- XSS protection
- CSRF tokens
- Rate limiting on APIs

## 🧪 Testing

### Backend Tests
```pwsh
cd backend
mvn test
```

### Frontend Tests
```pwsh
cd frontend
npm test
```

## 📦 Deployment

### Backend (Heroku/Railway)
```pwsh
# Add production database URL
# Update application-prod.properties
mvn clean package
# Deploy jar file
```

### Frontend (Vercel/Netlify)
```pwsh
npm run build
# Deploy build folder
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

MIT License - feel free to use for academic or personal projects

## 🐛 Known Issues

- Voice search requires HTTPS in production
- WebSocket connection needs SSL for secure deployment
- Email sending requires valid SMTP credentials

## 📞 Support

For issues or questions:
- Open GitHub issue
- Email: support@campuswap.com

## 🎓 Academic Use

Perfect for:
- Final year projects
- Database management assignments
- Full-stack development portfolios
- Software engineering coursework

## 🌟 Future Enhancements

- Mobile app (React Native)
- Payment gateway integration
- AI-based fraud detection
- Multi-language support
- Progressive Web App (PWA)
- Social media integration

---

**Built with ❤️ for College Students**
