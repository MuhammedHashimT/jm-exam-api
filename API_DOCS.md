# API Documentation

## Base URL
- Development: `http://localhost:5000`
- Production: `https://your-vercel-domain.vercel.app`

## Authentication
All protected routes require JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Response Format
All API responses follow this format:
```json
{
  "success": boolean,
  "message": "string",
  "data": {} // Optional
}
```

---

## Public Endpoints

### GET /api/health
Health check endpoint
```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2023-10-12T10:30:00.000Z"
}
```

### GET /api/districts
Get all Kerala districts
```json
{
  "success": true,
  "data": {
    "districts": ["Thiruvananthapuram", "Kollam", ...]
  }
}
```

### GET /api/sections
Get all sections
```json
{
  "success": true,
  "data": {
    "sections": ["المرحلة الإبتدائية", "المرحلة المتوسطة", "المرحلة العالية"]
  }
}
```

### GET /api/subjects
Get all subjects by section
```json
{
  "success": true,
  "data": {
    "subjects": {
      "المرحلة الإبتدائية": {
        "subject1": [
          {"code": "I-101", "name": "الفقه", "category": 1, "examTime": "09:00 AM - 11:00 AM"},
          {"code": "I-102", "name": "التوحيد", "category": 1, "examTime": "09:00 AM - 11:00 AM"},
          {"code": "I-103", "name": "القرآن", "category": 1, "examTime": "09:00 AM - 11:00 AM"}
        ],
        "subject2": [
          {"code": "I-201", "name": "الحديث", "category": 2, "examTime": "02:00 PM - 04:00 PM"},
          {"code": "I-202", "name": "العقيدة", "category": 2, "examTime": "02:00 PM - 04:00 PM"},
          {"code": "I-203", "name": "السيرة النبوية", "category": 2, "examTime": "02:00 PM - 04:00 PM"}
        ]
      }
      // ... other sections
    }
  }
}
```

**Important**: Students must select one subject from the `subject1` category and one from the `subject2` category. All Subject 1 exams are scheduled for morning (09:00 AM - 11:00 AM) and all Subject 2 exams for afternoon (02:00 PM - 04:00 PM).

---

## Institution Endpoints

### POST /api/institutions/register
Register new institution

**Request Body:**
```json
{
  "name": "Al-Azhar Academy",
  "email": "admin@alazhar.edu",
  "password": "securePassword123",
  "place": "Kozhikode",
  "district": "Kozhikode",
  "mudarrisName": "Sheikh Ahmad",
  "mudarrisPlace": "Kozhikode",
  "mudarrisContact": "+91 9876543210"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Institution registered successfully",
  "data": {
    "institution": {...},
    "token": "jwt-token",
    "needsVerification": boolean
  }
}
```

### POST /api/institutions/login
Institution login

**Request Body:**
```json
{
  "email": "admin@alazhar.edu",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "institution": {...},
    "token": "jwt-token"
  }
}
```

### GET /api/institutions/profile
Get institution profile (Protected)

### PUT /api/institutions/profile
Update institution profile (Protected)

---

## Student Endpoints

### POST /api/students/add
Add new student (Institution Protected)

**Request Body:**
```json
{
  "name": "Muhammad Ali",
  "place": "Calicut",
  "section": "المرحلة الإبتدائية",
  "subject1": {
    "code": "I-101",
    "name": "الفقه"
  },
  "subject2": {
    "code": "I-201",
    "name": "الحديث"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Student added successfully",
  "data": {
    "student": {
      "registrationNumber": "I250001",
      "name": "Muhammad Ali",
      "place": "Calicut",
      "section": "المرحلة الإبتدائية",
      "subject1": {
        "code": "I-101",
        "name": "الفقه",
        "category": 1,
        "examTime": "09:00 AM - 11:00 AM"
      },
      "subject2": {
        "code": "I-201",
        "name": "الحديث",
        "category": 2,
        "examTime": "02:00 PM - 04:00 PM"
      }
      // ... other fields
    }
  }
}
```

**Registration Number Format:**
- المرحلة العالية: A250001 - A259999
- المرحلة المتوسطة: M250001 - M259999  
- المرحلة الإبتدائية: I250001 - I259999

Registration numbers are auto-generated and unique across all sections.

### GET /api/students/list
Get all students for institution (Institution Protected)

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `section`: Filter by section
- `search`: Search by name, place, or registration number

### GET /api/students/list/:section
Get students by section (Institution Protected)

### GET /api/students/export/pdf
Export students as PDF (Institution Protected)

**Query Parameters:**
- `section`: Filter by section (optional)

### GET /api/students/export/excel
Export students as Excel (Institution Protected)

**Query Parameters:**
- `section`: Filter by section (optional)

---

## Admin Endpoints

### POST /api/admin/login
Admin login

**Request Body:**
```json
{
  "email": "admin@portal.com",
  "password": "Admin@123"
}
```

### GET /api/admin/dashboard
Get dashboard statistics (Admin Protected)

**Response:**
```json
{
  "success": true,
  "data": {
    "statistics": {
      "totalInstitutions": 25,
      "verifiedInstitutions": 20,
      "pendingInstitutions": 5,
      "totalStudents": 150
    },
    "studentsBySection": [...],
    "institutionsByDistrict": [...],
    "recentInstitutions": [...]
  }
}
```

### GET /api/admin/institutions
Get all institutions (Admin Protected)

**Query Parameters:**
- `page`: Page number
- `limit`: Items per page
- `search`: Search institutions
- `district`: Filter by district
- `verified`: Filter by verification status
- `mudarris`: Filter by mudarris name

### PUT /api/admin/institutions/:id/verify
Verify institution (Admin Protected)

### PUT /api/admin/institutions/:id/decline
Decline institution (Admin Protected)

### GET /api/admin/students
Get all students (Admin Protected)

**Query Parameters:**
- `page`: Page number
- `limit`: Items per page
- `search`: Search students
- `institution`: Filter by institution
- `district`: Filter by district
- `section`: Filter by section
- `subject1`: Filter by subject 1 code
- `subject2`: Filter by subject 2 code

### GET /api/admin/settings
Get system settings (Admin Protected)

### PUT /api/admin/settings
Update system settings (Admin Protected)

**Request Body:**
```json
{
  "requireVerification": true,
  "autoVerify": false
}
```

---

## Error Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

## Rate Limiting
Currently not implemented but recommended for production.

## Pagination
All list endpoints support pagination:
```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "pages": 10
    }
  }
}
```