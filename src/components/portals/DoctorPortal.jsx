import React from 'react';
import { Stethoscope, QrCode, MapPin, ShieldCheck, Hourglass, CheckCircle2, History, AlertTriangle, LogOut, Camera } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function DoctorPortal({ doctor, store, appointments, patients, onOpenCheckInModal, onCheckOut, onScanQR, onOpenConsultation, onViewRecord }) {
  const { t } = useLanguage();
  if (!doctor) return null;

  const todayStr = new Date().toISOString().split('T')[0];
  const docAppts = appointments.filter(a => a.doctorId === doctor.id && a.date === todayStr);

  const waiting = docAppts.filter(a => a.status === 'Waiting' || a.status === 'Confirmed' || a.status === 'With Doctor');
  const completed = docAppts.filter(a => a.status === 'Completed');

  const isVerified = doctor.dutyVerification?.isVerified;

  return (
    <div className="container-fluid px-lg-5 py-4">
      
      {/* Doctor Header Bar with Live GPS Telemetry */}
      <div className="card card-healthcare p-3 mb-4 shadow-sm border">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
          
          <div className="d-flex align-items-center gap-3">
            <div className="position-relative">
              <img
                src={doctor.dutyVerification?.selfieUrl || doctor.avatar}
                className="rounded-circle border"
                width="65"
                height="65"
                style={{ objectFit: 'cover' }}
                alt={doctor.name}
              />
              {isVerified && (
                <span className="position-absolute bottom-0 end-0 bg-success text-white p-1 rounded-circle" title="GPS Verified In Chamber">
                  <ShieldCheck size={14} />
                </span>
              )}
            </div>

            <div>
              <div className="d-flex align-items-center gap-2">
                <h3 className="fw-bold mb-0 text-dark">{doctor.name}</h3>
                {isVerified ? (
                  <span className="badge bg-success d-flex align-items-center gap-1">
                    <ShieldCheck size={14} />
                    <span>GPS Verified in Chamber</span>
                  </span>
                ) : (
                  <span className="badge bg-warning text-dark d-flex align-items-center gap-1">
                    <AlertTriangle size={14} />
                    <span>Not Checked In</span>
                  </span>
                )}
              </div>
              <div className="text-muted small">
                <span>{doctor.designation}</span> &bull; 
                Chamber: <strong className="text-primary">{doctor.roomNo}</strong> &bull; 
                Quota: {doctor.tokenQuota} Tokens
              </div>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2 flex-wrap">
            {isVerified ? (
              <>
                <div className="text-end d-none d-md-block me-2">
                  <div className="small fw-bold text-success">
                    <MapPin size={13} className="d-inline text-danger me-1" />
                    Chamber {doctor.roomNo} (Lat: {doctor.dutyVerification.gps.latitude}&deg;, Lng: {doctor.dutyVerification.gps.longitude}&deg;)
                  </div>
                  <small className="text-muted">Checked-in at {doctor.dutyVerification.checkedInAt}</small>
                </div>

                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1"
                  onClick={() => onCheckOut(doctor.id)}
                  title="Check out and end duty shift"
                >
                  <LogOut size={15} />
                  <span>{t('endShiftBtn')}</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                className="btn btn-success btn-sm d-flex align-items-center gap-2 px-3 py-2 shadow-sm"
                onClick={() => onOpenCheckInModal(doctor)}
              >
                <Camera size={18} />
                <span>{t('checkInBtn')}</span>
              </button>
            )}

            <button
              type="button"
              className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1"
              onClick={onScanQR}
            >
              <QrCode size={16} />
              <span>{t('scanPatientQrBtn')}</span>
            </button>
          </div>

        </div>

        {/* Anti-Absenteeism Notice If Not Checked In */}
        {!isVerified && (
          <div className="alert alert-warning py-2 px-3 mt-3 mb-0 small d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-2">
              <AlertTriangle size={18} className="text-warning flex-shrink-0" />
              <div>
                <strong>{t('absenteeismAlert')}</strong>
              </div>
            </div>
            <button
              type="button"
              className="btn btn-sm btn-dark"
              onClick={() => onOpenCheckInModal(doctor)}
            >
              {t('verifyPresenceNow')}
            </button>
          </div>
        )}

      </div>

      {/* Metrics */}
      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <div className="stat-widget">
            <div className="stat-icon-box stat-amber">
              <Hourglass size={26} />
            </div>
            <div>
              <h2 className="fw-bold mb-0 text-dark">{waiting.length}</h2>
              <span className="text-muted small">{t('patientsWaitingQueue')}</span>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="stat-widget">
            <div className="stat-icon-box stat-teal">
              <CheckCircle2 size={26} />
            </div>
            <div>
              <h2 className="fw-bold mb-0 text-dark">{completed.length}</h2>
              <span className="text-muted small">{t('consultationsCompleted')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Waiting Queue List */}
        <div className="col-lg-8">
          <div className="card card-healthcare shadow-sm">
            <div className="card-header-healthcare">
              <span>Active Waiting Patients for Today</span>
              <span className="badge bg-primary">{waiting.length} In Queue</span>
            </div>
            
            <div className="card-body p-3">
              {waiting.length === 0 ? (
                <div className="text-center py-4 text-muted">
                  No patients currently waiting in queue.
                </div>
              ) : (
                waiting.map((a) => {
                  const p = patients.find(pat => pat.id === a.patientId);
                  return (
                    <div key={a.id} className="card card-healthcare mb-2 p-3 d-flex flex-row justify-content-between align-items-center flex-wrap gap-2">
                      <div className="d-flex align-items-center gap-3">
                        <span className="badge bg-primary fs-5 px-3 py-2">#{a.tokenNo}</span>
                        <div>
                          <h4 className="fw-bold text-dark mb-0">{p?.fullName || 'Patient'}</h4>
                          <div className="text-muted small">{p?.id} &bull; {p?.age}Y/{p?.gender?.[0]} &bull; {a.timeSlot}</div>
                          <div className="text-secondary small fst-italic">"{a.reason}"</div>
                        </div>
                      </div>

                      <div className="d-flex gap-2">
                        <button
                          type="button"
                          className="btn btn-outline-info btn-sm d-flex align-items-center gap-1"
                          onClick={() => onViewRecord(p?.id)}
                        >
                          <History size={15} />
                          <span>History</span>
                        </button>
                        <button
                          type="button"
                          className="btn btn-primary-custom btn-sm d-flex align-items-center gap-1"
                          onClick={() => {
                            if (!isVerified) {
                              alert('Please complete your GPS Chamber Check-In before consulting patients.');
                              onOpenCheckInModal(doctor);
                              return;
                            }
                            onOpenConsultation(a.id);
                          }}
                        >
                          <Stethoscope size={15} />
                          <span>Consult</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

          </div>
        </div>

        {/* Completed Consultations */}
        <div className="col-lg-4">
          <div className="card card-healthcare shadow-sm">
            <div className="card-header-healthcare">
              <span>Completed Consultations</span>
            </div>
            <div className="card-body p-3">
              {completed.length === 0 ? (
                <div className="text-muted small p-2">No consultations completed yet today.</div>
              ) : (
                completed.map((a) => {
                  const p = patients.find(pat => pat.id === a.patientId);
                  return (
                    <div key={a.id} className="list-group-item d-flex justify-content-between align-items-center px-0 py-2 border-bottom">
                      <div>
                        <strong>Token #{a.tokenNo}: {p?.fullName || 'Patient'}</strong>
                        <div className="text-muted small">{p?.id}</div>
                      </div>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => onViewRecord(p?.id)}
                      >
                        Record
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
