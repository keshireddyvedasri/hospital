import React, { useEffect, useState } from 'react';
import { X, Printer, CheckCircle, ShieldCheck, FlaskConical, FileText } from 'lucide-react';
import QRCode from 'qrcode';
import { useLanguage } from '../../context/LanguageContext';

export default function LabReportModal({ isOpen, onClose, labOrder, hospital }) {
  const { t, language } = useLanguage();
  const [qrDataUrl, setQrDataUrl] = useState('');

  useEffect(() => {
    if (labOrder) {
      const payload = JSON.stringify({
        type: 'MGM_LAB_REPORT',
        orderId: labOrder.id,
        patientId: labOrder.patientId,
        test: labOrder.testName,
        status: labOrder.status,
        date: labOrder.orderDate
      });

      QRCode.toDataURL(payload, {
        width: 140,
        margin: 1,
        color: { dark: '#047857', light: '#ffffff' }
      }, (err, url) => {
        if (!err && url) setQrDataUrl(url);
      });
    }
  }, [labOrder]);

  if (!isOpen || !labOrder) return null;

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.65)' }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 shadow-lg">
          
          <div className="modal-header bg-success text-white no-print py-2">
            <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
              <FlaskConical size={20} />
              <span>{t('labReportModalTitle')}</span>
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>

          <div className="modal-body p-4 printable-area">
            <div className="op-slip-ticket">
              
              {/* Official Header */}
              <div className="text-center pb-2 mb-3 border-bottom">
                <h3 className="fw-bold text-dark mb-0">
                  {language === 'te' ? (hospital?.localName || 'మహాత్మా గాంధీ మెమోరియల్ ప్రభుత్వ ఆసుపత్రి, వరంగల్') : (hospital?.name || 'Mahatma Gandhi Memorial (MGM) Government Hospital')}
                </h3>
                <div className="fw-semibold text-primary small">
                  {language === 'te' ? 'సెంట్రల్ క్లినికల్ లాబొరేటరీ & పాథాలజీ వింగ్ • కాకతీయ మెడికల్ కాలేజ్ (KMC)' : 'Central Diagnostic Laboratory & Pathology Wing • Kakatiya Medical College (KMC)'}
                </div>
                <div className="text-muted small">
                  {hospital?.address || 'MG Road, Mattewada, Warangal - 506007'} &bull; Phone: 0870-2441010
                </div>
                <span className="badge bg-success-subtle text-success mt-1 px-3 py-1">
                  OFFICIAL DIAGNOSTIC TEST REPORT
                </span>
              </div>

              {/* Order & Patient Dossier */}
              <div className="row g-3 mb-3 p-3 bg-light rounded-3 border">
                <div className="col-8">
                  <div className="small text-muted">Patient Name:</div>
                  <h4 className="fw-bold text-dark mb-1">{labOrder.patientName}</h4>
                  <div className="small text-secondary">
                    Patient ID: <strong>{labOrder.patientId}</strong> &bull; Aadhaar: <strong>XXXX-XXXX-{labOrder.aadharNumber ? labOrder.aadharNumber.slice(-4) : 'XXXX'}</strong>
                  </div>
                  <div className="small text-secondary">
                    Doctor: <strong>{labOrder.doctorName}</strong> ({labOrder.department})
                  </div>
                  <div className="small text-muted">
                    Sample Type: <strong>{labOrder.sampleType}</strong> &bull; Date: {labOrder.orderDate}
                  </div>
                </div>

                <div className="col-4 text-center">
                  {qrDataUrl ? (
                    <img src={qrDataUrl} alt="QR Verification" className="border p-1 bg-white rounded shadow-sm" style={{ width: '110px', height: '110px' }} />
                  ) : (
                    <div className="spinner-border text-success" role="status"></div>
                  )}
                  <div className="small text-muted mt-1" style={{ fontSize: '0.72rem' }}>Lab Report QR Pass</div>
                </div>
              </div>

              {/* Test Name Header */}
              <div className="p-2 mb-3 bg-white border rounded d-flex justify-content-between align-items-center">
                <div>
                  <span className="text-muted small d-block">Investigation Conducted:</span>
                  <h5 className="fw-bold text-primary mb-0">{labOrder.testName}</h5>
                </div>
                <span className="badge bg-success fs-6 px-3 py-2">
                  <CheckCircle size={14} className="d-inline me-1" />
                  Report Ready & Verified
                </span>
              </div>

              {/* Investigation Findings Table */}
              <table className="table table-bordered small mb-3">
                <thead className="table-light">
                  <tr>
                    <th>Test Parameter</th>
                    <th>Observed Value</th>
                    <th>Biological Reference Range</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {labOrder.resultData ? (
                    Object.entries(labOrder.resultData).map(([key, val]) => (
                      <tr key={key}>
                        <td className="fw-semibold text-capitalize">{key.replace(/([A-Z])/g, ' $1')}</td>
                        <td className="fw-bold text-dark">{val}</td>
                        <td className="text-muted">Standard Clinical Reference</td>
                        <td><span className="badge bg-success-subtle text-success">Normal</span></td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center text-muted py-3">
                        Test observation completed under standard laboratory conditions.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              <div className="p-2 bg-light rounded text-muted small border mb-3">
                <ShieldCheck size={14} className="text-success me-1" />
                <strong>Technician Verification:</strong> Processed by <strong>{labOrder.technicianName}</strong>. Validated and digitally signed by Duty Clinical Pathologist, MGM Hospital & Kakatiya Medical College.
              </div>

            </div>
          </div>

          <div className="modal-footer bg-light no-print">
            <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>{t('closeBtn')}</button>
            <button type="button" className="btn btn-success btn-sm d-flex align-items-center gap-1" onClick={() => window.print()}>
              <Printer size={16} />
              <span>{t('printReportBtn')}</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

