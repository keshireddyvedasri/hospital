import React, { useState, useEffect } from 'react';
import { DoorOpen, Printer, CheckCircle, ShieldCheck } from 'lucide-react';
import QRCode from 'qrcode';

export default function BedBookingModal({ isOpen, onClose, room, defaultPatient, onConfirmBooking }) {
  const [patientName, setPatientName] = useState('');
  const [patientId, setPatientId] = useState('');
  const [aadharNumber, setAadharNumber] = useState('');
  const [mobile, setMobile] = useState('');
  const [admitDate, setAdmitDate] = useState(new Date().toISOString().split('T')[0]);
  const [durationDays, setDurationDays] = useState(3);
  const [department, setDepartment] = useState('General Medicine');
  const [notes, setNotes] = useState('');
  
  // Confirmed booking state for pass
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [qrUrl, setQrUrl] = useState('');

  useEffect(() => {
    if (defaultPatient) {
      setPatientName(defaultPatient.fullName || '');
      setPatientId(defaultPatient.id || '');
      setAadharNumber(defaultPatient.aadharNumber || '');
      setMobile(defaultPatient.mobile || '');
    }
  }, [defaultPatient, isOpen]);

  useEffect(() => {
    if (confirmedBooking) {
      QRCode.toDataURL(JSON.stringify({
        type: 'BED_ALLOTMENT',
        bkId: confirmedBooking.id,
        bed: confirmedBooking.bedNumber,
        pid: confirmedBooking.patientId
      }), { width: 140, margin: 1 }, (err, url) => {
        if (!err && url) setQrUrl(url);
      });
    }
  }, [confirmedBooking]);

  if (!isOpen || !room) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!patientName.trim()) {
      alert('Please enter patient name');
      return;
    }

    const bookingResult = onConfirmBooking({
      roomTypeId: room.id,
      patientId: patientId || `MGM-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
      patientName,
      aadharNumber,
      admitDate,
      durationDays,
      department,
      notes
    });

    if (bookingResult?.success) {
      setConfirmedBooking(bookingResult.booking);
    }
  };

  const handleClose = () => {
    setConfirmedBooking(null);
    onClose();
  };

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg">
          
          {confirmedBooking ? (
            /* Printable Bed Allotment Pass */
            <>
              <div className="modal-header bg-success text-white no-print py-2">
                <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
                  <CheckCircle size={20} />
                  <span>Inpatient Bed Allotment Pass</span>
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={handleClose}></button>
              </div>

              <div className="modal-body p-4 printable-area">
                <div className="p-3 border rounded-3 text-center mb-3 bg-light">
                  <span className="badge bg-success fs-6 mb-2">HOSPITAL ADMISSION ALLOTTED</span>
                  <h2 className="fw-bold text-success mb-0">{confirmedBooking.bedNumber}</h2>
                  <div className="text-muted">{confirmedBooking.roomTypeName}</div>
                </div>

                <div className="row g-2 align-items-center mb-3">
                  <div className="col-8">
                    <div className="small text-muted">Patient Name:</div>
                    <h4 className="fw-bold text-dark mb-1">{confirmedBooking.patientName}</h4>
                    <div className="small text-secondary">Patient ID: <strong>{confirmedBooking.patientId}</strong></div>
                    {confirmedBooking.aadharNumber && (
                      <div className="small text-secondary">Aadhaar: <strong>XXXX-XXXX-{confirmedBooking.aadharNumber.slice(-4)}</strong></div>
                    )}
                    <div className="small text-secondary">Admission: <strong>{confirmedBooking.admitDate}</strong> ({confirmedBooking.durationDays} Days)</div>
                    <div className="small text-secondary">Department: <strong>{confirmedBooking.department}</strong></div>
                  </div>
                  <div className="col-4 text-center">
                    {qrUrl ? (
                      <img src={qrUrl} alt="Bed QR Pass" className="border p-1 bg-white rounded shadow-sm" style={{ width: '120px', height: '120px' }} />
                    ) : null}
                    <div className="small text-muted mt-1" style={{ fontSize: '0.72rem' }}>Bed Admission Pass</div>
                  </div>
                </div>
              </div>

              <div className="modal-footer bg-light no-print">
                <button type="button" className="btn btn-secondary btn-sm" onClick={handleClose}>Done</button>
                <button type="button" className="btn btn-success btn-sm d-flex align-items-center gap-1" onClick={() => window.print()}>
                  <Printer size={16} />
                  <span>Print Bed Pass</span>
                </button>
              </div>
            </>
          ) : (
            /* Booking Form */
            <form onSubmit={handleSubmit}>
              <div className="modal-header bg-primary text-white py-2">
                <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
                  <DoorOpen size={20} />
                  <span>Book Inpatient Room / Bed</span>
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={handleClose}></button>
              </div>

              <div className="modal-body p-4">
                <div className="p-3 bg-light rounded-3 border mb-3">
                  <h4 className="fw-bold text-primary mb-1">{room.type}</h4>
                  <div className="small text-muted">{room.category} &bull; {room.pricePerDay}</div>
                  <span className="badge bg-success-subtle text-success mt-1">
                    {room.totalBeds - room.occupiedBeds} Beds Currently Free
                  </span>
                </div>

                <div className="mb-3">
                  <label className="form-label">Patient Full Name <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    required
                  />
                </div>

                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <label className="form-label">Aadhaar Card No. (12 Digits)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={aadharNumber}
                      onChange={(e) => setAadharNumber(e.target.value.replace(/\D/g, '').substring(0, 12))}
                      placeholder="12-digit Aadhaar"
                      maxLength="12"
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label">Mobile Number</label>
                    <input
                      type="tel"
                      className="form-control"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').substring(0, 10))}
                      placeholder="10 digits"
                      maxLength="10"
                    />
                  </div>
                </div>

                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <label className="form-label">Admission Date <span className="text-danger">*</span></label>
                    <input
                      type="date"
                      className="form-control"
                      value={admitDate}
                      onChange={(e) => setAdmitDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label">Estimated Days <span className="text-danger">*</span></label>
                    <input
                      type="number"
                      className="form-control"
                      value={durationDays}
                      min="1"
                      max="60"
                      onChange={(e) => setDurationDays(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Admitting Medical Department</label>
                  <select
                    className="form-select"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                  >
                    <option value="General Medicine">General Medicine</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="General Surgery">General Surgery</option>
                  </select>
                </div>

                <div className="mb-2">
                  <label className="form-label">Admission Reason / Notes</label>
                  <input
                    type="text"
                    className="form-control"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Post-op care, IV observation"
                  />
                </div>
              </div>

              <div className="modal-footer bg-light">
                <button type="button" className="btn btn-secondary btn-sm" onClick={handleClose}>Cancel</button>
                <button type="submit" className="btn btn-primary-custom btn-sm">Confirm Bed Allotment</button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}

