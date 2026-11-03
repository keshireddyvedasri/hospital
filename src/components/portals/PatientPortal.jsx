import React from 'react';
import { User, Calendar, Clock, QrCode, DoorOpen, Plus, FileText, CheckCircle2 } from 'lucide-react';

export default function PatientPortal({ patient, appointments, roomBookings, doctors, departments, onBookOP, onViewSlip, onViewBedPass, onViewHealthRecord }) {
  if (!patient) return null;

  const upcoming = appointments.filter(a => a.status !== 'Completed' && a.status !== 'Cancelled');
  const past = appointments.filter(a => a.status === 'Completed' || a.status === 'Cancelled');
  const patientBeds = roomBookings.filter(b => b.patientId === patient.id);

  return (
    <div className="container px-lg-5 py-4">
      
      {/* Patient Dossier Header */}
      <div className="card card-healthcare mb-4 p-4 border-0">
        <div className="row align-items-center g-3">
          <div className="col-auto">
            <div className="patient-avatar-frame bg-light d-flex align-items-center justify-content-center text-primary fs-2 fw-bold border">
              {patient.fullName ? patient.fullName.substring(0, 2).toUpperCase() : 'PT'}
            </div>
          </div>
          <div className="col">
            <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
              <h2 className="fw-bold text-dark mb-0">{patient.fullName}</h2>
              <span className="badge bg-primary fs-6">{patient.id}</span>
              <span className="badge bg-success-subtle text-success border">Aadhaar Linked</span>
            </div>
            <div className="text-muted small mb-1">
              {patient.age} Yrs / {patient.gender} &bull; Blood Group: <strong>{patient.bloodGroup || 'B+'}</strong>
            </div>
            <div className="small text-dark mb-1">
              <strong>Aadhaar:</strong> {patient.aadharNumber ? `XXXX-XXXX-${patient.aadharNumber.slice(-4)}` : 'Verified'} &bull; Mobile: <strong>+91 {patient.mobile}</strong>
            </div>
            <div className="small text-secondary">
              Address: {patient.address}, {patient.district}, {patient.state} - {patient.pinCode}
            </div>
          </div>
          <div className="col-auto ms-auto d-flex flex-wrap gap-2">
            <button type="button" className="btn btn-primary-custom btn-sm d-flex align-items-center gap-1" onClick={onBookOP}>
              <Plus size={16} />
              <span>Book OP Token</span>
            </button>
            <button type="button" className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1" onClick={() => onViewHealthRecord(patient.id)}>
              <QrCode size={16} />
              <span>My Health Pass</span>
            </button>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Left Column: Upcoming Appointments & Inpatient Beds */}
        <div className="col-lg-7">
          
          {/* Upcoming OP Appointments */}
          <div className="card card-healthcare mb-4">
            <div className="card-header-healthcare">
              <span><Calendar size={18} className="text-primary d-inline me-2" /> Upcoming OP Appointments</span>
              <span className="badge bg-primary-subtle text-primary">Live Token System</span>
            </div>
            <div className="card-body p-4">
              {upcoming.length === 0 ? (
                <div className="text-center py-4 text-muted">
                  <Calendar size={32} className="text-primary d-block mx-auto mb-2 opacity-50" />
                  No upcoming OP appointments scheduled.
                </div>
              ) : (
                upcoming.map((a) => {
                  const doc = doctors.find(d => d.id === a.doctorId);
                  const dept = departments.find(d => d.id === a.departmentId);

                  return (
                    <div key={a.id} className="card card-healthcare mb-3 p-3 border-start border-4 border-primary">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <div className="d-flex align-items-center gap-2 mb-1">
                            <span className="badge bg-primary fs-6">Token #{a.tokenNo}</span>
                            <span className={`badge-status badge-status-${a.status?.toLowerCase()}`}>{a.status}</span>
                          </div>
                          <h4 className="fw-bold mb-0 text-dark">{doc?.name || 'Physician'}</h4>
                          <p className="text-muted small mb-1">{dept?.name || 'OPD'} &bull; Chamber: <strong>{doc?.roomNo || 'Room 101'}</strong></p>
                          <p className="small mb-0 text-secondary"><Clock size={14} className="d-inline me-1" /> {a.date} | {a.timeSlot}</p>
                        </div>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
                          onClick={() => onViewSlip(a.id)}
                        >
                          <QrCode size={15} />
                          <span>View OP Slip</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Inpatient Bed Admissions */}
          <div className="card card-healthcare mb-4">
            <div className="card-header-healthcare">
              <span><DoorOpen size={18} className="text-teal d-inline me-2" /> Hospital Room / Bed Admissions</span>
            </div>
            <div className="card-body p-4">
              {patientBeds.length === 0 ? (
                <div className="text-muted small">No active hospital bed admissions.</div>
              ) : (
                patientBeds.map((b) => (
                  <div key={b.id} className="card p-3 border-start border-4 border-success mb-2">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h5 className="fw-bold text-dark mb-0">{b.roomTypeName}</h5>
                        <div className="text-success fw-bold">{b.bedNumber}</div>
                        <small className="text-muted">Admitted: {b.admitDate} &bull; Dept: {b.department}</small>
                      </div>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-success d-flex align-items-center gap-1"
                        onClick={() => onViewBedPass(b)}
                      >
                        <QrCode size={15} />
                        <span>Bed Pass</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Right Column: Past Visits */}
        <div className="col-lg-5">
          <div className="card card-healthcare mb-4">
            <div className="card-header-healthcare">
              <span><Clock size={18} className="text-secondary d-inline me-2" /> Past Completed Visits</span>
            </div>
            <div className="card-body p-3">
              {past.length === 0 ? (
                <div className="text-muted small p-2">No prior completed consultations.</div>
              ) : (
                past.map((a) => {
                  const doc = doctors.find(d => d.id === a.doctorId);
                  return (
                    <div key={a.id} className="list-group-item d-flex justify-content-between align-items-center px-0 py-2 border-bottom">
                      <div>
                        <strong>{doc?.name || 'Doctor'}</strong>
                        <div className="text-muted small">{a.date} &bull; Token #{a.tokenNo}</div>
                      </div>
                      <button
                        type="button"
                        className="btn btn-sm btn-light border d-flex align-items-center gap-1"
                        onClick={() => onViewSlip(a.id)}
                      >
                        <FileText size={14} />
                        <span>Slip</span>
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
  );
}

