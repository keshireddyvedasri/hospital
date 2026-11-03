import React from 'react';
import { Droplet, AlertTriangle, PlusCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function BloodBank({ bloodBank, onOpenBloodRequest }) {
  const { t } = useLanguage();

  return (
    <div className="container-fluid px-lg-5">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h3 className="fw-bold text-dark mb-1">{t('bloodBankTitle')}</h3>
          <p className="text-muted mb-0">{t('bloodBankDesc')}</p>
        </div>
        <button
          type="button"
          className="btn btn-danger d-flex align-items-center gap-1"
          onClick={() => onOpenBloodRequest('O+')}
        >
          <AlertTriangle size={18} />
          <span>{t('requestBloodBtn')}</span>
        </button>
      </div>

      <div className="row g-3">
        {bloodBank.map((b) => {
          let badgeClass = 'bg-success';
          if (b.status === 'Critical Low') badgeClass = 'bg-danger';
          else if (b.status === 'Low Stock') badgeClass = 'bg-warning text-dark';

          return (
            <div key={b.group} className="col-lg-3 col-md-4 col-6">
              <div className="blood-inventory-card">
                <div className="blood-drop-icon">
                  <Droplet size={24} />
                </div>
                <div className="blood-group-title">{b.group}</div>
                <div className="blood-units-count mb-1">
                  {b.units} <span className="fs-6 text-muted fw-normal">Units</span>
                </div>
                <span className={`badge ${badgeClass} mb-2`}>{b.status}</span>
                <div className="small text-muted mb-3">
                  Donors Today: <strong>{b.donorCountToday}</strong>
                </div>
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm w-100 d-flex align-items-center justify-content-center gap-1"
                  onClick={() => onOpenBloodRequest(b.group)}
                >
                  <PlusCircle size={14} />
                  <span>Request Unit</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

