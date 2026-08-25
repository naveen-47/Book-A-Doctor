# 🏥 Book a Doctor - Full-Stack MERN Healthcare Booking System

**Book a Doctor** is a production-ready, full-stack healthcare appointment scheduling platform built using MongoDB, Express.js, React, and Node.js. It delivers a modern, intuitive, and secure healthcare management experience for Patients, Doctors, and System Administrators.

---

## 🌟 Key Features

### 🧑 Patient Portal
- **Doctor Discovery & Search**: Search by doctor name, specialty, or clinic with live filters for fee ranges, ratings, and days.
- **Real-Time Slot Engine**: Dynamic slot availability check that prevents double bookings.
- **Instant Booking Flow**: Multi-step booking modal with instant confirmation and confetti effects.
- **Medical Records Vault**: Attach lab reports, blood test PDFs, and diagnostic files directly to appointments.
- **Prescription Viewer**: View, print, and download digital prescriptions issued by doctors.
- **Appointment Lifecycle**: Cancel appointments and review upcoming or completed visits.

### 👨‍⚕️ Doctor Portal
- **Doctor Queue & Schedule**: View today's and upcoming patient appointments with symptoms and history.
- **One-Click Status Controls**: Confirm, complete, or cancel appointments in real time.
- **Digital Prescription Generator**: Prescribe medications, clinical diagnosis, and dietary instructions with auto-completion.
- **Patient Document Review**: Access and view patient-uploaded lab tests and past records.
- **Practice & Fee Management**: Customize consultation fees, clinic details, bio, and working slots.

### 👑 Super Admin Control Center
- **Executive Platform Analytics**: Real-time counters for Total Patients, Registered Doctors, Platform Appointments, and Gross Revenue.
- **Doctor Verification Pipeline**: Review new doctor applications with instant 1-click **Approve** and **Reject** controls.
- **User Governance**: Searchable patient/doctor/admin directory with status toggle (Activate / Deactivate).
- **Platform-Wide Appointment Oversight**: Monitor all consultations across all specialties.

---

## 🔑 Demo Credentials (1-Click Login Available in App)

| Role | Email | Password | Features |
| :--- | :--- | :--- | :--- |
| 👑 **Super Admin** | `admin@bookadoctor.com` | `admin123` | Analytics, Doctor Approvals, User Governance |
| 👨‍⚕️ **Doctor** | `dr.sophia@bookadoctor.com` | `doctor123` | Schedule Queue, Digital Prescriptions, Status Updates |
| 🧑 **Patient** | `patient@bookadoctor.com` | `patient123` | Search, Instant Booking, Lab Reports, Prescriptions |

*(Tip: You can also use the **"Demo 1-Click Login"** dropdown directly in the top navigation bar!)*

---

## 🏗️ Architecture & Tech Stack

```
c:\Book A Doctor\
├── backend/
│   ├── config/             # MongoDB database connection
│   ├── controllers/        # Auth, Doctor, Appointment, and Admin business logic
│   ├── middleware/         # JWT Auth, Role-Based Access Control, Multer file upload
│   ├── models/             # Mongoose Schemas (User, Doctor, Appointment)
│   ├── routes/             # RESTful API Endpoints
│   ├── uploads/            # Static storage for reports and prescriptions
│   ├── utils/              # Database seeder with realistic medical data
│   └── server.js           # Express.js application entry point
├── frontend/
│   ├── src/
│   │   ├── components/     # Navbar, Footer, DoctorCard, BookingModal, Modals
│   │   ├── context/        # AuthContext, ToastContext
│   │   ├── pages/          # Home, Doctors, DoctorDetails, Dashboards, Auth
│   │   ├── services/       # Axios API client with JWT interceptors
│   │   ├── App.jsx         # App routing & protected routes
│   │   └── index.css       # Custom Glassmorphic Medical Design System
│   └── vite.config.js      # Vite build & proxy configuration
```

- **Frontend**: React 18, Vite 6, React Router 6, Axios, Lucide React, Canvas Confetti, Vanilla CSS Design System.
- **Backend**: Node.js, Express.js, Mongoose, JSON Web Tokens (JWT), BcryptJS, Multer, Morgan, CORS, Dotenv.
- **Database**: MongoDB (Local Server / Atlas).

---

## 🚀 Quick Start Guide

### 1. Backend Setup
```bash
cd backend
npm install
npm run seed      # Populates database with sample doctors, patients, and appointments
npm start         # Runs backend server on http://localhost:5000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev       # Runs frontend on http://localhost:5173
```

### 3. Running Automated Test Suite
```bash
cd backend
node test_suite.js
```

---

## 🛡️ Security & Role-Based Access
- Passwords salted and hashed with **BcryptJS**.
- Stateless authentication with **JWT (JSON Web Tokens)** expiring in 30 days.
- Role-based authorization middleware enforcing strict permission boundaries:
  - `authorize('admin')`: Doctor verification, user account status toggling, platform analytics.
  - `authorize('doctor')`: Patient queue, prescription issuance, doctor practice settings.
  - `authorize('patient')`: Appointment scheduling, cancellation, document uploads.
