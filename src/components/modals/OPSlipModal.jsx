import React, { useEffect, useState } from 'react';
import { X, Printer, CheckCircle, ShieldCheck, User } from 'lucide-react';
import QRCode from 'qrcode';
import { useLanguage } from '../../context/LanguageContext';

export default function OPSlipModal({ isOpen, onClose, appointment, patient, doctor, department, hospital }) {
  const { t, language } = useLanguage();
  const [qrDataUrl, setQrDataUrl] = useState('');

  useEffect(() => {
    if (appointment && patient) {
      const payload = JSON.stringify({
        v: 1,
        pid: patient.id,
        op: appointment.id,
        tok: appointment.qrToken,
        hosp: appointment.hospitalId
      });

      QRCode.toDataURL(payload, {
        width: 150,
        margin: 1,
        color: { dark: '#0b2447', light: '#ffffff' }
      }, (err, url) => {
        if (!err && url) setQrDataUrl(url);
      });
    }
  }, [appointment, patient]);

  if (!isOpen || !appointment || !patient) return null;

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 shadow-lg">
          
          <div className="modal-header bg-primary text-white no-print py-2">
            <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
              <CheckCircle size={20} className="text-warning" />
              <span>{t('opSlipTitle')}</span>
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>

          <div className="modal-body p-4 printable-area">
            <div className="op-slip-ticket">
              <div className="text-center pb-2 mb-3 border-bottom">
                <h3 className="fw-bold text-dark mb-0">
                  {language === 'te' ? (hospital?.localName || 'మహాత్మా గాంధీ మెమోరియల్ ప్రభుత్వ ఆసుపత్రి, వరంగల్') : (hospital?.name || 'Mahatma Gandhi Memorial (MGM) Government Hospital')}
                </h3>
                <div className="text-muted small">
                  {hospital?.address || 'MG Road, Mattewada, Warangal - 506007'}
                </div>
                <div className="small text-secondary">
                  {language === 'te' ? 'కాకతీయ మెడికల్ కాలేజ్ (KMC) అనుబంధ బోధనా ఆసుపత్రి • ఉచిత ఓపీడీ సేవలు' : 'Affiliated with Kakatiya Medical College (KMC) • Free Outpatient (OPD) Consultation'}
                </div>
                <span className="badge bg-primary-subtle text-primary mt-1 px-3 py-1">
                  {t('officialSlipBanner')}
                </span>
              </div>

              {/* Token Banner */}
              <div className="op-token-banner mb-3 d-flex justify-content-between align-items-center">
                <div>
                  <span className="small text-uppercase opacity-75 d-block">{t('todaysToken')}</span>
                  <h2 className="fw-bold mb-0 text-white">#{appointment.tokenNo}</h2>
                </div>
                <div className="text-end">
                  <span className="small text-uppercase opacity-75 d-block">{t('opNumber')}</span>
                  <h4 className="fw-bold mb-0 text-white">{appointment.id}</h4>
                </div>
              </div>

              {/* Patient Details & QR Code (No Patient Photo Required) */}
              <div className="row g-3 align-items-center mb-3">
                <div className="col-8">
                  <div className="d-flex align-items-center gap-3">
                    <div className="patient-avatar-frame bg-light d-flex align-items-center justify-content-center text-primary fs-3 fw-bold border">
                      {patient.fullName ? patient.fullName.substring(0, 2).toUpperCase() : 'PT'}
                    </div>
                    <div>
                      <h4 className="fw-bold text-dark mb-0">{patient.fullName}</h4>
                      <div className="text-primary fw-semibold">Patient ID: {patient.id}</div>
                      <div className="text-dark small">
                        <strong>Aadhaar:</strong> {patient.aadharNumber ? `XXXX-XXXX-${patient.aadharNumber.slice(-4)}` : 'Aadhaar Verified'}
                      </div>
                      <div className="text-muted small">{patient.age} Yrs / {patient.gender} &bull; Blood Group: {patient.bloodGroup || 'B+'}</div>
                      <div className="text-muted small">Mobile: +91 {patient.mobile?.substring(0, 3)}****{patient.mobile?.substring(7)} &bull; {patient.district}, {patient.state}</div>
                    </div>
                  </div>
                </div>

                <div className="col-4 text-center">
                  {qrDataUrl ? (
                    <img src={qrDataUrl} alt="Patient QR Code" className="border p-1 bg-white rounded shadow-sm" style={{ width: '130px', height: '130px' }} />
                  ) : (
                    <div className="spinner-border text-primary" role="status"></div>
                  )}
                  <div className="small text-muted mt-1" style={{ fontSize: '0.75rem' }}>{t('scanForEhr')}</div>
                </div>
              </div>

              {/* Appointment Details Table */}
              <table className="table table-sm table-bordered small mb-0">
                <tbody>
                  <tr>
                    <th className="bg-light" style={{ width: '25%' }}>{t('departmentCol')}</th>
                    <td className="fw-semibold">{department?.name || 'General Medicine'}</td>
                    <th className="bg-light" style={{ width: '25%' }}>{t('opdChamberCol')}</th>
                    <td className="fw-bold text-primary">{doctor?.roomNo || 'Room 101'}</td>
                  </tr>
                  <tr>
                    <th className="bg-light">{t('doctorCol')}</th>
                    <td className="fw-semibold">{doctor?.name || 'OPD Physician'}</td>
                    <th className="bg-light">{t('regStatusCol')}</th>
                    <td>
                      <span className={`badge-status badge-status-${appointment.status?.toLowerCase()}`}>
                        {appointment.status}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <th className="bg-light">{t('visitDateCol')}</th>
                    <td>{appointment.date}</td>
                    <th className="bg-light">{t('timeSlotCol')}</th>
                    <td>{appointment.timeSlot}</td>
                  </tr>
                </tbody>
              </table>

              <div className="p-2 bg-light rounded text-muted small border mt-3">
                <ShieldCheck size={14} className="text-success me-1" />
                <strong>{t('patientInstructions')}</strong>
              </div>

            </div>
          </div>

          <div className="modal-footer bg-light no-print">
            <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>{t('closeBtn')}</button>
            <button type="button" className="btn btn-primary-custom btn-sm d-flex align-items-center gap-1" onClick={() => window.print()}>
              <Printer size={16} />
              <span>{t('printOpSlipBtn')}</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
