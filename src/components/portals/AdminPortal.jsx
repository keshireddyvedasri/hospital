import React, { useState, useEffect, useRef } from 'react';
import {
  Users, CalendarCheck, Hourglass, UserCheck, MapPin, ShieldCheck,
  AlertCircle, Camera, CheckCircle2, XCircle, Clock, Calendar, Edit3,
  FileText, Download, Printer, Search, Plus, Filter, AlertTriangle,
  Award, Briefcase, Building, ChevronRight, Eye, Check, X
} from 'lucide-react';
import Chart from 'chart.js/auto';

export default function AdminPortal({ store, doctors, departments, appointments, patients, rooms, bloodBank }) {
  const [adminTab, setAdminTab] = useState('doctor_management'); // 'doctor_management' | 'analytics'
  const [docMgmtSubTab, setDocMgmtSubTab] = useState('pending_approvals'); // 'pending_approvals', 'roster', 'schedule_config', 'shift_requests', 'attendance_audit', 'reports'

  // Selected doctor for schedule configuration
  const [selectedDoctorId, setSelectedDoctorId] = useState(doctors[0]?.id || 'DH-2026-001');
  const [scheduleSuccessMsg, setScheduleSuccessMsg] = useState('');

  // Document Inspection Modal State
  const [inspectDocModalOpen, setInspectDocModalOpen] = useState(false);
  const [inspectingDoctor, setInspectingDoctor] = useState(null);

  // Rejection Modal State
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectingDoctorId, setRejectingDoctorId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Schedule Config Form State
  const selectedDocObj = doctors.find(d => d.id === selectedDoctorId) || doctors[0];
  const [schedForm, setSchedForm] = useState({
    workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    weeklyOff: 'Sunday',
    morningShift: '09:00 AM - 01:00 PM',
    afternoonShift: '01:00 PM - 05:00 PM',
    nightShift: 'Off',
    opdTimings: '09:00 AM - 01:00 PM',
    emergencyDuty: false,
    onCallAvailability: true,
    dutyHours: '09:00 AM - 05:00 PM'
  });

  // Sync form when selected doctor changes
  useEffect(() => {
    if (selectedDocObj) {
      setSchedForm({
        workingDays: selectedDocObj.days || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        weeklyOff: selectedDocObj.dutyShifts?.weeklyOff || 'Sunday',
        morningShift: selectedDocObj.dutyShifts?.morningShift || '09:00 AM - 01:00 PM',
        afternoonShift: selectedDocObj.dutyShifts?.afternoonShift || '01:00 PM - 05:00 PM',
        nightShift: selectedDocObj.dutyShifts?.nightShift || 'Off',
        opdTimings: selectedDocObj.dutyShifts?.opdTimings || '09:00 AM - 01:00 PM',
        emergencyDuty: !!selectedDocObj.dutyShifts?.emergencyDuty,
        onCallAvailability: !!selectedDocObj.dutyShifts?.onCallAvailability,
        dutyHours: selectedDocObj.dutyHours || '09:00 AM - 05:00 PM'
      });
    }
  }, [selectedDoctorId]);

  // Analytics Charts
  const lineChartRef = useRef(null);
  const pieChartRef = useRef(null);
  const chartInstances = useRef({});

  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppts = appointments.filter(a => a.date === todayStr);
  const waitingAppts = todayAppts.filter(a => a.status === 'Waiting');

  // Doctor metrics calculations (Page 6 Metrics)
  const totalDoctors = doctors.length;
  const onlineDoctors = doctors.filter(d => d.onlineStatus === 'online');
  const offlineDoctors = doctors.filter(d => d.onlineStatus === 'offline' || d.onlineStatus === 'off_duty');
  const inConsultationDoctors = doctors.filter(d => d.onlineStatus === 'in_consultation');
  const onLeaveDoctors = doctors.filter(d => d.onlineStatus === 'on_leave');
  const onDutyDoctors = doctors.filter(d => d.active && d.onlineStatus !== 'offline' && d.onlineStatus !== 'on_leave');
  const overdueDoctors = doctors.filter(d => d.active && (!d.dutyVerification || !d.dutyVerification.isVerified));

  const pendingDoctors = doctors.filter(d => d.approvalStatus === 'Pending Approval');
  const shiftRequests = store ? (store.getState().scheduleChangeRequests || []) : [];
  const attendanceLogs = store ? (store.getState().doctorCheckInLogs || []) : [];

  useEffect(() => {
    if (adminTab === 'analytics') {
      if (lineChartRef.current) {
        if (chartInstances.current.line) chartInstances.current.line.destroy();

        const labels = ['Mon (28 Oct)', 'Tue (29 Oct)', 'Wed (30 Oct)', 'Thu (31 Oct)', 'Fri (01 Nov)', 'Sat (02 Nov)', 'Today (03 Nov)'];
        const dataPoints = [420, 580, 610, 540, 680, 720, 390];

        chartInstances.current.line = new Chart(lineChartRef.current, {
          type: 'line',
          data: {
            labels,
            datasets: [{
              label: 'Daily OP Registrations',
              data: dataPoints,
              borderColor: '#0284c7',
              backgroundColor: 'rgba(2, 132, 199, 0.12)',
              fill: true,
              tension: 0.35,
              borderWidth: 3,
              pointBackgroundColor: '#0284c7',
              pointRadius: 5
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              y: { beginAtZero: true, grid: { color: '#f1f5f9' } },
              x: { grid: { display: false } }
            }
          }
        });
      }

      if (pieChartRef.current) {
        if (chartInstances.current.pie) chartInstances.current.pie.destroy();

        const labels = departments.map(d => d.name);
        const data = [38, 24, 18, 15, 12, 10];
        const colors = ['#0284c7', '#0d9488', '#f59e0b', '#6366f1', '#ec4899', '#84cc16'];

        chartInstances.current.pie = new Chart(pieChartRef.current, {
          type: 'doughnut',
          data: {
            labels,
            datasets: [{
              data,
              backgroundColor: colors,
              borderWidth: 2,
              borderColor: '#ffffff'
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'right',
                labels: { boxWidth: 12, font: { size: 12 } }
              }
            },
            cutout: '65%'
          }
        });
      }
    }

    return () => {
      if (chartInstances.current.line) chartInstances.current.line.destroy();
      if (chartInstances.current.pie) chartInstances.current.pie.destroy();
    };
  }, [adminTab, departments]);

  // Handle Approve Doctor
  const handleApproveDoctor = (doctorId) => {
    if (store) {
      store.approveDoctorRegistration(doctorId);
    }
  };

  // Handle Reject Doctor
  const handleRejectDoctor = () => {
    if (store && rejectingDoctorId) {
      store.rejectDoctorRegistration(rejectingDoctorId, rejectionReason || 'Credential verification failed');
      setRejectModalOpen(false);
      setRejectingDoctorId(null);
      setRejectionReason('');
    }
  };

  // Handle Save Doctor Schedule
  const handleSaveSchedule = (e) => {
    e.preventDefault();
    if (store && selectedDocObj) {
      const days = schedForm.workingDays;
      const weeklySchedule = [
        { day: 'Mon', dutyTime: days.includes('Mon') ? schedForm.morningShift : 'Off', department: selectedDocObj.department },
        { day: 'Tue', dutyTime: days.includes('Tue') ? schedForm.morningShift : 'Off', department: selectedDocObj.department },
        { day: 'Wed', dutyTime: days.includes('Wed') ? schedForm.morningShift : 'Off', department: selectedDocObj.department },
        { day: 'Thu', dutyTime: days.includes('Thu') ? schedForm.morningShift : 'Off', department: selectedDocObj.department },
        { day: 'Fri', dutyTime: days.includes('Fri') ? schedForm.morningShift : 'Off', department: selectedDocObj.department },
        { day: 'Sat', dutyTime: days.includes('Sat') ? schedForm.opdTimings : 'Off', department: selectedDocObj.department },
        { day: 'Sun', dutyTime: days.includes('Sun') ? schedForm.morningShift : 'Holiday', department: '-' }
      ];

      store.updateDoctorDutySchedule(selectedDocObj.id, {
        dutyShifts: {
          morningShift: schedForm.morningShift,
          afternoonShift: schedForm.afternoonShift,
          nightShift: schedForm.nightShift,
          opdTimings: schedForm.opdTimings,
          emergencyDuty: schedForm.emergencyDuty,
          onCallAvailability: schedForm.onCallAvailability,
          weeklyOff: schedForm.weeklyOff
        },
        days: schedForm.workingDays,
        weeklySchedule,
        dutyHours: schedForm.dutyHours
      });

      setScheduleSuccessMsg(`Duty schedule updated successfully for ${selectedDocObj.name}!`);
      setTimeout(() => setScheduleSuccessMsg(''), 4000);
    }
  };

  return (
    <div className="container-fluid px-lg-5 py-4">
      
      {/* Top Admin Header Bar */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3 bg-white p-3 rounded-4 shadow-sm border">
        <div>
          <div className="d-flex align-items-center gap-2">
            <h3 className="fw-bold mb-0 text-dark">Hospital Administration & Governance Console</h3>
            <span className="badge bg-primary">Govt. MGM Hospital Warangal</span>
          </div>
          <small className="text-muted">Doctor Registrations, Availability Monitoring, Duty Rosters & GPS Geofence Audit</small>
        </div>

        {/* High-Level Admin Tabs */}
        <div className="btn-group shadow-sm">
          <button
            type="button"
            className={`btn btn-sm ${adminTab === 'doctor_management' ? 'btn-primary' : 'btn-outline-primary'} fw-bold px-3`}
            onClick={() => setAdminTab('doctor_management')}
          >
            Doctor Management & Approvals
            {pendingDoctors.length > 0 && (
              <span className="badge bg-danger ms-2">{pendingDoctors.length} New</span>
            )}
          </button>
          <button
            type="button"
            className={`btn btn-sm ${adminTab === 'analytics' ? 'btn-primary' : 'btn-outline-primary'} fw-bold px-3`}
            onClick={() => setAdminTab('analytics')}
          >
            Hospital OP & Footfall Analytics
          </button>
        </div>
      </div>

      {/* ========================================================
          PAGE 6: ADMIN DOCTOR MANAGEMENT & APPROVALS
          ======================================================== */}
      {adminTab === 'doctor_management' && (
        <div>
          
          {/* 7 KPI Metrics Cards (As specified in Page 6) */}
          <div className="row g-3 mb-4">
            
            {/* 1. Total Doctors */}
            <div className="col-xl-2 col-md-4 col-6">
              <div className="stat-widget p-3 bg-white border rounded-3 h-100">
                <div className="d-flex align-items-center gap-2">
                  <div className="stat-icon-box stat-blue" style={{ width: '42px', height: '42px' }}>
                    <Users size={20} />
                  </div>
                  <div>
                    <h3 className="fw-bold mb-0 text-dark">{totalDoctors}</h3>
                    <span className="text-muted small">Total Doctors</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Online Doctors (Green) */}
            <div className="col-xl-2 col-md-4 col-6">
              <div className="stat-widget p-3 bg-white border rounded-3 h-100">
                <div className="d-flex align-items-center gap-2">
                  <div className="stat-icon-box stat-teal" style={{ width: '42px', height: '42px' }}>
                    <UserCheck size={20} />
                  </div>
                  <div>
                    <h3 className="fw-bold mb-0 text-success">{onlineDoctors.length}</h3>
                    <span className="text-muted small">Online (Available)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Offline Doctors (Grey) */}
            <div className="col-xl-2 col-md-4 col-6">
              <div className="stat-widget p-3 bg-white border rounded-3 h-100">
                <div className="d-flex align-items-center gap-2">
                  <div className="stat-icon-box bg-secondary bg-opacity-10 text-secondary" style={{ width: '42px', height: '42px' }}>
                    <Users size={20} />
                  </div>
                  <div>
                    <h3 className="fw-bold mb-0 text-secondary">{offlineDoctors.length}</h3>
                    <span className="text-muted small">Offline</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. In Consultation (Orange) */}
            <div className="col-xl-2 col-md-4 col-6">
              <div className="stat-widget p-3 bg-white border rounded-3 h-100">
                <div className="d-flex align-items-center gap-2">
                  <div className="stat-icon-box stat-amber" style={{ width: '42px', height: '42px' }}>
                    <Hourglass size={20} />
                  </div>
                  <div>
                    <h3 className="fw-bold mb-0 text-warning">{inConsultationDoctors.length}</h3>
                    <span className="text-muted small">In Consultation</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 5. On Leave (Amber) */}
            <div className="col-xl-2 col-md-4 col-6">
              <div className="stat-widget p-3 bg-white border rounded-3 h-100">
                <div className="d-flex align-items-center gap-2">
                  <div className="stat-icon-box bg-warning bg-opacity-10 text-warning" style={{ width: '42px', height: '42px' }}>
                    <Calendar size={20} />
                  </div>
                  <div>
                    <h3 className="fw-bold mb-0 text-dark">{onLeaveDoctors.length}</h3>
                    <span className="text-muted small">On Approved Leave</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 6 & 7: Currently on Duty & Verification Overdue */}
            <div className="col-xl-2 col-md-4 col-6">
              <div className="stat-widget p-3 bg-white border rounded-3 h-100">
                <div className="d-flex align-items-center gap-2">
                  <div className="stat-icon-box bg-danger bg-opacity-10 text-danger" style={{ width: '42px', height: '42px' }}>
                    <AlertTriangle size={20} />
                  </div>
                  <div>
                    <h3 className="fw-bold mb-0 text-danger">{overdueDoctors.length}</h3>
                    <span className="text-muted small">Check-in Overdue</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Sub Navigation Bar for Doctor Management */}
          <div className="bg-white p-2 rounded-3 border mb-4 d-flex flex-wrap gap-2 shadow-sm">
            
            <button
              type="button"
              className={`btn btn-sm ${docMgmtSubTab === 'pending_approvals' ? 'btn-primary' : 'btn-light text-dark'} fw-bold d-flex align-items-center gap-2`}
              onClick={() => setDocMgmtSubTab('pending_approvals')}
            >
              <Award size={15} />
              <span>Pending Doctor Approvals</span>
              {pendingDoctors.length > 0 && (
                <span className="badge bg-danger rounded-pill">{pendingDoctors.length}</span>
              )}
            </button>

            <button
              type="button"
              className={`btn btn-sm ${docMgmtSubTab === 'roster' ? 'btn-primary' : 'btn-light text-dark'} fw-bold d-flex align-items-center gap-2`}
              onClick={() => setDocMgmtSubTab('roster')}
            >
              <Users size={15} />
              <span>Doctor Roster & Availability</span>
            </button>

            <button
              type="button"
              className={`btn btn-sm ${docMgmtSubTab === 'schedule_config' ? 'btn-primary' : 'btn-light text-dark'} fw-bold d-flex align-items-center gap-2`}
              onClick={() => setDocMgmtSubTab('schedule_config')}
            >
              <Calendar size={15} />
              <span>Configure Duty Schedules</span>
            </button>

            <button
              type="button"
              className={`btn btn-sm ${docMgmtSubTab === 'shift_requests' ? 'btn-primary' : 'btn-light text-dark'} fw-bold d-flex align-items-center gap-2`}
              onClick={() => setDocMgmtSubTab('shift_requests')}
            >
              <Clock size={15} />
              <span>Shift Change Requests</span>
              {shiftRequests.filter(r => r.status === 'Pending Approval').length > 0 && (
                <span className="badge bg-warning text-dark rounded-pill">
                  {shiftRequests.filter(r => r.status === 'Pending Approval').length}
                </span>
              )}
            </button>

            <button
              type="button"
              className={`btn btn-sm ${docMgmtSubTab === 'attendance_audit' ? 'btn-primary' : 'btn-light text-dark'} fw-bold d-flex align-items-center gap-2`}
              onClick={() => setDocMgmtSubTab('attendance_audit')}
            >
              <Camera size={15} />
              <span>GPS Geofence & Camera Audit</span>
            </button>

            <button
              type="button"
              className={`btn btn-sm ${docMgmtSubTab === 'reports' ? 'btn-primary' : 'btn-light text-dark'} fw-bold d-flex align-items-center gap-2 ms-auto`}
              onClick={() => setDocMgmtSubTab('reports')}
            >
              <FileText size={15} />
              <span>Generate Attendance Reports</span>
            </button>

          </div>

          {/* ========================================================
              SUB-TAB 1: PENDING DOCTOR REGISTRATION APPROVAL QUEUE
              ======================================================== */}
          {docMgmtSubTab === 'pending_approvals' && (
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="fw-bold mb-0 text-dark">Pending Doctor Registrations Awaiting Administrator Approval</h5>
                  <small className="text-muted">Review medical council credentials, degree certificates & government employee verification</small>
                </div>
                <span className="badge bg-warning text-dark px-3 py-2 fs-6">
                  {pendingDoctors.length} Pending Review
                </span>
              </div>

              <div className="card-body p-3">
                {pendingDoctors.length === 0 ? (
                  <div className="text-center py-5 text-muted">
                    <CheckCircle2 size={40} className="text-success mb-2" />
                    <h5 className="fw-bold text-dark">All Doctor Registrations Approved</h5>
                    <p className="small mb-0">No new registration requests currently pending review.</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead className="table-light small">
                        <tr>
                          <th>Doctor Profile</th>
                          <th>Medical Reg. No.</th>
                          <th>Department & Role</th>
                          <th>Experience & Qualification</th>
                          <th>Assigned Chamber</th>
                          <th>Credential Documents</th>
                          <th className="text-end">Administrative Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingDoctors.map((doc) => (
                          <tr key={doc.id}>
                            <td>
                              <div className="d-flex align-items-center gap-2">
                                <img
                                  src={doc.avatar}
                                  alt={doc.name}
                                  className="rounded-circle border"
                                  width="45"
                                  height="45"
                                  style={{ objectFit: 'cover' }}
                                />
                                <div>
                                  <strong className="text-dark d-block">{doc.name}</strong>
                                  <span className="text-muted small">{doc.id} &bull; {doc.gender || 'Doctor'}</span>
                                  <div className="text-secondary" style={{ fontSize: '0.75rem' }}>{doc.email}</div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className="badge bg-primary-subtle text-primary border px-2 py-1 fw-bold">
                                {doc.medicalRegNumber || 'TSMC/2021/65412'}
                              </span>
                              <div className="text-muted" style={{ fontSize: '0.72rem' }}>State Medical Council</div>
                            </td>
                            <td>
                              <strong>{doc.department}</strong>
                              <div className="text-muted small">{doc.designation}</div>
                              <div className="text-secondary" style={{ fontSize: '0.72rem' }}>{doc.employmentType || 'Permanent State Govt'}</div>
                            </td>
                            <td>
                              <span className="badge bg-light text-dark border">{doc.qualification}</span>
                              <div className="small text-muted">{doc.specialization} &bull; {doc.experience}</div>
                            </td>
                            <td>
                              <span className="badge bg-light text-dark border">{doc.assignedLocation || doc.roomNo}</span>
                            </td>
                            <td>
                              <button
                                type="button"
                                className="btn btn-outline-info btn-sm d-flex align-items-center gap-1"
                                onClick={() => {
                                  setInspectingDoctor(doc);
                                  setInspectDocModalOpen(true);
                                }}
                              >
                                <Eye size={14} />
                                <span>Inspect 4 Docs</span>
                              </button>
                            </td>
                            <td className="text-end">
                              <div className="d-flex gap-2 justify-content-end">
                                <button
                                  type="button"
                                  className="btn btn-outline-danger btn-sm"
                                  onClick={() => {
                                    setRejectingDoctorId(doc.id);
                                    setRejectModalOpen(true);
                                  }}
                                >
                                  Reject
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-success btn-sm fw-bold shadow-sm d-flex align-items-center gap-1"
                                  onClick={() => handleApproveDoctor(doc.id)}
                                >
                                  <Check size={15} />
                                  <span>Approve Doctor</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================
              SUB-TAB 2: DOCTOR ROSTER & AVAILABILITY MONITOR
              ======================================================== */}
          {docMgmtSubTab === 'roster' && (
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center flex-wrap gap-2">
                <div>
                  <h5 className="fw-bold mb-0 text-dark">Doctor Roster & Availability Monitoring Console</h5>
                  <small className="text-muted">Live patient availability status & physical chamber check-in tracking</small>
                </div>
                <div className="d-flex gap-2">
                  <span className="badge bg-success-subtle text-success border px-2 py-1">● Online ({onlineDoctors.length})</span>
                  <span className="badge bg-warning-subtle text-warning border px-2 py-1">● In Consult ({inConsultationDoctors.length})</span>
                  <span className="badge bg-secondary-subtle text-secondary border px-2 py-1">⚪ Offline ({offlineDoctors.length})</span>
                </div>
              </div>

              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light small">
                      <tr>
                        <th>Doctor</th>
                        <th>Medical Council Reg.</th>
                        <th>Department</th>
                        <th>Chamber Location</th>
                        <th>Availability Status</th>
                        <th>Last Verified Status Time</th>
                        <th>Admin Status Override</th>
                      </tr>
                    </thead>
                    <tbody>
                      {doctors.map((d) => {
                        let statusBadge = <span className="badge bg-secondary-subtle text-secondary">⚪ Offline</span>;
                        if (d.onlineStatus === 'online') statusBadge = <span className="badge bg-success text-white">🟢 Available (Online)</span>;
                        if (d.onlineStatus === 'in_consultation') statusBadge = <span className="badge bg-warning text-dark">🟠 In Consultation</span>;
                        if (d.onlineStatus === 'emergency_duty') statusBadge = <span className="badge bg-danger text-white">🔴 Emergency Duty</span>;
                        if (d.onlineStatus === 'on_leave') statusBadge = <span className="badge bg-warning-subtle text-dark border">🟡 On Leave</span>;

                        return (
                          <tr key={d.id} className={d.approvalStatus === 'Pending Approval' ? 'table-warning table-opacity-10' : ''}>
                            <td>
                              <div className="d-flex align-items-center gap-2">
                                <img
                                  src={d.avatar}
                                  alt={d.name}
                                  className="rounded-circle border"
                                  width="38"
                                  height="38"
                                  style={{ objectFit: 'cover' }}
                                />
                                <div>
                                  <strong className="text-dark d-block">{d.name}</strong>
                                  <span className="text-muted small">{d.id} &bull; {d.designation}</span>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className="badge bg-light text-dark border">{d.medicalRegNumber || 'TSMC/REG'}</span>
                            </td>
                            <td>
                              <strong>{d.department}</strong>
                              <div className="text-muted" style={{ fontSize: '0.75rem' }}>{d.specialization}</div>
                            </td>
                            <td>
                              <span className="badge bg-light text-dark border">{d.roomNo}</span>
                            </td>
                            <td>
                              {statusBadge}
                              {d.approvalStatus === 'Pending Approval' && (
                                <span className="badge bg-warning text-dark ms-1">Pending</span>
                              )}
                            </td>
                            <td>
                              <small className="text-dark fw-semibold">{d.statusChangeTimestamp || d.lastCheckInTime || '-'}</small>
                            </td>
                            <td>
                              <select
                                className="form-select form-select-sm"
                                value={d.onlineStatus}
                                onChange={(e) => {
                                  if (store) store.setDoctorAvailabilityStatus(d.id, e.target.value);
                                }}
                              >
                                <option value="online">🟢 Online (Available)</option>
                                <option value="offline">⚪ Offline</option>
                                <option value="in_consultation">🟠 In Consultation</option>
                                <option value="emergency_duty">🔴 Emergency Duty</option>
                                <option value="on_leave">🟡 On Leave</option>
                                <option value="off_duty">⚪ Off Duty</option>
                              </select>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              SUB-TAB 3: CONFIGURE DOCTOR DUTY SCHEDULES & WEEKLY OFF
              ======================================================== */}
          {docMgmtSubTab === 'schedule_config' && (
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center flex-wrap gap-2">
                <div>
                  <h5 className="fw-bold mb-0 text-dark">Configure Individual Doctor Duty Schedules & Shifts</h5>
                  <small className="text-muted">Administrators configure custom working days, weekly holidays & shift allocations per physician</small>
                </div>
                
                {/* Doctor Selector */}
                <div className="d-flex align-items-center gap-2">
                  <span className="text-muted small fw-bold">Select Doctor:</span>
                  <select
                    className="form-select form-select-sm fw-bold"
                    value={selectedDoctorId}
                    onChange={(e) => setSelectedDoctorId(e.target.value)}
                    style={{ minWidth: '220px' }}
                  >
                    {doctors.map((d) => (
                      <option key={d.id} value={d.id}>{d.name} ({d.department})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="card-body p-4">
                
                {scheduleSuccessMsg && (
                  <div className="alert alert-success d-flex align-items-center gap-2 py-2 px-3 mb-4">
                    <CheckCircle2 size={18} className="text-success" />
                    <strong>{scheduleSuccessMsg}</strong>
                  </div>
                )}

                <form onSubmit={handleSaveSchedule}>
                  <div className="row g-4">
                    
                    {/* Selected Doctor Summary Card */}
                    <div className="col-12 bg-light p-3 rounded-3 border d-flex align-items-center justify-content-between flex-wrap gap-3">
                      <div className="d-flex align-items-center gap-3">
                        <img
                          src={selectedDocObj.avatar}
                          alt={selectedDocObj.name}
                          className="rounded-circle border"
                          width="55"
                          height="55"
                          style={{ objectFit: 'cover' }}
                        />
                        <div>
                          <h5 className="fw-bold text-dark mb-0">{selectedDocObj.name}</h5>
                          <span className="text-muted small">{selectedDocObj.id} &bull; {selectedDocObj.designation} &bull; {selectedDocObj.department}</span>
                          <div className="text-primary small fw-semibold">Medical Reg: {selectedDocObj.medicalRegNumber || 'TSMC/2018/48921'}</div>
                        </div>
                      </div>

                      <div className="text-end">
                        <span className="badge bg-primary px-3 py-2">
                          Chamber: {selectedDocObj.assignedLocation || selectedDocObj.roomNo}
                        </span>
                      </div>
                    </div>

                    {/* Working Days Checkboxes (Monday to Sunday) */}
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-dark d-block">
                        Working Days (Select Working Schedule) *
                      </label>
                      <div className="d-flex flex-wrap gap-2">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => {
                          const isChecked = schedForm.workingDays.includes(day);
                          return (
                            <button
                              key={day}
                              type="button"
                              className={`btn btn-sm ${isChecked ? 'btn-primary' : 'btn-outline-secondary'}`}
                              onClick={() => {
                                const newDays = isChecked
                                  ? schedForm.workingDays.filter(d => d !== day)
                                  : [...schedForm.workingDays, day];
                                setSchedForm({ ...schedForm, workingDays: newDays });
                              }}
                            >
                              {isChecked && <Check size={13} className="d-inline me-1" />}
                              {day}
                            </button>
                          );
                        })}
                      </div>
                      <small className="text-muted mt-1 d-block">
                        Active days: {schedForm.workingDays.join(', ') || 'None selected'}
                      </small>
                    </div>

                    {/* Weekly Off Day */}
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-dark">Weekly Off Day *</label>
                      <select
                        className="form-select"
                        value={schedForm.weeklyOff}
                        onChange={(e) => setSchedForm({ ...schedForm, weeklyOff: e.target.value })}
                      >
                        <option>Sunday</option>
                        <option>Saturday</option>
                        <option>Wednesday</option>
                        <option>Saturday & Sunday</option>
                        <option>Rotating Off</option>
                      </select>
                    </div>

                    {/* Morning Shift */}
                    <div className="col-md-4">
                      <label className="form-label small fw-bold text-dark">Morning Shift Hours</label>
                      <input
                        type="text"
                        className="form-control"
                        value={schedForm.morningShift}
                        onChange={(e) => setSchedForm({ ...schedForm, morningShift: e.target.value })}
                        placeholder="09:00 AM - 01:00 PM"
                      />
                    </div>

                    {/* Afternoon Shift */}
                    <div className="col-md-4">
                      <label className="form-label small fw-bold text-dark">Afternoon Shift Hours</label>
                      <input
                        type="text"
                        className="form-control"
                        value={schedForm.afternoonShift}
                        onChange={(e) => setSchedForm({ ...schedForm, afternoonShift: e.target.value })}
                        placeholder="01:00 PM - 05:00 PM"
                      />
                    </div>

                    {/* Night Shift */}
                    <div className="col-md-4">
                      <label className="form-label small fw-bold text-dark">Night Shift Hours</label>
                      <input
                        type="text"
                        className="form-control"
                        value={schedForm.nightShift}
                        onChange={(e) => setSchedForm({ ...schedForm, nightShift: e.target.value })}
                        placeholder="08:00 PM - 08:00 AM or Off"
                      />
                    </div>

                    {/* OPD Timings */}
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-dark">Outpatient (OPD) Consultation Timings</label>
                      <input
                        type="text"
                        className="form-control"
                        value={schedForm.opdTimings}
                        onChange={(e) => setSchedForm({ ...schedForm, opdTimings: e.target.value })}
                        placeholder="09:00 AM - 01:00 PM"
                      />
                    </div>

                    {/* Overall Duty Hours */}
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-dark">Standard Duty Hours Banner</label>
                      <input
                        type="text"
                        className="form-control"
                        value={schedForm.dutyHours}
                        onChange={(e) => setSchedForm({ ...schedForm, dutyHours: e.target.value })}
                        placeholder="09:00 AM - 05:00 PM"
                      />
                    </div>

                    {/* Emergency & On-Call Toggles */}
                    <div className="col-md-6">
                      <div className="form-check form-switch p-3 bg-light rounded-3 border">
                        <input
                          className="form-check-input ms-0 me-3"
                          type="checkbox"
                          id="emergencyDutySwitch"
                          checked={schedForm.emergencyDuty}
                          onChange={(e) => setSchedForm({ ...schedForm, emergencyDuty: e.target.checked })}
                        />
                        <label className="form-check-label fw-bold small text-dark" htmlFor="emergencyDutySwitch">
                          Assigned to Casualty / Emergency Duty
                        </label>
                        <div className="text-muted" style={{ fontSize: '0.75rem' }}>Doctor is rostered for acute emergency coverage</div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-check form-switch p-3 bg-light rounded-3 border">
                        <input
                          className="form-check-input ms-0 me-3"
                          type="checkbox"
                          id="onCallSwitch"
                          checked={schedForm.onCallAvailability}
                          onChange={(e) => setSchedForm({ ...schedForm, onCallAvailability: e.target.checked })}
                        />
                        <label className="form-check-label fw-bold small text-dark" htmlFor="onCallSwitch">
                          24/7 On-Call Medical Availability
                        </label>
                        <div className="text-muted" style={{ fontSize: '0.75rem' }}>Available for specialty telephonic or inpatient consults</div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="col-12 mt-4 text-end">
                      <button type="submit" className="btn btn-primary fw-bold px-4 py-2 shadow-sm">
                        Save Doctor Schedule & Apply to Directory
                      </button>
                    </div>

                  </div>
                </form>

              </div>
            </div>
          )}

          {/* ========================================================
              SUB-TAB 4: SHIFT CHANGE REQUESTS (FROM DOCTORS)
              ======================================================== */}
          {docMgmtSubTab === 'shift_requests' && (
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="fw-bold mb-0 text-dark">Doctor Shift Change & Duty Exchange Requests</h5>
                  <small className="text-muted">Review schedule alteration requests submitted by hospital physicians</small>
                </div>
              </div>

              <div className="card-body p-3">
                {shiftRequests.length === 0 ? (
                  <div className="text-center py-5 text-muted">
                    <CheckCircle2 size={36} className="text-success mb-2" />
                    <div>No pending shift change requests.</div>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead className="table-light small">
                        <tr>
                          <th>Request ID</th>
                          <th>Doctor</th>
                          <th>Department</th>
                          <th>Day & Requested Shift</th>
                          <th>Reason for Change</th>
                          <th>Status</th>
                          <th className="text-end">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {shiftRequests.map((req) => (
                          <tr key={req.id}>
                            <td><strong>{req.id}</strong></td>
                            <td>{req.doctorName}</td>
                            <td>{req.department}</td>
                            <td>
                              <span className="badge bg-light text-dark border">{req.requestedDay}</span>
                              <div className="small text-primary fw-semibold">{req.requestedShift}</div>
                            </td>
                            <td><small className="text-muted">{req.reason}</small></td>
                            <td>
                              <span className={`badge ${req.status === 'Approved' ? 'bg-success' : 'bg-warning text-dark'}`}>
                                {req.status}
                              </span>
                            </td>
                            <td className="text-end">
                              {req.status === 'Pending Approval' ? (
                                <div className="d-flex justify-content-end gap-1">
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => store && store.rejectScheduleChange(req.id)}
                                  >
                                    Reject
                                  </button>
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-success fw-bold"
                                    onClick={() => store && store.approveScheduleChange(req.id)}
                                  >
                                    Approve Shift
                                  </button>
                                </div>
                              ) : (
                                <span className="text-muted small">Processed</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================
              SUB-TAB 5: GPS GEOFENCE & CAMERA AUDIT
              ======================================================== */}
          {docMgmtSubTab === 'attendance_audit' && (
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="fw-bold mb-0 text-dark">Live Chamber GPS Geofence & Facial Camera Audit</h5>
                  <small className="text-muted">Automated verification logs for anti-absenteeism compliance at Govt. MGM Hospital Warangal</small>
                </div>
                <span className="badge bg-success-subtle text-success border px-3 py-2">
                  <ShieldCheck size={16} className="d-inline me-1" /> Hospital Geofence Active (±5m)
                </span>
              </div>

              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light small">
                      <tr>
                        <th>Time & Date</th>
                        <th>Doctor Name & ID</th>
                        <th>Chamber Live Photo</th>
                        <th>GPS Telemetry</th>
                        <th>Accuracy</th>
                        <th>Campus Geofence Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceLogs.map((log, idx) => (
                        <tr key={idx} className="small">
                          <td>
                            <strong>{log.timestamp}</strong>
                            <div className="text-muted">{log.date}</div>
                          </td>
                          <td>
                            <strong className="text-dark d-block">{log.doctorName}</strong>
                            <span className="text-muted">{log.doctorId}</span>
                          </td>
                          <td>
                            <img
                              src={log.selfieUrl}
                              alt="Verification Snap"
                              className="rounded border"
                              width="52"
                              height="52"
                              style={{ objectFit: 'cover' }}
                            />
                          </td>
                          <td>
                            <strong>{log.chamber}</strong>
                            <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                              Lat: {log.latitude}&deg; N, Lng: {log.longitude}&deg; E
                            </div>
                          </td>
                          <td>
                            <span className="badge bg-light text-dark border">&plusmn;{log.accuracyMeters} m</span>
                          </td>
                          <td>
                            <span className="badge bg-success-subtle text-success border d-inline-flex align-items-center gap-1">
                              <CheckCircle2 size={13} />
                              <span>Inside Hospital Area</span>
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              SUB-TAB 6: GENERATE ATTENDANCE REPORTS
              ======================================================== */}
          {docMgmtSubTab === 'reports' && (
            <div className="card border-0 shadow-sm rounded-4 p-4">
              <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2 border-bottom pb-3">
                <div>
                  <h5 className="fw-bold text-dark mb-0">Official Doctor Attendance & Duty Compliance Report</h5>
                  <small className="text-muted">Govt. Mahatma Gandhi Memorial (MGM) Hospital & Kakatiya Medical College, Warangal</small>
                </div>
                <div className="d-flex gap-2 no-print">
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
                    onClick={() => window.print()}
                  >
                    <Printer size={15} />
                    <span>Print Report</span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm d-flex align-items-center gap-1"
                    onClick={() => alert('Attendance report exported as CSV / PDF for Medical Superintendent Office.')}
                  >
                    <Download size={15} />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-md-3">
                  <div className="p-3 bg-light rounded-3 border">
                    <small className="text-muted">Total Rostered Doctors</small>
                    <h3 className="fw-bold mb-0 text-dark">{doctors.length}</h3>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="p-3 bg-light rounded-3 border">
                    <small className="text-muted">On-Duty Compliance</small>
                    <h3 className="fw-bold mb-0 text-success">
                      {Math.round((onlineDoctors.length / (totalDoctors || 1)) * 100)}%
                    </h3>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="p-3 bg-light rounded-3 border">
                    <small className="text-muted">Hourly Verification Rate</small>
                    <h3 className="fw-bold mb-0 text-primary">94.8%</h3>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="p-3 bg-light rounded-3 border">
                    <small className="text-muted">Absence / Leave Rate</small>
                    <h3 className="fw-bold mb-0 text-warning">{onLeaveDoctors.length} On Leave</h3>
                  </div>
                </div>
              </div>

              <div className="table-responsive">
                <table className="table table-bordered align-middle small mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Doctor ID</th>
                      <th>Physician Name</th>
                      <th>Medical Reg. No.</th>
                      <th>Department</th>
                      <th>Assigned Shifts</th>
                      <th>Today's Check-in</th>
                      <th>GPS Geofence Status</th>
                      <th>Attendance Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doctors.map((d) => (
                      <tr key={d.id}>
                        <td>{d.id}</td>
                        <td><strong>{d.name}</strong></td>
                        <td>{d.medicalRegNumber || 'TSMC/2018/48921'}</td>
                        <td>{d.department}</td>
                        <td>{d.dutyHours || '09:00 AM - 05:00 PM'}</td>
                        <td>{d.lastCheckInTime || 'Pending'}</td>
                        <td>
                          {d.dutyVerification?.isVerified ? (
                            <span className="text-success fw-bold">Verified in Chamber</span>
                          ) : (
                            <span className="text-danger">Unverified</span>
                          )}
                        </td>
                        <td>
                          <span className={`badge ${d.onlineStatus === 'online' ? 'bg-success' : 'bg-secondary'}`}>
                            {d.onlineStatus.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

        </div>
      )}

      {/* ========================================================
          PAGE 6 (TAB 2): HOSPITAL FOOTFALL & CLINICAL ANALYTICS
          ======================================================== */}
      {adminTab === 'analytics' && (
        <div>
          {/* Visual Analytics Charts */}
          <div className="row g-4 mb-4">
            <div className="col-lg-8">
              <div className="card card-healthcare shadow-sm h-100">
                <div className="card-header-healthcare">
                  <span>Weekly Outpatient Registration Trend</span>
                  <span className="small text-muted">Daily footfall pattern</span>
                </div>
                <div className="card-body p-3" style={{ minHeight: '300px', position: 'relative' }}>
                  <canvas ref={lineChartRef}></canvas>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card card-healthcare shadow-sm h-100">
                <div className="card-header-healthcare">
                  <span>Department Patient Distribution</span>
                </div>
                <div className="card-body p-3" style={{ minHeight: '300px', position: 'relative' }}>
                  <canvas ref={pieChartRef}></canvas>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          DOCUMENT INSPECTION MODAL (PAGE 1 / PAGE 6 CREDENTIALS)
          ======================================================== */}
      {inspectDocModalOpen && inspectingDoctor && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow">
              <div className="modal-header bg-light">
                <div>
                  <h5 className="modal-title fw-bold text-dark mb-0">
                    Credential Documents Verification: {inspectingDoctor.name}
                  </h5>
                  <small className="text-muted">Doctor ID: {inspectingDoctor.id} &bull; Reg: {inspectingDoctor.medicalRegNumber}</small>
                </div>
                <button type="button" className="btn-close" onClick={() => setInspectDocModalOpen(false)}></button>
              </div>

              <div className="modal-body p-4">
                <div className="row g-4">
                  
                  {/* Document 1: Medical Council Certificate */}
                  <div className="col-md-6">
                    <div className="card h-100 border rounded-3 p-3 text-center">
                      <strong className="text-dark small mb-2 d-block">1. Medical Registration Certificate</strong>
                      <img
                        src={inspectingDoctor.documents?.regCertUrl || 'https://images.unsplash.com/photo-1584467735815-f778f274e296?w=400&auto=format&fit=crop&q=80'}
                        alt="Reg Cert"
                        className="rounded border mb-2"
                        style={{ height: '140px', objectFit: 'cover' }}
                      />
                      <span className="badge bg-success-subtle text-success small">Verified State Council</span>
                    </div>
                  </div>

                  {/* Document 2: Qualification Certificates */}
                  <div className="col-md-6">
                    <div className="card h-100 border rounded-3 p-3 text-center">
                      <strong className="text-dark small mb-2 d-block">2. Qualification Degrees ({inspectingDoctor.qualification})</strong>
                      <img
                        src={inspectingDoctor.documents?.qualCertUrl || 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=400&auto=format&fit=crop&q=80'}
                        alt="Degree Cert"
                        className="rounded border mb-2"
                        style={{ height: '140px', objectFit: 'cover' }}
                      />
                      <span className="badge bg-primary-subtle text-primary small">MBBS, MD Degrees Verified</span>
                    </div>
                  </div>

                  {/* Document 3: Government Employee ID */}
                  <div className="col-md-6">
                    <div className="card h-100 border rounded-3 p-3 text-center">
                      <strong className="text-dark small mb-2 d-block">3. Government Employee / Faculty ID</strong>
                      <img
                        src={inspectingDoctor.documents?.govtIdUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80'}
                        alt="Govt ID"
                        className="rounded border mb-2"
                        style={{ height: '140px', objectFit: 'cover' }}
                      />
                      <span className="badge bg-info-subtle text-info small">DME Telangana Card</span>
                    </div>
                  </div>

                  {/* Document 4: Profile Photograph */}
                  <div className="col-md-6">
                    <div className="card h-100 border rounded-3 p-3 text-center">
                      <strong className="text-dark small mb-2 d-block">4. Official Profile Photograph</strong>
                      <img
                        src={inspectingDoctor.avatar}
                        alt="Doctor Photo"
                        className="rounded-circle border mb-2 mx-auto"
                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                      />
                      <span className="badge bg-light text-dark border small">Chamber Pass Photo</span>
                    </div>
                  </div>

                </div>
              </div>

              <div className="modal-footer bg-light">
                <button type="button" className="btn btn-secondary" onClick={() => setInspectDocModalOpen(false)}>Close</button>
                {inspectingDoctor.approvalStatus === 'Pending Approval' && (
                  <button
                    type="button"
                    className="btn btn-success fw-bold d-flex align-items-center gap-1"
                    onClick={() => {
                      handleApproveDoctor(inspectingDoctor.id);
                      setInspectDocModalOpen(false);
                    }}
                  >
                    <Check size={16} />
                    <span>Approve Credentials & Register Doctor</span>
                  </button>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          REJECT REGISTRATION MODAL
          ======================================================== */}
      {rejectModalOpen && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow">
              <div className="modal-header">
                <h5 className="modal-title fw-bold text-danger">Reject Doctor Registration</h5>
                <button type="button" className="btn-close" onClick={() => setRejectModalOpen(false)}></button>
              </div>
              <div className="modal-body p-4">
                <label className="form-label small fw-bold">Reason for Rejection *</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="e.g. Medical Council Registration Number verification failed or incomplete qualification certificate."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setRejectModalOpen(false)}>Cancel</button>
                <button type="button" className="btn btn-danger fw-bold" onClick={handleRejectDoctor}>Confirm Rejection</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
