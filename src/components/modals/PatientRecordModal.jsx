import React from 'react';
import { User, Calendar, Activity, AlertTriangle, CheckCircle, Stethoscope } from 'lucide-react';

export default function PatientRecordModal({ isOpen, onClose, verifiedData, currentRole, onStartConsultation }) {
  if (!isOpen || !verifiedData) return null;

  const { patient, currentAppointment, records, isNewPatient } = verifiedData;

  const hasAllergies = patient.allergies && 
    patient.allergies.length > 0 && 
    !patient.allergies.includes('No Known Drug Allergies');

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
      <div className="modal-dialog modal-dialog-centered modal-xl modal-dialog-scrollable">
        <div className="modal-content border-0 shadow-lg">
          
          <div className="modal-header bg-primary text-white py-2">
            <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
              <CheckCircle size={20} className="text-warning" />
              <span>Verified Patient Electronic Health Record (EHR)</span>
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>

          <div className="modal-body p-4 bg-light">
            
            {/* Patient Header Card */}
            <div className="card card-healthcare p-3 mb-4">
              <div className="row align-items-center g-3">
                <div className="col-auto">
                  <div className="patient-avatar-frame bg-light d-flex align-items-center justify-content-center text-primary fs-2 fw-bold border">
                    {patient.fullName ? patient.fullName.substring(0, 2).toUpperCase() : 'PT'}
                  </div>
                </div>
                <div className="col">
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <h3 className="fw-bold text-dark mb-0">{patient.fullName}</h3>
                    <span className="badge bg-primary fs-6">{patient.id}</span>
                    <span className="badge bg-success-subtle text-success border">QR Verified</span>
                  </div>
                  <div className="text-muted small mb-1">{patient.age} Yrs &bull; {patient.gender} &bull; Blood Group: <strong>{patient.bloodGroup || 'Unknown'}</strong></div>
                  <div className="text-secondary small">{patient.address}, {patient.district}, {patient.state} - {patient.pinCode}</div>
                  <div className="small text-dark mt-1">
                    Aadhaar: <strong>{patient.aadharNumber ? `XXXX-XXXX-${patient.aadharNumber.slice(-4)}` : 'Verified'}</strong> &bull; Mobile: <strong>+91 {patient.mobile}</strong> &bull; ABHA: {patient.abhaId || 'Active'}
                  </div>
                </div>
              </div>
            </div>

            {/* Allergy Banner */}
            {hasAllergies ? (
              <div className="alert alert-danger py-2 px-3 mb-3 d-flex align-items-center gap-2">
                <AlertTriangle size={20} className="text-danger flex-shrink-0" />
                <div>
                  <strong>ALLERGY WARNING:</strong> {patient.allergies.join('; ')}
                </div>
              </div>
            ) : (
              <div className="alert alert-success py-2 px-3 small mb-3">
                No known drug allergies reported.
              </div>
            )}

            <h4 className="text-primary fw-bold mb-3 border-bottom pb-2">
              Previous Medical History & Doctor Prescriptions
            </h4>

            {/* Medical Consultations Timeline */}
            {isNewPatient || records.length === 0 ? (
              <div className="card bg-white border-0 text-center py-4 px-3 shadow-sm">
                <h5 className="fw-bold text-dark">No Previous Medical Records Available</h5>
                <p className="text-muted small mb-0">This patient is visiting for their first outpatient consultation in this hospital.</p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {records.map((rec) => (
                  <div key={rec.id} className="card card-healthcare p-4">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <h4 className="fw-bold text-primary mb-0">{rec.diagnosis}</h4>
                        <small className="text-muted">
                          <Calendar size={13} className="d-inline me-1" />
                          {rec.visitDate} &bull; {rec.doctorName} ({rec.departmentName})
                        </small>
                      </div>
                      <span className="badge bg-success-subtle text-success px-3 py-1">Completed</span>
                    </div>

                    <div className="row g-2 mb-2 p-2 bg-light rounded text-center small">
                      <div className="col"><strong>BP:</strong> {rec.vitals?.bloodPressure || 'N/A'}</div>
                      <div className="col"><strong>Pulse:</strong> {rec.vitals?.pulseRate || 'N/A'}</div>
                      <div className="col"><strong>Temp:</strong> {rec.vitals?.temperature || 'N/A'}</div>
                      <div className="col"><strong>SpO2:</strong> {rec.vitals?.spo2 || 'N/A'}</div>
                    </div>

                    <div className="small mb-2">
                      <strong className="text-secondary">Symptoms:</strong> {(rec.symptoms || []).join(', ')}
                    </div>

                    {rec.prescriptions && rec.prescriptions.length > 0 && (
                      <div className="mb-2">
                        <strong className="small text-secondary">Prescriptions:</strong>
                        <div className="mt-1 d-flex flex-wrap gap-1">
                          {rec.prescriptions.map((rx, idx) => (
                            <span key={idx} className="badge bg-light text-dark border p-2">
                              <strong>{rx.medicine}</strong> ({rx.dosage}) &bull; {rx.frequency} &bull; {rx.instructions}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="small text-muted border-top pt-2 mt-2">
                      <strong>Doctor Notes:</strong> {rec.notes}
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>

          <div className="modal-footer bg-white">
            <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>Close File</button>
            {currentRole === 'doctor' && currentAppointment && currentAppointment.status !== 'Completed' && (
              <button
                type="button"
                className="btn btn-primary-custom btn-sm d-flex align-items-center gap-1"
                onClick={() => {
                  onClose();
                  onStartConsultation(currentAppointment.id);
                }}
              >
                <Stethoscope size={16} />
                <span>Start Consultation</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
