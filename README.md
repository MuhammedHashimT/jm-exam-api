# JM Exam Registration Portal - Backend API

A Node.js + Express backend for an Exam Registration Portal with MongoDB integration, built for deployment on Vercel.

## 🚀 Features

- **Institution Management**: Registration, login, profile management
- **Student Management**: Add students, manage by sections, export data
- **Admin Panel**: Institution verification, system settings, dashboard
- **Authentication**: JWT-based auth for institutions and admin
- **Data Export**: PDF and Excel export functionality
- **Verification System**: Configurable institution verification workflow

## 🏗️ Project Structure

```
src/
├── config/
│   ├── db.js              # Database connection
│   └── constants.js       # Kerala districts, subjects, sections
├── controllers/
│   ├── adminController.js
│   ├── institutionController.js
│   └── studentController.js
├── middleware/
│   └── authMiddleware.js  # JWT authentication
├── models/
│   ├── Institution.js
│   ├── Student.js
│   └── Setting.js
├── routes/
│   ├── adminRoutes.js
│   ├── institutionRoutes.js
│   ├── publicRoutes.js
│   └── studentRoutes.js
└── server.js              # Main application file
```

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd jm-exam-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your values:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/jm-exam-portal
   JWT_SECRET=your-super-secret-jwt-key-here
   ```

4. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## 📊 Database Models

### Institution Model
```javascript
{
  name: String,
  email: { type: String, required: true, unique: true },
  password: String, // hashed with bcrypt
  place: String,
  district: String, // Kerala district from predefined list
  mudarrisName: String,
  mudarrisPlace: String,
  mudarrisContact: String,
  verified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
}
```

### Student Model
```javascript
{
  institutionId: { type: ObjectId, ref: 'Institution' },
  name: String,
  place: String,
  section: { type: String, enum: ['المرحلة الإبتدائية', 'المرحلة المتوسطة', 'المرحلة العالية'] },
  subject1: { code: String, name: String },
  subject2: { code: String, name: String },
  createdAt: { type: Date, default: Date.now }
}
```

### Settings Model
```javascript
{
  requireVerification: { type: Boolean, default: true },
  autoVerify: { type: Boolean, default: false }
}
```

## 🛣️ API Routes

### Public Routes (`/api`)
- `GET /health` - Health check
- `GET /districts` - Get Kerala districts
- `GET /sections` - Get all sections
- `GET /subjects` - Get all subjects
- `GET /subjects/:section` - Get subjects for section

### Institution Routes (`/api/institutions`)
- `POST /register` - Register institution
- `POST /login` - Institution login
- `GET /profile` - Get profile (JWT required)
- `PUT /profile` - Update profile (JWT required)

### Student Routes (`/api/students`)
- `POST /add` - Add student (Institution auth)
- `GET /list` - Get institution's students
- `GET /list/:section` - Get students by section
- `GET /export/pdf` - Export students as PDF
- `GET /export/excel` - Export students as Excel
- `GET /subjects/:section` - Get subjects for section

### Admin Routes (`/api/admin`)
- `POST /login` - Admin login
- `GET /dashboard` - Dashboard statistics
- `GET /institutions` - Get all institutions
- `PUT /institutions/:id/verify` - Verify institution
- `PUT /institutions/:id/decline` - Decline institution
- `GET /students` - Get all students
- `GET /settings` - Get system settings
- `PUT /settings` - Update system settings

## 🔐 Authentication

### Admin Credentials
```
Email: admin@portal.com
Password: Admin@123
```

### JWT Token Usage
Include in headers:
```
Authorization: Bearer <your-jwt-token>
```

## 📚 Subject Configuration

### Primary Level (المرحلة الإبتدائية)
- I-101: الفقه
- I-102: التوحيد
- I-103: القرآن

### Intermediate Level (المرحلة المتوسطة)
- M-201: الفقه
- M-202: النحو

### Advanced Level (المرحلة العالية)
- H-301: الحديث
- H-302: البلاغة

## 🌍 Kerala Districts
All 14 Kerala districts are supported:
Thiruvananthapuram, Kollam, Pathanamthitta, Alappuzha, Kottayam, Idukki, Ernakulam, Thrissur, Palakkad, Malappuram, Kozhikode, Wayanad, Kannur, Kasaragod

## 📤 Data Export

### PDF Export
- Generates formatted PDF with institution and student details
- Includes all students or filtered by section

### Excel Export
- Creates structured Excel sheet with student data
- Includes all relevant fields in columns

## 🚀 Deployment on Vercel

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Environment Variables**
   Set in Vercel dashboard:
   - `MONGO_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Your JWT secret key
   - `NODE_ENV`: production

## 🔧 Configuration

### Verification Settings
Admins can configure:
- `requireVerification`: Whether institutions need verification
- `autoVerify`: Whether to auto-verify new institutions

### CORS Configuration
Update allowed origins in `server.js` for production deployment.

## 📝 API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [] // Optional validation errors
}
```

## 🛡️ Security Features

- Password hashing with bcrypt
- JWT authentication with expiration
- Input validation and sanitization
- CORS protection
- Rate limiting ready (can be added)
- SQL injection protection (MongoDB)

## 🧪 Testing

```bash
# Add test scripts
npm test
```

## 📦 Dependencies

### Production
- `express`: Web framework
- `mongoose`: MongoDB ODM
- `bcryptjs`: Password hashing
- `jsonwebtoken`: JWT authentication
- `cors`: CORS middleware
- `dotenv`: Environment variables
- `morgan`: HTTP logging
- `pdfkit`: PDF generation
- `xlsx`: Excel file generation

### Development
- `nodemon`: Development server

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection**
   - Check MongoDB connection string
   - Ensure MongoDB is running

2. **JWT Errors**
   - Verify JWT_SECRET is set
   - Check token format in headers

3. **CORS Issues**
   - Update allowed origins in server.js
   - Check request headers

## 📞 Support

For issues and questions, please refer to the API documentation or contact the development team.

## 📄 License

This project is licensed under the ISC License.