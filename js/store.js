/**
 * Arogya Care: Digital Hospital & Health Records
 * Data Store & Local Database Engine (LocalStorage backed)
 * Models: Patients, Hospitals, Departments, Doctors, Appointments, MedicalRecords, QRRecords, Users, Rooms, BloodBank
 */

const STORAGE_KEY = 'arogya_care_db_v2';

// Initial Seed Data
const DEFAULT_DATABASE = {
  hospitals: [
    {
      id: 'HOSP-01',
      name: 'City Central Government Hospital',
      code: 'CCGH-01',
      city: 'Metro City',
      state: 'State Central',
      emergencyPhone: '108 / 011-26165060',
      address: 'Ring Road, Medical Campus',
      dailyCap: 1500
    },
    {
      id: 'HOSP-02',
      name: 'Memorial Government Super-Speciality Hospital',
      code: 'MGH-02',
      city: 'Metro City',
      state: 'State Central',
      emergencyPhone: '108 / 011-26588500',
      address: 'Aurobindo Marg, Health Enclave',
      dailyCap: 2000
    }
  ],

  departments: [
    { id: 'DEP-GEN', name: 'General Medicine', code: 'GM', icon: 'bi-heart-pulse', floor: '1st Floor - Wing A' },
    { id: 'DEP-CARD', name: 'Cardiology (Heart)', code: 'CARD', icon: 'bi-activity', floor: '2nd Floor - Super-Speciality' },
    { id: 'DEP-ORTH', name: 'Orthopedics (Bones & Joints)', code: 'ORTH', icon: 'bi-person-arms-up', floor: 'Ground Floor - Wing B' },
    { id: 'DEP-PED', name: 'Pediatrics (Child Care)', code: 'PED', icon: 'bi-emoji-smile', floor: '3rd Floor - Mother & Child' },
    { id: 'DEP-DERM', name: 'Dermatology (Skin)', code: 'DERM', icon: 'bi-bandaid', floor: '2nd Floor - Wing C' },
    { id: 'DEP-ENT', name: 'ENT (Ear, Nose, Throat)', code: 'ENT', icon: 'bi-soundwave', floor: '2nd Floor - Room 218' },
    { id: 'DEP-OPHTH', name: 'Ophthalmology (Eye Clinic)', code: 'EYE', icon: 'bi-eye', floor: '1st Floor - Eye Center' },
    { id: 'DEP-PULM', name: 'Pulmonology (Lungs & Chest)', code: 'PULM', icon: 'bi-lungs', floor: 'Ground Floor - Chest Clinic' }
  ],

  doctors: [
    {
      id: 'DOC-101',
      name: 'Dr. Anita Roy',
      qualification: 'MD (Medicine), DM (Cardiology)',
      designation: 'Senior Cardiologist',
      departmentId: 'DEP-CARD',
      hospitalId: 'HOSP-01',
      roomNo: 'Chamber 204',
      experience: '16 Years',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      tokenQuota: 40,
      active: true,
      onlineStatus: 'online', // 'online' = in chamber, 'offline' = away/on rounds
      statusNote: 'Available in Chamber 204'
    },
    {
      id: 'DOC-102',
      name: 'Dr. Rajesh Sharma',
      qualification: 'MD (General Medicine)',
      designation: 'Chief Medical Consultant',
      departmentId: 'DEP-GEN',
      hospitalId: 'HOSP-01',
      roomNo: 'Chamber 108',
      experience: '22 Years',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      tokenQuota: 60,
      active: true,
      onlineStatus: 'online',
      statusNote: 'Available for Consultations'
    },
    {
      id: 'DOC-103',
      name: 'Dr. Sunita Kulkarni',
      qualification: 'MS (Orthopedics)',
      designation: 'Senior Orthopedic Surgeon',
      departmentId: 'DEP-ORTH',
      hospitalId: 'HOSP-01',
      roomNo: 'Chamber 115',
      experience: '14 Years',
      days: ['Mon', 'Wed', 'Fri'],
      tokenQuota: 45,
      active: true,
      onlineStatus: 'offline', // Currently in OT / Rounds
      statusNote: 'In Operation Theatre until 12:30 PM'
    },
    {
      id: 'DOC-104',
      name: 'Dr. Mohammed Imran',
      qualification: 'MD (Pediatrics), DCH',
      designation: 'Pediatric Specialist',
      departmentId: 'DEP-PED',
      hospitalId: 'HOSP-01',
      roomNo: 'Chamber 210',
      experience: '11 Years',
      days: ['Mon', 'Tue', 'Thu', 'Fri', 'Sat'],
      tokenQuota: 50,
      active: true,
      onlineStatus: 'online',
      statusNote: 'Available in Chamber 210'
    },
    {
      id: 'DOC-105',
      name: 'Dr. Kavita Deshmukh',
      qualification: 'MD (Dermatology)',
      designation: 'Consultant Dermatologist',
      departmentId: 'DEP-DERM',
      hospitalId: 'HOSP-01',
      roomNo: 'Chamber 302',
      experience: '9 Years',
      days: ['Tue', 'Thu', 'Sat'],
      tokenQuota: 40,
      active: true,
      onlineStatus: 'offline',
      statusNote: 'Off-Duty Today (Next OP: Tomorrow 9 AM)'
    },
    {
      id: 'DOC-106',
      name: 'Dr. Arvind Nair',
      qualification: 'MS (ENT)',
      designation: 'Assistant Professor & Surgeon',
      departmentId: 'DEP-ENT',
      hospitalId: 'HOSP-01',
      roomNo: 'Chamber 218',
      experience: '12 Years',
      days: ['Mon', 'Wed', 'Fri'],
      tokenQuota: 40,
      active: true,
      onlineStatus: 'online',
      statusNote: 'Available in Chamber 218'
    }
  ],

  // Hospital Inpatient Rooms & Beds
  rooms: [
    {
      id: 'ROOM-GW-M',
      type: 'General Ward (Male)',
      category: 'General',
      totalBeds: 40,
      occupiedBeds: 28,
      pricePerDay: 'Free (Govt Supported)',
      amenities: ['Continuous Nursing Care', 'Central Oxygen Supply', 'Doctor Daily Rounds', 'Free Meals'],
      floor: 'Ground & 1st Floor',
      icon: 'bi-hospital'
    },
    {
      id: 'ROOM-GW-F',
      type: 'General Ward (Female & Pediatric)',
      category: 'General',
      totalBeds: 40,
      occupiedBeds: 31,
      pricePerDay: 'Free (Govt Supported)',
      amenities: ['Attendant Space', 'Central Oxygen Supply', 'Doctor Daily Rounds', 'Free Meals'],
      floor: '1st Floor - Wing B',
      icon: 'bi-hospital'
    },
    {
      id: 'ROOM-SP',
      type: 'Semi-Private Room (Twin Sharing)',
      category: 'Semi-Private',
      totalBeds: 24,
      occupiedBeds: 18,
      pricePerDay: '₹ 800 / day',
      amenities: ['Air Conditioned', 'Twin Sharing', 'Attached Washroom', 'Attendant Cot & Chair', 'Television'],
      floor: '2nd Floor - North Wing',
      icon: 'bi-door-open'
    },
    {
      id: 'ROOM-PVT',
      type: 'Private Deluxe Room (Single)',
      category: 'Private',
      totalBeds: 16,
      occupiedBeds: 11,
      pricePerDay: '₹ 1,800 / day',
      amenities: ['Private Room', 'Attached Washroom', 'Dedicated Nurse Call', 'Refrigerator & Sofa', 'Wi-Fi'],
      floor: '3rd Floor - Deluxe Wing',
      icon: 'bi-star-fill'
    },
    {
      id: 'ROOM-ICU',
      type: 'ICU / Critical Care Bed',
      category: 'Critical Care',
      totalBeds: 14,
      occupiedBeds: 10,
      pricePerDay: 'Subsidized / Free for Emergencies',
      amenities: ['Multi-Parameter Monitor', 'Advanced Ventilator', '1:1 Dedicated Nursing', 'Emergency Defibrillator'],
      floor: '2nd Floor - ICU Complex',
      icon: 'bi-activity'
    },
    {
      id: 'ROOM-DC',
      type: 'Day Care Observation Bed',
      category: 'Day Care',
      totalBeds: 15,
      occupiedBeds: 7,
      pricePerDay: 'Free / ₹ 300 for Day Surgery',
      amenities: ['Short Stay Bed', 'Post-Op Monitoring', 'IV Fluid Station', 'Dialysis Support'],
      floor: 'Ground Floor - Day Care',
      icon: 'bi-clock-history'
    }
  ],

  roomBookings: [
    {
      id: 'BK-2026-019',
      patientId: 'GH-2026-89102',
      patientName: 'Ramesh Kumar',
      roomTypeId: 'ROOM-SP',
      roomTypeName: 'Semi-Private Room (Twin Sharing)',
      bedNumber: 'Bed SP-12',
      admitDate: new Date().toISOString().split('T')[0],
      durationDays: 3,
      status: 'Admitted / Active',
      department: 'Cardiology',
      doctor: 'Dr. Anita Roy',
      notes: 'Admitted for 72-hour cardiac rhythm monitoring and medication titration'
    }
  ],

  // Hospital Blood Bank Real-time Inventory
  bloodBank: [
    { group: 'A+', units: 24, status: 'Adequate', donorCountToday: 5, lastUpdated: 'Today, 10:15 AM' },
    { group: 'A-', units: 6, status: 'Low Stock', donorCountToday: 1, lastUpdated: 'Today, 09:30 AM' },
    { group: 'B+', units: 38, status: 'Adequate', donorCountToday: 8, lastUpdated: 'Today, 11:00 AM' },
    { group: 'B-', units: 3, status: 'Critical Low', donorCountToday: 0, lastUpdated: 'Today, 08:45 AM' },
    { group: 'O+', units: 42, status: 'Good Stock', donorCountToday: 11, lastUpdated: 'Today, 11:15 AM' },
    { group: 'O-', units: 5, status: 'Critical Low', donorCountToday: 2, lastUpdated: 'Today, 09:00 AM' },
    { group: 'AB+', units: 16, status: 'Adequate', donorCountToday: 3, lastUpdated: 'Today, 10:45 AM' },
    { group: 'AB-', units: 2, status: 'Critical Low', donorCountToday: 0, lastUpdated: 'Today, 08:00 AM' },
    { group: 'Platelets (RDP)', units: 18, status: 'Adequate', donorCountToday: 4, lastUpdated: 'Today, 10:30 AM' },
    { group: 'Plasma (FFP)', units: 25, status: 'Adequate', donorCountToday: 6, lastUpdated: 'Today, 11:00 AM' }
  ],

  bloodRequests: [
    {
      id: 'BLD-REQ-801',
      patientName: 'Ramesh Kumar',
      patientId: 'GH-2026-89102',
      bloodGroup: 'B+',
      unitsRequested: 1,
      urgency: 'Scheduled / OP Support',
      doctor: 'Dr. Anita Roy',
      status: 'Reserved',
      createdAt: '2026-11-03T09:45:00Z'
    }
  ],

  patients: [
    {
      id: 'GH-2026-89102',
      fullName: 'Ramesh Kumar',
      mobile: '9876543210',
      dob: '1978-04-12',
      age: 48,
      gender: 'Male',
      bloodGroup: 'B+',
      address: 'H-42, Pocket-B, Mayur Vihar Phase-2',
      district: 'East District',
      state: 'Metro State',
      pinCode: '110091',
      emergencyContactName: 'Suman Kumar (Wife)',
      emergencyContactMobile: '9876543211',
      photo: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 150 150"><rect width="150" height="150" fill="%230284c7"/><circle cx="75" cy="55" r="30" fill="%23f8fafc"/><path d="M25 135 C30 95, 120 95, 125 135" fill="%23f8fafc"/></svg>',
      allergies: ['Penicillin (Moderate rash)', 'Aspirin intolerance'],
      chronicConditions: ['Essential Hypertension (Since 2021)'],
      registeredAt: '2024-03-15T09:30:00Z',
      abhaId: '91-8910-2345-6712'
    },
    {
      id: 'GH-2026-67341',
      fullName: 'Sunita Mehra',
      mobile: '9811223344',
      dob: '1992-09-24',
      age: 34,
      gender: 'Female',
      bloodGroup: 'O+',
      address: 'Sector 14, Green Heights',
      district: 'West District',
      state: 'Metro State',
      pinCode: '110078',
      emergencyContactName: 'Rajesh Mehra (Husband)',
      emergencyContactMobile: '9811223340',
      photo: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 150 150"><rect width="150" height="150" fill="%230d9488"/><circle cx="75" cy="55" r="30" fill="%23fef08a"/><path d="M25 135 C30 95, 120 95, 125 135" fill="%23fef08a"/></svg>',
      allergies: ['Sulfa drugs (Severe)'],
      chronicConditions: ['Hypothyroidism'],
      registeredAt: '2025-01-10T11:20:00Z',
      abhaId: '91-6734-1902-8833'
    }
  ],

  appointments: [
    {
      id: 'OP-2026-0412',
      tokenNo: 14,
      patientId: 'GH-2026-89102',
      hospitalId: 'HOSP-01',
      departmentId: 'DEP-CARD',
      doctorId: 'DOC-101',
      date: new Date().toISOString().split('T')[0],
      timeSlot: 'Morning Slot (09:00 AM - 11:30 AM)',
      status: 'Waiting',
      reason: 'Frequent palpitation, occasional chest tightness',
      createdAt: '2026-11-02T10:00:00Z',
      checkedInAt: '2026-11-03T09:12:00Z',
      qrToken: 'SEC-TOKEN-89102-0412'
    },
    {
      id: 'OP-2026-0413',
      tokenNo: 15,
      patientId: 'GH-2026-67341',
      hospitalId: 'HOSP-01',
      departmentId: 'DEP-DERM',
      doctorId: 'DOC-105',
      date: new Date().toISOString().split('T')[0],
      timeSlot: 'Morning Slot (09:00 AM - 11:30 AM)',
      status: 'Confirmed',
      reason: 'Erythematous itchy skin patch on forearm',
      createdAt: '2026-11-02T14:30:00Z',
      qrToken: 'SEC-TOKEN-67341-0413'
    }
  ],

  medicalRecords: [
    {
      id: 'REC-2025-0812',
      patientId: 'GH-2026-89102',
      hospitalId: 'HOSP-01',
      departmentId: 'DEP-CARD',
      doctorId: 'DOC-101',
      doctorName: 'Dr. Anita Roy',
      departmentName: 'Cardiology',
      visitDate: '2025-09-14',
      symptoms: ['Mild exertional shortness of breath', 'High BP reading at home (150/94)'],
      vitals: {
        bloodPressure: '148/92 mmHg',
        pulseRate: '82 bpm',
        temperature: '98.4 °F',
        spo2: '98%',
        weight: '74 kg'
      },
      diagnosis: 'Primary Essential Hypertension - Grade 1',
      prescriptions: [
        { medicine: 'Tab. Telmisartan', dosage: '40 mg', frequency: '1-0-0 (Morning)', duration: '30 Days', instructions: 'Take after breakfast' },
        { medicine: 'Tab. Amlodipine', dosage: '5 mg', frequency: '0-0-1 (Night)', duration: '30 Days', instructions: 'Take at bedtime' }
      ],
      labReports: [
        { testName: '12-Lead Resting ECG', result: 'Normal sinus rhythm, Left axis deviation', status: 'Completed', reportDate: '2025-09-14' },
        { testName: 'Lipid Profile (Fasting)', result: 'Total Cholesterol: 218 mg/dL, LDL: 138 mg/dL', status: 'Completed', reportDate: '2025-09-15' }
      ],
      notes: 'Advised strict low-sodium diet and daily walking. Review after 6 weeks.',
      nextFollowUp: '2025-10-25'
    }
  ],

  qrRecords: [
    {
      qrId: 'QR-89102-0412',
      patientId: 'GH-2026-89102',
      appointmentId: 'OP-2026-0412',
      hospitalId: 'HOSP-01',
      secureToken: 'SEC-TOKEN-89102-0412',
      createdAt: '2026-11-02T10:00:00Z',
      status: 'Active'
    }
  ],

  users: [
    { id: 'USR-PAT-01', username: '9876543210', name: 'Ramesh Kumar', role: 'patient', patientId: 'GH-2026-89102' },
    { id: 'USR-STAFF-01', username: 'staff1', name: 'S. Ramanathan', role: 'staff', counterNo: 'Counter-03' },
    { id: 'USR-DOC-01', username: 'doctor1', name: 'Dr. Anita Roy', role: 'doctor', doctorId: 'DOC-101' },
    { id: 'USR-ADMIN-01', username: 'admin', name: 'Dr. V. K. Paul (Director)', role: 'admin' }
  ]
};

// Database Store Service
class DatabaseStore {
  constructor() {
    this.init();
  }

  init() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        this.saveState(DEFAULT_DATABASE);
      }
    } catch (e) {
      console.warn('LocalStorage not available, running in memory mode', e);
      this._memoryDb = JSON.parse(JSON.stringify(DEFAULT_DATABASE));
    }
  }

  getState() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      if (this._memoryDb) return this._memoryDb;
    }
    return JSON.parse(JSON.stringify(DEFAULT_DATABASE));
  }

  saveState(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      this._memoryDb = state;
    }
  }

  resetToDefault() {
    this.saveState(DEFAULT_DATABASE);
    return this.getState();
  }

  // --- Patients API ---
  getPatients() {
    return this.getState().patients || [];
  }

  getPatientById(id) {
    return this.getPatients().find(p => p.id === id) || null;
  }

  getPatientByMobile(mobile) {
    const clean = String(mobile).trim().replace(/^\+91/, '').replace(/\s+/g, '');
    return this.getPatients().find(p => p.mobile === clean) || null;
  }

  createPatient(patientData) {
    const state = this.getState();
    const cleanMobile = String(patientData.mobile).trim().replace(/^\+91/, '').replace(/\s+/g, '');

    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const newId = `GH-${new Date().getFullYear()}-${randomNum}`;

    const newPatient = {
      id: newId,
      fullName: patientData.fullName.trim(),
      mobile: cleanMobile,
      dob: patientData.dob || '',
      age: parseInt(patientData.age, 10) || 0,
      gender: patientData.gender || 'Not Specified',
      bloodGroup: patientData.bloodGroup || 'Unknown',
      address: patientData.address || '',
      district: patientData.district || 'Central',
      state: patientData.state || 'Metro State',
      pinCode: patientData.pinCode || '',
      emergencyContactName: patientData.emergencyContactName || '',
      emergencyContactMobile: patientData.emergencyContactMobile || '',
      photo: patientData.photo || this.generateDefaultAvatar(patientData.fullName),
      allergies: patientData.allergies ? (Array.isArray(patientData.allergies) ? patientData.allergies : [patientData.allergies]) : ['No Known Drug Allergies'],
      chronicConditions: patientData.chronicConditions ? (Array.isArray(patientData.chronicConditions) ? patientData.chronicConditions : [patientData.chronicConditions]) : ['None'],
      registeredAt: new Date().toISOString(),
      abhaId: `91-${randomNum}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`
    };

    state.patients.unshift(newPatient);
    this.saveState(state);
    return { success: true, patient: newPatient };
  }

  updatePatient(id, updateData) {
    const state = this.getState();
    const idx = state.patients.findIndex(p => p.id === id);
    if (idx === -1) return { success: false, message: 'Patient not found' };

    state.patients[idx] = { ...state.patients[idx], ...updateData };
    this.saveState(state);
    return { success: true, patient: state.patients[idx] };
  }

  // --- Hospitals, Departments, Doctors ---
  getHospitals() {
    return this.getState().hospitals || [];
  }

  getHospitalById(id) {
    return this.getHospitals().find(h => h.id === id) || null;
  }

  getDepartments() {
    return this.getState().departments || [];
  }

  getDepartmentById(id) {
    return this.getDepartments().find(d => d.id === id) || null;
  }

  getDoctors(departmentId = null) {
    const docs = this.getState().doctors || [];
    return departmentId ? docs.filter(d => d.departmentId === departmentId) : docs;
  }

  getDoctorById(id) {
    return this.getState().doctors.find(d => d.id === id) || null;
  }

  toggleDoctorStatus(doctorId) {
    const state = this.getState();
    const doc = state.doctors.find(d => d.id === doctorId);
    if (!doc) return { success: false };

    doc.onlineStatus = doc.onlineStatus === 'online' ? 'offline' : 'online';
    doc.statusNote = doc.onlineStatus === 'online' ? `Available in ${doc.roomNo}` : 'Away / On Ward Rounds';
    this.saveState(state);
    return { success: true, doctor: doc };
  }

  // --- Rooms & Bed Booking API ---
  getRooms() {
    return this.getState().rooms || [];
  }

  getRoomById(id) {
    return this.getRooms().find(r => r.id === id) || null;
  }

  getRoomBookings(patientId = null) {
    let list = this.getState().roomBookings || [];
    if (patientId) list = list.filter(b => b.patientId === patientId);
    return list;
  }

  bookRoom(bookingData) {
    const state = this.getState();
    const room = state.rooms.find(r => r.id === bookingData.roomTypeId);
    if (!room) return { success: false, message: 'Room type not found' };

    const available = room.totalBeds - room.occupiedBeds;
    if (available <= 0) {
      return { success: false, message: 'No beds currently available in this ward/room category' };
    }

    const bookingId = `BK-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const bedNum = `Bed ${room.category.substring(0, 2).toUpperCase()}-${room.occupiedBeds + 1}`;

    const newBooking = {
      id: bookingId,
      patientId: bookingData.patientId,
      patientName: bookingData.patientName,
      roomTypeId: room.id,
      roomTypeName: room.type,
      bedNumber: bedNum,
      admitDate: bookingData.admitDate || new Date().toISOString().split('T')[0],
      durationDays: parseInt(bookingData.durationDays, 10) || 2,
      status: 'Admitted / Active',
      department: bookingData.department || 'General Medicine',
      doctor: bookingData.doctor || 'Attending Physician',
      notes: bookingData.notes || 'Routine admission requested',
      createdAt: new Date().toISOString()
    };

    // Increment occupied bed
    room.occupiedBeds += 1;
    state.roomBookings.unshift(newBooking);
    this.saveState(state);

    return { success: true, booking: newBooking, room };
  }

  // --- Blood Bank API ---
  getBloodStock() {
    return this.getState().bloodBank || [];
  }

  getBloodRequests() {
    return this.getState().bloodRequests || [];
  }

  requestBlood(reqData) {
    const state = this.getState();
    const bloodItem = state.bloodBank.find(b => b.group === reqData.bloodGroup);
    if (!bloodItem) return { success: false, message: 'Blood group not recognized' };

    const reqId = `BLD-REQ-${Math.floor(100 + Math.random() * 900)}`;
    const newReq = {
      id: reqId,
      patientName: reqData.patientName,
      patientId: reqData.patientId || 'Walk-in / Emergency',
      bloodGroup: reqData.bloodGroup,
      unitsRequested: parseInt(reqData.unitsRequested, 10) || 1,
      urgency: reqData.urgency || 'Immediate / Emergency',
      doctor: reqData.doctor || 'Emergency Physician',
      status: bloodItem.units >= reqData.unitsRequested ? 'Reserved / Ready for Dispatch' : 'Waitlisted / Donor Alert Sent',
      createdAt: new Date().toISOString()
    };

    // If stock available, deduct
    if (bloodItem.units >= reqData.unitsRequested) {
      bloodItem.units -= reqData.unitsRequested;
      if (bloodItem.units < 5) bloodItem.status = 'Critical Low';
      else if (bloodItem.units < 10) bloodItem.status = 'Low Stock';
    }

    state.bloodRequests.unshift(newReq);
    this.saveState(state);
    return { success: true, request: newReq, stockRemaining: bloodItem.units };
  }

  // --- Appointments API ---
  getAppointments(filter = {}) {
    let list = this.getState().appointments || [];
    if (filter.patientId) list = list.filter(a => a.patientId === filter.patientId);
    if (filter.doctorId) list = list.filter(a => a.doctorId === filter.doctorId);
    if (filter.departmentId) list = list.filter(a => a.departmentId === filter.departmentId);
    if (filter.hospitalId) list = list.filter(a => a.hospitalId === filter.hospitalId);
    if (filter.status) list = list.filter(a => a.status.toLowerCase() === filter.status.toLowerCase());
    if (filter.date) list = list.filter(a => a.date === filter.date);
    return list;
  }

  getAppointmentById(id) {
    return (this.getState().appointments || []).find(a => a.id === id) || null;
  }

  createAppointment(apptData) {
    const state = this.getState();

    const existingForDay = state.appointments.filter(
      a => a.doctorId === apptData.doctorId && a.date === apptData.date && a.status !== 'Cancelled'
    );
    const tokenNo = existingForDay.length + 1;

    const opNum = Math.floor(1000 + Math.random() * 9000);
    const opId = `OP-${new Date().getFullYear()}-${opNum}`;
    const secureToken = `SEC-TOKEN-${apptData.patientId.replace('GH-', '')}-${opNum}`;

    const newAppt = {
      id: opId,
      tokenNo: tokenNo,
      patientId: apptData.patientId,
      hospitalId: apptData.hospitalId || 'HOSP-01',
      departmentId: apptData.departmentId,
      doctorId: apptData.doctorId,
      date: apptData.date,
      timeSlot: apptData.timeSlot,
      status: 'Confirmed',
      reason: apptData.reason || 'General Outpatient Consultation',
      createdAt: new Date().toISOString(),
      qrToken: secureToken
    };

    const qrRecord = {
      qrId: `QR-${apptData.patientId.replace('GH-', '')}-${opNum}`,
      patientId: apptData.patientId,
      appointmentId: opId,
      hospitalId: apptData.hospitalId || 'HOSP-01',
      secureToken: secureToken,
      createdAt: new Date().toISOString(),
      status: 'Active'
    };

    state.appointments.unshift(newAppt);
    state.qrRecords.unshift(qrRecord);
    this.saveState(state);

    return { success: true, appointment: newAppt, qrRecord };
  }

  updateAppointmentStatus(id, newStatus, extra = {}) {
    const state = this.getState();
    const idx = state.appointments.findIndex(a => a.id === id);
    if (idx === -1) return { success: false, message: 'Appointment not found' };

    state.appointments[idx].status = newStatus;
    if (newStatus === 'Waiting' && !state.appointments[idx].checkedInAt) {
      state.appointments[idx].checkedInAt = new Date().toISOString();
    }
    if (newStatus === 'Completed') {
      state.appointments[idx].completedAt = new Date().toISOString();
    }
    if (extra) {
      state.appointments[idx] = { ...state.appointments[idx], ...extra };
    }

    this.saveState(state);
    return { success: true, appointment: state.appointments[idx] };
  }

  // --- Medical Records API ---
  getMedicalRecords(patientId) {
    const recs = this.getState().medicalRecords || [];
    return recs
      .filter(r => r.patientId === patientId)
      .sort((a, b) => new Date(b.visitDate) - new Date(a.visitDate));
  }

  addMedicalRecord(recordData) {
    const state = this.getState();
    const recNum = Math.floor(1000 + Math.random() * 9000);
    const recId = `REC-${new Date().getFullYear()}-${recNum}`;

    const newRecord = {
      id: recId,
      patientId: recordData.patientId,
      hospitalId: recordData.hospitalId || 'HOSP-01',
      departmentId: recordData.departmentId,
      doctorId: recordData.doctorId,
      doctorName: recordData.doctorName || 'Attending Physician',
      departmentName: recordData.departmentName || 'Outpatient Clinic',
      visitDate: recordData.visitDate || new Date().toISOString().split('T')[0],
      symptoms: recordData.symptoms || [],
      vitals: recordData.vitals || {
        bloodPressure: '120/80 mmHg',
        pulseRate: '72 bpm',
        temperature: '98.6 °F',
        spo2: '99%',
        weight: '68 kg'
      },
      diagnosis: recordData.diagnosis || 'Clinical Evaluation Completed',
      prescriptions: recordData.prescriptions || [],
      labReports: recordData.labReports || [],
      notes: recordData.notes || 'Routine consultation completed.',
      nextFollowUp: recordData.nextFollowUp || 'SOS'
    };

    state.medicalRecords.unshift(newRecord);

    if (recordData.appointmentId) {
      const apptIdx = state.appointments.findIndex(a => a.id === recordData.appointmentId);
      if (apptIdx !== -1) {
        state.appointments[apptIdx].status = 'Completed';
        state.appointments[apptIdx].completedAt = new Date().toISOString();
      }
    }

    this.saveState(state);
    return { success: true, record: newRecord };
  }

  // --- QR & Token Verification API ---
  verifyQRToken(tokenString) {
    const state = this.getState();
    let token = String(tokenString).trim();

    let patientId = null;
    let appointmentId = null;

    if (token.startsWith('{') && token.endsWith('}')) {
      try {
        const parsed = JSON.parse(token);
        token = parsed.tok || parsed.secureToken || token;
        patientId = parsed.pid || parsed.patientId;
        appointmentId = parsed.op || parsed.appointmentId;
      } catch (e) { }
    }

    const qrMatch = state.qrRecords.find(q => q.secureToken === token || q.qrId === token);
    if (qrMatch) {
      patientId = qrMatch.patientId;
      appointmentId = qrMatch.appointmentId;
    } else if (!patientId) {
      const pat = state.patients.find(p => p.id.toUpperCase() === token.toUpperCase());
      if (pat) patientId = pat.id;

      const appt = state.appointments.find(a => a.id.toUpperCase() === token.toUpperCase());
      if (appt) {
        patientId = appt.patientId;
        appointmentId = appt.id;
      }
    }

    if (!patientId) {
      return { success: false, message: 'Invalid or expired QR pass. Patient record not found.' };
    }

    const patient = this.getPatientById(patientId);
    if (!patient) {
      return { success: false, message: 'Patient profile record missing.' };
    }

    const records = this.getMedicalRecords(patientId);
    const appointments = this.getAppointments({ patientId });
    const currentAppointment = appointmentId ? this.getAppointmentById(appointmentId) : appointments[0] || null;

    return {
      success: true,
      patient,
      currentAppointment,
      appointments,
      records,
      isNewPatient: records.length === 0,
      token
    };
  }

  searchRegistry(query) {
    if (!query) return [];
    const q = String(query).trim().toLowerCase();
    const state = this.getState();

    const matchedPatients = state.patients.filter(p =>
      p.id.toLowerCase().includes(q) ||
      p.fullName.toLowerCase().includes(q) ||
      p.mobile.includes(q)
    );

    const matchedAppts = state.appointments.filter(a =>
      a.id.toLowerCase().includes(q) ||
      (a.tokenNo && String(a.tokenNo) === q)
    );

    const results = [];
    const seenPids = new Set();

    matchedPatients.forEach(p => {
      seenPids.add(p.id);
      const latestAppt = state.appointments.find(a => a.patientId === p.id);
      results.push({ patient: p, appointment: latestAppt || null, matchType: 'Patient Record' });
    });

    matchedAppts.forEach(a => {
      if (!seenPids.has(a.patientId)) {
        const p = state.patients.find(pat => pat.id === a.patientId);
        if (p) {
          seenPids.add(p.id);
          results.push({ patient: p, appointment: a, matchType: 'OP Ticket Match' });
        }
      }
    });

    return results;
  }

  getAdminStats() {
    const state = this.getState();
    const today = new Date().toISOString().split('T')[0];

    const todayAppts = state.appointments.filter(a => a.date === today && a.status !== 'Cancelled');
    const waitingAppts = todayAppts.filter(a => a.status === 'Waiting');
    const completedAppts = todayAppts.filter(a => a.status === 'Completed');
    const onlineDoctors = state.doctors.filter(d => d.onlineStatus === 'online').length;

    const deptCounts = {};
    state.departments.forEach(d => { deptCounts[d.name] = 0; });
    todayAppts.forEach(a => {
      const dep = state.departments.find(d => d.id === a.departmentId);
      if (dep) {
        deptCounts[dep.name] = (deptCounts[dep.name] || 0) + 1;
      }
    });

    return {
      totalPatients: state.patients.length,
      todayTotalOP: todayAppts.length,
      todayWaiting: waitingAppts.length,
      todayCompleted: completedAppts.length,
      onlineDoctorsCount: onlineDoctors,
      totalDoctorsCount: state.doctors.length,
      avgWaitTimeMinutes: 20,
      departmentBreakdown: deptCounts
    };
  }

  generateDefaultAvatar(name) {
    const initials = (name || 'P')
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();

    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160"><rect width="160" height="160" fill="%230284c7" rx="80"/><text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif" font-size="56" font-weight="bold" fill="%23ffffff">${initials}</text></svg>`;
  }
}

window.dbStore = new DatabaseStore();
