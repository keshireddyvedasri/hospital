import React from 'react';
import { Home, User, UserCheck, FlaskConical, Shield, RotateCcw, ClipboardList, Stethoscope } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function RoleSwitcher({ currentRole, staffCategory, onSwitchRole, onResetData }) {
  const { t } = useLanguage();

  return (
    <nav className="demo-role-bar no-print" aria-label="Portal Role Navigation">
      <div className="container-fluid px-lg-5">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
          <div className="d-flex flex-wrap align-items-center gap-2">
            <span className="text-muted fw-bold small me-1">{t('switchPortal')}</span>
            
            <button
              type="button"
              className={`role-pill-btn ${currentRole === 'landing' ? 'active' : ''}`}
              onClick={() => onSwitchRole('landing')}
            >
              <Home size={15} />
              <span>{t('hospitalHome')}</span>
            </button>

            <button
              type="button"
              className={`role-pill-btn ${currentRole === 'patient' ? 'active' : ''}`}
              onClick={() => onSwitchRole('patient', 'MGM-2026-89102')}
            >
              <User size={15} />
              <span>{t('patientRole')}</span>
            </button>

            {/* Doctor Workflow Portal */}
            <button
              type="button"
              className={`role-pill-btn ${currentRole === 'doctor' ? 'active' : ''}`}
              onClick={() => onSwitchRole('doctor', 'DH-2026-001')}
            >
              <Stethoscope size={15} />
              <span>{t('doctorRole') || 'Doctor (Dr. Rajesh)'}</span>
            </button>

            {/* Staff: Receptionist Category */}
            <button
              type="button"
              className={`role-pill-btn ${currentRole === 'staff' && staffCategory === 'receptionist' ? 'active' : ''}`}
              onClick={() => onSwitchRole('staff', null, 'receptionist')}
            >
              <ClipboardList size={15} />
              <span>{t('receptionistRole')}</span>
            </button>

            {/* Staff: Lab Technician Category */}
            <button
              type="button"
              className={`role-pill-btn ${currentRole === 'staff' && staffCategory === 'lab_technician' ? 'active' : ''}`}
              onClick={() => onSwitchRole('staff', null, 'lab_technician')}
            >
              <FlaskConical size={15} />
              <span>{t('labTechRole')}</span>
            </button>

            {/* Hospital Admin */}
            <button
              type="button"
              className={`role-pill-btn ${currentRole === 'admin' ? 'active' : ''}`}
              onClick={() => onSwitchRole('admin')}
            >
              <Shield size={15} />
              <span>{t('adminRole')}</span>
            </button>
          </div>

          <div>
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary py-0 px-2 d-flex align-items-center gap-1"
              onClick={onResetData}
              title="Reset sample patients, appointments & records"
            >
              <RotateCcw size={13} />
              <span className="small">{t('resetDemoData')}</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

