# Arogya Care: Digital Hospital, OP & Room Booking Management System (React.js)

A modern, accessible, and responsive hospital management system built with **React.js**, **Vite**, and **Bootstrap 5**. Designed for seamless outpatient (OP) registration, inpatient bed allocation, real-time blood bank inventory tracking, and electronic health records (EHR).

---

## 🚀 Live Localhost Link

👉 **[http://localhost:8000](http://localhost:8000)** *(or [http://127.0.0.1:8000](http://127.0.0.1:8000))*

Vite development server is running in the background.

---

## 🌟 Modules & Features

### 1. Patient OP Registration Module
- Full Name, 10-digit Indian Mobile Number (`+91`), Age / DOB auto-synchronization, Gender, Blood Group, Address, District, State, PIN code.
- **WebRTC Camera Selfie Capture**: Real-time webcam capture with oval face guide, instant snapshot, and retake capabilities, plus device file upload.
- **Duplicate Prevention**: Instant duplicate check when 10 digits are entered; 1-click **"Use Saved Profile"** autofill.
- **Dynamic Doctors with Live Status**: Select doctor displaying **🟢 ONLINE (In Chamber)** or **⚪ OFFLINE (Away / Rounds)**.
- **Instant QR OP Ticket**: Generates Patient ID (`GH-2026-XXXXX`), OP Ticket (`OP-2026-XXXX`), sequential Token Number (`#14`), and printable ticket with dynamic QR code.

### 2. Inpatient Hospital Rooms & Bed Booking
- **Live Bed Tracking**: Real-time occupancy progress bars and free bed counters across:
  - *General Ward (Male / Female)*
  - *Semi-Private Room (Twin Sharing, AC, Washroom)*
  - *Private Deluxe Room (Single, TV, Recliner)*
  - *ICU / Critical Care Bed (Ventilator, Multi-Para Monitor)*
  - *Day-Care Observation Bed*
- **Instant Bed Allotment**: 1-click booking allocating a physical bed (`Bed #GW-08`), generating a printable **Bed Allotment Pass with QR Code**.

### 3. Real-Time Blood Bank Inventory
- Real-time stock counts for **A+**, **A-**, **B+**, **B-**, **O+**, **O-**, **AB+**, **AB-**, **Platelets**, and **Plasma**.
- Status levels: `Good Stock`, `Adequate`, `Critical Low`.
- **"Emergency Blood Request"** modal for immediate unit reservation.

### 4. Doctor Availability (Online / Offline Tracker)
- Real-time indicator on doctor directory and appointment booking.
- **Doctor 1-Click Status Toggle**: In the Doctor OPD Suite, doctors can switch their status between **ONLINE** and **OFFLINE** with one click.

### 5. Multi-Portal Workspaces (1-Click Switcher)
- 🏠 **Hospital Home**: Public OP booking, bed booking, blood bank, doctor directory.
- 👤 **Patient Portal**: Upcoming tokens, QR health pass, bed admissions, past consultations.
- 📋 **Staff Desk**: Real-time search, today's queue table, camera QR scanner, check-in, photo verification.
- 🩺 **Doctor OPD Suite**: Active queue, camera QR scan, consultation workspace with vitals, diagnosis, dynamic prescription builder (+ Add Drug row), and e-record saving.
- 🏛️ **Hospital Admin**: KPI metrics, weekly trend and department distribution charts, doctor roster.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | React 19 (Hooks, Functional Components) |
| **Bundler & Dev Server** | Vite 8 (Hot Module Replacement, Rolldown) |
| **Styling** | Bootstrap 5, Bootstrap Icons, Lucide React, Custom CSS |
| **State & Persistence** | Reactive LocalStorage DataStore with Custom `useStore` Hook |
| **QR Code Engine** | QRCode.js (dynamic canvas & base64 generation) |
| **Camera Scanner** | Html5-Qrcode (live webcam video stream with electronic audio chime) |
| **Charts** | Chart.js 4 (Line & Doughnut visual analytics) |

---

## 📁 React Project Structure

```
op-booking/
├── src/
│   ├── main.jsx                     # React DOM root entry
│   ├── App.jsx                      # Main controller with state & role views
│   ├── index.css                    # Global healthcare styles & font scaling
│   ├── store/
│   │   ├── dataStore.js             # LocalStorage database engine with reactive notifications
│   │   └── useStore.js              # Custom React hook for shared store state
│   ├── components/
│   │   ├── Navbar.jsx               # Header with emergency hotline, font scaler (A-, A, A+) & contrast
│   │   ├── RoleSwitcher.jsx         # 1-click portal switcher
│   │   ├── modules/
│   │   │   ├── OPBooking.jsx        # OP registration with live camera & duplicate check
│   │   │   ├── RoomBooking.jsx      # Inpatient room & bed booking with live meters
│   │   │   ├── BloodBank.jsx        # Real-time blood units inventory & request
│   │   │   └── DoctorDirectory.jsx  # Doctor cards with live Online/Offline status
│   │   ├── portals/
│   │   │   ├── PatientPortal.jsx    # Patient dashboard
│   │   │   ├── StaffPortal.jsx      # Registration staff counter
│   │   │   ├── DoctorPortal.jsx     # Doctor OPD consultation suite
│   │   │   └── AdminPortal.jsx      # Hospital admin console & charts
│   │   └── modals/
│   │       ├── OPSlipModal.jsx      # Printable OP ticket with dynamic QR code
│   │       ├── BedBookingModal.jsx  # Bed allotment modal & printable pass
│   │       ├── BloodRequestModal.jsx# Blood unit request modal
│   │       ├── CameraModal.jsx      # WebRTC camera selfie capture
│   │       ├── QRScannerModal.jsx   # Live camera QR scanner with sound
│   │       ├── PatientRecordModal.jsx# Verified EHR medical timeline
│   │       └── ConsultationModal.jsx# Prescription pad & diagnosis builder
├── vite.config.js
├── index.html
└── package.json
```

---

## 💻 Commands

```bash
# Start Vite development server
npm run dev

# Build production bundle
npm run build

# Preview production build
npm run preview
```
