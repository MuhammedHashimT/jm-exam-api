# Quick Reference Guide - JM Exam API

## 🔐 Password Management

### Institution Changes Own Password
```bash
PUT /api/institutions/profile
Authorization: Bearer {INSTITUTION_TOKEN}

{
  "currentPassword": "current_password",
  "newPassword": "new_password"
}
```

### Admin Changes Institution Password
```bash
PUT /api/admin/institutions/:id
Authorization: Bearer {ADMIN_TOKEN}

{
  "password": "new_password"
}
```

---

## 🔍 Student Filtering (Admin)

### Filter by Institution ID
```bash
GET /api/admin/students?institutionId=507f1f77bcf86cd799439011
```

### Filter by Institution Name
```bash
GET /api/admin/students?institutionName=alazhar
```

### Filter by Subjects
```bash
GET /api/admin/students?subject1=I-101&subject2=I-201
```

### Filter by Section
```bash
GET /api/admin/students?section=المرحلة الإبتدائية
```

### Filter by District
```bash
GET /api/admin/students?district=Malappuram
```

### Combined Filters
```bash
GET /api/admin/students?institutionId=507f...&section=المرحلة الإبتدائية&subject1=I-101&page=1&limit=20
```

---

## 📋 Common Query Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `page` | number | Page number (default: 1) | `?page=2` |
| `limit` | number | Items per page (default: 10) | `?limit=20` |
| `search` | string | Search term | `?search=Muhammad` |
| `institutionId` | ObjectId | Exact institution ID | `?institutionId=507f...` |
| `institutionName` | string | Institution name (partial) | `?institutionName=academy` |
| `district` | string | District name | `?district=Kozhikode` |
| `section` | string | Section name | `?section=المرحلة المتوسطة` |
| `subject1` | string | First subject code | `?subject1=M-101` |
| `subject2` | string | Second subject code | `?subject2=M-201` |

---

## 🎯 Quick Examples

### Password Use Cases

**Update profile with password:**
```json
{
  "name": "Updated Name",
  "currentPassword": "old123",
  "newPassword": "new456"
}
```

**Update profile without password:**
```json
{
  "name": "Updated Name",
  "place": "New Place"
}
```

**Admin resets password:**
```json
{
  "password": "temporary123"
}
```

### Filter Use Cases

**All students in an institution:**
```
?institutionId=507f1f77bcf86cd799439011
```

**Students taking specific subject:**
```
?subject1=I-101
```

**District + Section + Subject:**
```
?district=Malappuram&section=المرحلة الإبتدائية&subject1=I-101
```

**Search within institution:**
```
?institutionId=507f...&search=Muhammad
```

---

## 📊 Response Formats

### Success (With Data)
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    "students": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 150,
      "pages": 15
    }
  }
}
```

### Success (No Data)
```json
{
  "success": true,
  "message": "Operation successful"
}
```

### Error
```json
{
  "success": false,
  "message": "Error description"
}
```

### Validation Error
```json
{
  "success": false,
  "message": "Validation error",
  "errors": ["Field 1 error", "Field 2 error"]
}
```

---

## 🔑 Authentication Headers

```bash
# Institution Token
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Admin Token  
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🚨 Common Error Codes

| Code | Meaning | Common Cause |
|------|---------|--------------|
| 400 | Bad Request | Invalid input, validation error |
| 401 | Unauthorized | Missing/invalid token, wrong password |
| 403 | Forbidden | Not verified, insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Database error, internal issue |

---

## 📝 Password Requirements

- ✅ Minimum 6 characters (increase for production)
- ✅ Current password required for institution self-change
- ✅ No current password for admin changes
- ✅ Automatically hashed with bcrypt
- ❌ Never returned in responses

---

## 🎓 Sections & Prefixes

| Section | Registration Prefix | Range |
|---------|-------------------|-------|
| المرحلة الإبتدائية | I | I250001-I259999 |
| المرحلة المتوسطة | M | M250001-M259999 |
| المرحلة العالية | A | A250001-A259999 |

---

## 🏫 Kerala Districts

```
Thiruvananthapuram, Kollam, Pathanamthitta, Alappuzha,
Kottayam, Idukki, Ernakulam, Thrissur,
Palakkad, Malappuram, Kozhikode, Wayanad,
Kannur, Kasaragod
```

---

## ⚡ Performance Tips

1. **Use `institutionId` over `institutionName`** for better performance
2. **Always paginate** large result sets
3. **Combine filters** to reduce result size
4. **Cache frequently accessed data** in frontend
5. **Use specific searches** instead of broad queries

---

## 🔗 Related Documentation

- Full API Docs: [API_DOCS.md](./API_DOCS.md)
- New Features: [NEW_FEATURES.md](./NEW_FEATURES.md)
- Changelog: [CHANGELOG.md](./CHANGELOG.md)
- Deployment: [DEPLOYMENT.md](./DEPLOYMENT.md)

---

**Last Updated:** November 3, 2025
