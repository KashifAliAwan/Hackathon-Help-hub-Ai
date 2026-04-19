# Saylani Final Hackathon Backend

## Overview

Yeh backend Node.js/Express par hai, MongoDB use karta hai, aur role-based authentication, OTP verification, aur JWT-based login provide karta hai.

## Core APIs

### 1. Welcome

- **GET /test**
  - Response: `{ "status": true, "message": "Welcome Node.js" }`

### 2. User Signup

- **POST /api/auth/signup**
  - Body: `{ "name": "Ali User", "email": "user@example.com", "password": "User@123", "confirmPassword": "User@123", "role": "Need Help" }`
  - Allowed roles: `Need Help`, `Can Help`, `Both`
  - Response: OTP email par send hota hai

### 3. Verify OTP

- **POST /api/auth/verify-otp**
  - Body: `{ "email": "user@example.com", "otp": "123456" }`
  - Response: Email verified

### 4. Resend OTP

- **POST /api/auth/resend-otp**
  - Body: `{ "email": "user@example.com" }`
  - Response: OTP dobara send

### 5. Login

- **POST /api/auth/login**
  - Body: `{ "email": "user@example.com", "password": "User@123" }`
  - Response: JWT token + user info (role bhi included)

### 6. Get My Profile

- **GET /api/auth/me**
  - Header: `Authorization: Bearer <token>`
  - Response: `{ success: true, user: { ... } }`

## Roles

- `Need Help`
- `Can Help`
- `Both`

## Notes

- Sari API details aur test requests Postman collection mein bhi milengi: `postman/saylani-backend-apis.postman_collection.json`
- Sirf yahi endpoints ab backend mein active hain. Koi extra/duplicate API nahi hai.

## Postman Environment Switch

- Collection file: `postman/saylani-backend-apis.postman_collection.json`
- `appEnv = development` ho to requests `http://localhost:3080` par chalti hain.
- `appEnv = production` ho to requests `https://helplytics-backend.vercel.app` par chalti hain.
- `baseUrl` auto-set hota hai collection pre-request script se, manually change karne ki zarurat nahi.

## Quick Start

```bash
npm install
npm run dev
```

## Author

Saylani Hackathon Team
