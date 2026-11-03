import React, { useState } from 'react';
import {
  CalendarPlus, MapPin, ShieldCheck, AlertCircle, Clock,
  Search, Filter, CheckCircle2, User, Stethoscope, ChevronRight,
  Building, Phone, Sparkles
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function DoctorDirectory({ doctors, departments, onQuickBookDoctor, onOpenDoctorPortal }) {
  const { t } = useLanguage();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  // Filter approved doctors only for public patient view
  const approvedDoctors = doctors.filter(d => d.approvalStatus !== 'Pending Approval' && d.approvalStatus !== 'Rejected');

  // Apply search & filters
  const filteredDoctors = approvedDoctors.filter(d => {
    const matchesName = d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.specialization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.qualification?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept = selectedDept === 'ALL' || d.departmentId === selectedDept || d.department === selectedDept;

    const matchesStatus = selectedStatus === 'ALL' ||
      (selectedStatus === 'ONLINE' && d.onlineStatus === 'online') ||
      (selectedStatus === 'IN_CONSULTATION' && d.onlineStatus === 'in_consultation') ||
      (selectedStatus === 'OFFLINE' && (d.onlineStatus === 'offline' || d.onlineStatus === 'off_duty'));

    return matchesName && matchesDept && matchesStatus;
  });

  return (
    <div className="container-fluid px-lg-5">
      
      {/* Top Banner: Doctor Portal Quick Launcher for Hospital Staff / Physicians */}
      <div className="alert alert-primary bg-primary bg-opacity-10 border-primary border-opacity-25 p-3 rounded-4 mb-4 d-flex justify-content-between align-items-center flex-wrap gap-3 shadow-sm">
        <div className="d-flex align-items-center gap-3">
          <div className="bg-primary text-white p-2 rounded-circle">
            <Stethoscope size={24} />
          </div>
          <div>
            <h5 className="fw-bold text-dark mb-0">Doctor Chamber Duty & Verification Portal</h5>
            <small className="text-muted">Physicians & Medical Staff: Check in with live chamber GPS, view weekly shifts, and manage patient consultations.</small>
          </div>
        </div>
        <button
          type="button"
          className="btn btn-primary fw-bold px-3 py-2 shadow-sm d-flex align-items-center gap-2"
          onClick={onOpenDoctorPortal}
        >
          <Stethoscope size={16} />
          <span>Open Doctor Portal (Dr. Rajesh) &rarr;</span>
        </button>
      </div>

      {/* Page Title & Search Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 className="fw-bold text-dark mb-1">Find a Doctor & Consultation Hours</h2>
          <p className="text-muted mb-0">
            Govt. MGM Hospital, Warangal &bull; Check real-time doctor availability, OPD chamber locations & book free appointments.
          </p>
        </div>
        <span className="badge bg-success-subtle text-success fs-6 px-3 py-2 border rounded-pill">
          <CheckCircle2 size={16} className="d-inline me-1" /> Real-time Doctor Availability
        </span>
      </div>

      {/* Search & Filter Control Bar */}
      <div className="card border-0 shadow-sm rounded-4 p-3 mb-4 bg-white">
        <div className="row g-3 align-items-center">
          
          {/* Search by Name / Specialization */}
          <div className="col-lg-5 col-md-6">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <Search size={18} className="text-muted" />
              </span>
              <input
                type="text"
                className="form-control border-start-0 bg-light"
                placeholder="Search doctor by name, qualification or specialization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Department Filter */}
          <div className="col-lg-4 col-md-3">
            <select
              className="form-select bg-light"
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
            >
              <option value="ALL">All Clinical Departments</option>
              {departments.map((dep) => (
                <option key={dep.id} value={dep.id}>{dep.name}</option>
              ))}
            </select>
          </div>

          {/* Availability Status Filter */}
          <div className="col-lg-3 col-md-3">
            <select
              className="form-select bg-light"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="ALL">All Availability Statuses</option>
              <option value="ONLINE">🟢 Available for Patients (Online)</option>
              <option value="IN_CONSULTATION">🟠 In Consultation</option>
              <option value="OFFLINE">⚪ Currently Offline</option>
            </select>
          </div>

        </div>
      </div>

      {/* Doctor Cards Grid */}
      <div className="row g-4">
        {filteredDoctors.length === 0 ? (
          <div className="col-12 text-center py-5">
            <AlertCircle size={40} className="text-muted mb-2" />
            <h5 className="text-dark fw-bold">No doctors found matching your filter criteria.</h5>
            <p className="text-muted">Try clearing your search term or selecting another department.</p>
            <button
              type="button"
              className="btn btn-outline-primary btn-sm mt-2"
              onClick={() => {
                setSearchTerm('');
                setSelectedDept('ALL');
                setSelectedStatus('ALL');
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredDoctors.map((d) => {
            const dept = departments.find(dep => dep.id === d.departmentId);
            const isVerified = d.dutyVerification?.isVerified;

            // Status Badge Formatting
            let statusPill = (
              <span className="badge bg-secondary-subtle text-secondary border px-3 py-1">
                ⚪ Currently Offline
              </span>
            );

            if (d.onlineStatus === 'online') {
              statusPill = (
                <span className="badge bg-success text-white px-3 py-1 shadow-sm">
                  🟢 Available for Patients
                </span>
              );
            } else if (d.onlineStatus === 'in_consultation') {
              statusPill = (
                <span className="badge bg-warning text-dark px-3 py-1">
                  🟠 In Consultation
                </span>
              );
            } else if (d.onlineStatus === 'emergency_duty') {
              statusPill = (
                <span className="badge bg-danger text-white px-3 py-1">
                  🔴 Emergency Duty
                </span>
              );
            } else if (d.onlineStatus === 'on_leave') {
              statusPill = (
                <span className="badge bg-warning-subtle text-dark border px-3 py-1">
                  🟡 On Approved Leave
                </span>
              );
            }

            return (
              <div key={d.id} className="col-lg-4 col-md-6">
                <div className="card border-0 shadow-sm rounded-4 p-4 h-100 d-flex flex-column bg-white hover-card">
                  
                  {/* Doctor Avatar & Designation Header */}
                  <div className="d-flex align-items-center gap-3 mb-3 pb-3 border-bottom">
                    <div className="position-relative">
                      <img
                        src={d.avatar}
                        className="rounded-circle border border-2 border-primary"
                        width="70"
                        height="70"
                        style={{ objectFit: 'cover' }}
                        alt={d.name}
                      />
                      {isVerified && (
                        <span className="position-absolute bottom-0 end-0 bg-success text-white p-1 rounded-circle" title="Physically Present on Campus">
                          <CheckCircle2 size={14} />
                        </span>
                      )}
                    </div>

                    <div>
                      <h5 className="fw-bold mb-0 text-dark">{d.name}</h5>
                      <div className="text-primary fw-semibold small">{d.designation}</div>
                      <div className="small text-muted">{d.qualification}</div>
                      <div className="text-secondary small" style={{ fontSize: '0.78rem' }}>
                        {d.specialization} &bull; {d.experience || '8 Years'} Exp.
                      </div>
                    </div>
                  </div>

                  {/* Availability Status Badge & Timestamp */}
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>{statusPill}</div>
                    <div className="text-muted small" style={{ fontSize: '0.75rem' }}>
                      {d.statusChangeTimestamp ? `Updated: ${d.statusChangeTimestamp.split(' ')[0]}` : ''}
                    </div>
                  </div>

                  {/* Campus Presence Verification Card (Privacy Protected: Never exposes coordinates or selfies) */}
                  {isVerified ? (
                    <div className="p-3 bg-success bg-opacity-10 rounded-3 border border-success border-opacity-25 mb-3">
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <ShieldCheck size={16} className="text-success" />
                        <strong className="text-success small">Verified Present in Chamber</strong>
                      </div>
                      <div className="small text-dark">
                        <div><Clock size={13} className="d-inline me-1 text-muted" /> Duty Check-in: <strong>{d.dutyVerification?.checkedInAt || d.lastCheckInTime}</strong></div>
                        <div><MapPin size={13} className="d-inline me-1 text-danger" /> Location: <strong>{d.assignedLocation || d.roomNo}</strong></div>
                        <div className="text-muted" style={{ fontSize: '0.78rem' }}>
                          Govt. MGM Hospital Campus, Warangal
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-light rounded-3 border mb-3">
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <AlertCircle size={15} className="text-muted" />
                        <strong className="text-muted small">Not Checked In Today</strong>
                      </div>
                      <div className="small text-muted">
                        Consultation slot opens according to weekly OPD schedule.
                      </div>
                    </div>
                  )}

                  {/* Consultation Hours & Weekly Schedule Info */}
                  <div className="p-3 bg-light rounded-3 small mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span className="text-muted">Chamber:</span>
                      <strong className="text-dark">{d.roomNo}</strong>
                    </div>
                    <div className="d-flex justify-content-between mb-1">
                      <span className="text-muted">Department:</span>
                      <strong className="text-dark">{dept?.name || d.department || 'OPD'}</strong>
                    </div>
                    <div className="d-flex justify-content-between mb-1">
                      <span className="text-muted">OPD Hours:</span>
                      <strong className="text-primary">{d.dutyShifts?.opdTimings || d.dutyHours || '09:00 AM - 01:00 PM'}</strong>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Working Days:</span>
                      <span className="badge bg-white text-dark border">
                        {d.days ? d.days.join(', ') : 'Mon - Sat'}
                      </span>
                    </div>
                  </div>

                  {/* Action Button: Book Free OP Token */}
                  <div className="mt-auto">
                    <button
                      type="button"
                      className="btn btn-primary w-100 py-2 d-flex align-items-center justify-content-center gap-2 shadow-sm rounded-3 fw-bold"
                      onClick={() => onQuickBookDoctor(d.id, d.departmentId)}
                    >
                      <CalendarPlus size={16} />
                      <span>Book Free OP Token</span>
                    </button>
                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
