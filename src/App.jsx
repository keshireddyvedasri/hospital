import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import RoleSwitcher from './components/RoleSwitcher';
import OPBooking from './components/modules/OPBooking';
import RoomBooking from './components/modules/RoomBooking';
import BloodBank from './components/modules/BloodBank';
import DoctorDirectory from './components/modules/DoctorDirectory';

import PatientPortal from './components/portals/PatientPortal';
import StaffPortal from './components/portals/StaffPortal';
import AdminPortal from './components/portals/AdminPortal';
import DoctorWorkflowPortal from './components/portals/DoctorWorkflowPortal';

import OPSlipModal from './components/modals/OPSlipModal';
import BedBookingModal from './components/modals/BedBookingModal';
import BloodRequestModal from './components/modals/BloodRequestModal';
import LabReportModal from './components/modals/LabReportModal';
import QRScannerModal from './components/modals/QRScannerModal';
import PatientRecordModal from './components/modals/PatientRecordModal';

import { useStore } from './store/useStore';
import { useLanguage } from './context/LanguageContext';

export default function App() {
  const { store, state, patients, doctors, departments, hospitals, appointments, rooms, roomBookings, bloodBank, labOrders } = useStore();
  const { language, setLanguage, t } = useLanguage();

  const [currentRole, setCurrentRole] = useState('landing'); // 'landing', 'patient', 'staff', 'admin'
  const [staffCategory, setStaffCategory] = useState('receptionist'); // 'receptionist' | 'lab_technician'
  const [currentLandingTab, setCurrentLandingTab] = useState('opBookingTab'); // 'opBookingTab', 'roomBookingTab', 'bloodBankTab', 'doctorStatusTab'
  const [currentPatientId, setCurrentPatientId] = useState('MGM-2026-89102');
  const [currentDoctorId, setCurrentDoctorId] = useState('DH-2026-001');

  // Accessibility State
  const [fontSize, setFontSize] = useState(17.5);
  const [highContrast, setHighContrast] = useState(false);

  // Toast
  const [toast, setToast] = useState(null);

  // Modals State
  const [opSlipModalOpen, setOpSlipModalOpen] = useState(false);
  const [selectedSlipData, setSelectedSlipData] = useState(null);

  const [bedBookingModalOpen, setBedBookingModalOpen] = useState(false);
  const [selectedRoomForBooking, setSelectedRoomForBooking] = useState(null);

  const [bloodRequestModalOpen, setBloodRequestModalOpen] = useState(false);
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('O+');

  // Lab Report Modal State
  const [labReportModalOpen, setLabReportModalOpen] = useState(false);
  const [selectedLabOrder, setSelectedLabOrder] = useState(null);

  const [qrScannerModalOpen, setQrScannerModalOpen] = useState(false);
  const [patientRecordModalOpen, setPatientRecordModalOpen] = useState(false);
  const [verifiedPatientData, setVerifiedPatientData] = useState(null);

  // Sync font size and high contrast to document root
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`;
  }, [fontSize]);

  useEffect(() => {
    document.body.classList.toggle('high-contrast', highContrast);
  }, [highContrast]);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSwitchRole = (role, targetId = null, category = null) => {
    setCurrentRole(role);
    if (role === 'patient' && targetId) setCurrentPatientId(targetId);
    if (role === 'doctor' && targetId) setCurrentDoctorId(targetId);
    if (category) setStaffCategory(category);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetData = () => {
    if (confirm('Reset hospital database to default demonstration state?')) {
      store.resetToDefault();
      showToast('Database reset to defaults', 'success');
    }
  };

  // View OP Slip Handler
  const handleViewSlip = (appointmentId) => {
    const appt = appointments.find(a => a.id === appointmentId);
    if (!appt) return;
    const pat = patients.find(p => p.id === appt.patientId);
    const doc = doctors.find(d => d.id === appt.doctorId);
    const dept = departments.find(d => d.id === appt.departmentId);
    const hosp = store.getHospital();

    setSelectedSlipData({ appointment: appt, patient: pat, doctor: doc, department: dept, hospital: hosp });
    setOpSlipModalOpen(true);
  };

  // View Bed Pass Handler
  const handleViewBedPass = (booking) => {
    showToast(`Bed: ${booking.bedNumber} allotted for ${booking.patientName}`, 'info');
  };

  // View Patient Medical Record Handler
  const handleViewRecord = (patientId) => {
    const result = store.verifyQRToken(patientId);
    if (result.success) {
      setVerifiedPatientData(result);
      setPatientRecordModalOpen(true);
    } else {
      alert(result.message);
    }
  };

  // Handle QR Scan Success
  const handleScanQRSuccess = (token) => {
    const result = store.verifyQRToken(token);
    if (result.success) {
      showToast(`Verified: ${result.patient.fullName} (PID: ${result.patient.id})`, 'success');
      setVerifiedPatientData(result);
      setPatientRecordModalOpen(true);
    } else {
      alert(`QR Code error: ${result.message}`);
    }
  };

  // Quick book with doctor (switches to OP tab)
  const handleQuickBookDoctor = (doctorId, deptId) => {
    setCurrentLandingTab('opBookingTab');
    setCurrentRole('landing');
    showToast('Choose your appointment date and slot', 'info');
  };

  // Complete Doctor Consultation
  const handleCompleteConsultation = (consultData) => {
    const res = store.addMedicalRecord(consultData);
    if (res.success) {
      showToast('Consultation completed & prescription saved!', 'success');
      setConsultationModalOpen(false);
      handleViewSlip(consultData.appointmentId);
    }
  };

  // Handle Doctor Live Duty Check-in
  const handleDoctorCheckInComplete = (doctorId, checkInData) => {
    const res = store.doctorDutyCheckIn(doctorId, checkInData);
    if (res.success) {
      showToast(`Presence Verified! GPS locked in Chamber ${res.doctor.roomNo}`, 'success');
    }
  };

  // Handle Doctor Duty Check-out
  const handleDoctorCheckOut = (doctorId) => {
    const res = store.doctorDutyCheckOut(doctorId);
    if (res.success) {
      showToast('Shift ended. Marked offline.', 'info');
    }
  };

  const currentPatient = patients.find(p => p.id === currentPatientId) || patients[0];
  const currentDoctor = doctors.find(d => d.id === currentDoctorId) || doctors[0];

  return (
    <div className="d-flex flex-column min-vh-100">
      
      {/* Modern Navigation Header */}
      <Navbar
        onBookOP={() => {
          setCurrentRole('landing');
          setCurrentLandingTab('opBookingTab');
        }}
        onOpenBloodRequest={(grp) => {
          setSelectedBloodGroup(grp);
          setBloodRequestModalOpen(true);
        }}
        onHomeClick={() => setCurrentRole('landing')}
        onDoctorPortal={() => handleSwitchRole('doctor', 'DH-2026-001')}
        fontSize={fontSize}
        setFontSize={setFontSize}
        highContrast={highContrast}
        setHighContrast={setHighContrast}
      />

      {/* Role Switcher Bar */}
      <RoleSwitcher
        currentRole={currentRole}
        staffCategory={staffCategory}
        onSwitchRole={handleSwitchRole}
        onResetData={handleResetData}
      />

      {/* Main Content Area Based on Current Role */}
      <main className="flex-grow-1">
        
        {/* VIEW 1: PUBLIC / CITIZEN LANDING VIEW */}
        {currentRole === 'landing' && (
          <div>
            {/* Hero Banner with 4 Easy Tabs */}
            <section className="py-4 bg-white border-bottom">
              <div className="container-fluid px-lg-5">
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
                  <div>
                    <h2 className="fw-bold text-dark mb-1">{t('heroTitle')}</h2>
                    <p className="text-muted mb-0">
                      {t('heroDesc')}
                    </p>
                  </div>
                  <div>
                    <span className="badge bg-success-subtle text-success fs-6 border px-3 py-2">
                      {t('heroBadge')}
                    </span>
                  </div>
                </div>

                {/* 4 Core Module Navigation Tabs */}
                <ul className="nav nav-pills-modern mb-2">
                  <li className="nav-item">
                    <button
                      type="button"
                      className={`nav-link ${currentLandingTab === 'opBookingTab' ? 'active' : ''}`}
                      onClick={() => setCurrentLandingTab('opBookingTab')}
                    >
                      {t('tabOpBooking')}
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      type="button"
                      className={`nav-link ${currentLandingTab === 'roomBookingTab' ? 'active' : ''}`}
                      onClick={() => setCurrentLandingTab('roomBookingTab')}
                    >
                      {t('tabRoomBooking')}
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      type="button"
                      className={`nav-link ${currentLandingTab === 'bloodBankTab' ? 'active' : ''}`}
                      onClick={() => setCurrentLandingTab('bloodBankTab')}
                    >
                      {t('tabBloodBank')}
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      type="button"
                      className={`nav-link ${currentLandingTab === 'doctorStatusTab' ? 'active' : ''}`}
                      onClick={() => setCurrentLandingTab('doctorStatusTab')}
                    >
                      {t('tabDoctorStatus')}
                    </button>
                  </li>
                </ul>
              </div>
            </section>

            {/* TAB 1: OP REGISTRATION (NO PATIENT PHOTO REQUIRED) */}
            {currentLandingTab === 'opBookingTab' && (
              <div className="container px-lg-5 py-4">
                <div className="row justify-content-center">
                  <div className="col-lg-10">
                    <OPBooking
                      store={store}
                      onBookingSuccess={(result) => {
                        showToast('OP Registration Successful! QR Ticket Generated.', 'success');
                        setSelectedSlipData(result);
                        setOpSlipModalOpen(true);
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: ROOM & BED BOOKING */}
            {currentLandingTab === 'roomBookingTab' && (
              <div className="py-4">
                <RoomBooking
                  rooms={rooms}
                  onOpenBookingModal={(r) => {
                    setSelectedRoomForBooking(r);
                    setBedBookingModalOpen(true);
                  }}
                />
              </div>
            )}

            {/* TAB 3: BLOOD BANK */}
            {currentLandingTab === 'bloodBankTab' && (
              <div className="py-4">
                <BloodBank
                  bloodBank={bloodBank}
                  onOpenBloodRequest={(grp) => {
                    setSelectedBloodGroup(grp);
                    setBloodRequestModalOpen(true);
                  }}
                />
              </div>
            )}

            {/* TAB 4: DOCTOR DIRECTORY & GPS TRACKER */}
            {currentLandingTab === 'doctorStatusTab' && (
              <div className="py-4">
                <DoctorDirectory
                  doctors={doctors}
                  departments={departments}
                  onQuickBookDoctor={handleQuickBookDoctor}
                  onOpenDoctorPortal={() => handleSwitchRole('doctor', 'DH-2026-001')}
                />
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: PATIENT PORTAL */}
        {currentRole === 'patient' && (
          <PatientPortal
            patient={currentPatient}
            appointments={appointments}
            roomBookings={roomBookings}
            doctors={doctors}
            departments={departments}
            onBookOP={() => {
              setCurrentRole('landing');
              setCurrentLandingTab('opBookingTab');
            }}
            onViewSlip={handleViewSlip}
            onViewBedPass={handleViewBedPass}
            onViewHealthRecord={handleViewRecord}
          />
        )}

        {/* VIEW 3: STAFF OPERATIONS (RECEPTIONIST & LAB TECHNICIAN) */}
        {currentRole === 'staff' && (
          <StaffPortal
            store={store}
            appointments={appointments}
            patients={patients}
            doctors={doctors}
            departments={departments}
            labOrders={labOrders}
            staffCategory={staffCategory}
            setStaffCategory={setStaffCategory}
            onScanQR={() => setQrScannerModalOpen(true)}
            onRegisterWalkIn={() => {
              setCurrentRole('landing');
              setCurrentLandingTab('opBookingTab');
            }}
            onViewSlip={handleViewSlip}
            onViewRecord={handleViewRecord}
            onViewLabReport={(order) => {
              setSelectedLabOrder(order);
              setLabReportModalOpen(true);
            }}
          />
        )}

        {/* VIEW 4: HOSPITAL ADMIN */}
        {currentRole === 'admin' && (
          <AdminPortal
            doctors={doctors}
            departments={departments}
            appointments={appointments}
            patients={patients}
            rooms={rooms}
            bloodBank={bloodBank}
          />
        )}

        {/* VIEW 5: DOCTOR WORKFLOW PORTAL (MATCHES GOVT HOSPITAL UI DESIGN) */}
        {currentRole === 'doctor' && (
          <DoctorWorkflowPortal
            store={store}
            doctor={currentDoctor}
            doctors={doctors}
            departments={departments}
            appointments={appointments}
            patients={patients}
            onSwitchDoctor={(docId) => setCurrentDoctorId(docId)}
            onScanQR={() => setQrScannerModalOpen(true)}
            onViewRecord={handleViewRecord}
            onViewSlip={handleViewSlip}
            onLogout={() => setCurrentRole('landing')}
          />
        )}

      </main>

      {/* Floating Toast Notification */}
      {toast && (
        <div className="toast-container position-fixed bottom-0 end-0 p-3 no-print" style={{ zIndex: 9999 }}>
          <div className={`toast align-items-center ${toast.type === 'success' ? 'bg-success text-white' : 'bg-primary text-white'} border-0 show`}>
            <div className="d-flex">
              <div className="toast-body">
                {toast.message}
              </div>
              <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={() => setToast(null)}></button>
            </div>
          </div>
        </div>
      )}

      {/* MODALS */}
      {/* 1. OP Slip Modal */}
      {selectedSlipData && (
        <OPSlipModal
          isOpen={opSlipModalOpen}
          onClose={() => setOpSlipModalOpen(false)}
          appointment={selectedSlipData.appointment}
          patient={selectedSlipData.patient}
          doctor={selectedSlipData.doctor}
          department={selectedSlipData.department}
          hospital={selectedSlipData.hospital}
        />
      )}

      {/* 2. Room & Bed Booking Modal */}
      {selectedRoomForBooking && (
        <BedBookingModal
          isOpen={bedBookingModalOpen}
          onClose={() => setBedBookingModalOpen(false)}
          room={selectedRoomForBooking}
          defaultPatient={currentPatient}
          onConfirmBooking={(bookingData) => {
            const res = store.bookRoom(bookingData);
            if (res.success) {
              showToast(`Bed ${res.booking.bedNumber} allotted successfully!`, 'success');
            } else {
              alert(res.message);
            }
            return res;
          }}
        />
      )}

      {/* 3. Blood Request Modal */}
      <BloodRequestModal
        isOpen={bloodRequestModalOpen}
        onClose={() => setBloodRequestModalOpen(false)}
        initialGroup={selectedBloodGroup}
        defaultPatient={currentPatient}
        onSubmitRequest={(reqData) => {
          const res = store.requestBlood(reqData);
          if (res.success) {
            showToast(`Blood request logged! Status: ${res.request.status}`, 'success');
          }
        }}
      />

      {/* 4. Official Diagnostic Lab Report Modal */}
      {selectedLabOrder && (
        <LabReportModal
          isOpen={labReportModalOpen}
          onClose={() => setLabReportModalOpen(false)}
          labOrder={selectedLabOrder}
          hospital={store.getHospital()}
        />
      )}

      {/* 5. Live Camera QR Scanner Modal */}
      <QRScannerModal
        isOpen={qrScannerModalOpen}
        onClose={() => setQrScannerModalOpen(false)}
        onScanSuccess={handleScanQRSuccess}
      />

      {/* 6. Patient Record Modal */}
      <PatientRecordModal
        isOpen={patientRecordModalOpen}
        onClose={() => setPatientRecordModalOpen(false)}
        verifiedData={verifiedPatientData}
        currentRole={currentRole}
      />

      {/* Footer */}
      <footer className="modern-footer py-4 no-print">
        <div className="container-fluid px-lg-5">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div>
              <strong className="text-white">Govt. MGM Hospital, Warangal</strong>
              <div className="small text-white-50">
                {language === 'te' 
                  ? 'మహాత్మా గాంధీ మెమోరియల్ ప్రభుత్వ ఆసుపత్రి, వరంగల్ • కాకతీయ మెడికల్ కాలేజ్ (KMC)'
                  : 'Mahatma Gandhi Memorial Government Hospital • Kakatiya Medical College (KMC)'}
              </div>
            </div>
            <div className="small text-white-50">
              Casualty: <strong>0870-2441010</strong> &bull; Emergency: <strong>108</strong>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
