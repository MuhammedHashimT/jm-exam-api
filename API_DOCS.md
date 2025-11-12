# API Documentation

> **Note**: All passwords, tokens, and sensitive data shown in this documentation are example placeholders only. Use secure, environment-specific values in production.

## Base URL
- Development: `http://localhost:5000`
- Production: `https://your-vercel-domain.vercel.app`

## Authentication
All protected routes require JWT token in the Authorization header:
```
Authorization: Bearer [JWT_TOKEN]
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

## New Features (Recent Updates)

### Admin CRUD Operations
- **Institution Management**: Admin can now view, edit, and delete institutions
- **Student Management**: Admin can view, edit, and delete any student
- **Safety Features**: Cannot delete institutions with registered students

### Institution Manager CRUD Operations
- **Student Management**: Institution managers can now view, edit, and delete their own students
- **Security**: Institutions can only manage students belonging to their institution
- **Data Integrity**: Registration numbers are protected from modification

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

**Note**: Exam times are not stored in the student database. Frontend can get exam times by matching the subject code with the constants data from `/api/subjects/:section`.

---

## Institution Endpoints

### POST /api/institutions/register
Register new institution

**Request Body:**
```json
{
  "name": "Al-Azhar Academy",
  "email": "admin@alazhar.edu",
  "password": "example_password",
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
    "token": "[JWT_TOKEN]",
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
  "password": "example_password"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "institution": {...},
    "token": "[JWT_TOKEN]"
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
        "category": 1
      },
      "subject2": {
        "code": "I-201",
        "name": "الحديث",
        "category": 2
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

**Subject Categories & Exam Times:**
- Category 1 (Subject 1): Morning session (09:00 AM - 11:00 AM)
- Category 2 (Subject 2): Afternoon session (02:00 PM - 04:00 PM)
- Exam times are retrieved from constants, not stored in database

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

### GET /api/students/:id
Get single student details (Institution Protected)

**Response:**
```json
{
  "success": true,
  "data": {
    "student": {
      "registrationNumber": "I250001",
      "name": "Muhammad Ali",
      "place": "Calicut",
      "section": "المرحلة الإبتدائية",
      "subject1": {...},
      "subject2": {...},
      "institutionId": {...}
    }
  }
}
```

### PUT /api/students/:id
Edit student details (Institution Protected)

**Request Body:**
```json
{
  "name": "Muhammad Ali Updated",
  "place": "Kozhikode",
  "section": "المرحلة المتوسطة",
  "subject1": {
    "code": "M-101",
    "name": "الفقه المتقدم"
  },
  "subject2": {
    "code": "M-201",
    "name": "الحديث المتقدم"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Student updated successfully",
  "data": {
    "student": {...}
  }
}
```

**Notes:**
- Institution can only edit their own students
- Registration number cannot be changed
- All validation rules apply (subject categories, section compatibility)

### DELETE /api/students/:id
Delete student (Institution Protected)

**Response:**
```json
{
  "success": true,
  "message": "Student deleted successfully"
}
```

**Notes:**
- Institution can only delete their own students
- This action is irreversible

### GET /api/students/subjects/:section
Get available subjects for a section (Institution Protected)

**Response:**
```json
{
  "success": true,
  "data": {
    "section": "المرحلة الإبتدائية",
    "subjects": {
      "subject1": [...],
      "subject2": [...]
    }
  }
}
```

---

## Admin Endpoints

### POST /api/admin/login
Admin login

**Request Body:**
```json
{
  "email": "admin@portal.com",
  "password": "admin_password_here"
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

### PUT /api/admin/institutions/bulk/approve
Bulk approve institutions (Admin Protected)

**Request Body:**
```json
{
  "institutionIds": [
    "institution-id-1",
    "institution-id-2",
    "institution-id-3"
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "3 institution(s) approved successfully",
  "data": {
    "matched": 3,
    "modified": 3
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Institution IDs array is required"
}
```

**Notes:**
- Validates all institution IDs before processing
- Returns count of matched and modified documents
- `matched`: Number of institutions found
- `modified`: Number of institutions actually updated

### PUT /api/admin/institutions/bulk/decline
Bulk decline institutions (Admin Protected)

**Request Body:**
```json
{
  "institutionIds": [
    "institution-id-1",
    "institution-id-2",
    "institution-id-3"
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "3 institution(s) declined successfully",
  "data": {
    "matched": 3,
    "modified": 3
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Invalid institution ID(s) provided",
  "invalidIds": ["invalid-id-1"]
}
```

**Notes:**
- Validates all institution IDs before processing
- Returns count of matched and modified documents
- Provides detailed error information for invalid IDs

### GET /api/admin/institutions/:id
Get single institution details (Admin Protected)

**Response:**
```json
{
  "success": true,
  "data": {
    "institution": {
      "_id": "institution-id",
      "name": "Al-Azhar Academy",
      "email": "admin@alazhar.edu",
      "place": "Kozhikode",
      "district": "Kozhikode",
      "mudarrisName": "Sheikh Ahmad",
      "mudarrisPlace": "Kozhikode",
      "mudarrisContact": "+91 9876543210",
      "verified": true,
      "studentCount": 25,
      "createdAt": "2023-10-12T10:30:00.000Z"
    }
  }
}
```

### PUT /api/admin/institutions/:id
Edit institution details (Admin Protected)

**Request Body:**
```json
{
  "name": "Updated Institution Name",
  "email": "newemail@institution.edu",
  "place": "New Place",
  "district": "Malappuram",
  "mudarrisName": "New Mudarris",
  "mudarrisPlace": "New Place",
  "mudarrisContact": "+91 9876543211",
  "verified": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Institution updated successfully",
  "data": {
    "institution": {...}
  }
}
```

**Notes:**
- All fields are optional
- Email must be unique if provided
- Password changes require separate endpoint

### DELETE /api/admin/institutions/:id
Delete institution (Admin Protected)

**Response:**
```json
{
  "success": true,
  "message": "Institution deleted successfully"
}
```

**Error Response (if institution has students):**
```json
{
  "success": false,
  "message": "Cannot delete institution. It has 25 registered students. Please delete or transfer students first."
}
```

**Notes:**
- Cannot delete institution if it has registered students
- This action is irreversible

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

### GET /api/admin/students/:id
Get single student details (Admin Protected)

**Response:**
```json
{
  "success": true,
  "data": {
    "student": {
      "_id": "student-id",
      "registrationNumber": "I250001",
      "name": "Muhammad Ali",
      "place": "Calicut",
      "section": "المرحلة الإبتدائية",
      "subject1": {...},
      "subject2": {...},
      "institutionId": {
        "name": "Al-Azhar Academy",
        "district": "Kozhikode",
        "place": "Kozhikode"
      },
      "createdAt": "2023-10-12T10:30:00.000Z"
    }
  }
}
```

### PUT /api/admin/students/:id
Edit student details (Admin Protected)

**Request Body:**
```json
{
  "name": "Muhammad Ali Updated",
  "place": "Kozhikode",
  "section": "المرحلة المتوسطة",
  "subject1": {
    "code": "M-101",
    "name": "الفقه المتقدم"
  },
  "subject2": {
    "code": "M-201",
    "name": "الحديث المتقدم"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Student updated successfully",
  "data": {
    "student": {...}
  }
}
```

**Notes:**
- All fields are optional
- Registration number cannot be changed
- All validation rules apply (subject categories, section compatibility)

### DELETE /api/admin/students/:id
Delete student (Admin Protected)

**Response:**
```json
{
  "success": true,
  "message": "Student deleted successfully"
}
```

**Notes:**
- Admin can delete any student from any institution
- This action is irreversible

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