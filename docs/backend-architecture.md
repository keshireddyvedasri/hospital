# e-Arogya: Government Hospital Digital OP Booking & E-Record Management System
## Production Backend Architecture & Database Specification

This document provides the complete production backend architectural blueprint for transitioning the **e-Arogya** system to an enterprise-grade, ABDM-compliant (Ayushman Bharat Digital Mission) national healthcare platform using **Python FastAPI** and **PostgreSQL**.

---

## 1. System Architecture Diagram

```
+-----------------------------------------------------------------------------------+
|                            CITIZEN & CLINICAL CLIENTS                             |
|  - Patient Mobile / Web Portal    - Staff Registration Desk                       |
|  - Doctor OPD Suite               - Hospital Admin Governance Console             |
+-----------------------------------------------------------------------------------+
                                          |
                                    HTTPS / TLS 1.3
                                          |
+-----------------------------------------------------------------------------------+
|                        API GATEWAY & LOAD BALANCER (Nginx)                        |
|  - Rate Limiting (Token Bucket)        - SSL Termination                          |
|  - WAF / DDoS Mitigation               - CORS & Security Headers                  |
+-----------------------------------------------------------------------------------+
                                          |
+-----------------------------------------------------------------------------------+
|                       FASTAPI APPLICATION SERVICES (ASGI)                         |
|                                                                                   |
|  +--------------------+  +--------------------+  +--------------------+           |
|  |   Auth & RBAC      |  |  OP Registration   |  |   QR Token Engine  |           |
|  |  (OAuth2 / JWT)    |  |  & Slot Allocator  |  |  (HMAC Verification)|          |
|  +--------------------+  +--------------------+  +--------------------+           |
|                                                                                   |
|  +--------------------+  +--------------------+  +--------------------+           |
|  |   Doctor Consult   |  | Medical Records    |  | Analytics / Metric |           |
|  |  & Rx Builder      |  | (FHIR / E-Record)  |  | Aggregator         |           |
|  +--------------------+  +--------------------+  +--------------------+           |
+-----------------------------------------------------------------------------------+
           |                                  |                         |
+----------------------+           +----------------------+   +---------------------+
|   POSTGRESQL 16      |           |    REDIS 7 (CACHE)   |   |   S3 / MinIO BUCKET |
|  - Relational Data   |           |  - Session Store     |   |  - Patient Photos   |
|  - JSONB for Vitals  |           |  - Token Counters    |   |  - Lab PDF Reports  |
|  - Full-Text Search  |           |  - Rate Limit Keys   |   |  - Encrypted (AES)  |
+----------------------+           +----------------------+   +---------------------+
```

---

## 2. PostgreSQL Relational Database Schema (DDL)

```sql
-- e-Arogya Production PostgreSQL DDL Schema
-- Compliant with ABDM & National Health Systems Resource Centre (NHSRC)

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Hospitals Table
CREATE TABLE hospitals (
    hospital_id VARCHAR(20) PRIMARY KEY,
    hospital_name VARCHAR(255) NOT NULL,
    hospital_code VARCHAR(50) UNIQUE NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pin_code VARCHAR(10) NOT NULL,
    address TEXT NOT NULL,
    emergency_phone VARCHAR(20) NOT NULL,
    hospital_type VARCHAR(100) DEFAULT 'Central Government Hospital',
    daily_capacity INT DEFAULT 1500,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Departments Table
CREATE TABLE departments (
    department_id VARCHAR(20) PRIMARY KEY,
    hospital_id VARCHAR(20) REFERENCES hospitals(hospital_id) ON DELETE CASCADE,
    department_name VARCHAR(150) NOT NULL,
    department_code VARCHAR(30) NOT NULL,
    floor_location VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Doctors Table
CREATE TABLE doctors (
    doctor_id VARCHAR(20) PRIMARY KEY,
    hospital_id VARCHAR(20) REFERENCES hospitals(hospital_id) ON DELETE CASCADE,
    department_id VARCHAR(20) REFERENCES departments(department_id) ON DELETE RESTRICT,
    full_name VARCHAR(150) NOT NULL,
    qualification VARCHAR(200) NOT NULL,
    designation VARCHAR(150) NOT NULL,
    chamber_room_no VARCHAR(50) NOT NULL,
    medical_council_reg_no VARCHAR(100) UNIQUE NOT NULL,
    daily_token_quota INT DEFAULT 50,
    is_on_duty BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Patients Table
CREATE TABLE patients (
    patient_id VARCHAR(30) PRIMARY KEY, -- e.g. GH-2026-89102
    full_name VARCHAR(150) NOT NULL,
    mobile_number VARCHAR(15) NOT NULL,
    date_of_birth DATE,
    age INT NOT NULL,
    gender VARCHAR(20) NOT NULL,
    blood_group VARCHAR(10),
    complete_address TEXT NOT NULL,
    district VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pin_code VARCHAR(10) NOT NULL,
    photo_storage_url TEXT,
    abha_address VARCHAR(100),
    emergency_contact_name VARCHAR(150),
    emergency_contact_mobile VARCHAR(15),
    allergies TEXT[] DEFAULT ARRAY[]::TEXT[],
    chronic_conditions TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_patients_mobile ON patients(mobile_number);
CREATE INDEX idx_patients_name ON patients(full_name);

-- 5. Appointments Table
CREATE TYPE appointment_status AS ENUM ('Confirmed', 'Waiting', 'With Doctor', 'Completed', 'Cancelled');

CREATE TABLE appointments (
    appointment_id VARCHAR(30) PRIMARY KEY, -- e.g. OP-2026-0412
    token_number INT NOT NULL,
    patient_id VARCHAR(30) REFERENCES patients(patient_id) ON DELETE CASCADE,
    hospital_id VARCHAR(20) REFERENCES hospitals(hospital_id),
    department_id VARCHAR(20) REFERENCES departments(department_id),
    doctor_id VARCHAR(20) REFERENCES doctors(doctor_id),
    appointment_date DATE NOT NULL,
    time_slot VARCHAR(100) NOT NULL,
    status appointment_status DEFAULT 'Confirmed',
    chief_symptoms TEXT,
    checked_in_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_doctor_date_token UNIQUE (doctor_id, appointment_date, token_number)
);

CREATE INDEX idx_appointments_date_doc ON appointments(appointment_date, doctor_id);
CREATE INDEX idx_appointments_patient ON appointments(patient_id);

-- 6. QR Records Table
CREATE TABLE qr_records (
    qr_id VARCHAR(50) PRIMARY KEY,
    patient_id VARCHAR(30) REFERENCES patients(patient_id) ON DELETE CASCADE,
    appointment_id VARCHAR(30) REFERENCES appointments(appointment_id) ON DELETE CASCADE,
    secure_token_hash VARCHAR(255) NOT NULL, -- SHA-256 HMAC hash
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_qr_token_hash ON qr_records(secure_token_hash);

-- 7. Medical Records Table
CREATE TABLE medical_records (
    record_id VARCHAR(30) PRIMARY KEY,
    patient_id VARCHAR(30) REFERENCES patients(patient_id) ON DELETE CASCADE,
    appointment_id VARCHAR(30) REFERENCES appointments(appointment_id),
    hospital_id VARCHAR(20) REFERENCES hospitals(hospital_id),
    department_id VARCHAR(20) REFERENCES departments(department_id),
    doctor_id VARCHAR(20) REFERENCES doctors(doctor_id),
    visit_date DATE NOT NULL,
    symptoms TEXT[] NOT NULL,
    vitals JSONB NOT NULL, -- { bp: "120/80", pulse: 72, temp: 98.6, spo2: 99, weight: 70 }
    diagnosis TEXT NOT NULL,
    prescriptions JSONB NOT NULL, -- [{ drug: "Paracetamol", dosage: "650mg", freq: "1-0-1", duration: "5d" }]
    lab_investigations JSONB DEFAULT '[]'::JSONB,
    clinical_notes TEXT,
    follow_up_advice VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_medrec_patient ON medical_records(patient_id, visit_date DESC);

-- 8. Users and Roles Table
CREATE TYPE user_role AS ENUM ('patient', 'staff', 'doctor', 'admin', 'superadmin');

CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(100) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    role user_role NOT NULL,
    hospital_id VARCHAR(20) REFERENCES hospitals(hospital_id),
    doctor_id VARCHAR(20) REFERENCES doctors(doctor_id),
    patient_id VARCHAR(30) REFERENCES patients(patient_id),
    counter_number VARCHAR(30),
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

## 3. Secure QR Code Token Specification

### Cryptographic Nonce & Payload
To comply with healthcare data privacy laws (DPDP Act 2023 / HIPAA equivalent):
- The QR Code **MUST NOT** contain unencrypted patient medical diagnoses or sensitive personal notes.
- The QR payload contains a structured verifiable token with an HMAC signature:

```json
{
  "v": 1,
  "pid": "GH-2026-89102",
  "op": "OP-2026-0412",
  "tok": "9d8f3b20c1a9",
  "hosp": "HOSP-01",
  "exp": 1730678400,
  "sig": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
}
```

### Python HMAC Verification Implementation
```python
import hmac
import hashlib
import json
import time
from fastapi import HTTPException, status

SECRET_KEY = b"GOVT_HEALTH_SECURITY_KEY_2026_PROD"

def generate_secure_qr_payload(patient_id: str, appointment_id: str, hospital_id: str) -> dict:
    expires_at = int(time.time()) + (86400 * 3) # Valid for 72 hours
    nonce = hashlib.sha256(f"{patient_id}:{appointment_id}:{time.time()}".encode()).hexdigest()[:16]
    
    body = f"{patient_id}:{appointment_id}:{hospital_id}:{nonce}:{expires_at}"
    signature = hmac.new(SECRET_KEY, body.encode(), hashlib.sha256).hexdigest()
    
    return {
        "v": 1,
        "pid": patient_id,
        "op": appointment_id,
        "tok": nonce,
        "hosp": hospital_id,
        "exp": expires_at,
        "sig": signature
    }

def verify_qr_token(payload: dict) -> bool:
    if payload.get("exp", 0) < int(time.time()):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="QR Pass Expired")
        
    body = f"{payload['pid']}:{payload['op']}:{payload['hosp']}:{payload['tok']}:{payload['exp']}"
    expected_sig = hmac.new(SECRET_KEY, body.encode(), hashlib.sha256).hexdigest()
    
    if not hmac.compare_digest(expected_sig, payload.get("sig", "")):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid QR Code Signature")
        
    return True
```

---

## 4. FastAPI Application Layout & Endpoints

```
backend/
├── app/
│   ├── main.py                  # FastAPI initialization, CORS, middlewares
│   ├── config.py                # Environment configs (Pydantic Settings)
│   ├── database.py              # Async SQLAlchemy engine & sessionmaker
│   ├── dependencies.py          # Current user, RBAC role guard
│   ├── models/                  # SQLAlchemy ORM mapped models
│   ├── schemas/                 # Pydantic v2 request/response schemas
│   ├── routers/
│   │   ├── auth.py              # Login (JWT OAuth2), OTP verify
│   │   ├── patients.py          # OP Registration, duplicate check, photo upload
│   │   ├── appointments.py      # Slot booking, live queue, token updates
│   │   ├── qr.py                # Dynamic QR generation & camera scan verify
│   │   ├── medical_records.py   # Consultation notes, prescriptions, lab orders
│   │   └── admin.py             # Hospital KPIs, doctor rosters, slot capacity
│   └── services/
│       ├── storage_service.py   # S3 / MinIO presigned uploads
│       └── sms_service.py       # NIC SMS gateway integration
```

### Core REST Endpoints Matrix
| Method | Endpoint | Role Allowed | Description |
|---|---|---|---|
| `POST` | `/api/v1/auth/token` | Public | Login credentials, returns JWT bearer token |
| `POST` | `/api/v1/patients/register` | Public / Staff | Register patient, check duplicate mobile |
| `POST` | `/api/v1/appointments/book` | Public / Staff | Book OP appointment & assign daily token |
| `GET` | `/api/v1/appointments/slip/{id}` | All Authenticated | Get printable OP ticket with signed QR payload |
| `POST` | `/api/v1/qr/scan-verify` | Staff, Doctor, Admin | Scan QR token, verifies HMAC, returns patient EHR |
| `GET` | `/api/v1/doctor/queue/{doc_id}` | Doctor | View active waiting and completed queue for today |
| `POST` | `/api/v1/medical-records/consultation` | Doctor | Save clinical diagnosis, prescriptions, and lab orders |
| `GET` | `/api/v1/admin/analytics` | Admin | Get Chart.js weekly trend, department breakdown |

---

## 5. Secure Photograph & Report Storage (MinIO / S3)
1. **Presigned Upload Workflow**: Client requests an upload token (`/api/v1/patients/upload-photo-url`).
2. Server returns a 15-minute presigned PUT URL pointing to `s3://e-arogya-photos/{patient_id}.jpg`.
3. Client streams the captured webcam snapshot or file directly to object storage with AES-256 server-side encryption.
4. Images are served through an authenticated proxy or CloudFront CDN with strict time-limited access tokens.

