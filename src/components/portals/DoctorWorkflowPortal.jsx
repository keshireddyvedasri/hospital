import React, { useState, useRef, useEffect } from 'react';
import {
  Stethoscope, Calendar, Clock, CheckCircle2, ShieldCheck, MapPin,
  Camera, FileText, BarChart3, Edit3, User, ChevronRight, AlertTriangle,
  LogOut, Bell, Menu, X, Upload, Check, RefreshCw, Send, Plus, Search,
  Eye, QrCode, Sparkles, Building, Phone, Mail, Award, Briefcase, UserCheck,
  AlertCircle, Shield, FileCheck, HelpCircle, ArrowRight, Users, ChevronDown
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function DoctorWorkflowPortal({
  store,
  doctor,
  doctors,
  departments,
  appointments,
  patients,
  onSwitchDoctor,
  onScanQR,
  onViewRecord,
  onOpenConsultation,
  onViewSlip,
  onLogout
}) {
  const { t, language } = useLanguage();

  // Active navigation tab (Pages 1 to 5 + OP Queue)
  // 'dashboard' (Page 2), 'registration' (Page 1), 'schedule' (Page 3), 'attendance' (Page 4), 'profile' (Page 5), 'op_queue'
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Active Doctor fallback
  const currentDoc = doctor || (doctors && doctors.find(d => d.id === 'DH-2026-001')) || (doctors && doctors[0]) || {
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
    roomNo: 'Chamber 108',
    experience: '8 Years',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    tokenQuota: 65,
    active: true,
    approvalStatus: 'Approved',
    onlineStatus: 'online',
    statusNote: 'Available for Patients',
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
    }
  };

  // Live Camera state for Hourly Attendance (Page 4)
  const videoRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [capturedSelfie, setCapturedSelfie] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [lastVerifiedAlert, setLastVerifiedAlert] = useState(null);

  // Dynamic Clock
  const [currentTimeStr, setCurrentTimeStr] = useState(() => {
    const now = new Date();
    return now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' +
      now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  });

  // Modals state
  const [leaveModalOpen, setLeaveModalOpen] = useState(false);
  const [editProfileModalOpen, setEditProfileModalOpen] = useState(false);
  const [scheduleChangeModalOpen, setScheduleChangeModalOpen] = useState(false);
  const [consultModalOpen, setConsultModalOpen] = useState(false);
  const [activeConsultAppt, setActiveConsultAppt] = useState(null);

  // Leave Form state
  const [leaveType, setLeaveType] = useState('Casual Leave');
  const [leaveStartDate, setLeaveStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [leaveEndDate, setLeaveEndDate] = useState(new Date(Date.now() + 86400000).toISOString().split('T')[0]);
  const [leaveReason, setLeaveReason] = useState('');

  // Schedule Change Request Form State (Page 3)
  const [changeReqDay, setChangeReqDay] = useState('Wed');
  const [changeReqShift, setChangeReqShift] = useState('Morning Shift (09:00 AM - 01:00 PM)');
  const [changeReqReason, setChangeReqReason] = useState('');

  // PAGE 1: Comprehensive Doctor Registration Form State
  const [regForm, setRegForm] = useState({
    // 1. Personal Information
    name: '',
    dob: '1988-06-15',
    gender: 'Male',
    mobile: '',
    email: '',
    address: 'Warangal, Telangana',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80',

    // 2. Professional Information
    id: `DH-2026-00${(doctors?.length || 5) + 1}`,
    medicalRegNumber: 'TSMC/2026/',
    qualification: 'MBBS, MD',
    specialization: 'Internal Medicine',
    experience: '5 Years',
    designation: 'Senior Medical Officer',

    // 3. Hospital Information
    hospitalName: 'Govt. MGM Hospital, Warangal',
    department: 'General Medicine',
    departmentId: 'DEP-GEN',
    assignedLocation: 'Chamber 110, Ground Floor OPD Wing',
    departmentHead: 'Dr. P. Srinivas Rao, Prof & HOD',
    employmentType: 'Permanent State Govt',

    // 4. Duty Information
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    weeklyOff: 'Sunday',
    morningShift: '09:00 AM - 01:00 PM',
    afternoonShift: '01:00 PM - 05:00 PM',
    nightShift: 'Off',
    opdTimings: '09:00 AM - 01:00 PM',
    emergencyDuty: false,
    onCallAvailability: true,

    // 5. Document Previews
    regCertUrl: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?w=400&auto=format&fit=crop&q=80',
    qualCertUrl: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=400&auto=format&fit=crop&q=80',
    govtIdUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80'
  });
  const [regSuccessModalOpen, setRegSuccessModalOpen] = useState(false);
  const [newlyRegisteredDoc, setNewlyRegisteredDoc] = useState(null);

  // Edit Profile Form State (Page 5)
  const [editForm, setEditForm] = useState({
    name: currentDoc.name,
    designation: currentDoc.designation,
    department: currentDoc.department,
    qualification: currentDoc.qualification,
    specialization: currentDoc.specialization,
    experience: currentDoc.experience || '8 Years',
    mobile: currentDoc.mobile,
    email: currentDoc.email,
    medicalRegNumber: currentDoc.medicalRegNumber || 'TSMC/2018/48921',
    assignedLocation: currentDoc.assignedLocation || currentDoc.roomNo
  });

  // Consultation Form state
  const [consultSymptoms, setConsultSymptoms] = useState('');
  const [consultDiagnosis, setConsultDiagnosis] = useState('');
  const [consultPrescription, setConsultPrescription] = useState([
    { medicineName: 'Paracetamol 650mg', dosage: '1 tablet thrice daily after food', duration: '5 days' },
    { medicineName: 'Amoxicillin 500mg', dosage: '1 capsule twice daily after meals', duration: '5 days' }
  ]);
  const [consultLabTests, setConsultLabTests] = useState('Complete Blood Picture (CBC)');
  const [consultNotes, setConsultNotes] = useState('Drink plenty of boiled water. Review in 5 days if fever persists.');

  // Camera stream lifecycle
  useEffect(() => {
    let localStream = null;
    if (activeTab === 'dashboard' || activeTab === 'attendance') {
      if (typeof navigator !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: { width: 480, height: 360 } })
          .then((s) => {
            localStream = s;
            setCameraStream(s);
            setCameraActive(true);
            if (videoRef.current) {
              videoRef.current.srcObject = s;
              videoRef.current.play().catch(() => {});
            }
          })
          .catch((err) => {
            console.warn('Webcam permission not granted or no webcam available, using chamber preview fallback', err);
            setCameraActive(false);
          });
      }
    }

    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [activeTab]);

  useEffect(() => {
    if (videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream;
      videoRef.current.play().catch(() => {});
    }
  }, [cameraStream, cameraActive]);

  // Live clock
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTimeStr(
        now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' +
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      );
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  // Filter OP appointments for active doctor today
  const todayStr = new Date().toISOString().split('T')[0];
  const docAppts = (appointments || []).filter(a =>
    a && (a.doctorId === currentDoc.id || a.departmentId === currentDoc.departmentId) &&
    a.date === todayStr
  );
  const waitingAppts = docAppts.filter(a => a.status === 'Waiting' || a.status === 'Confirmed' || a.status === 'With Doctor');
  const completedAppts = docAppts.filter(a => a.status === 'Completed');

  // PAGE 2: Handle Availability Status Toggle (Online / Offline / In Consultation / Emergency Duty / On Leave / Off Duty)
  const handleSetDoctorStatus = (newStatus) => {
    if (store) {
      store.setDoctorAvailabilityStatus(currentDoc.id, newStatus);
      const label = newStatus === 'online' ? 'ONLINE (Available for Patients)' : newStatus.toUpperCase();
      setLastVerifiedAlert(`Availability Status updated to: ${label}`);
      setTimeout(() => setLastVerifiedAlert(null), 3500);
    }
  };

  // PAGE 4: Live Photo & GPS Chamber Verification
  const handleCaptureLiveAttendance = () => {
    setIsVerifying(true);
    let capturedDataUrl = null;

    if (cameraActive && videoRef.current) {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth || 480;
        canvas.height = videoRef.current.videoHeight || 360;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        capturedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setCapturedSelfie(capturedDataUrl);
      } catch (e) {
        capturedDataUrl = currentDoc.avatar;
      }
    } else {
      capturedDataUrl = currentDoc.avatar;
    }

    setTimeout(() => {
      if (store) {
        const result = store.submitDoctorHourlyCheckIn(currentDoc.id, {
          selfieUrl: capturedDataUrl,
          latitude: 17.9818,
          longitude: 79.5960,
          accuracyMeters: 5
        });

        setIsVerifying(false);
        if (result.success) {
          setLastVerifiedAlert('✅ Live Chamber Presence Verified via GPS Geofence! Next verification countdown reset to 60 min.');
          setTimeout(() => setLastVerifiedAlert(null), 5000);
        }
      }
    }, 700);
  };

  // PAGE 1: Handle Doctor Registration Submit (Status: Pending Approval)
  const handleRegisterDoctorSubmit = (e) => {
    e.preventDefault();
    if (!regForm.name || !regForm.mobile || !regForm.email || !regForm.qualification) {
      alert('Please fill all mandatory personal and professional fields.');
      return;
    }

    if (store) {
      const res = store.registerDoctor(regForm);
      if (res.success) {
        setNewlyRegisteredDoc(res.doctor);
        setRegSuccessModalOpen(true);
      } else {
        alert(res.message);
      }
    }
  };

  // PAGE 3: Handle Request Schedule Change Submit
  const handleScheduleChangeSubmit = (e) => {
    e.preventDefault();
    if (!changeReqReason.trim()) {
      alert('Please enter a clinical or personal reason for the shift change request.');
      return;
    }

    if (store) {
      const res = store.requestScheduleChange({
        doctorId: currentDoc.id,
        doctorName: currentDoc.name,
        department: currentDoc.department,
        requestedDay: changeReqDay,
        requestedShift: changeReqShift,
        currentShift: currentDoc.dutyShifts?.morningShift || 'Standard Shift',
        reason: changeReqReason
      });

      if (res.success) {
        setScheduleChangeModalOpen(false);
        setChangeReqReason('');
        setLastVerifiedAlert('Shift change request submitted to Hospital Administration for approval.');
        setTimeout(() => setLastVerifiedAlert(null), 4000);
      }
    }
  };

  // PAGE 5: Handle Edit Profile Save
  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (store) {
      const res = store.updateDoctorProfile(currentDoc.id, editForm);
      if (res.success) {
        setEditProfileModalOpen(false);
        setLastVerifiedAlert('Doctor profile and medical credentials updated successfully!');
        setTimeout(() => setLastVerifiedAlert(null), 3500);
      }
    }
  };

  // Handle Complete Consultation
  const handleSubmitConsultation = () => {
    if (!activeConsultAppt || !store) return;
    const pat = patients.find(p => p.id === activeConsultAppt.patientId);

    const recordData = {
      patientId: activeConsultAppt.patientId,
      appointmentId: activeConsultAppt.id,
      doctorId: currentDoc.id,
      departmentId: currentDoc.departmentId,
      department: currentDoc.department,
      doctorName: currentDoc.name,
      diagnosis: consultDiagnosis,
      symptoms: consultSymptoms,
      prescription: consultPrescription,
      labTestsRequested: consultLabTests ? [consultLabTests] : [],
      notes: consultNotes,
      vitals: { bp: '120/80 mmHg', pulse: '76 bpm', temp: '98.6 °F', spo2: '99%' }
    };

    const res = store.addMedicalRecord(recordData);
    if (res.success) {
      setConsultModalOpen(false);
      setActiveConsultAppt(null);
      setLastVerifiedAlert(`Consultation completed for ${pat?.fullName || 'Patient'}! Prescription generated.`);
      setTimeout(() => setLastVerifiedAlert(null), 4000);
    }
  };

  const isOnline = currentDoc.onlineStatus === 'online';

  return (
    <div className="doc-portal-wrapper d-flex flex-column flex-md-row">
      
      {/* 1. PROFESSIONAL SIDEBAR NAVIGATION */}
      <aside className={`doc-sidebar d-flex flex-column ${sidebarOpen ? '' : 'd-none d-md-flex'}`} style={{ minHeight: '90vh' }}>
        
        {/* Hospital Branding Header */}
        <div className="doc-sidebar-brand">
          <div className="bg-primary rounded-3 p-2 text-white d-flex align-items-center justify-content-center shadow-sm">
            <Building size={22} />
          </div>
          <div>
            <div className="fw-bold text-white small lh-sm">Govt. MGM Hospital</div>
            <div className="text-white-50" style={{ fontSize: '0.72rem' }}>Kakatiya Medical College, Warangal</div>
          </div>
        </div>

        {/* Sidebar Nav Items (Pages 1 to 5 + OP Queue) */}
        <div className="py-3 flex-grow-1">
          
          {/* PAGE 2: DASHBOARD */}
          <button
            type="button"
            className={`doc-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <Stethoscope size={18} />
            <span>Dashboard</span>
          </button>

          {/* PAGE 5: DOCTOR PROFILE */}
          <button
            type="button"
            className={`doc-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={18} />
            <span>My Profile</span>
          </button>

          {/* PAGE 3: WEEKLY DUTY SCHEDULE */}
          <button
            type="button"
            className={`doc-nav-item ${activeTab === 'schedule' ? 'active' : ''}`}
            onClick={() => setActiveTab('schedule')}
          >
            <Calendar size={18} />
            <span>Duty Schedule</span>
          </button>

          {/* PAGE 4: LIVE ATTENDANCE & GPS */}
          <button
            type="button"
            className={`doc-nav-item ${activeTab === 'attendance' ? 'active' : ''}`}
            onClick={() => setActiveTab('attendance')}
          >
            <Camera size={18} />
            <span>Attendance</span>
          </button>

          {/* LEAVE REQUESTS (MATCHES FIGMA DESIGN SHEET) */}
          <button
            type="button"
            className="doc-nav-item"
            onClick={() => setLeaveModalOpen(true)}
          >
            <Mail size={18} />
            <span>Leave Requests</span>
          </button>

          {/* OPD QUEUE & CONSULTATIONS */}
          <button
            type="button"
            className={`doc-nav-item ${activeTab === 'op_queue' ? 'active' : ''}`}
            onClick={() => setActiveTab('op_queue')}
          >
            <UserCheck size={18} />
            <span>OP Queue ({waitingAppts.length})</span>
            {waitingAppts.length > 0 && (
              <span className="doc-nav-badge">{waitingAppts.length}</span>
            )}
          </button>

          {/* PAGE 1: REGISTER NEW DOCTOR */}
          <button
            type="button"
            className={`doc-nav-item ${activeTab === 'registration' ? 'active' : ''}`}
            onClick={() => setActiveTab('registration')}
          >
            <Plus size={18} />
            <span>Register as Doctor</span>
          </button>

        </div>

        {/* Doctor Quick Badge at bottom of sidebar */}
        <div className="p-3 border-top border-secondary border-opacity-25 mt-auto">
          <div className="d-flex align-items-center gap-2 mb-2">
            <img
              src={currentDoc.avatar}
              alt={currentDoc.name}
              className="rounded-circle border border-white"
              width="38"
              height="38"
              style={{ objectFit: 'cover' }}
            />
            <div className="overflow-hidden">
              <div className="text-white text-truncate small fw-bold">{currentDoc.name}</div>
              <div className="text-white-50 text-truncate" style={{ fontSize: '0.7rem' }}>
                {currentDoc.id} &bull; {currentDoc.department}
              </div>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-sm btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2"
            onClick={onLogout}
          >
            <LogOut size={14} />
            <span>Logout to Public Portal</span>
          </button>
        </div>

      </aside>

      {/* 2. MAIN WORKSPACE */}
      <div className="flex-grow-1 p-3 p-lg-4" style={{ backgroundColor: '#f8fafc' }}>
        
        {/* TOP STATUS BAR & HEADER - MATCHES FIGMA DESIGN SHEET */}
        <div className="bg-white p-3 rounded-4 shadow-sm border mb-4">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
            
            <div className="d-flex align-items-center gap-3">
              <button
                type="button"
                className="btn btn-sm btn-light border d-md-none"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <Menu size={18} />
              </button>

              <div>
                <div className="d-flex align-items-center gap-2">
                  <h4 className="fw-bold text-dark mb-0">Welcome, {currentDoc.name}</h4>
                  <span className="badge bg-primary-subtle text-primary border small d-none d-sm-inline">
                    {currentDoc.id}
                  </span>
                </div>
                <div className="text-muted small">
                  Here is your duty overview for today &bull; <strong>{currentDoc.designation}</strong> &bull; {currentDoc.department} &bull; Chamber: <strong>{currentDoc.assignedLocation || currentDoc.roomNo}</strong>
                </div>
              </div>
            </div>

            {/* TOP RIGHT: NOTIFICATION BELL + DOCTOR PROFILE SELECTOR + LARGE ONLINE / OFFLINE TOGGLE */}
            <div className="d-flex align-items-center gap-3 flex-wrap justify-content-end">
              
              {/* Notification Bell with Red Badge (2) */}
              <div className="position-relative cursor-pointer p-2 rounded-circle bg-light border" title="2 New Hospital Circulars & Rostering Alerts">
                <Bell size={18} className="text-secondary" />
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-light" style={{ fontSize: '0.65rem' }}>
                  2
                </span>
              </div>

              {/* Doctor Switcher Dropdown */}
              <div className="dropdown">
                <button
                  type="button"
                  className="btn btn-sm btn-light border rounded-pill d-flex align-items-center gap-2 py-1 px-3 shadow-sm dropdown-toggle"
                  id="doctorProfileMenu"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  onClick={() => {
                    const el = document.getElementById('doc-dropdown-menu');
                    if (el) el.classList.toggle('show');
                  }}
                >
                  <img
                    src={currentDoc.avatar}
                    alt={currentDoc.name}
                    className="doc-header-avatar"
                  />
                  <span className="small fw-bold text-dark d-none d-sm-inline">{currentDoc.name}</span>
                  <ChevronDown size={14} className="text-muted" />
                </button>
                <ul
                  id="doc-dropdown-menu"
                  className="dropdown-menu dropdown-menu-end shadow border-0 rounded-3 mt-1 p-2"
                  style={{ minWidth: '240px' }}
                >
                  <li className="px-2 py-1 border-bottom mb-1">
                    <span className="text-muted small fw-bold">SWITCH ACTIVE DOCTOR:</span>
                  </li>
                  {(doctors || []).map(d => (
                    <li key={d.id}>
                      <button
                        type="button"
                        className={`dropdown-item rounded-2 py-1 px-2 d-flex align-items-center justify-content-between small ${d.id === currentDoc.id ? 'active' : ''}`}
                        onClick={() => {
                          onSwitchDoctor && onSwitchDoctor(d.id);
                          const el = document.getElementById('doc-dropdown-menu');
                          if (el) el.classList.remove('show');
                        }}
                      >
                        <span className="text-truncate me-2">{d.name}</span>
                        <span className="badge bg-light text-secondary border" style={{ fontSize: '0.68rem' }}>{d.department?.split(' ')[0]}</span>
                      </button>
                    </li>
                  ))}
                  <li className="border-top mt-1 pt-1">
                    <button
                      type="button"
                      className="dropdown-item rounded-2 py-1 px-2 text-danger small d-flex align-items-center gap-2"
                      onClick={onLogout}
                    >
                      <LogOut size={13} />
                      <span>Logout to Main Portal</span>
                    </button>
                  </li>
                </ul>
              </div>

              {/* PAGE 2: LARGE CLEAR ONLINE / OFFLINE TOGGLE (MATCHES FIGMA DESIGN SHEET) */}
              <div className="d-flex flex-column align-items-end">
                <div className="doc-status-pill-group p-1" style={{ border: '2px solid #cbd5e1' }}>
                  <button
                    type="button"
                    className={`btn btn-sm px-3 fw-bold rounded-pill transition-all ${isOnline ? 'btn-success text-white shadow-sm' : 'btn-light text-muted'}`}
                    style={{ backgroundColor: isOnline ? '#10b981' : 'transparent', minWidth: '95px' }}
                    onClick={() => handleSetDoctorStatus('online')}
                  >
                    ● Online
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm px-3 fw-bold rounded-pill transition-all ${!isOnline ? 'btn-secondary text-white shadow-sm' : 'btn-light text-muted'}`}
                    style={{ backgroundColor: !isOnline ? '#64748b' : 'transparent', minWidth: '95px' }}
                    onClick={() => handleSetDoctorStatus('offline')}
                  >
                    ○ Offline
                  </button>
                </div>

                {/* Subtitle Indicator directly below toggle */}
                <div className="small mt-1 fw-bold" style={{ fontSize: '0.76rem' }}>
                  {isOnline ? (
                    <span className="text-success d-flex align-items-center gap-1">
                      <span className="badge bg-success p-1 rounded-circle"></span>
                      <span>Currently Available</span>
                    </span>
                  ) : (
                    <span className="text-secondary d-flex align-items-center gap-1">
                      <span className="badge bg-secondary p-1 rounded-circle"></span>
                      <span>Currently Offline</span>
                    </span>
                  )}
                </div>
              </div>

            </div>

          </div>

          {/* Additional Status Quick Switcher (In Consultation, Emergency Duty, On Leave, Off Duty) */}
          <div className="d-flex align-items-center gap-2 flex-wrap pt-2 mt-2 border-top">
            <span className="text-muted small fw-bold">Clinical Duty Mode:</span>
            
            <button
              type="button"
              className={`btn btn-sm py-0 px-2 rounded-pill ${currentDoc.onlineStatus === 'in_consultation' ? 'btn-primary text-white fw-bold shadow-sm' : 'btn-outline-primary'}`}
              onClick={() => handleSetDoctorStatus('in_consultation')}
            >
              🔵 In Consultation
            </button>

            <button
              type="button"
              className={`btn btn-sm py-0 px-2 rounded-pill ${currentDoc.onlineStatus === 'emergency_duty' ? 'btn-danger text-white fw-bold shadow-sm' : 'btn-outline-danger'}`}
              onClick={() => handleSetDoctorStatus('emergency_duty')}
            >
              🔴 Emergency Duty
            </button>

            <button
              type="button"
              className={`btn btn-sm py-0 px-2 rounded-pill ${currentDoc.onlineStatus === 'on_leave' ? 'btn-warning text-dark fw-bold shadow-sm' : 'btn-outline-warning text-dark'}`}
              onClick={() => handleSetDoctorStatus('on_leave')}
            >
              🟡 On Leave
            </button>

            <button
              type="button"
              className={`btn btn-sm py-0 px-2 rounded-pill ${currentDoc.onlineStatus === 'off_duty' ? 'btn-secondary text-white fw-bold shadow-sm' : 'btn-outline-secondary'}`}
              onClick={() => handleSetDoctorStatus('off_duty')}
            >
              ⚪ Off Duty
            </button>
          </div>

        </div>

        {/* Global Feedback Banner */}
        {lastVerifiedAlert && (
          <div className="alert alert-success d-flex align-items-center gap-2 shadow-sm py-2 px-3 mb-4 animate__animated animate__fadeIn">
            <CheckCircle2 size={18} className="text-success flex-shrink-0" />
            <div className="fw-bold small">{lastVerifiedAlert}</div>
          </div>
        )}

        {/* ========================================================
            PAGE 2: DOCTOR DASHBOARD VIEW (MATCHES FIGMA DESIGN SHEET)
            ======================================================== */}
        {activeTab === 'dashboard' && (
          <div>
            
            {/* TOP 3 STAT CARDS (EXACT MATCH TO DESIGN SHEET) + 4th QUEUE CARD */}
            <div className="row g-3 mb-4">
              
              {/* Card 1: Today's Duty */}
              <div className="col-12 col-sm-6 col-lg-3">
                <div className="doc-metric-card h-100">
                  <div className="doc-metric-icon bg-primary bg-opacity-10 text-primary">
                    <Stethoscope size={24} />
                  </div>
                  <div>
                    <div className="text-muted small fw-bold">Today's Duty</div>
                    <div className="fw-bold fs-5 text-dark lh-sm">{currentDoc.dutyHours || '09:00 AM – 05:00 PM'}</div>
                    <div className="text-muted small">({currentDoc.department || 'General Medicine'})</div>
                  </div>
                </div>
              </div>

              {/* Card 2: Next Check-in */}
              <div className="col-12 col-sm-6 col-lg-3">
                <div className="doc-metric-card h-100">
                  <div className="doc-metric-icon bg-success bg-opacity-10 text-success">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <div className="text-muted small fw-bold">Next Check-in</div>
                    <div className="fw-bold fs-5 text-success lh-sm">{currentDoc.nextCheckIn || 'in 58 min'}</div>
                    <div className="text-muted small">(10:00 AM)</div>
                  </div>
                </div>
              </div>

              {/* Card 3: Last Updated */}
              <div className="col-12 col-sm-6 col-lg-3">
                <div className="doc-metric-card h-100">
                  <div className="doc-metric-icon bg-info bg-opacity-10 text-info">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <div className="text-muted small fw-bold">Last Updated</div>
                    <div className="fw-bold fs-5 text-dark lh-sm">{currentDoc.lastCheckInTime || '09:02 AM'}</div>
                    <div className="text-muted small">02 Nov 2026</div>
                  </div>
                </div>
              </div>

              {/* Card 4: Waiting Patients / Queue */}
              <div className="col-12 col-sm-6 col-lg-3">
                <div className="doc-metric-card h-100">
                  <div className="doc-metric-icon bg-warning bg-opacity-10 text-warning">
                    <Users size={24} />
                  </div>
                  <div>
                    <div className="text-muted small fw-bold">Waiting Patients</div>
                    <div className="fw-bold fs-5 text-dark lh-sm">{waitingAppts.length} In Queue</div>
                    <div className="text-muted small">Completed: {completedAppts.length} Today</div>
                  </div>
                </div>
              </div>

            </div>

            {/* Middle Row: Weekly Duty Schedule Preview + Quick Actions */}
            <div className="row g-4 mb-4">
              
              {/* Weekly Duty Schedule Preview (Matches Design Sheet Left Column) */}
              <div className="col-lg-8">
                <div className="card border-0 shadow-sm rounded-4 h-100">
                  <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center border-bottom">
                    <div className="d-flex align-items-center gap-2">
                      <Calendar size={18} className="text-primary" />
                      <h6 className="fw-bold mb-0 text-dark">Weekly Duty Schedule</h6>
                    </div>
                    <button
                      type="button"
                      className="btn btn-link btn-sm text-decoration-none text-primary p-0 fw-bold d-flex align-items-center gap-1"
                      onClick={() => setActiveTab('schedule')}
                    >
                      <span>View Full Schedule</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>

                  <div className="card-body p-0">
                    <div className="table-responsive">
                      <table className="table table-hover align-middle mb-0">
                        <thead className="table-light small">
                          <tr>
                            <th className="ps-4">Day</th>
                            <th>Duty Timing</th>
                            <th>Department</th>
                            <th className="text-end pe-4">Duty Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            { day: 'Mon', dutyTime: '09:00 AM – 05:00 PM', department: 'General Medicine' },
                            { day: 'Tue', dutyTime: '09:00 AM – 05:00 PM', department: 'General Medicine' },
                            { day: 'Wed', dutyTime: '09:00 AM – 05:00 PM', department: 'General Medicine' },
                            { day: 'Thu', dutyTime: '09:00 AM – 05:00 PM', department: 'General Medicine' },
                            { day: 'Fri', dutyTime: '09:00 AM – 01:00 PM', department: 'OPD' },
                            { day: 'Sat', dutyTime: '09:00 AM – 01:00 PM', department: 'OPD' },
                            { day: 'Sun', dutyTime: 'Holiday', department: '-' }
                          ].map((sched, idx) => {
                            const isToday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date().getDay()] === sched.day;
                            const isHoliday = sched.dutyTime.toLowerCase().includes('holiday') || sched.dutyTime === 'Off';

                            return (
                              <tr key={idx} className={isToday ? 'table-primary table-opacity-10 fw-semibold' : ''}>
                                <td className="ps-4">
                                  <span className={`badge ${isToday ? 'bg-primary' : 'bg-light text-dark border'}`}>
                                    {sched.day}
                                  </span>
                                  {isToday && <span className="ms-2 text-primary small">(Today)</span>}
                                </td>
                                <td className="text-dark">{sched.dutyTime}</td>
                                <td>{sched.department}</td>
                                <td className="text-end pe-4">
                                  {isHoliday ? (
                                    <span className="badge bg-secondary-subtle text-secondary">Weekly Off</span>
                                  ) : (
                                    <span className="badge bg-success-subtle text-success">Active Shift</span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions 2x2 Grid (Matches Design Sheet Right Column) */}
              <div className="col-lg-4">
                <div className="card border-0 shadow-sm rounded-4 h-100">
                  <div className="card-header bg-white py-3 border-bottom">
                    <h6 className="fw-bold mb-0 text-dark">Quick Actions</h6>
                  </div>
                  <div className="card-body p-3">
                    <div className="row g-2">
                      
                      {/* Action 1: Upload Hourly Photo */}
                      <div className="col-6">
                        <div
                          className="doc-action-tile h-100"
                          onClick={() => {
                            setActiveTab('attendance');
                            window.scrollTo({ top: 300, behavior: 'smooth' });
                          }}
                        >
                          <div className="bg-primary bg-opacity-10 text-primary p-3 rounded-circle mb-1">
                            <Camera size={22} />
                          </div>
                          <span className="fw-bold small text-dark">Upload Hourly Photo</span>
                          <span className="text-muted" style={{ fontSize: '0.72rem' }}>Camera & GPS</span>
                        </div>
                      </div>

                      {/* Action 2: Request Leave */}
                      <div className="col-6">
                        <div
                          className="doc-action-tile h-100"
                          onClick={() => setLeaveModalOpen(true)}
                        >
                          <div className="bg-warning bg-opacity-10 text-warning p-3 rounded-circle mb-1">
                            <Calendar size={22} />
                          </div>
                          <span className="fw-bold small text-dark">Request Leave</span>
                          <span className="text-muted" style={{ fontSize: '0.72rem' }}>Apply off-duty</span>
                        </div>
                      </div>

                      {/* Action 3: View Attendance */}
                      <div className="col-6">
                        <div
                          className="doc-action-tile h-100"
                          onClick={() => setActiveTab('attendance')}
                        >
                          <div className="bg-info bg-opacity-10 text-info p-3 rounded-circle mb-1">
                            <FileText size={22} />
                          </div>
                          <span className="fw-bold small text-dark">View Attendance</span>
                          <span className="text-muted" style={{ fontSize: '0.72rem' }}>Past GPS logs</span>
                        </div>
                      </div>

                      {/* Action 4: View Reports / OP Queue */}
                      <div className="col-6">
                        <div
                          className="doc-action-tile h-100"
                          onClick={() => setActiveTab('op_queue')}
                        >
                          <div className="bg-success bg-opacity-10 text-success p-3 rounded-circle mb-1">
                            <BarChart3 size={22} />
                          </div>
                          <span className="fw-bold small text-dark">View Reports</span>
                          <span className="text-muted" style={{ fontSize: '0.72rem' }}>{waitingAppts.length} In Queue</span>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Row: 3 FIGMA DESIGN CARDS: My Profile | Hourly Attendance | Schedule Overview */}
            <div className="row g-3 mb-4">
              
              {/* CARD 1: MY PROFILE (Bottom-Left in Figma Design Sheet) */}
              <div className="col-lg-4 col-md-6">
                <div className="card border-0 shadow-sm rounded-4 p-3 h-100 bg-white">
                  <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                    <div className="d-flex align-items-center gap-2">
                      <div className="bg-primary bg-opacity-10 text-primary p-1 rounded-circle">
                        <User size={16} />
                      </div>
                      <h6 className="fw-bold mb-0 text-dark">My Profile</h6>
                    </div>
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm py-0 px-2 rounded-pill d-flex align-items-center gap-1"
                      style={{ fontSize: '0.75rem' }}
                      onClick={() => setEditProfileModalOpen(true)}
                    >
                      <Edit3 size={12} />
                      <span>Edit Profile</span>
                    </button>
                  </div>

                  <div className="row g-2 align-items-center">
                    <div className="col-4 text-center">
                      <img
                        src={currentDoc.avatar}
                        alt={currentDoc.name}
                        className="rounded-circle border border-2 border-primary shadow-sm mb-1"
                        width="70"
                        height="70"
                        style={{ objectFit: 'cover' }}
                      />
                      <div>
                        {isOnline ? (
                          <span className="doc-pill-status doc-pill-online" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
                            ● Online
                          </span>
                        ) : (
                          <span className="doc-pill-status doc-pill-offline" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
                            ⚪ Offline
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm py-0 px-1 mt-2 w-100 shadow-sm"
                        style={{ fontSize: '0.72rem' }}
                        onClick={() => setEditProfileModalOpen(true)}
                      >
                        Change Photo
                      </button>
                    </div>

                    <div className="col-8 ps-2" style={{ fontSize: '0.82rem' }}>
                      <h6 className="fw-bold text-dark mb-1 lh-sm">{currentDoc.name}</h6>
                      
                      <div className="d-flex justify-content-between py-1 border-bottom">
                        <span className="text-muted">Doctor ID :</span>
                        <strong className="text-dark">{currentDoc.id}</strong>
                      </div>
                      <div className="d-flex justify-content-between py-1 border-bottom">
                        <span className="text-muted">Designation :</span>
                        <strong className="text-dark text-truncate ms-1" title={currentDoc.designation}>{currentDoc.designation}</strong>
                      </div>
                      <div className="d-flex justify-content-between py-1 border-bottom">
                        <span className="text-muted">Department :</span>
                        <strong className="text-dark">{currentDoc.department}</strong>
                      </div>
                      <div className="d-flex justify-content-between py-1 border-bottom">
                        <span className="text-muted">Qualification :</span>
                        <strong className="text-primary">{currentDoc.qualification}</strong>
                      </div>
                      <div className="d-flex justify-content-between py-1 border-bottom">
                        <span className="text-muted">Specialization :</span>
                        <span className="text-dark">{currentDoc.specialization}</span>
                      </div>
                      <div className="d-flex justify-content-between py-1 border-bottom">
                        <span className="text-muted">Experience :</span>
                        <span className="text-dark">{currentDoc.experience || '8 Years'}</span>
                      </div>
                      <div className="d-flex justify-content-between pt-1">
                        <span className="text-muted">Hospital :</span>
                        <span className="text-dark text-truncate ms-1" title={currentDoc.hospitalName}>Govt. MGM Hospital</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD 2: HOURLY ATTENDANCE (Bottom-Middle in Figma Design Sheet) */}
              <div className="col-lg-4 col-md-6">
                <div className="card border-0 shadow-sm rounded-4 p-3 h-100 bg-white">
                  <div className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
                    <div className="d-flex align-items-center gap-2">
                      <div className="bg-primary bg-opacity-10 text-primary p-1 rounded-circle">
                        <Camera size={16} />
                      </div>
                      <h6 className="fw-bold mb-0 text-dark">Hourly Attendance</h6>
                    </div>
                    <span className="badge bg-success-subtle text-success py-1 px-2" style={{ fontSize: '0.7rem' }}>
                      GPS Geofence
                    </span>
                  </div>

                  <div className="alert alert-info py-1 px-2 small mb-2 d-flex align-items-center gap-2 rounded-2" style={{ fontSize: '0.74rem' }}>
                    <AlertCircle size={14} className="text-info flex-shrink-0" />
                    <span>Please capture a fresh photo with GPS location for verification.</span>
                  </div>

                  <div className="row g-2 align-items-center">
                    {/* Live Camera Viewport */}
                    <div className="col-6">
                      <div className="doc-mini-camera-box">
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          muted
                          style={{
                            display: cameraActive ? 'block' : 'none',
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                        <img
                          src={capturedSelfie || currentDoc.avatar}
                          alt="Doctor Live Camera"
                          style={{
                            display: !cameraActive ? 'block' : 'none',
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                        <div className="doc-live-badge" style={{ fontSize: '0.65rem', padding: '1px 6px' }}>
                          ● LIVE
                        </div>
                        <div className="doc-mini-reticle" />
                      </div>
                    </div>

                    {/* Location Details & Timestamp */}
                    <div className="col-6 ps-2" style={{ fontSize: '0.78rem' }}>
                      <div className="d-flex align-items-center gap-1 fw-bold text-dark mb-1">
                        <MapPin size={13} className="text-primary flex-shrink-0" />
                        <span>Location Details</span>
                      </div>
                      <div className="text-muted ms-2 lh-sm">
                        <div>Lat: <strong className="text-dark">17.9818</strong></div>
                        <div>Lng: <strong className="text-dark">79.5960</strong></div>
                        <div>Accuracy: <strong className="text-dark">±5 m</strong></div>
                        <div className="text-success fw-bold mt-1 d-flex align-items-center gap-1">
                          <Check size={12} /> Within Hospital Area
                        </div>
                      </div>

                      <div className="d-flex align-items-center gap-1 fw-bold text-dark mt-2 mb-1">
                        <Clock size={13} className="text-secondary flex-shrink-0" />
                        <span>Timestamp</span>
                      </div>
                      <div className="text-muted ms-2 lh-sm">
                        <strong className="text-dark">{currentTimeStr || '02 Nov 2026, 10:02 AM'}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Capture & Submit Button */}
                  <button
                    type="button"
                    className="btn btn-primary w-100 py-2 mt-3 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-sm"
                    style={{ fontSize: '0.85rem' }}
                    onClick={handleCaptureLiveAttendance}
                    disabled={isVerifying}
                  >
                    <Camera size={16} />
                    <span>{isVerifying ? 'Verifying Presence...' : 'Capture & Submit'}</span>
                  </button>
                </div>
              </div>

              {/* CARD 3: SCHEDULE OVERVIEW (Bottom-Right in Figma Design Sheet) */}
              <div className="col-lg-4 col-md-12">
                <div className="card border-0 shadow-sm rounded-4 p-3 h-100 bg-white">
                  <div className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
                    <div className="d-flex align-items-center gap-2">
                      <div className="bg-primary bg-opacity-10 text-primary p-1 rounded-circle">
                        <Calendar size={16} />
                      </div>
                      <h6 className="fw-bold mb-0 text-dark">Schedule Overview</h6>
                    </div>
                    <select className="form-select form-select-sm py-0 px-2" style={{ width: 'auto', fontSize: '0.75rem' }}>
                      <option>This Week</option>
                      <option>Next Week</option>
                    </select>
                  </div>

                  {/* Doctor Roster matching Figma Design Sheet */}
                  <div className="d-flex flex-column gap-2" style={{ maxHeight: '250px', overflowY: 'auto' }}>
                    {(doctors || [
                      { id: 'DH-2026-001', name: 'Dr. Rajesh Kumar', department: 'General Medicine', onlineStatus: 'online', lastCheckInTime: '09:02 AM' },
                      { id: 'DH-2026-002', name: 'Dr. Sneha Patel', department: 'Pediatrics', onlineStatus: 'offline', lastCheckInTime: '08:45 AM' },
                      { id: 'DH-2026-003', name: 'Dr. Ahmed Khan', department: 'Cardiology', onlineStatus: 'in_consultation', lastCheckInTime: '09:10 AM' },
                      { id: 'DH-2026-004', name: 'Dr. Priya Sharma', department: 'Gynecology', onlineStatus: 'on_leave', lastCheckInTime: '-' },
                      { id: 'DH-2026-005', name: 'Dr. Vikram Singh', department: 'Orthopedics', onlineStatus: 'online', lastCheckInTime: '09:00 AM' }
                    ]).slice(0, 5).map((doc, idx) => {
                      const getStatusBadge = (status) => {
                        switch (status) {
                          case 'online':
                            return <span className="doc-pill-status doc-pill-online">● Online</span>;
                          case 'offline':
                            return <span className="doc-pill-status doc-pill-offline">● Offline</span>;
                          case 'in_consultation':
                            return <span className="doc-pill-status doc-pill-consultation">● In Consultation</span>;
                          case 'on_leave':
                            return <span className="doc-pill-status doc-pill-leave">● On Leave</span>;
                          default:
                            return <span className="doc-pill-status doc-pill-offline">● Off Duty</span>;
                        }
                      };

                      return (
                        <div
                          key={doc.id || idx}
                          className="doc-peer-row p-1 rounded-2"
                          style={{ cursor: 'pointer' }}
                          onClick={() => onSwitchDoctor && onSwitchDoctor(doc.id)}
                          title={`Click to switch active doctor to ${doc.name}`}
                        >
                          <div className="d-flex align-items-center gap-2">
                            <img
                              src={doc.avatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=100'}
                              alt={doc.name}
                              className="rounded-circle"
                              width="32"
                              height="32"
                              style={{ objectFit: 'cover' }}
                            />
                            <div>
                              <div className="fw-bold text-dark lh-sm" style={{ fontSize: '0.8rem' }}>{doc.name}</div>
                              <div className="text-muted" style={{ fontSize: '0.7rem' }}>{doc.department}</div>
                            </div>
                          </div>
                          
                          <div className="d-flex flex-column align-items-end">
                            {getStatusBadge(doc.onlineStatus)}
                            <div className="text-muted mt-1" style={{ fontSize: '0.68rem' }}>
                              {String(doc.lastCheckInTime || '').split(' ')[0] || '-'}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ========================================================
            PAGE 1: DOCTOR REGISTRATION (5 Comprehensive Sections)
            ======================================================== */}
        {activeTab === 'registration' && (
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
            
            <div className="bg-light px-4 py-3 border-bottom d-flex justify-content-between align-items-center">
              <div>
                <h5 className="fw-bold text-dark mb-0">Government Hospital Doctor Registration</h5>
                <small className="text-muted">Govt. Mahatma Gandhi Memorial (MGM) Hospital, Warangal &bull; Official Staff Onboarding</small>
              </div>
              <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setActiveTab('dashboard')}>
                Back to Dashboard
              </button>
            </div>

            <div className="p-4 p-xl-5 bg-white">
              
              <div className="alert alert-info bg-info bg-opacity-10 border-info border-opacity-25 py-3 px-4 rounded-3 mb-4 small d-flex align-items-center gap-3">
                <HelpCircle size={24} className="text-info flex-shrink-0" />
                <div>
                  <strong className="d-block text-dark">Important Hospital Administrative Policy:</strong>
                  Upon submitting this registration, your credentials, Medical Council number, and certificates will be submitted to the Medical Superintendent for verification. Your account will remain in <strong>"Pending Approval"</strong> status until authorized by a hospital administrator.
                </div>
              </div>

              <div className="row g-4 align-items-stretch">
                
                {/* LEFT COLUMN: FIGMA DESIGN HERO ILLUSTRATION */}
                <div className="col-lg-4 d-none d-lg-block">
                  <div className="doc-reg-hero-box h-100 p-4">
                    <div className="text-center my-auto">
                      <div className="p-4 bg-white rounded-circle d-inline-flex align-items-center justify-content-center shadow-sm mb-4" style={{ width: '130px', height: '130px' }}>
                        <Stethoscope size={64} className="text-primary" />
                      </div>
                      <h3 className="fw-bold text-dark mb-2">Register as Doctor</h3>
                      <p className="text-secondary small mb-4 px-2">
                        Join our hospital team and manage your profile, attendance and schedule.
                      </p>

                      <div className="bg-white bg-opacity-80 p-3 rounded-3 border text-start small">
                        <div className="fw-bold text-dark mb-1 d-flex align-items-center gap-1">
                          <ShieldCheck size={16} className="text-success" />
                          <span>Govt. MGM Hospital Warangal:</span>
                        </div>
                        <ul className="mb-0 ps-3 text-muted" style={{ fontSize: '0.78rem' }}>
                          <li>State Medical Council registration verification</li>
                          <li>Automatic DH-2026 Doctor ID generation</li>
                          <li>Hospital Admin Medical Superintendent authorization</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN: REGISTRATION FORM */}
                <div className="col-lg-8">
                  <form onSubmit={handleRegisterDoctorSubmit}>
                    
                    {/* SECTION 1: PERSONAL INFORMATION */}
                    <div className="mb-4">
                      <div className="d-flex align-items-center gap-2 pb-2 mb-3 border-bottom">
                        <User size={18} className="text-primary" />
                        <h6 className="fw-bold text-dark mb-0">Doctor Registration & Personal Information</h6>
                      </div>

                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Full Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Dr. Full Name"
                        value={regForm.name}
                        onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-md-3">
                      <label className="form-label small fw-bold">Date of Birth *</label>
                      <input
                        type="date"
                        className="form-control"
                        value={regForm.dob}
                        onChange={(e) => setRegForm({ ...regForm, dob: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-md-3">
                      <label className="form-label small fw-bold">Gender *</label>
                      <select
                        className="form-select"
                        value={regForm.gender}
                        onChange={(e) => setRegForm({ ...regForm, gender: e.target.value })}
                      >
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Mobile Number (10 Digits) *</label>
                      <input
                        type="tel"
                        className="form-control"
                        placeholder="9876543210"
                        maxLength="10"
                        value={regForm.mobile}
                        onChange={(e) => setRegForm({ ...regForm, mobile: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Official Email Address *</label>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="doctor@mgmhospital.gov.in"
                        value={regForm.email}
                        onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-bold">Residential / Chamber Address *</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="H.No, Street, Locality, Warangal, Telangana"
                        value={regForm.address}
                        onChange={(e) => setRegForm({ ...regForm, address: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION 2: PROFESSIONAL INFORMATION */}
                <div className="mb-4">
                  <div className="d-flex align-items-center gap-2 pb-2 mb-3 border-bottom">
                    <Award size={18} className="text-primary" />
                    <h6 className="fw-bold text-dark mb-0">2. Professional Information</h6>
                  </div>

                  <div className="row g-3">
                    <div className="col-md-4">
                      <label className="form-label small fw-bold">Doctor ID (Auto-Generated)</label>
                      <input
                        type="text"
                        className="form-control bg-light"
                        value={regForm.id}
                        readOnly
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-bold">Medical Registration Number *</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. TSMC/2026/48921"
                        value={regForm.medicalRegNumber}
                        onChange={(e) => setRegForm({ ...regForm, medicalRegNumber: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-bold">Qualification *</label>
                      <select
                        className="form-select"
                        value={regForm.qualification}
                        onChange={(e) => setRegForm({ ...regForm, qualification: e.target.value })}
                      >
                        <option>MBBS</option>
                        <option>MBBS, MD</option>
                        <option>MBBS, MS</option>
                        <option>MBBS, DNB</option>
                        <option>MBBS, MD, DM</option>
                        <option>MBBS, MS, MCh</option>
                      </select>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-bold">Specialization *</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Internal Medicine / Cardiology"
                        value={regForm.specialization}
                        onChange={(e) => setRegForm({ ...regForm, specialization: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-bold">Years of Experience *</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. 6 Years"
                        value={regForm.experience}
                        onChange={(e) => setRegForm({ ...regForm, experience: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-bold">Designation *</label>
                      <select
                        className="form-select"
                        value={regForm.designation}
                        onChange={(e) => setRegForm({ ...regForm, designation: e.target.value })}
                      >
                        <option>Senior Medical Officer</option>
                        <option>Assistant Professor</option>
                        <option>Associate Professor</option>
                        <option>Professor & HOD</option>
                        <option>Resident Medical Officer (RMO)</option>
                        <option>Casualty Medical Officer (CMO)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* SECTION 3: HOSPITAL INFORMATION */}
                <div className="mb-4">
                  <div className="d-flex align-items-center gap-2 pb-2 mb-3 border-bottom">
                    <Building size={18} className="text-primary" />
                    <h6 className="fw-bold text-dark mb-0">3. Hospital Information</h6>
                  </div>

                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Hospital Name</label>
                      <input
                        type="text"
                        className="form-control bg-light"
                        value="Govt. MGM Hospital, Warangal"
                        readOnly
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Department *</label>
                      <select
                        className="form-select"
                        value={regForm.department}
                        onChange={(e) => {
                          const dep = departments.find(d => d.name === e.target.value);
                          setRegForm({
                            ...regForm,
                            department: e.target.value,
                            departmentId: dep ? dep.id : 'DEP-GEN'
                          });
                        }}
                      >
                        {departments.map((dep) => (
                          <option key={dep.id} value={dep.name}>{dep.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-bold">Assigned Hospital Location / Chamber *</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Chamber 110 (Ground Floor OPD)"
                        value={regForm.assignedLocation}
                        onChange={(e) => setRegForm({ ...regForm, assignedLocation: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-bold">Department Head</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Dr. P. Srinivas Rao, Prof & HOD"
                        value={regForm.departmentHead}
                        onChange={(e) => setRegForm({ ...regForm, departmentHead: e.target.value })}
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-bold">Employment Type *</label>
                      <select
                        className="form-select"
                        value={regForm.employmentType}
                        onChange={(e) => setRegForm({ ...regForm, employmentType: e.target.value })}
                      >
                        <option>Permanent State Govt</option>
                        <option>Teaching Faculty (KMC)</option>
                        <option>Contract Specialist</option>
                        <option>Postgraduate Resident</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* SECTION 4: DUTY INFORMATION */}
                <div className="mb-4">
                  <div className="d-flex align-items-center gap-2 pb-2 mb-3 border-bottom">
                    <Clock size={18} className="text-primary" />
                    <h6 className="fw-bold text-dark mb-0">4. Duty & Shift Information</h6>
                  </div>

                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold d-block">Working Days *</label>
                      <div className="d-flex flex-wrap gap-2">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => {
                          const isSelected = regForm.days.includes(day);
                          return (
                            <button
                              key={day}
                              type="button"
                              className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-outline-secondary'}`}
                              onClick={() => {
                                const newDays = isSelected
                                  ? regForm.days.filter(d => d !== day)
                                  : [...regForm.days, day];
                                setRegForm({ ...regForm, days: newDays });
                              }}
                            >
                              {isSelected && <Check size={13} className="d-inline me-1" />}
                              {day}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Weekly Off *</label>
                      <select
                        className="form-select"
                        value={regForm.weeklyOff}
                        onChange={(e) => setRegForm({ ...regForm, weeklyOff: e.target.value })}
                      >
                        <option>Sunday</option>
                        <option>Saturday</option>
                        <option>Wednesday</option>
                        <option>Saturday & Sunday</option>
                      </select>
                    </div>

                    <div className="col-md-3">
                      <label className="form-label small fw-bold">Morning Shift</label>
                      <input
                        type="text"
                        className="form-control"
                        value={regForm.morningShift}
                        onChange={(e) => setRegForm({ ...regForm, morningShift: e.target.value })}
                      />
                    </div>

                    <div className="col-md-3">
                      <label className="form-label small fw-bold">Afternoon Shift</label>
                      <input
                        type="text"
                        className="form-control"
                        value={regForm.afternoonShift}
                        onChange={(e) => setRegForm({ ...regForm, afternoonShift: e.target.value })}
                      />
                    </div>

                    <div className="col-md-3">
                      <label className="form-label small fw-bold">Night Shift</label>
                      <input
                        type="text"
                        className="form-control"
                        value={regForm.nightShift}
                        onChange={(e) => setRegForm({ ...regForm, nightShift: e.target.value })}
                      />
                    </div>

                    <div className="col-md-3">
                      <label className="form-label small fw-bold">OPD Timings</label>
                      <input
                        type="text"
                        className="form-control"
                        value={regForm.opdTimings}
                        onChange={(e) => setRegForm({ ...regForm, opdTimings: e.target.value })}
                      />
                    </div>

                    <div className="col-md-6">
                      <div className="form-check form-switch p-3 bg-light rounded-3 border">
                        <input
                          className="form-check-input ms-0 me-3"
                          type="checkbox"
                          id="regEmergencyDuty"
                          checked={regForm.emergencyDuty}
                          onChange={(e) => setRegForm({ ...regForm, emergencyDuty: e.target.checked })}
                        />
                        <label className="form-check-label fw-bold small text-dark" htmlFor="regEmergencyDuty">
                          Available for Casualty Emergency Duty
                        </label>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-check form-switch p-3 bg-light rounded-3 border">
                        <input
                          className="form-check-input ms-0 me-3"
                          type="checkbox"
                          id="regOnCall"
                          checked={regForm.onCallAvailability}
                          onChange={(e) => setRegForm({ ...regForm, onCallAvailability: e.target.checked })}
                        />
                        <label className="form-check-label fw-bold small text-dark" htmlFor="regOnCall">
                          24/7 On-Call Medical Availability
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SECTION 5: DOCUMENTS UPLOAD */}
                <div className="mb-4">
                  <div className="d-flex align-items-center gap-2 pb-2 mb-3 border-bottom">
                    <FileText size={18} className="text-primary" />
                    <h6 className="fw-bold text-dark mb-0">5. Credential Verification Documents</h6>
                  </div>

                  <div className="row g-3">
                    <div className="col-md-3">
                      <div className="p-3 border rounded-3 text-center bg-light">
                        <FileCheck size={24} className="text-primary mb-1" />
                        <div className="small fw-bold">1. Medical Reg. Certificate</div>
                        <span className="badge bg-success-subtle text-success small mt-1">Uploaded &bull; TSMC</span>
                      </div>
                    </div>

                    <div className="col-md-3">
                      <div className="p-3 border rounded-3 text-center bg-light">
                        <Award size={24} className="text-primary mb-1" />
                        <div className="small fw-bold">2. Qualification Degrees</div>
                        <span className="badge bg-success-subtle text-success small mt-1">Uploaded &bull; MBBS/MD</span>
                      </div>
                    </div>

                    <div className="col-md-3">
                      <div className="p-3 border rounded-3 text-center bg-light">
                        <Briefcase size={24} className="text-primary mb-1" />
                        <div className="small fw-bold">3. Govt. Employee ID</div>
                        <span className="badge bg-success-subtle text-success small mt-1">Uploaded &bull; DME ID</span>
                      </div>
                    </div>

                    <div className="col-md-3">
                      <div className="p-3 border rounded-3 text-center bg-light">
                        <Camera size={24} className="text-primary mb-1" />
                        <div className="small fw-bold">4. Profile Photograph</div>
                        <span className="badge bg-success-subtle text-success small mt-1">Chamber Selfie Attached</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SUBMIT BUTTON */}
                <div className="text-end pt-3 border-top">
                  <button type="submit" className="btn btn-primary btn-lg fw-bold px-5 shadow-sm">
                    Register Doctor
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>

          </div>
        )}

        {/* ========================================================
            PAGE 3: WEEKLY DUTY SCHEDULE & SHIFT CALENDAR
            ======================================================== */}
        {activeTab === 'schedule' && (
          <div className="card border-0 shadow-sm rounded-4 mb-4">
            <div className="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center flex-wrap gap-2">
              <div>
                <h5 className="fw-bold mb-0 text-dark">Weekly Duty Schedule & Shift Timings</h5>
                <small className="text-muted">Physician Roster: {currentDoc.name} &bull; {currentDoc.department} &bull; Chamber: {currentDoc.assignedLocation || currentDoc.roomNo}</small>
              </div>
              <button
                type="button"
                className="btn btn-warning btn-sm fw-bold d-flex align-items-center gap-1 shadow-sm"
                onClick={() => setScheduleChangeModalOpen(true)}
              >
                <Clock size={15} />
                <span>Request Schedule Change</span>
              </button>
            </div>

            <div className="card-body p-4">
              
              <div className="alert alert-primary bg-primary bg-opacity-10 border-primary border-opacity-25 py-2 px-3 small rounded-3 mb-4 d-flex align-items-center gap-2">
                <AlertCircle size={18} className="text-primary flex-shrink-0" />
                <span>Duty schedules are configured and authorized by the Hospital Administration. Any requested adjustments require administrative verification.</span>
              </div>

              {/* 7-Day Calendar Grid */}
              <div className="row g-3">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((dayName) => {
                  const dayCode = dayName.slice(0, 3);
                  const sched = (currentDoc.weeklySchedule || []).find(s => s.day === dayCode) || {
                    day: dayCode,
                    dutyTime: dayCode === 'Sun' ? 'Holiday' : '09:00 AM - 05:00 PM',
                    department: currentDoc.department
                  };
                  const isToday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date().getDay()] === dayCode;
                  const isOff = sched.dutyTime === 'Holiday' || sched.dutyTime === 'Off';

                  return (
                    <div key={dayName} className="col-md-4 col-sm-6">
                      <div className={`p-3 rounded-4 border h-100 ${isToday ? 'border-primary border-2 shadow-sm bg-white' : 'bg-light'}`}>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <strong className="text-dark">{dayName}</strong>
                          {isToday && <span className="badge bg-primary">Today</span>}
                          {isOff && <span className="badge bg-secondary-subtle text-secondary">Weekly Off</span>}
                        </div>

                        <div className="small mb-2">
                          <div className="text-muted">Duty Hours:</div>
                          <div className="fw-bold text-dark">{sched.dutyTime}</div>
                        </div>

                        <div className="small mb-2">
                          <div className="text-muted">Clinical Assignment:</div>
                          <div className="fw-semibold text-primary">{sched.department}</div>
                        </div>

                        <div className="pt-2 border-top d-flex gap-1 flex-wrap">
                          {currentDoc.dutyShifts?.emergencyDuty && dayCode !== 'Sun' && (
                            <span className="badge bg-danger-subtle text-danger" style={{ fontSize: '0.68rem' }}>Emergency Covered</span>
                          )}
                          {currentDoc.dutyShifts?.onCallAvailability && (
                            <span className="badge bg-info-subtle text-info" style={{ fontSize: '0.68rem' }}>On-Call</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>
        )}

        {/* ========================================================
            PAGE 4: LIVE ATTENDANCE AND GPS VERIFICATION
            ======================================================== */}
        {activeTab === 'attendance' && (
          <div className="card border-0 shadow-sm rounded-4 mb-4">
            <div className="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center flex-wrap gap-2">
              <div>
                <h5 className="fw-bold mb-0 text-dark">Live Camera Attendance & GPS Geofence Verification</h5>
                <small className="text-muted">Govt. MGM Hospital Warangal Anti-Absenteeism Chamber Telemetry & Bullseye Geofence</small>
              </div>
              <span className="badge bg-success-subtle text-success border px-3 py-2">
                <ShieldCheck size={16} className="d-inline me-1" /> Geofence Locked (±5m)
              </span>
            </div>

            <div className="card-body p-4">
              
              <div className="row g-4 align-items-center mb-4">
                
                {/* Camera Viewport (Fresh Live Capture Only - No Gallery Upload) */}
                <div className="col-lg-5 text-center">
                  <div className="doc-camera-viewport mb-3 shadow" style={{ maxWidth: '380px', height: '280px' }}>
                    <div className="doc-live-badge">
                      <span style={{ fontSize: '0.55rem' }}>●</span> LIVE CAMERA
                    </div>

                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      style={{
                        display: cameraActive ? 'block' : 'none',
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                    {!cameraActive && (
                      <img
                        src={capturedSelfie || currentDoc.avatar}
                        alt="Doctor Camera View"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    )}

                    <div className="doc-face-reticle" />
                  </div>

                  <button
                    type="button"
                    className="btn btn-primary btn-lg w-100 py-3 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-sm"
                    style={{ maxWidth: '380px', margin: '0 auto' }}
                    onClick={handleCaptureLiveAttendance}
                    disabled={isVerifying}
                  >
                    {isVerifying ? (
                      <>
                        <RefreshCw size={20} className="spin" />
                        <span>Verifying GPS Geofence & Facial Liveness...</span>
                      </>
                    ) : (
                      <>
                        <Camera size={22} />
                        <span>Start Duty & Capture Live Verification</span>
                      </>
                    )}
                  </button>
                  <small className="text-muted mt-2 d-block" style={{ fontSize: '0.75rem' }}>
                    Fresh camera capture only &bull; Gallery uploads strictly prohibited for duty compliance.
                  </small>
                </div>

                {/* GPS Coordinates & Verification Details */}
                <div className="col-lg-7">
                  <div className="bg-light p-4 rounded-4 border">
                    <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                      <MapPin size={20} className="text-danger" />
                      <span>Live Geolocation Telemetry (Govt. MGM Hospital Campus)</span>
                    </h6>

                    <div className="row g-3 mb-3 small">
                      <div className="col-sm-6">
                        <div className="p-2 bg-white rounded border">
                          <span className="text-muted d-block">Current Latitude:</span>
                          <strong className="text-dark fs-6">17.9818° N</strong>
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="p-2 bg-white rounded border">
                          <span className="text-muted d-block">Current Longitude:</span>
                          <strong className="text-dark fs-6">79.5960° E</strong>
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="p-2 bg-white rounded border">
                          <span className="text-muted d-block">GPS Accuracy:</span>
                          <strong className="text-success fs-6">&plusmn; 5 Meters</strong>
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="p-2 bg-white rounded border">
                          <span className="text-muted d-block">Hospital Geofence:</span>
                          <span className="badge bg-success text-white">Within Campus Perimeter</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-white rounded border mb-3">
                      <div className="d-flex justify-content-between mb-1 small">
                        <span className="text-muted">Last Verified Photo:</span>
                        <strong className="text-dark">{currentDoc.lastCheckInTime || '09:02 AM Today'}</strong>
                      </div>
                      <div className="d-flex justify-content-between mb-1 small">
                        <span className="text-muted">Assigned Chamber:</span>
                        <strong className="text-primary">{currentDoc.assignedLocation || currentDoc.roomNo}</strong>
                      </div>
                      <div className="d-flex justify-content-between small">
                        <span className="text-muted">Next Hourly Verification Deadline:</span>
                        <span className="badge bg-warning text-dark">{currentDoc.nextCheckIn || 'in 58 min'}</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Previous Attendance History Audit Table */}
              <div className="mt-4 pt-3 border-top">
                <h6 className="fw-bold text-dark mb-3">Previous Attendance Verification Logs for Today</h6>
                <div className="table-responsive">
                  <table className="table table-hover align-middle small mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Timestamp</th>
                        <th>Chamber Live Photo</th>
                        <th>GPS Telemetry</th>
                        <th>Accuracy</th>
                        <th>Campus Geofence Status</th>
                        <th>Verification Method</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(store ? (store.getState().doctorCheckInLogs || []) : []).filter(l => l.doctorId === currentDoc.id).map((log, idx) => (
                        <tr key={idx}>
                          <td><strong>{log.timestamp}</strong> ({log.date})</td>
                          <td>
                            <img
                              src={log.selfieUrl}
                              alt="Log Snap"
                              className="rounded border"
                              width="45"
                              height="45"
                              style={{ objectFit: 'cover' }}
                            />
                          </td>
                          <td>
                            <div>{log.chamber}</div>
                            <small className="text-muted">Lat: {log.latitude}&deg; N, Lng: {log.longitude}&deg; E</small>
                          </td>
                          <td>&plusmn;{log.accuracyMeters} m</td>
                          <td>
                            <span className="badge bg-success-subtle text-success">
                              <Check size={12} className="me-1" /> Inside MGM Hospital Area
                            </span>
                          </td>
                          <td><span className="badge bg-light text-dark border">Face + Live Geofence</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ========================================================
            PAGE 5: DOCTOR PROFILE VIEW
            ======================================================== */}
        {activeTab === 'profile' && (
          <div className="card border-0 shadow-sm rounded-4 mb-4">
            <div className="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
              <div>
                <h5 className="fw-bold mb-0 text-dark">Official Government Doctor Credential Profile</h5>
                <small className="text-muted">Govt. MGM Hospital Warangal &bull; Medical Superintendent Verification Record</small>
              </div>
              <button
                type="button"
                className="btn btn-outline-primary btn-sm py-1 px-3 d-flex align-items-center gap-1"
                onClick={() => setEditProfileModalOpen(true)}
              >
                <Edit3 size={15} />
                <span>Edit Profile</span>
              </button>
            </div>

            <div className="card-body p-4">
              
              <div className="row g-4 align-items-center pb-4 mb-4 border-bottom">
                <div className="col-md-3 text-center">
                  <img
                    src={currentDoc.avatar}
                    alt={currentDoc.name}
                    className="rounded-circle border border-4 border-light shadow-sm mb-2"
                    width="120"
                    height="120"
                    style={{ objectFit: 'cover' }}
                  />
                  <div>
                    {isOnline ? (
                      <span className="badge bg-success text-white px-3 py-1">● Online (Available)</span>
                    ) : (
                      <span className="badge bg-secondary text-white px-3 py-1">⚪ Offline</span>
                    )}
                  </div>
                </div>

                <div className="col-md-9">
                  <h3 className="fw-bold text-dark mb-1">{currentDoc.name}</h3>
                  <div className="text-primary fs-6 fw-semibold mb-2">
                    {currentDoc.designation} &bull; {currentDoc.department}
                  </div>
                  <p className="text-muted small mb-3">
                    {currentDoc.specialization} &bull; {currentDoc.experience || '8 Years'} clinical practice &bull; {currentDoc.qualification}
                  </p>
                  <div className="d-flex gap-2 flex-wrap">
                    <span className="badge bg-primary-subtle text-primary border px-3 py-2">
                      Medical Reg: {currentDoc.medicalRegNumber || 'TSMC/2018/48921'}
                    </span>
                    <span className="badge bg-success-subtle text-success border px-3 py-2">
                      Employment: {currentDoc.employmentType || 'Permanent State Govt'}
                    </span>
                    <span className="badge bg-light text-dark border px-3 py-2">
                      Head of Dept: {currentDoc.departmentHead || 'Dr. P. Srinivas Rao, Prof & HOD'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Detailed Grid */}
              <div className="row g-4 mb-4">
                <div className="col-md-6">
                  <h6 className="fw-bold text-dark border-bottom pb-2 mb-3">Professional & Hospital Details</h6>
                  <div className="small">
                    <div className="d-flex justify-content-between py-2 border-bottom">
                      <span className="text-muted">Doctor ID:</span>
                      <strong className="text-dark">{currentDoc.id}</strong>
                    </div>
                    <div className="d-flex justify-content-between py-2 border-bottom">
                      <span className="text-muted">Assigned Chamber:</span>
                      <strong className="text-dark">{currentDoc.assignedLocation || currentDoc.roomNo}</strong>
                    </div>
                    <div className="d-flex justify-content-between py-2 border-bottom">
                      <span className="text-muted">Working Days:</span>
                      <span className="badge bg-light text-dark border">{currentDoc.days ? currentDoc.days.join(', ') : 'Mon - Sat'}</span>
                    </div>
                    <div className="d-flex justify-content-between py-2 border-bottom">
                      <span className="text-muted">Weekly Off:</span>
                      <strong className="text-dark">{currentDoc.dutyShifts?.weeklyOff || 'Sunday'}</strong>
                    </div>
                    <div className="d-flex justify-content-between py-2">
                      <span className="text-muted">OPD Consultation Hours:</span>
                      <strong className="text-primary">{currentDoc.dutyShifts?.opdTimings || '09:00 AM - 01:00 PM'}</strong>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <h6 className="fw-bold text-dark border-bottom pb-2 mb-3">Contact & Demographic Information</h6>
                  <div className="small">
                    <div className="d-flex justify-content-between py-2 border-bottom">
                      <span className="text-muted">Mobile Number:</span>
                      <strong className="text-dark">{currentDoc.mobile}</strong>
                    </div>
                    <div className="d-flex justify-content-between py-2 border-bottom">
                      <span className="text-muted">Official Email:</span>
                      <span className="text-dark">{currentDoc.email}</span>
                    </div>
                    <div className="d-flex justify-content-between py-2 border-bottom">
                      <span className="text-muted">Date of Birth:</span>
                      <span className="text-dark">{currentDoc.dob || '1986-08-14'}</span>
                    </div>
                    <div className="d-flex justify-content-between py-2 border-bottom">
                      <span className="text-muted">Gender:</span>
                      <span className="text-dark">{currentDoc.gender || 'Male'}</span>
                    </div>
                    <div className="d-flex justify-content-between py-2">
                      <span className="text-muted">Residential Address:</span>
                      <span className="text-dark text-end">{currentDoc.address || 'Hanamkonda, Warangal'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Verified Documents */}
              <div className="pt-3 border-top">
                <h6 className="fw-bold text-dark mb-3">Verified Credential Documents on File</h6>
                <div className="row g-3">
                  <div className="col-md-4">
                    <div className="p-3 border rounded-3 bg-light text-center">
                      <FileCheck size={28} className="text-primary mb-1" />
                      <div className="fw-bold small">State Medical Council Certificate</div>
                      <small className="text-muted d-block">{currentDoc.medicalRegNumber || 'TSMC/2018/48921'}</small>
                      <span className="badge bg-success-subtle text-success small mt-1">Verified Active</span>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="p-3 border rounded-3 bg-light text-center">
                      <Award size={28} className="text-primary mb-1" />
                      <div className="fw-bold small">MBBS & MD Degrees</div>
                      <small className="text-muted d-block">{currentDoc.qualification}</small>
                      <span className="badge bg-success-subtle text-success small mt-1">Certified Copy</span>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="p-3 border rounded-3 bg-light text-center">
                      <Briefcase size={28} className="text-primary mb-1" />
                      <div className="fw-bold small">DME Faculty / Govt. ID Card</div>
                      <small className="text-muted d-block">Govt. MGM Hospital Warangal</small>
                      <span className="badge bg-success-subtle text-success small mt-1">Official ID Active</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ========================================================
            OP QUEUE & CONSULTATIONS TAB
            ======================================================== */}
        {activeTab === 'op_queue' && (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
              <div>
                <h5 className="fw-bold text-dark mb-0">Today's OPD Patient Queue & Consultations</h5>
                <p className="text-muted small mb-0">{currentDoc.department} &bull; Chamber: {currentDoc.assignedLocation || currentDoc.roomNo}</p>
              </div>
              <button
                type="button"
                className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1"
                onClick={onScanQR}
              >
                <QrCode size={16} />
                <span>Scan Patient QR Pass</span>
              </button>
            </div>

            <div className="row g-4">
              <div className="col-lg-8">
                <div className="card border-0 shadow-sm rounded-4">
                  <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center border-bottom">
                    <span className="fw-bold text-dark">Active Waiting Patients ({waitingAppts.length})</span>
                    <span className="badge bg-primary">Live Token System</span>
                  </div>

                  <div className="card-body p-3">
                    {waitingAppts.length === 0 ? (
                      <div className="text-center py-5 text-muted">
                        <CheckCircle2 size={36} className="text-success mb-2" />
                        <div>No patients currently waiting in queue for {currentDoc.department}.</div>
                      </div>
                    ) : (
                      waitingAppts.map((appt) => {
                        const pat = patients.find(p => p.id === appt.patientId);
                        return (
                          <div key={appt.id} className="card p-3 mb-3 border d-flex flex-row justify-content-between align-items-center flex-wrap gap-3">
                            <div className="d-flex align-items-center gap-3">
                              <span className="badge bg-primary fs-5 px-3 py-2">Token #{appt.tokenNo}</span>
                              <div>
                                <h6 className="fw-bold text-dark mb-0">{pat?.fullName || 'Patient'}</h6>
                                <div className="text-muted small">
                                  PID: {pat?.id} &bull; Aadhaar: {pat?.aadharNumber} &bull; {pat?.age}Y / {pat?.gender}
                                </div>
                                <div className="text-secondary small fst-italic">
                                  Chief Complaint: "{appt.reason}"
                                </div>
                              </div>
                            </div>

                            <div className="d-flex gap-2">
                              <button
                                type="button"
                                className="btn btn-outline-secondary btn-sm"
                                onClick={() => onViewRecord && onViewRecord(pat?.id)}
                              >
                                View History
                              </button>
                              <button
                                type="button"
                                className="btn btn-primary btn-sm d-flex align-items-center gap-1"
                                onClick={() => {
                                  setActiveConsultAppt(appt);
                                  setConsultSymptoms(appt.reason || 'Generalized weakness, fever, body pains');
                                  setConsultDiagnosis('Acute Febrile Illness');
                                  setConsultModalOpen(true);
                                }}
                              >
                                <Stethoscope size={15} />
                                <span>Consult Patient</span>
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>

              <div className="col-lg-4">
                <div className="card border-0 shadow-sm rounded-4">
                  <div className="card-header bg-white py-3 border-bottom">
                    <h6 className="fw-bold mb-0 text-dark">Completed Today ({completedAppts.length})</h6>
                  </div>
                  <div className="card-body p-3">
                    {completedAppts.length === 0 ? (
                      <div className="text-muted small p-2">No completed consultations logged yet today.</div>
                    ) : (
                      completedAppts.map((a) => {
                        const p = patients.find(pat => pat.id === a.patientId);
                        return (
                          <div key={a.id} className="py-2 border-bottom d-flex justify-content-between align-items-center small">
                            <div>
                              <strong>Token #{a.tokenNo}: {p?.fullName || 'Patient'}</strong>
                              <div className="text-muted">{p?.id}</div>
                            </div>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-primary py-0 px-2"
                              onClick={() => onViewSlip && onViewSlip(a.id)}
                            >
                              Rx Slip
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* ========================================================
          MODAL 1: REGISTRATION SUBMITTED MODAL (STATUS: PENDING APPROVAL)
          ======================================================== */}
      {regSuccessModalOpen && newlyRegisteredDoc && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow p-4 text-center">
              <div className="bg-warning bg-opacity-10 text-warning p-3 rounded-circle mx-auto mb-3" style={{ width: '64px', height: '64px' }}>
                <Clock size={32} />
              </div>
              <h4 className="fw-bold text-dark">Doctor Registration Submitted</h4>
              <span className="badge bg-warning text-dark px-3 py-2 fs-6 mb-3">Status: Pending Administrator Approval</span>
              
              <p className="text-muted small mb-4">
                Thank you, <strong>{newlyRegisteredDoc.name}</strong>. Your registration with Medical Council Number <strong>{newlyRegisteredDoc.medicalRegNumber}</strong> has been transmitted to the Medical Superintendent's Governance Office at Govt. MGM Hospital Warangal.
              </p>

              <div className="p-3 bg-light rounded-3 text-start small mb-4">
                <div>Doctor ID: <strong>{newlyRegisteredDoc.id}</strong></div>
                <div>Department: <strong>{newlyRegisteredDoc.department}</strong></div>
                <div>Assigned Chamber: <strong>{newlyRegisteredDoc.assignedLocation}</strong></div>
              </div>

              <button
                type="button"
                className="btn btn-primary fw-bold w-100"
                onClick={() => {
                  setRegSuccessModalOpen(false);
                  setActiveTab('dashboard');
                }}
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 2: REQUEST SCHEDULE CHANGE (PAGE 3)
          ======================================================== */}
      {scheduleChangeModalOpen && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Request Schedule / Shift Change</h5>
                <button type="button" className="btn-close" onClick={() => setScheduleChangeModalOpen(false)}></button>
              </div>
              <form onSubmit={handleScheduleChangeSubmit}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Select Day of Week *</label>
                    <select className="form-select" value={changeReqDay} onChange={(e) => setChangeReqDay(e.target.value)}>
                      <option value="Mon">Monday</option>
                      <option value="Tue">Tuesday</option>
                      <option value="Wed">Wednesday</option>
                      <option value="Thu">Thursday</option>
                      <option value="Fri">Friday</option>
                      <option value="Sat">Saturday</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold">Desired Shift Timing *</label>
                    <select className="form-select" value={changeReqShift} onChange={(e) => setChangeReqShift(e.target.value)}>
                      <option>Morning Shift (09:00 AM - 01:00 PM)</option>
                      <option>Afternoon Shift (01:00 PM - 05:00 PM)</option>
                      <option>Casualty Emergency Duty (08:00 PM - 08:00 AM)</option>
                      <option>Weekly Off / Compensatory Off</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold">Reason for Schedule Alteration *</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="e.g. Clinical exchange with Dr. Ahmed Khan for Cath Lab cover"
                      value={changeReqReason}
                      onChange={(e) => setChangeReqReason(e.target.value)}
                      required
                    />
                  </div>

                  <small className="text-muted">
                    Notice: Shift changes will be reviewed by the hospital administration before being published to the public directory.
                  </small>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setScheduleChangeModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary fw-bold">Submit Request to Admin</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 3: EDIT PROFILE MODAL (PAGE 5)
          ======================================================== */}
      {editProfileModalOpen && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Edit Doctor Profile & Credentials</h5>
                <button type="button" className="btn-close" onClick={() => setEditProfileModalOpen(false)}></button>
              </div>
              <form onSubmit={handleSaveProfile}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-bold">Designation</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editForm.designation}
                        onChange={(e) => setEditForm({ ...editForm, designation: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-bold">Medical Reg. No.</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editForm.medicalRegNumber}
                        onChange={(e) => setEditForm({ ...editForm, medicalRegNumber: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-bold">Qualification</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editForm.qualification}
                        onChange={(e) => setEditForm({ ...editForm, qualification: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-bold">Specialization</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editForm.specialization}
                        onChange={(e) => setEditForm({ ...editForm, specialization: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="row g-2 mb-0">
                    <div className="col-6">
                      <label className="form-label small fw-bold">Mobile</label>
                      <input
                        type="tel"
                        className="form-control"
                        value={editForm.mobile}
                        onChange={(e) => setEditForm({ ...editForm, mobile: e.target.value })}
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-bold">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setEditProfileModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary fw-bold">Save Profile Changes</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 4: LEAVE APPLICATION MODAL
          ======================================================== */}
      {leaveModalOpen && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Apply for Leave / Duty Absence</h5>
                <button type="button" className="btn-close" onClick={() => setLeaveModalOpen(false)}></button>
              </div>
              <form onSubmit={(e) => {
                e.preventDefault();
                if (store) {
                  store.requestDoctorLeave({
                    doctorId: currentDoc.id,
                    doctorName: currentDoc.name,
                    department: currentDoc.department,
                    leaveType,
                    startDate: leaveStartDate,
                    endDate: leaveEndDate,
                    reason: leaveReason
                  });
                  setLeaveModalOpen(false);
                  setLeaveReason('');
                  setLastVerifiedAlert(`Leave request logged for MS Office approval (${leaveType}).`);
                }
              }}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Leave Type</label>
                    <select className="form-select" value={leaveType} onChange={(e) => setLeaveType(e.target.value)}>
                      <option>Casual Leave</option>
                      <option>Medical Leave</option>
                      <option>Academic / Conference Duty</option>
                      <option>Emergency On-Call Rest</option>
                    </select>
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-bold">From Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={leaveStartDate}
                        onChange={(e) => setLeaveStartDate(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-bold">To Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={leaveEndDate}
                        onChange={(e) => setLeaveEndDate(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold">Reason for Absence</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="e.g. Attending national medical conference"
                      value={leaveReason}
                      onChange={(e) => setLeaveReason(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setLeaveModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary fw-bold">Submit Leave Request</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 5: OP CONSULTATION & PRESCRIPTION MODAL
          ======================================================== */}
      {consultModalOpen && activeConsultAppt && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow">
              <div className="modal-header bg-primary text-white">
                <div className="d-flex align-items-center gap-2">
                  <Stethoscope size={20} />
                  <h5 className="modal-title fw-bold mb-0">
                    OP Consultation: Token #{activeConsultAppt.tokenNo}
                  </h5>
                </div>
                <button type="button" className="btn-close btn-close-white" onClick={() => setConsultModalOpen(false)}></button>
              </div>

              <div className="modal-body p-4">
                <div className="bg-light p-3 rounded-3 mb-3 d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="fw-bold text-dark mb-0">
                      {patients.find(p => p.id === activeConsultAppt.patientId)?.fullName || 'Patient'}
                    </h6>
                    <div className="text-muted small">
                      PID: {activeConsultAppt.patientId} &bull; Date: {activeConsultAppt.date} &bull; Slot: {activeConsultAppt.timeSlot}
                    </div>
                  </div>
                  <span className="badge bg-primary">In Consultation</span>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-bold">Symptoms & Clinical Findings</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    value={consultSymptoms}
                    onChange={(e) => setConsultSymptoms(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-bold">Provisional / Confirmatory Diagnosis</label>
                  <input
                    type="text"
                    className="form-control"
                    value={consultDiagnosis}
                    onChange={(e) => setConsultDiagnosis(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-bold d-flex justify-content-between align-items-center">
                    <span>Prescribed Medicines</span>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary py-0 px-2"
                      onClick={() => {
                        setConsultPrescription([
                          ...consultPrescription,
                          { medicineName: 'Pantoprazole 40mg', dosage: '1 tablet before breakfast', duration: '5 days' }
                        ]);
                      }}
                    >
                      + Add Medicine
                    </button>
                  </label>

                  {consultPrescription.map((med, idx) => (
                    <div key={idx} className="row g-2 mb-2 align-items-center bg-light p-2 rounded">
                      <div className="col-5">
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          value={med.medicineName}
                          onChange={(e) => {
                            const updated = [...consultPrescription];
                            updated[idx].medicineName = e.target.value;
                            setConsultPrescription(updated);
                          }}
                        />
                      </div>
                      <div className="col-4">
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          value={med.dosage}
                          onChange={(e) => {
                            const updated = [...consultPrescription];
                            updated[idx].dosage = e.target.value;
                            setConsultPrescription(updated);
                          }}
                        />
                      </div>
                      <div className="col-2">
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          value={med.duration}
                          onChange={(e) => {
                            const updated = [...consultPrescription];
                            updated[idx].duration = e.target.value;
                            setConsultPrescription(updated);
                          }}
                        />
                      </div>
                      <div className="col-1 text-end">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger p-1"
                          onClick={() => setConsultPrescription(consultPrescription.filter((_, i) => i !== idx))}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-bold">Request Diagnostic Lab Tests (Optional)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={consultLabTests}
                    onChange={(e) => setConsultLabTests(e.target.value)}
                  />
                </div>

                <div className="mb-0">
                  <label className="form-label small fw-bold">General Clinical Advice</label>
                  <input
                    type="text"
                    className="form-control"
                    value={consultNotes}
                    onChange={(e) => setConsultNotes(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setConsultModalOpen(false)}>Cancel</button>
                <button
                  type="button"
                  className="btn btn-success fw-bold d-flex align-items-center gap-2"
                  onClick={handleSubmitConsultation}
                >
                  <CheckCircle2 size={18} />
                  <span>Mark Consultation Completed</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
