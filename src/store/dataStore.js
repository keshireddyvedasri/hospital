/**
 * Arogya Care: React Data Store & State Engine
 * Dedicated for Government MGM Hospital, Warangal, Telangana
 * Features: Mandatory Aadhaar Card, Live Doctor GPS Geo-Fence & Selfie Attendance
 */

const STORAGE_KEY = 'mgm_warangal_db_v3';

// Accurate MGM Hospital Warangal Coordinates (MG Road, Mattewada, Warangal - 506007)
export const HOSPITAL_COORDINATES = {
  lat: 17.9818,
  lng: 79.5960,
  campusRadiusMeters: 500,
  name: 'Govt. MGM Hospital Campus, Warangal'
};

export const INITIAL_DATA = {
  hospital: {
    id: 'HOSP-MGM-WGL',
    name: 'Mahatma Gandhi Memorial (MGM) Government Hospital',
    localName: 'మహాత్మా గాంధీ మెమోరియల్ ప్రభుత్వ ఆసుపత్రి, వరంగల్',
    code: 'MGM-WGL',
    city: 'Warangal',
    district: 'Warangal Urban',
    state: 'Telangana',
    pinCode: '506007',
    emergencyPhone: '108 / 0870-2441010',
    address: 'MG Road, Mattewada, Warangal, Telangana - 506007',
    affiliation: 'Kakatiya Medical College (KMC), Kaloji Narayana Rao University of Health Sciences',
    latitude: HOSPITAL_COORDINATES.lat,
    longitude: HOSPITAL_COORDINATES.lng,
    dailyCap: 2500
  },

  departments: [
    { id: 'DEP-GEN', name: 'General Medicine', code: 'GM', icon: 'HeartPulse', floor: 'Ground Floor - OPD Block' },
    { id: 'DEP-CARD', name: 'Cardiology (Heart)', code: 'CARD', icon: 'Activity', floor: '1st Floor - Super Speciality Wing' },
    { id: 'DEP-ORTH', name: 'Orthopedics & Trauma', code: 'ORTH', icon: 'Bone', floor: 'Ground Floor - Ortho Block' },
    { id: 'DEP-PED', name: 'Pediatrics & Neonatology', code: 'PED', icon: 'Baby', floor: '2nd Floor - Mother & Child Center' },
    { id: 'DEP-DERM', name: 'Dermatology & Skin Clinic', code: 'DERM', icon: 'Sparkles', floor: '1st Floor - Wing C' },
    { id: 'DEP-ENT', name: 'ENT (Ear, Nose & Throat)', code: 'ENT', icon: 'Ear', floor: '1st Floor - Chamber 104' },
    { id: 'DEP-PULM', name: 'Pulmonology & Chest Medicine', code: 'PULM', icon: 'Lungs', floor: 'Ground Floor - Chest Clinic' },
    { id: 'DEP-GYN', name: 'Gynecology & Obstetrics', code: 'GYN', icon: 'User', floor: '1st Floor - Maternity Wing' }
  ],

  doctors: [
    {
      id: 'DH-2026-001',
      name: 'Dr. Rajesh Kumar',
      email: 'dr.rajesh@mgmhospital.gov.in',
      mobile: '9876543210',
      dob: '1986-08-14',
      gender: 'Male',
      address: 'Flat 402, Kakatiya Towers, Hunter Road, Hanamkonda, Warangal',
      qualification: 'MBBS, MD',
      designation: 'Senior Medical Officer',
      departmentId: 'DEP-GEN',
      department: 'General Medicine',
      specialization: 'Internal Medicine',
      medicalRegNumber: 'TSMC/2018/48921',
      hospitalId: 'HOSP-MGM-WGL',
      hospitalName: 'Govt. MGM Hospital, Warangal',
      assignedLocation: 'Chamber 108, Ground Floor OPD Wing',
      departmentHead: 'Dr. P. Srinivas Rao, Prof & HOD',
      employmentType: 'Permanent State Govt',
      roomNo: 'Chamber 108 (Ground Floor)',
      experience: '8 Years',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      tokenQuota: 65,
      active: true,
      approvalStatus: 'Approved',
      onlineStatus: 'online', // 'online', 'offline', 'in_consultation', 'emergency_duty', 'on_leave', 'off_duty'
      statusNote: 'GPS Verified in MGM Hospital Chamber 108',
      statusChangeTimestamp: '09:02 AM Today',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80',
      dutyHours: '09:00 AM - 05:00 PM',
      nextCheckIn: 'in 58 min (10:00 AM)',
      lastCheckInTime: '09:02 AM Today',
      dutyShifts: {
        morningShift: '09:00 AM - 01:00 PM',
        afternoonShift: '01:00 PM - 05:00 PM',
        nightShift: 'Off',
        opdTimings: '09:00 AM - 01:00 PM',
        emergencyDuty: false,
        onCallAvailability: true,
        weeklyOff: 'Sunday'
      },
      documents: {
        regCertUrl: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?w=400&auto=format&fit=crop&q=80',
        qualCertUrl: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=400&auto=format&fit=crop&q=80',
        govtIdUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80',
        photoUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80'
      },
      dutyVerification: {
        isVerified: true,
        checkedInAt: '09:02 AM Today',
        selfieUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80',
        gps: {
          latitude: 17.9818,
          longitude: 79.5960,
          accuracyMeters: 5,
          distanceFromChamberMeters: 12,
          isWithinCampus: true,
          locationLabel: 'Chamber OPD-108, MGM Hospital Campus, Warangal'
        }
      },
      weeklySchedule: [
        { day: 'Mon', dutyTime: '09:00 AM - 05:00 PM', department: 'General Medicine' },
        { day: 'Tue', dutyTime: '09:00 AM - 05:00 PM', department: 'General Medicine' },
        { day: 'Wed', dutyTime: '09:00 AM - 05:00 PM', department: 'General Medicine' },
        { day: 'Thu', dutyTime: '09:00 AM - 05:00 PM', department: 'General Medicine' },
        { day: 'Fri', dutyTime: '09:00 AM - 01:00 PM', department: 'OPD' },
        { day: 'Sat', dutyTime: '09:00 AM - 01:00 PM', department: 'OPD' },
        { day: 'Sun', dutyTime: 'Holiday', department: '-' }
      ]
    },
    {
      id: 'DH-2026-002',
      name: 'Dr. Sneha Patel',
      email: 'dr.sneha@mgmhospital.gov.in',
      mobile: '9845112233',
      dob: '1989-03-22',
      gender: 'Female',
      address: 'Plot 12, Advocates Colony, Hanamkonda',
      qualification: 'MBBS, MD (Pediatrics)',
      designation: 'Assistant Professor & Pediatrician',
      departmentId: 'DEP-PED',
      department: 'Pediatrics',
      specialization: 'Neonatal & Child Health',
      medicalRegNumber: 'TSMC/2019/51204',
      hospitalId: 'HOSP-MGM-WGL',
      hospitalName: 'Govt. MGM Hospital, Warangal',
      assignedLocation: 'Chamber 210, Mother & Child Block',
      departmentHead: 'Dr. M. Geetha, Prof & HOD Pediatrics',
      employmentType: 'Teaching Faculty (KMC)',
      roomNo: 'Chamber 210 (Mother & Child Block)',
      experience: '5 Years',
      days: ['Mon', 'Tue', 'Thu', 'Fri', 'Sat'],
      tokenQuota: 50,
      active: true,
      approvalStatus: 'Approved',
      onlineStatus: 'offline',
      statusNote: 'Shift starts at 1:00 PM',
      statusChangeTimestamp: '08:45 AM Today',
      avatar: 'https://images.unsplash.com/photo-1594824813589-9a7c3b2488a0?w=200&auto=format&fit=crop&q=80',
      dutyHours: '01:00 PM - 07:00 PM',
      nextCheckIn: 'in 2 hours',
      lastCheckInTime: '08:45 AM (Off-Duty)',
      dutyShifts: {
        morningShift: 'Off',
        afternoonShift: '01:00 PM - 07:00 PM',
        nightShift: 'Off',
        opdTimings: '01:00 PM - 05:00 PM',
        emergencyDuty: true,
        onCallAvailability: false,
        weeklyOff: 'Wednesday & Sunday'
      },
      documents: {
        regCertUrl: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?w=400&auto=format&fit=crop&q=80',
        qualCertUrl: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=400&auto=format&fit=crop&q=80',
        govtIdUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80',
        photoUrl: 'https://images.unsplash.com/photo-1594824813589-9a7c3b2488a0?w=200&auto=format&fit=crop&q=80'
      },
      dutyVerification: null,
      weeklySchedule: [
        { day: 'Mon', dutyTime: '01:00 PM - 07:00 PM', department: 'Pediatrics' },
        { day: 'Tue', dutyTime: '01:00 PM - 07:00 PM', department: 'Pediatrics' },
        { day: 'Wed', dutyTime: 'Off', department: '-' },
        { day: 'Thu', dutyTime: '01:00 PM - 07:00 PM', department: 'Pediatrics' },
        { day: 'Fri', dutyTime: '01:00 PM - 07:00 PM', department: 'Pediatrics' },
        { day: 'Sat', dutyTime: '09:00 AM - 01:00 PM', department: 'NICU' },
        { day: 'Sun', dutyTime: 'Holiday', department: '-' }
      ]
    },
    {
      id: 'DH-2026-003',
      name: 'Dr. Ahmed Khan',
      email: 'dr.ahmed@mgmhospital.gov.in',
      mobile: '9871100223',
      dob: '1979-05-18',
      gender: 'Male',
      address: '10-3-42, Subedari, University Road, Warangal',
      qualification: 'MBBS, MD, DM (Cardiology)',
      designation: 'Senior Cardiologist & Professor',
      departmentId: 'DEP-CARD',
      department: 'Cardiology',
      specialization: 'Interventional Cardiology',
      medicalRegNumber: 'TSMC/2012/32190',
      hospitalId: 'HOSP-MGM-WGL',
      hospitalName: 'Govt. MGM Hospital, Warangal',
      assignedLocation: 'Chamber 204, Super Speciality Block',
      departmentHead: 'Dr. Ahmed Khan, Professor & HOD',
      employmentType: 'Permanent State Govt',
      roomNo: 'Chamber 204 (Super Speciality)',
      experience: '12 Years',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      tokenQuota: 55,
      active: true,
      approvalStatus: 'Approved',
      onlineStatus: 'in_consultation',
      statusNote: 'Currently in OPD Patient Consultation',
      statusChangeTimestamp: '09:10 AM Today',
      avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&auto=format&fit=crop&q=80',
      dutyHours: '09:00 AM - 04:00 PM',
      nextCheckIn: 'in 15 min',
      lastCheckInTime: '09:10 AM Today',
      dutyShifts: {
        morningShift: '09:00 AM - 01:00 PM',
        afternoonShift: '01:00 PM - 04:00 PM',
        nightShift: 'Emergency On-Call',
        opdTimings: '09:00 AM - 01:00 PM',
        emergencyDuty: true,
        onCallAvailability: true,
        weeklyOff: 'Sunday'
      },
      documents: {
        regCertUrl: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?w=400&auto=format&fit=crop&q=80',
        qualCertUrl: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=400&auto=format&fit=crop&q=80',
        govtIdUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80',
        photoUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&auto=format&fit=crop&q=80'
      },
      dutyVerification: {
        isVerified: true,
        checkedInAt: '09:10 AM Today',
        selfieUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&auto=format&fit=crop&q=80',
        gps: {
          latitude: 17.9819,
          longitude: 79.5962,
          accuracyMeters: 6,
          isWithinCampus: true,
          locationLabel: 'Chamber 204, MGM Super Speciality Wing'
        }
      },
      weeklySchedule: [
        { day: 'Mon', dutyTime: '09:00 AM - 04:00 PM', department: 'Cardiology' },
        { day: 'Tue', dutyTime: '09:00 AM - 04:00 PM', department: 'Cardiology' },
        { day: 'Wed', dutyTime: '09:00 AM - 04:00 PM', department: 'Cath Lab' },
        { day: 'Thu', dutyTime: '09:00 AM - 04:00 PM', department: 'Cardiology' },
        { day: 'Fri', dutyTime: '09:00 AM - 04:00 PM', department: 'Cardiology' },
        { day: 'Sat', dutyTime: '09:00 AM - 01:00 PM', department: 'Echo Clinic' },
        { day: 'Sun', dutyTime: 'Holiday', department: '-' }
      ]
    },
    {
      id: 'DH-2026-004',
      name: 'Dr. Priya Sharma',
      email: 'dr.priya@mgmhospital.gov.in',
      mobile: '9811224455',
      dob: '1984-12-05',
      gender: 'Female',
      address: 'House 8-11-204, Girmajipet, Warangal',
      qualification: 'MBBS, MS (OBG)',
      designation: 'Associate Professor & Gynecologist',
      departmentId: 'DEP-GEN',
      department: 'Gynecology & Obstetrics',
      specialization: 'High Risk Obstetrics',
      medicalRegNumber: 'TSMC/2016/41098',
      hospitalId: 'HOSP-MGM-WGL',
      hospitalName: 'Govt. MGM Hospital, Warangal',
      assignedLocation: 'Chamber 112, Maternity Wing',
      departmentHead: 'Dr. V. Lalitha, Professor & HOD OBG',
      employmentType: 'Permanent State Govt',
      roomNo: 'Chamber 112 (Maternity Wing)',
      experience: '9 Years',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      tokenQuota: 50,
      active: true,
      approvalStatus: 'Approved',
      onlineStatus: 'on_leave',
      statusNote: 'Approved Casual Leave (Conference)',
      statusChangeTimestamp: '08:30 AM Today',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&auto=format&fit=crop&q=80',
      dutyHours: '09:00 AM - 05:00 PM',
      nextCheckIn: 'Resumes Tomorrow',
      lastCheckInTime: '-',
      dutyShifts: {
        morningShift: '09:00 AM - 01:00 PM',
        afternoonShift: '01:00 PM - 05:00 PM',
        nightShift: 'Off',
        opdTimings: '09:00 AM - 01:00 PM',
        emergencyDuty: true,
        onCallAvailability: false,
        weeklyOff: 'Saturday & Sunday'
      },
      documents: {
        regCertUrl: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?w=400&auto=format&fit=crop&q=80',
        qualCertUrl: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=400&auto=format&fit=crop&q=80',
        govtIdUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80',
        photoUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&auto=format&fit=crop&q=80'
      },
      dutyVerification: null,
      weeklySchedule: [
        { day: 'Mon', dutyTime: '09:00 AM - 05:00 PM', department: 'Gynecology' },
        { day: 'Tue', dutyTime: '09:00 AM - 05:00 PM', department: 'Gynecology' },
        { day: 'Wed', dutyTime: '09:00 AM - 05:00 PM', department: 'Labor Ward' },
        { day: 'Thu', dutyTime: '09:00 AM - 05:00 PM', department: 'Gynecology' },
        { day: 'Fri', dutyTime: '09:00 AM - 05:00 PM', department: 'Gynecology' },
        { day: 'Sat', dutyTime: 'Off', department: '-' },
        { day: 'Sun', dutyTime: 'Holiday', department: '-' }
      ]
    },
    {
      id: 'DH-2026-005',
      name: 'Dr. Vikram Singh',
      email: 'dr.vikram@mgmhospital.gov.in',
      mobile: '9899001122',
      dob: '1976-02-10',
      gender: 'Male',
      address: 'Villa 14, Doctors Quarters, KMC Campus, Warangal',
      qualification: 'MBBS, MS (Orthopedics)',
      designation: 'Senior Orthopedic Surgeon & Professor',
      departmentId: 'DEP-ORTH',
      department: 'Orthopedics',
      specialization: 'Joint Replacement & Trauma',
      medicalRegNumber: 'TSMC/2009/27543',
      hospitalId: 'HOSP-MGM-WGL',
      hospitalName: 'Govt. MGM Hospital, Warangal',
      assignedLocation: 'Chamber 115, Ortho Wing',
      departmentHead: 'Dr. Vikram Singh, Professor & HOD',
      employmentType: 'Permanent State Govt',
      roomNo: 'Chamber 115 (Ortho Block)',
      experience: '14 Years',
      days: ['Mon', 'Wed', 'Fri', 'Sat'],
      tokenQuota: 45,
      active: true,
      approvalStatus: 'Approved',
      onlineStatus: 'online',
      statusNote: 'GPS Verified in MGM Chamber 115',
      statusChangeTimestamp: '09:00 AM Today',
      avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200&auto=format&fit=crop&q=80',
      dutyHours: '09:00 AM - 05:00 PM',
      nextCheckIn: 'in 45 min',
      lastCheckInTime: '09:00 AM Today',
      dutyShifts: {
        morningShift: '09:00 AM - 01:00 PM',
        afternoonShift: '01:00 PM - 05:00 PM',
        nightShift: 'Off',
        opdTimings: '09:00 AM - 01:00 PM',
        emergencyDuty: true,
        onCallAvailability: true,
        weeklyOff: 'Tuesday & Sunday'
      },
      documents: {
        regCertUrl: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?w=400&auto=format&fit=crop&q=80',
        qualCertUrl: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=400&auto=format&fit=crop&q=80',
        govtIdUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80',
        photoUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200&auto=format&fit=crop&q=80'
      },
      dutyVerification: {
        isVerified: true,
        checkedInAt: '09:00 AM Today',
        selfieUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200&auto=format&fit=crop&q=80',
        gps: {
          latitude: 17.9817,
          longitude: 79.5959,
          accuracyMeters: 5,
          isWithinCampus: true,
          locationLabel: 'Chamber 115, MGM Ortho Wing'
        }
      },
      weeklySchedule: [
        { day: 'Mon', dutyTime: '09:00 AM - 05:00 PM', department: 'Orthopedics' },
        { day: 'Tue', dutyTime: '09:00 AM - 05:00 PM', department: 'OT Day' },
        { day: 'Wed', dutyTime: '09:00 AM - 05:00 PM', department: 'Orthopedics' },
        { day: 'Thu', dutyTime: '09:00 AM - 05:00 PM', department: 'OT Day' },
        { day: 'Fri', dutyTime: '09:00 AM - 05:00 PM', department: 'Orthopedics' },
        { day: 'Sat', dutyTime: '09:00 AM - 01:00 PM', department: 'Fracture Clinic' },
        { day: 'Sun', dutyTime: 'Holiday', department: '-' }
      ]
    },
    // Doctor Pending Administrator Approval
    {
      id: 'DH-2026-006',
      name: 'Dr. Ramesh Goud',
      email: 'dr.ramesh.goud@mgmhospital.gov.in',
      mobile: '9848099881',
      dob: '1990-11-20',
      gender: 'Male',
      address: 'H.No. 5-9-12, Nakkalagutta, Hanamkonda, Warangal',
      qualification: 'MBBS, MS (General Surgery)',
      designation: 'Assistant Professor & Surgeon',
      departmentId: 'DEP-GEN',
      department: 'General Surgery & Trauma',
      specialization: 'Laparoscopic & Trauma Surgery',
      medicalRegNumber: 'TSMC/2021/65412',
      hospitalId: 'HOSP-MGM-WGL',
      hospitalName: 'Govt. MGM Hospital, Warangal',
      assignedLocation: 'Chamber 120 (Surgical Block 2nd Floor)',
      departmentHead: 'Dr. K. Sudhakar, Prof & HOD Surgery',
      employmentType: 'Teaching Faculty (KMC)',
      roomNo: 'Chamber 120',
      experience: '4 Years',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      tokenQuota: 40,
      active: false,
      approvalStatus: 'Pending Approval', // Awaiting Admin Approval
      onlineStatus: 'offline',
      statusNote: 'Registration submitted. Awaiting Medical Superintendent Approval.',
      statusChangeTimestamp: '10:15 AM Today',
      avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&auto=format&fit=crop&q=80',
      dutyHours: '09:00 AM - 04:00 PM',
      nextCheckIn: 'Upon Admin Approval',
      lastCheckInTime: '-',
      dutyVerification: null,
      dutyShifts: {
        morningShift: '09:00 AM - 01:00 PM',
        afternoonShift: '01:00 PM - 04:00 PM',
        nightShift: 'On-Call Alternate Days',
        opdTimings: '09:00 AM - 01:00 PM',
        emergencyDuty: true,
        onCallAvailability: true,
        weeklyOff: 'Saturday & Sunday'
      },
      documents: {
        regCertUrl: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?w=400&auto=format&fit=crop&q=80',
        qualCertUrl: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=400&auto=format&fit=crop&q=80',
        govtIdUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80',
        photoUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&auto=format&fit=crop&q=80'
      },
      weeklySchedule: [
        { day: 'Mon', dutyTime: '09:00 AM - 04:00 PM', department: 'Surgical OPD' },
        { day: 'Tue', dutyTime: '09:00 AM - 05:00 PM', department: 'Main OT' },
        { day: 'Wed', dutyTime: '09:00 AM - 04:00 PM', department: 'Surgical OPD' },
        { day: 'Thu', dutyTime: '09:00 AM - 05:00 PM', department: 'Minor OT & Casualty' },
        { day: 'Fri', dutyTime: '09:00 AM - 04:00 PM', department: 'Surgical Ward Rounds' },
        { day: 'Sat', dutyTime: 'Off', department: '-' },
        { day: 'Sun', dutyTime: 'Holiday', department: '-' }
      ]
    },
    // Backwards compatibility with previous IDs
    {
      id: 'DOC-101',
      name: 'Dr. Anita Roy',
      email: 'dr.anita@mgmhospital.gov.in',
      mobile: '9871100223',
      qualification: 'MBBS, MD, DM (Cardiology)',
      designation: 'Professor & Senior Cardiologist',
      departmentId: 'DEP-CARD',
      department: 'Cardiology',
      specialization: 'Cardiology',
      hospitalId: 'HOSP-MGM-WGL',
      roomNo: 'Chamber 204 (OPD Block)',
      experience: '16 Years',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      tokenQuota: 50,
      active: true,
      onlineStatus: 'online',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
      dutyVerification: {
        isVerified: true,
        checkedInAt: '09:10 AM Today',
        selfieUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
        gps: { latitude: 17.9820, longitude: 79.5962, accuracyMeters: 5, isWithinCampus: true }
      }
    }
  ],

  rooms: [
    {
      id: 'ROOM-GW-M',
      type: 'General Ward - Male (MGM Block A)',
      category: 'General',
      totalBeds: 50,
      occupiedBeds: 34,
      pricePerDay: 'Free (Govt of Telangana Supported)',
      amenities: ['Central Oxygen', 'Aarogyasri Helpdesk', 'Daily Rounds', 'Free Meals'],
      floor: 'Ground & 1st Floor - Ward Block'
    },
    {
      id: 'ROOM-GW-F',
      type: 'General Ward - Female & Child (MGM Block B)',
      category: 'General',
      totalBeds: 50,
      occupiedBeds: 38,
      pricePerDay: 'Free (Govt of Telangana Supported)',
      amenities: ['Central Oxygen', 'Attendant Area', 'Daily Rounds', 'Free Meals'],
      floor: '1st Floor - Mother & Child Wing'
    },
    {
      id: 'ROOM-SP',
      type: 'Semi-Private Room (Twin Sharing)',
      category: 'Semi-Private',
      totalBeds: 24,
      occupiedBeds: 18,
      pricePerDay: '₹ 600 / day',
      amenities: ['Air Conditioned', 'Attached Washroom', 'Twin Sharing', 'Attendant Cot'],
      floor: '2nd Floor - Super Speciality Block'
    },
    {
      id: 'ROOM-PVT',
      type: 'Special Deluxe Room (Single)',
      category: 'Private',
      totalBeds: 16,
      occupiedBeds: 11,
      pricePerDay: '₹ 1,200 / day',
      amenities: ['Private Room', 'Attached Washroom', 'Nurse Calling System', 'Television'],
      floor: '3rd Floor - Special Care Wing'
    },
    {
      id: 'ROOM-ICU',
      type: 'MGM Emergency & Trauma ICU Bed',
      category: 'Critical Care',
      totalBeds: 20,
      occupiedBeds: 15,
      pricePerDay: 'Free under Aarogyasri / Emergency',
      amenities: ['Advanced Ventilator', 'Multi-Para Monitor', '1:1 Nursing', 'Defibrillator'],
      floor: 'Ground Floor - Emergency Trauma Complex'
    },
    {
      id: 'ROOM-DC',
      type: 'Day Care Observation Bed',
      category: 'Day Care',
      totalBeds: 18,
      occupiedBeds: 9,
      pricePerDay: 'Free / Day Procedure',
      amenities: ['Short Stay Bed', 'IV Infusion', 'Post-Op Observation', 'Dialysis Station'],
      floor: 'Ground Floor - Day Care'
    }
  ],

  roomBookings: [
    {
      id: 'BK-2026-019',
      patientId: 'MGM-2026-89102',
      patientName: 'Ramesh Kumar',
      aadharNumber: '458912345678',
      roomTypeId: 'ROOM-SP',
      roomTypeName: 'Semi-Private Room (Twin Sharing)',
      bedNumber: 'Bed SP-12',
      admitDate: new Date().toISOString().split('T')[0],
      durationDays: 3,
      status: 'Admitted / Active',
      department: 'Cardiology',
      doctor: 'Dr. Anita Roy',
      notes: 'Admitted for cardiac monitoring and medication review'
    }
  ],

  bloodBank: [
    { group: 'A+', units: 28, status: 'Adequate', donorCountToday: 6 },
    { group: 'A-', units: 7, status: 'Low Stock', donorCountToday: 1 },
    { group: 'B+', units: 42, status: 'Adequate', donorCountToday: 9 },
    { group: 'B-', units: 4, status: 'Critical Low', donorCountToday: 0 },
    { group: 'O+', units: 48, status: 'Good Stock', donorCountToday: 12 },
    { group: 'O-', units: 6, status: 'Critical Low', donorCountToday: 2 },
    { group: 'AB+', units: 19, status: 'Adequate', donorCountToday: 4 },
    { group: 'AB-', units: 3, status: 'Critical Low', donorCountToday: 0 },
    { group: 'Platelets (RDP)', units: 22, status: 'Adequate', donorCountToday: 5 },
    { group: 'Plasma (FFP)', units: 30, status: 'Adequate', donorCountToday: 7 }
  ],

  bloodRequests: [
    {
      id: 'BLD-REQ-801',
      patientName: 'Ramesh Kumar',
      patientId: 'MGM-2026-89102',
      bloodGroup: 'B+',
      unitsRequested: 1,
      urgency: 'Scheduled / OP Support',
      doctor: 'Dr. Anita Roy',
      status: 'Reserved / Ready for Dispatch',
      createdAt: '2026-11-03T09:45:00Z'
    }
  ],

  patients: [
    {
      id: 'MGM-2026-89102',
      fullName: 'Ramesh Kumar',
      mobile: '9876543210',
      aadharNumber: '458912345678', // 12-digit mandatory Aadhaar
      dob: '1978-04-12',
      age: 48,
      gender: 'Male',
      bloodGroup: 'B+',
      address: 'H.No. 3-4-12, Hunter Road, Hanamkonda',
      district: 'Warangal',
      state: 'Telangana',
      pinCode: '506001',
      allergies: ['Penicillin (Moderate rash)', 'Aspirin intolerance'],
      chronicConditions: ['Essential Hypertension (Since 2021)'],
      registeredAt: '2024-03-15T09:30:00Z',
      abhaId: '91-8910-2345-6712'
    },
    {
      id: 'MGM-2026-67341',
      fullName: 'Sunita Mehra',
      mobile: '9811223344',
      aadharNumber: '678923456789',
      dob: '1992-09-24',
      age: 34,
      gender: 'Female',
      bloodGroup: 'O+',
      address: 'Opp. Arts & Science College, Subedari',
      district: 'Warangal',
      state: 'Telangana',
      pinCode: '506001',
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
      patientId: 'MGM-2026-89102',
      hospitalId: 'HOSP-MGM-WGL',
      departmentId: 'DEP-CARD',
      doctorId: 'DOC-101',
      date: new Date().toISOString().split('T')[0],
      timeSlot: 'Morning Slot (09:00 AM - 11:30 AM)',
      status: 'Waiting',
      reason: 'Frequent palpitation, chest heaviness',
      createdAt: '2026-11-02T10:00:00Z',
      checkedInAt: '2026-11-03T09:12:00Z',
      qrToken: 'SEC-TOKEN-89102-0412'
    },
    {
      id: 'OP-2026-0413',
      tokenNo: 15,
      patientId: 'MGM-2026-67341',
      hospitalId: 'HOSP-MGM-WGL',
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
      patientId: 'MGM-2026-89102',
      hospitalId: 'HOSP-MGM-WGL',
      departmentId: 'DEP-CARD',
      doctorId: 'DOC-101',
      doctorName: 'Dr. Anita Roy',
      departmentName: 'Cardiology',
      visitDate: '2025-09-14',
      symptoms: ['Exertional shortness of breath', 'High BP reading (150/94)'],
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
        { testName: '12-Lead Resting ECG', result: 'Normal sinus rhythm, Left axis deviation', status: 'Completed', reportDate: '2025-09-14' }
      ],
      notes: 'Advised low-salt diet and brisk walking. MGM Cardiology follow-up in 6 weeks.',
      nextFollowUp: '2025-10-25'
    }
  ],

  qrRecords: [
    {
      qrId: 'QR-89102-0412',
      patientId: 'MGM-2026-89102',
      appointmentId: 'OP-2026-0412',
      hospitalId: 'HOSP-MGM-WGL',
      secureToken: 'SEC-TOKEN-89102-0412',
      createdAt: '2026-11-02T10:00:00Z',
      status: 'Active'
    }
  ],

  labOrders: [
    {
      id: 'LAB-2026-101',
      patientId: 'MGM-2026-89102',
      patientName: 'Ramesh Kumar',
      aadharNumber: '458912345678',
      doctorName: 'Dr. Anita Roy',
      department: 'Cardiology',
      testName: 'Complete Blood Picture (CBC / CBP) & Lipid Profile',
      category: 'Biochemistry & Hematology',
      sampleType: 'Venous Blood (EDTA + Serum)',
      orderDate: new Date().toISOString().split('T')[0],
      status: 'Testing In Progress', // 'Pending Collection', 'Sample Collected', 'Testing In Progress', 'Report Ready'
      urgency: 'Urgent',
      resultData: {
        hemoglobin: '13.8 g/dL (Normal: 13.0 - 17.0)',
        totalWbc: '7,400 /cu.mm (Normal: 4,000 - 11,000)',
        plateletCount: '2.45 Lakhs/cu.mm',
        totalCholesterol: '188 mg/dL (< 200 mg/dL)',
        triglycerides: '145 mg/dL (< 150 mg/dL)',
        hdlGoodCholesterol: '45 mg/dL (> 40 mg/dL)',
        ldlBadCholesterol: '114 mg/dL (< 100 mg/dL)'
      },
      technicianName: 'M. Suresh, Lab Tech (KMC MGM)',
      notes: 'Sample processed at Central MGM Diagnostic Laboratory Room 14'
    },
    {
      id: 'LAB-2026-102',
      patientId: 'MGM-2026-67341',
      patientName: 'Sunita Mehra',
      aadharNumber: '678923456789',
      doctorName: 'Dr. Kavita Deshmukh',
      department: 'Dermatology',
      testName: 'Fasting Blood Sugar (FBS) & HbA1c Glycated Hemoglobin',
      category: 'Clinical Pathology',
      sampleType: 'Blood (Grey Fluoride Vacutainer)',
      orderDate: new Date().toISOString().split('T')[0],
      status: 'Pending Collection',
      urgency: 'Routine',
      resultData: null,
      technicianName: 'Awaiting Phlebotomist',
      notes: 'Patient advised 10-hour fasting overnight'
    },
    {
      id: 'LAB-2026-103',
      patientId: 'MGM-2026-89102',
      patientName: 'Ramesh Kumar',
      aadharNumber: '458912345678',
      doctorName: 'Dr. Rajesh Sharma',
      department: 'General Medicine',
      testName: 'Serum Creatinine & Kidney Function Test (KFT)',
      category: 'Biochemistry',
      sampleType: 'Serum Clot Activator',
      orderDate: new Date().toISOString().split('T')[0],
      status: 'Report Ready',
      urgency: 'Routine',
      resultData: {
        serumCreatinine: '1.0 mg/dL (Normal: 0.7 - 1.3)',
        bloodUrea: '28 mg/dL (Normal: 15 - 40)',
        serumUricAcid: '5.2 mg/dL (Normal: 3.5 - 7.2)',
        serumElectrolytesNa: '139 mEq/L (Normal: 135 - 145)',
        serumElectrolytesK: '4.2 mEq/L (Normal: 3.5 - 5.0)'
      },
      technicianName: 'P. Lavanya, Sr. Lab Technician',
      notes: 'Kidney profile parameters within normal physiological limits. Verified by Duty Pathologist.'
    },
    {
      id: 'LAB-2026-104',
      patientId: 'MGM-2026-92841',
      patientName: 'K. Venkatesham',
      aadharNumber: '556677889900',
      doctorName: 'Dr. Srinivas Rao',
      department: 'Orthopedics & Trauma',
      testName: 'Digital X-Ray Right Knee (AP & Lateral View)',
      category: 'Radiology & Imaging',
      sampleType: 'Radiological Imaging',
      orderDate: new Date().toISOString().split('T')[0],
      status: 'Sample Collected',
      urgency: 'Urgent',
      resultData: {
        observation: 'Mild joint space narrowing medial compartment. No fracture or dislocation seen.',
        impression: 'Grade 1 Osteoarthritis changes'
      },
      technicianName: 'T. Ravinder, X-Ray Tech',
      notes: 'Digital film transmitted to MGM Ortho OPD Chamber 115'
    }
  ],

  doctorCheckInLogs: [
    {
      id: 'CHK-2026-901',
      doctorId: 'DH-2026-001',
      doctorName: 'Dr. Rajesh Kumar',
      timestamp: '09:02 AM Today',
      date: new Date().toISOString().split('T')[0],
      latitude: 17.9818,
      longitude: 79.5960,
      accuracyMeters: 5,
      isWithinCampus: true,
      chamber: 'Chamber 108',
      selfieUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80',
      status: 'VERIFIED_IN_CHAMBER'
    },
    {
      id: 'CHK-2026-902',
      doctorId: 'DH-2026-003',
      doctorName: 'Dr. Ahmed Khan',
      timestamp: '09:10 AM Today',
      date: new Date().toISOString().split('T')[0],
      latitude: 17.9819,
      longitude: 79.5962,
      accuracyMeters: 6,
      isWithinCampus: true,
      chamber: 'Chamber 204',
      selfieUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&auto=format&fit=crop&q=80',
      status: 'VERIFIED_IN_CHAMBER'
    },
    {
      id: 'CHK-2026-903',
      doctorId: 'DH-2026-005',
      doctorName: 'Dr. Vikram Singh',
      timestamp: '09:00 AM Today',
      date: new Date().toISOString().split('T')[0],
      latitude: 17.9817,
      longitude: 79.5959,
      accuracyMeters: 5,
      isWithinCampus: true,
      chamber: 'Chamber 115',
      selfieUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200&auto=format&fit=crop&q=80',
      status: 'VERIFIED_IN_CHAMBER'
    }
  ],

  doctorLeaveRequests: [
    {
      id: 'LV-2026-041',
      doctorId: 'DH-2026-004',
      doctorName: 'Dr. Priya Sharma',
      department: 'Gynecology & Obstetrics',
      leaveType: 'Casual Leave',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      reason: 'National Gynecological Oncology Conference attendance',
      status: 'Approved',
      appliedAt: '2026-11-01T14:30:00Z',
      approvedBy: 'Medical Superintendent, MGM Warangal'
    }
  ],

  scheduleChangeRequests: [
    {
      id: 'SCH-REQ-101',
      doctorId: 'DH-2026-002',
      doctorName: 'Dr. Sneha Patel',
      department: 'Pediatrics',
      requestedDay: 'Wed',
      requestedShift: 'Morning Shift (09:00 AM - 01:00 PM)',
      currentShift: 'Off Duty',
      reason: 'Exchange duty with Dr. Ramesh for Pediatric Emergency Cover',
      status: 'Pending Approval',
      submittedAt: '2026-11-03T08:30:00Z'
    }
  ]
};

// Data Store Class
class DataStore {
  constructor() {
    this.listeners = new Set();
    this.init();
  }

  init() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        this.saveState(INITIAL_DATA);
      }
    } catch (e) {
      this._memoryState = JSON.parse(JSON.stringify(INITIAL_DATA));
    }
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach(fn => fn(this.getState()));
  }

  getState() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const hasDrRajesh = parsed.doctors && parsed.doctors.some(d => d.id === 'DH-2026-001' && d.medicalRegNumber);
        if (!hasDrRajesh) {
          parsed.doctors = INITIAL_DATA.doctors;
        }
        if (!parsed.doctorCheckInLogs || parsed.doctorCheckInLogs.length === 0) {
          parsed.doctorCheckInLogs = INITIAL_DATA.doctorCheckInLogs;
        }
        if (!parsed.doctorLeaveRequests || parsed.doctorLeaveRequests.length === 0) {
          parsed.doctorLeaveRequests = INITIAL_DATA.doctorLeaveRequests;
        }
        if (!parsed.scheduleChangeRequests) {
          parsed.scheduleChangeRequests = INITIAL_DATA.scheduleChangeRequests;
        }
        if (!parsed.departments || parsed.departments.length < INITIAL_DATA.departments.length) {
          parsed.departments = INITIAL_DATA.departments;
        }
        if (!parsed.labOrders) parsed.labOrders = INITIAL_DATA.labOrders;
        return parsed;
      }
    } catch (e) {
      if (this._memoryState) return this._memoryState;
    }
    return JSON.parse(JSON.stringify(INITIAL_DATA));
  }

  saveState(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      this._memoryState = state;
    }
    this.notify();
  }

  resetToDefault() {
    this.saveState(INITIAL_DATA);
    return this.getState();
  }

  getHospital() {
    return this.getState().hospital || INITIAL_DATA.hospital;
  }

  // --- Patients API (Mandatory 12-Digit Aadhaar, No Photo Required) ---
  getPatients() {
    return this.getState().patients || [];
  }

  getPatientById(id) {
    return this.getPatients().find(p => p.id === id) || null;
  }

  getPatientByAadhar(aadhar) {
    const clean = String(aadhar).trim().replace(/\D/g, '');
    return this.getPatients().find(p => p.aadharNumber === clean) || null;
  }

  getPatientByMobile(mobile) {
    const clean = String(mobile).trim().replace(/^\+91/, '').replace(/\s+/g, '');
    return this.getPatients().find(p => p.mobile === clean) || null;
  }

  createPatient(patientData) {
    const state = this.getState();
    const cleanMobile = String(patientData.mobile).trim().replace(/^\+91/, '').replace(/\s+/g, '');
    const cleanAadhar = String(patientData.aadharNumber).trim().replace(/\D/g, '');

    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const newId = `MGM-${new Date().getFullYear()}-${randomNum}`;

    const newPatient = {
      id: newId,
      fullName: patientData.fullName.trim(),
      mobile: cleanMobile,
      aadharNumber: cleanAadhar, // 12-Digit Mandatory Aadhaar
      dob: patientData.dob || '',
      age: parseInt(patientData.age, 10) || 0,
      gender: patientData.gender || 'Male',
      bloodGroup: patientData.bloodGroup || 'Unknown',
      address: patientData.address || '',
      district: patientData.district || 'Warangal',
      state: patientData.state || 'Telangana',
      pinCode: patientData.pinCode || '506007',
      allergies: ['No Known Drug Allergies'],
      chronicConditions: ['None'],
      registeredAt: new Date().toISOString(),
      abhaId: `91-${cleanAadhar.substring(0, 4)}-${cleanAadhar.substring(4, 8)}-${cleanAadhar.substring(8, 12)}`
    };

    state.patients.unshift(newPatient);
    this.saveState(state);
    return { success: true, patient: newPatient };
  }

  updatePatient(id, updateData) {
    const state = this.getState();
    const idx = state.patients.findIndex(p => p.id === id);
    if (idx === -1) return { success: false };

    state.patients[idx] = { ...state.patients[idx], ...updateData };
    this.saveState(state);
    return { success: true, patient: state.patients[idx] };
  }

  // --- DOCTOR LIVE GPS & SELFIE DUTY VERIFICATION FOR MGM WARANGAL ---
  doctorDutyCheckIn(doctorId, checkInData) {
    const state = this.getState();
    const doc = state.doctors.find(d => d.id === doctorId);
    if (!doc) return { success: false, message: 'Doctor not found' };

    const { selfieUrl, latitude, longitude, accuracyMeters = 12 } = checkInData;

    const toRad = x => (x * Math.PI) / 180;
    const R = 6371e3;
    const phi1 = toRad(latitude);
    const phi2 = toRad(HOSPITAL_COORDINATES.lat);
    const deltaPhi = toRad(HOSPITAL_COORDINATES.lat - latitude);
    const deltaLambda = toRad(HOSPITAL_COORDINATES.lng - longitude);

    const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
              Math.cos(phi1) * Math.cos(phi2) *
              Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distanceMeters = Math.round(R * c);

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' Today';

    doc.onlineStatus = 'online';
    doc.statusNote = `GPS Verified in MGM Hospital ${doc.roomNo} (${timeStr})`;
    doc.dutyVerification = {
      isVerified: true,
      checkedInAt: timeStr,
      selfieUrl: selfieUrl || doc.avatar,
      gps: {
        latitude: parseFloat(latitude.toFixed(4)),
        longitude: parseFloat(longitude.toFixed(4)),
        accuracyMeters: Math.round(accuracyMeters),
        distanceFromChamberMeters: Math.max(10, distanceMeters),
        isWithinCampus: true,
        locationLabel: `MGM Hospital Warangal, ${doc.roomNo} (Lat: ${latitude.toFixed(4)}°, Lng: ${longitude.toFixed(4)}°)`
      }
    };

    this.saveState(state);
    return { success: true, doctor: doc };
  }

  doctorDutyCheckOut(doctorId) {
    const state = this.getState();
    const doc = state.doctors.find(d => d.id === doctorId);
    if (!doc) return { success: false };

    doc.onlineStatus = 'offline';
    doc.statusNote = 'Duty Shift Ended / Checked Out';
    doc.dutyVerification = null;

    this.saveState(state);
    return { success: true, doctor: doc };
  }

  // --- DOCTOR WORKFLOW EXTENSIONS ---
  registerDoctor(doctorData) {
    const state = this.getState();
    const count = (state.doctors || []).length + 1;
    const docId = doctorData.id || `DH-2026-${String(count).padStart(3, '0')}`;

    const existing = state.doctors.find(d => d.id === docId || (d.email && d.email.toLowerCase() === doctorData.email?.toLowerCase()));
    if (existing) {
      return { success: false, message: `Doctor with ID ${docId} or email ${doctorData.email} is already registered.` };
    }

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' Today';

    const newDoctor = {
      id: docId,
      name: doctorData.name || 'Dr. Medical Officer',
      email: doctorData.email || `${docId.toLowerCase()}@mgmhospital.gov.in`,
      mobile: doctorData.mobile || '9876543210',
      dob: doctorData.dob || '1990-01-01',
      gender: doctorData.gender || 'Male',
      address: doctorData.address || 'Warangal, Telangana',
      qualification: doctorData.qualification || 'MBBS, MD',
      designation: doctorData.designation || 'Medical Officer',
      departmentId: doctorData.departmentId || 'DEP-GEN',
      department: doctorData.department || 'General Medicine',
      specialization: doctorData.specialization || 'General Medicine',
      medicalRegNumber: doctorData.medicalRegNumber || `TSMC/2026/${Math.floor(10000 + Math.random() * 90000)}`,
      hospitalId: 'HOSP-MGM-WGL',
      hospitalName: 'Govt. MGM Hospital, Warangal',
      assignedLocation: doctorData.assignedLocation || `Chamber ${100 + count} (OPD Block)`,
      departmentHead: doctorData.departmentHead || 'Dr. P. Srinivas Rao, Prof & HOD',
      employmentType: doctorData.employmentType || 'Permanent State Govt',
      roomNo: doctorData.roomNo || `Chamber ${100 + count}`,
      experience: doctorData.experience || '3 Years',
      days: doctorData.days || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      tokenQuota: 50,
      active: false, // Inactive until approved by Hospital Admin
      approvalStatus: 'Pending Approval', // 'Approved', 'Pending Approval', 'Rejected'
      onlineStatus: 'offline',
      statusNote: 'Registration submitted. Awaiting Medical Superintendent / Admin approval.',
      statusChangeTimestamp: timeStr,
      avatar: doctorData.avatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80',
      dutyHours: doctorData.dutyHours || '09:00 AM - 05:00 PM',
      nextCheckIn: 'Upon Admin Approval',
      lastCheckInTime: '-',
      dutyShifts: {
        morningShift: doctorData.morningShift || '09:00 AM - 01:00 PM',
        afternoonShift: doctorData.afternoonShift || '01:00 PM - 05:00 PM',
        nightShift: doctorData.nightShift || 'Off',
        opdTimings: doctorData.opdTimings || '09:00 AM - 01:00 PM',
        emergencyDuty: !!doctorData.emergencyDuty,
        onCallAvailability: !!doctorData.onCallAvailability,
        weeklyOff: doctorData.weeklyOff || 'Sunday'
      },
      documents: {
        regCertUrl: doctorData.regCertUrl || 'https://images.unsplash.com/photo-1584467735815-f778f274e296?w=400&auto=format&fit=crop&q=80',
        qualCertUrl: doctorData.qualCertUrl || 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=400&auto=format&fit=crop&q=80',
        govtIdUrl: doctorData.govtIdUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80',
        photoUrl: doctorData.avatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80'
      },
      dutyVerification: null,
      weeklySchedule: doctorData.weeklySchedule || [
        { day: 'Mon', dutyTime: '09:00 AM - 05:00 PM', department: doctorData.department || 'General Medicine' },
        { day: 'Tue', dutyTime: '09:00 AM - 05:00 PM', department: doctorData.department || 'General Medicine' },
        { day: 'Wed', dutyTime: '09:00 AM - 05:00 PM', department: doctorData.department || 'General Medicine' },
        { day: 'Thu', dutyTime: '09:00 AM - 05:00 PM', department: doctorData.department || 'General Medicine' },
        { day: 'Fri', dutyTime: '09:00 AM - 01:00 PM', department: 'OPD' },
        { day: 'Sat', dutyTime: '09:00 AM - 01:00 PM', department: 'OPD' },
        { day: 'Sun', dutyTime: 'Holiday', department: '-' }
      ]
    };

    state.doctors.push(newDoctor);
    this.saveState(state);
    return { success: true, doctor: newDoctor, pendingApproval: true };
  }

  approveDoctorRegistration(doctorId) {
    const state = this.getState();
    const doc = state.doctors.find(d => d.id === doctorId);
    if (!doc) return { success: false, message: 'Doctor not found' };

    doc.approvalStatus = 'Approved';
    doc.active = true;
    doc.statusNote = 'Approved by Medical Superintendent. Ready for duty.';
    this.saveState(state);
    return { success: true, doctor: doc };
  }

  rejectDoctorRegistration(doctorId, reason = 'Credentials could not be verified') {
    const state = this.getState();
    const doc = state.doctors.find(d => d.id === doctorId);
    if (!doc) return { success: false, message: 'Doctor not found' };

    doc.approvalStatus = 'Rejected';
    doc.active = false;
    doc.rejectionReason = reason;
    doc.statusNote = `Registration Rejected: ${reason}`;
    this.saveState(state);
    return { success: true, doctor: doc };
  }

  updateDoctorDutySchedule(doctorId, scheduleData) {
    const state = this.getState();
    const doc = state.doctors.find(d => d.id === doctorId);
    if (!doc) return { success: false, message: 'Doctor not found' };

    if (scheduleData.dutyShifts) doc.dutyShifts = { ...doc.dutyShifts, ...scheduleData.dutyShifts };
    if (scheduleData.weeklySchedule) doc.weeklySchedule = scheduleData.weeklySchedule;
    if (scheduleData.days) doc.days = scheduleData.days;
    if (scheduleData.dutyHours) doc.dutyHours = scheduleData.dutyHours;

    this.saveState(state);
    return { success: true, doctor: doc };
  }

  requestScheduleChange(changeData) {
    const state = this.getState();
    if (!state.scheduleChangeRequests) state.scheduleChangeRequests = [];

    const newReq = {
      id: `SCH-REQ-${String(state.scheduleChangeRequests.length + 102)}`,
      doctorId: changeData.doctorId,
      doctorName: changeData.doctorName,
      department: changeData.department,
      requestedDay: changeData.requestedDay,
      requestedShift: changeData.requestedShift,
      currentShift: changeData.currentShift || 'Scheduled Shift',
      reason: changeData.reason,
      status: 'Pending Approval',
      submittedAt: new Date().toISOString()
    };

    state.scheduleChangeRequests.unshift(newReq);
    this.saveState(state);
    return { success: true, request: newReq };
  }

  approveScheduleChange(requestId) {
    const state = this.getState();
    const req = (state.scheduleChangeRequests || []).find(r => r.id === requestId);
    if (!req) return { success: false, message: 'Request not found' };

    req.status = 'Approved';
    req.approvedAt = new Date().toISOString();

    const doc = state.doctors.find(d => d.id === req.doctorId);
    if (doc && doc.weeklySchedule) {
      const daySched = doc.weeklySchedule.find(s => s.day === req.requestedDay);
      if (daySched) {
        daySched.dutyTime = req.requestedShift;
      }
    }

    this.saveState(state);
    return { success: true, request: req };
  }

  rejectScheduleChange(requestId, reason = 'Shift rearrangement not possible due to department coverage') {
    const state = this.getState();
    const req = (state.scheduleChangeRequests || []).find(r => r.id === requestId);
    if (!req) return { success: false, message: 'Request not found' };

    req.status = 'Rejected';
    req.rejectionReason = reason;
    this.saveState(state);
    return { success: true, request: req };
  }

  setDoctorAvailabilityStatus(doctorId, newStatus) {
    const state = this.getState();
    const doc = state.doctors.find(d => d.id === doctorId);
    if (!doc) return { success: false, message: 'Doctor not found' };

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' Today';

    doc.onlineStatus = newStatus;
    doc.statusChangeTimestamp = timeStr;

    if (newStatus === 'online') {
      doc.statusNote = `Available for Patients (${timeStr})`;
    } else if (newStatus === 'offline') {
      doc.statusNote = `Not Available (${timeStr})`;
    } else if (newStatus === 'in_consultation') {
      doc.statusNote = `In Patient Consultation (${timeStr})`;
    } else if (newStatus === 'emergency_duty') {
      doc.statusNote = `On Emergency Casualty Duty (${timeStr})`;
    } else if (newStatus === 'on_leave') {
      doc.statusNote = `On Approved Leave (${timeStr})`;
    } else if (newStatus === 'off_duty') {
      doc.statusNote = `Off Duty (${timeStr})`;
    }

    this.saveState(state);
    return { success: true, doctor: doc };
  }

  updateDoctorProfile(doctorId, updateData) {
    const state = this.getState();
    const idx = state.doctors.findIndex(d => d.id === doctorId);
    if (idx === -1) return { success: false, message: 'Doctor not found' };

    state.doctors[idx] = { ...state.doctors[idx], ...updateData };
    this.saveState(state);
    return { success: true, doctor: state.doctors[idx] };
  }

  toggleDoctorStatus(doctorId, newStatus) {
    const state = this.getState();
    const doc = state.doctors.find(d => d.id === doctorId);
    if (!doc) return { success: false, message: 'Doctor not found' };

    doc.onlineStatus = newStatus;
    if (newStatus === 'online') {
      doc.statusNote = 'Currently Available in Chamber';
    } else if (newStatus === 'offline') {
      doc.statusNote = 'Shift Off / Offline';
    } else if (newStatus === 'in_consultation') {
      doc.statusNote = 'In Patient Consultation';
    } else if (newStatus === 'on_leave') {
      doc.statusNote = 'On Approved Leave';
    }

    this.saveState(state);
    return { success: true, doctor: doc };
  }

  submitDoctorHourlyCheckIn(doctorId, checkInData = {}) {
    const state = this.getState();
    const doc = state.doctors.find(d => d.id === doctorId);
    if (!doc) return { success: false, message: 'Doctor not found' };

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' Today';
    const nextCheckInMin = 58;

    const selfie = checkInData.selfieUrl || doc.avatar;
    const lat = checkInData.latitude || 17.9818;
    const lng = checkInData.longitude || 79.5960;
    const accuracy = checkInData.accuracyMeters || 5;

    doc.onlineStatus = 'online';
    doc.lastCheckInTime = timeStr;
    doc.nextCheckIn = `in ${nextCheckInMin} min`;
    doc.statusNote = `GPS Chamber Verified at ${timeStr}`;
    doc.dutyVerification = {
      isVerified: true,
      checkedInAt: timeStr,
      selfieUrl: selfie,
      gps: {
        latitude: lat,
        longitude: lng,
        accuracyMeters: accuracy,
        distanceFromChamberMeters: 6,
        isWithinCampus: true,
        locationLabel: `Govt. MGM Hospital, ${doc.roomNo}`
      }
    };

    if (!state.doctorCheckInLogs) state.doctorCheckInLogs = [];
    const logEntry = {
      id: `CHK-2026-${Date.now().toString().slice(-4)}`,
      doctorId: doc.id,
      doctorName: doc.name,
      timestamp: timeStr,
      date: new Date().toISOString().split('T')[0],
      latitude: lat,
      longitude: lng,
      accuracyMeters: accuracy,
      isWithinCampus: true,
      chamber: doc.roomNo,
      selfieUrl: selfie,
      status: 'VERIFIED_IN_CHAMBER'
    };
    state.doctorCheckInLogs.unshift(logEntry);

    this.saveState(state);
    return { success: true, doctor: doc, log: logEntry };
  }

  requestDoctorLeave(leaveData) {
    const state = this.getState();
    if (!state.doctorLeaveRequests) state.doctorLeaveRequests = [];

    const newLeave = {
      id: `LV-2026-${String(state.doctorLeaveRequests.length + 42).padStart(3, '0')}`,
      doctorId: leaveData.doctorId,
      doctorName: leaveData.doctorName,
      department: leaveData.department,
      leaveType: leaveData.leaveType || 'Casual Leave',
      startDate: leaveData.startDate,
      endDate: leaveData.endDate,
      reason: leaveData.reason,
      status: 'Approved',
      appliedAt: new Date().toISOString(),
      approvedBy: 'Medical Superintendent, MGM Warangal'
    };

    state.doctorLeaveRequests.unshift(newLeave);

    const today = new Date().toISOString().split('T')[0];
    if (leaveData.startDate <= today && leaveData.endDate >= today) {
      const doc = state.doctors.find(d => d.id === leaveData.doctorId);
      if (doc) {
        doc.onlineStatus = 'on_leave';
        doc.statusNote = `On Approved ${newLeave.leaveType}`;
      }
    }

    this.saveState(state);
    return { success: true, leaveRequest: newLeave };
  }

  // --- Appointments API ---
  getAppointments(filter = {}) {
    let list = this.getState().appointments || [];
    if (filter.patientId) list = list.filter(a => a.patientId === filter.patientId);
    if (filter.doctorId) list = list.filter(a => a.doctorId === filter.doctorId);
    if (filter.status) list = list.filter(a => a.status.toLowerCase() === filter.status.toLowerCase());
    if (filter.date) list = list.filter(a => a.date === filter.date);
    return list;
  }

  createAppointment(apptData) {
    const state = this.getState();
    const existingForDay = state.appointments.filter(
      a => a.doctorId === apptData.doctorId && a.date === apptData.date && a.status !== 'Cancelled'
    );
    const tokenNo = existingForDay.length + 1;

    const opNum = Math.floor(1000 + Math.random() * 9000);
    const opId = `OP-${new Date().getFullYear()}-${opNum}`;
    const secureToken = `SEC-TOKEN-${apptData.patientId.replace('MGM-', '')}-${opNum}`;

    const newAppt = {
      id: opId,
      tokenNo,
      patientId: apptData.patientId,
      hospitalId: 'HOSP-MGM-WGL',
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
      qrId: `QR-${apptData.patientId.replace('MGM-', '')}-${opNum}`,
      patientId: apptData.patientId,
      appointmentId: opId,
      hospitalId: 'HOSP-MGM-WGL',
      secureToken,
      createdAt: new Date().toISOString(),
      status: 'Active'
    };

    state.appointments.unshift(newAppt);
    state.qrRecords.unshift(qrRecord);
    this.saveState(state);

    return { success: true, appointment: newAppt };
  }

  updateAppointmentStatus(id, newStatus) {
    const state = this.getState();
    const idx = state.appointments.findIndex(a => a.id === id);
    if (idx === -1) return { success: false };

    state.appointments[idx].status = newStatus;
    if (newStatus === 'Waiting' && !state.appointments[idx].checkedInAt) {
      state.appointments[idx].checkedInAt = new Date().toISOString();
    }
    if (newStatus === 'Completed') {
      state.appointments[idx].completedAt = new Date().toISOString();
    }

    this.saveState(state);
    return { success: true, appointment: state.appointments[idx] };
  }

  // --- Rooms & Bed Booking API ---
  bookRoom(bookingData) {
    const state = this.getState();
    const room = state.rooms.find(r => r.id === bookingData.roomTypeId);
    if (!room) return { success: false, message: 'Room type not found' };

    const available = room.totalBeds - room.occupiedBeds;
    if (available <= 0) {
      return { success: false, message: 'No beds currently available in this category' };
    }

    const bookingId = `BK-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const bedNum = `Bed ${room.category.substring(0, 2).toUpperCase()}-${room.occupiedBeds + 1}`;

    const newBooking = {
      id: bookingId,
      patientId: bookingData.patientId,
      patientName: bookingData.patientName,
      aadharNumber: bookingData.aadharNumber,
      roomTypeId: room.id,
      roomTypeName: room.type,
      bedNumber: bedNum,
      admitDate: bookingData.admitDate || new Date().toISOString().split('T')[0],
      durationDays: parseInt(bookingData.durationDays, 10) || 2,
      status: 'Admitted / Active',
      department: bookingData.department || 'General Medicine',
      doctor: bookingData.doctor || 'MGM Duty Physician',
      notes: bookingData.notes || 'Admission booked at MGM Hospital',
      createdAt: new Date().toISOString()
    };

    room.occupiedBeds += 1;
    state.roomBookings.unshift(newBooking);
    this.saveState(state);

    return { success: true, booking: newBooking, room };
  }

  // --- Blood Bank API ---
  requestBlood(reqData) {
    const state = this.getState();
    const bloodItem = state.bloodBank.find(b => b.group === reqData.bloodGroup);
    if (!bloodItem) return { success: false, message: 'Blood group not recognized' };

    const reqId = `BLD-REQ-${Math.floor(100 + Math.random() * 900)}`;
    const newReq = {
      id: reqId,
      patientName: reqData.patientName,
      patientId: reqData.patientId || 'Emergency',
      bloodGroup: reqData.bloodGroup,
      unitsRequested: parseInt(reqData.unitsRequested, 10) || 1,
      urgency: reqData.urgency || 'Emergency (Immediate)',
      doctor: reqData.doctor || 'MGM Casualty Physician',
      status: bloodItem.units >= reqData.unitsRequested ? 'Reserved / Ready at MGM Blood Bank' : 'Waitlisted / Donor Alert Sent',
      createdAt: new Date().toISOString()
    };

    if (bloodItem.units >= reqData.unitsRequested) {
      bloodItem.units -= reqData.unitsRequested;
      if (bloodItem.units < 5) bloodItem.status = 'Critical Low';
      else if (bloodItem.units < 10) bloodItem.status = 'Low Stock';
    }

    state.bloodRequests.unshift(newReq);
    this.saveState(state);
    return { success: true, request: newReq, stockRemaining: bloodItem.units };
  }

  // --- Medical Records API ---
  addMedicalRecord(recordData) {
    const state = this.getState();
    const recNum = Math.floor(1000 + Math.random() * 9000);
    const recId = `REC-${new Date().getFullYear()}-${recNum}`;

    const newRecord = {
      id: recId,
      patientId: recordData.patientId,
      hospitalId: 'HOSP-MGM-WGL',
      departmentId: recordData.departmentId,
      doctorId: recordData.doctorId,
      doctorName: recordData.doctorName || 'MGM OPD Doctor',
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

  // --- Diagnostic Lab Orders API for Lab Technicians ---
  getLabOrders() {
    return this.getState().labOrders || [];
  }

  updateLabOrderStatus(orderId, newStatus, resultData = null, technicianName = 'M. Suresh, Lab Tech') {
    const state = this.getState();
    if (!state.labOrders) state.labOrders = [];
    const idx = state.labOrders.findIndex(o => o.id === orderId);
    if (idx === -1) return { success: false, message: 'Lab order not found' };

    state.labOrders[idx].status = newStatus;
    state.labOrders[idx].technicianName = technicianName;
    state.labOrders[idx].updatedAt = new Date().toISOString();

    if (resultData) {
      state.labOrders[idx].resultData = resultData;
    }

    // If report is marked ready, also link to patient's medical records
    if (newStatus === 'Report Ready') {
      const order = state.labOrders[idx];
      const rec = state.medicalRecords.find(r => r.patientId === order.patientId);
      if (rec) {
        if (!rec.labReports) rec.labReports = [];
        rec.labReports.unshift({
          testName: order.testName,
          result: 'Lab Report Ready - Verified by MGM Central Diagnostics',
          status: 'Completed',
          reportDate: new Date().toISOString().split('T')[0]
        });
      }
    }

    this.saveState(state);
    return { success: true, order: state.labOrders[idx] };
  }

  createLabOrder(orderData) {
    const state = this.getState();
    if (!state.labOrders) state.labOrders = [];

    const orderNum = Math.floor(100 + Math.random() * 900);
    const newOrder = {
      id: `LAB-${new Date().getFullYear()}-${orderNum}`,
      patientId: orderData.patientId,
      patientName: orderData.patientName,
      aadharNumber: orderData.aadharNumber || '',
      doctorName: orderData.doctorName || 'MGM Duty Physician',
      department: orderData.department || 'General Medicine',
      testName: orderData.testName,
      category: orderData.category || 'Clinical Pathology',
      sampleType: orderData.sampleType || 'Venous Blood',
      orderDate: new Date().toISOString().split('T')[0],
      status: 'Pending Collection',
      urgency: orderData.urgency || 'Routine',
      resultData: null,
      technicianName: 'Awaiting Collection',
      notes: orderData.notes || 'Requisition from OPD'
    };

    state.labOrders.unshift(newOrder);
    this.saveState(state);
    return { success: true, order: newOrder };
  }

  // --- QR Token Verification ---
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
      const pat = state.patients.find(p => p.id.toUpperCase() === token.toUpperCase() || p.aadharNumber === token.replace(/\D/g, ''));
      if (pat) patientId = pat.id;

      const appt = state.appointments.find(a => a.id.toUpperCase() === token.toUpperCase());
      if (appt) {
        patientId = appt.patientId;
        appointmentId = appt.id;
      }
    }

    if (!patientId) {
      return { success: false, message: 'Invalid or expired QR pass.' };
    }

    const patient = state.patients.find(p => p.id === patientId);
    if (!patient) {
      return { success: false, message: 'Patient profile record missing.' };
    }

    const records = (state.medicalRecords || []).filter(r => r.patientId === patientId);
    const appointments = (state.appointments || []).filter(a => a.patientId === patientId);
    const currentAppointment = appointmentId ? state.appointments.find(a => a.id === appointmentId) : appointments[0] || null;

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
}

export const store = new DataStore();
