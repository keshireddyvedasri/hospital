import React, { useState, useEffect } from 'react';
import { Droplet, AlertCircle, CheckCircle } from 'lucide-react';

export default function BloodRequestModal({ isOpen, onClose, initialGroup, defaultPatient, onSubmitRequest }) {
  const [bloodGroup, setBloodGroup] = useState(initialGroup || 'O+');
  const [unitsRequested, setUnitsRequested] = useState(1);
  const [urgency, setUrgency] = useState('Emergency (Immediate)');
  const [patientName, setPatientName] = useState('');
  const [patientId, setPatientId] = useState('');
  const [doctor, setDoctor] = useState('Emergency Attending Physician');

  useEffect(() => {
    if (initialGroup) setBloodGroup(initialGroup);
  }, [initialGroup]);

  useEffect(() => {
    if (defaultPatient) {
      setPatientName(defaultPatient.fullName || '');
      setPatientId(defaultPatient.id || '');
    }
  }, [defaultPatient, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!patientName.trim()) {
      alert('Please enter patient name');
      return;
    }

    onSubmitRequest({
      bloodGroup,
      unitsRequested,
      patientName,
      patientId,
      urgency,
      doctor
    });
    onClose();
  };

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg">
          
          <div className="modal-header bg-danger text-white py-2">
            <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
              <Droplet size={20} />
              <span>Hospital Blood Bank Unit Requisition</span>
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4">
              <div className="mb-3">
                <label className="form-label">Required Blood Group <span className="text-danger">*</span></label>
                <select
                  className="form-select fs-5 fw-bold text-danger"
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  required
                >
                  <option value="A+">A+ (Positive)</option>
                  <option value="A-">A- (Negative)</option>
                  <option value="B+">B+ (Positive)</option>
                  <option value="B-">B- (Negative)</option>
                  <option value="O+">O+ (Positive)</option>
                  <option value="O-">O- (Negative)</option>
                  <option value="AB+">AB+ (Positive)</option>
                  <option value="AB-">AB- (Negative)</option>
                  <option value="Platelets (RDP)">Platelets (RDP)</option>
                  <option value="Plasma (FFP)">Plasma (FFP)</option>
                </select>
              </div>

              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label">Units Needed <span className="text-danger">*</span></label>
                  <input
                    type="number"
                    className="form-control"
                    value={unitsRequested}
                    min="1"
                    max="10"
                    onChange={(e) => setUnitsRequested(e.target.value)}
                    required
                  />
                </div>
                <div className="col-6">
                  <label className="form-label">Urgency Level <span className="text-danger">*</span></label>
                  <select
                    className="form-select"
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value)}
                    required
                  >
                    <option value="Emergency (Immediate)">Emergency (Immediate)</option>
                    <option value="Within 4 Hours">Within 4 Hours</option>
                    <option value="Scheduled Surgery">Scheduled Surgery</option>
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Patient Name <span className="text-danger">*</span></label>
                <input
                  type="text"
                  className="form-control"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="Recipient Patient Name"
                  required
                />
              </div>

              <div className="row g-2 mb-2">
                <div className="col-6">
                  <label className="form-label">Patient ID</label>
                  <input
                    type="text"
                    className="form-control"
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                    placeholder="Optional / Auto-generated"
                  />
                </div>
                <div className="col-6">
                  <label className="form-label">Prescribing Doctor</label>
                  <input
                    type="text"
                    className="form-control"
                    value={doctor}
                    onChange={(e) => setDoctor(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer bg-light">
              <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-danger btn-sm">Submit Blood Request</button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}

