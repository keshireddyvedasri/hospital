import React from 'react';
import { Phone, Hospital, Sun, Moon, PlusCircle, Droplet, Languages, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar({ onBookOP, onOpenBloodRequest, onHomeClick, onDoctorPortal, fontSize, setFontSize, highContrast, setHighContrast }) {
  const { language, setLanguage, t } = useLanguage();

  return (
    <>
      {/* Top Utility Bar with Highlighted Moving Emergency Ticker */}
      <div className="top-utility-bar bg-white border-bottom no-print">
        <div className="container-fluid px-lg-5">
          <div className="d-flex justify-content-between align-items-center gap-3 py-1">
            
            {/* Highlighted Emergency Marquee / Moving Ticker */}
            <div className="emergency-highlight-wrapper">
              <div className="emergency-alert-badge">
                <AlertTriangle size={13} className="text-white flex-shrink-0" />
                <span>CASUALTY 24x7</span>
              </div>

              <div className="emergency-ticker-container" title="24/7 Government MGM Hospital Emergency & Casualty Contacts">
                <div className="emergency-ticker-track">
                  {/* Sequence 1 */}
                  <div className="emergency-ticker-item">
                    <span className="emergency-chip">
                      <Phone size={13} className="text-danger flex-shrink-0" />
                      <span>MGM Casualty: <strong className="text-danger">0870-2441010</strong></span>
                    </span>
                    <span className="emergency-chip emergency-chip-red">
                      <span>Emergency: <strong className="text-danger">108</strong></span>
                    </span>
                    <span className="emergency-chip">
                      <span>Blood Bank: <strong>0870-2441012 / 1910</strong></span>
                    </span>
                    <span className="emergency-chip text-muted">
                      <span>Warangal, Telangana</span>
                    </span>
                  </div>

                  {/* Sequence 2 for seamless loop */}
                  <div className="emergency-ticker-item" aria-hidden="true">
                    <span className="emergency-chip">
                      <Phone size={13} className="text-danger flex-shrink-0" />
                      <span>MGM Casualty: <strong className="text-danger">0870-2441010</strong></span>
                    </span>
                    <span className="emergency-chip emergency-chip-red">
                      <span>Emergency: <strong className="text-danger">108</strong></span>
                    </span>
                    <span className="emergency-chip">
                      <span>Blood Bank: <strong>0870-2441012 / 1910</strong></span>
                    </span>
                    <span className="emergency-chip text-muted">
                      <span>Warangal, Telangana</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Accessibility: Font Scaler & Contrast */}
            <div className="d-flex align-items-center gap-2 flex-shrink-0">
              <span className="text-muted small me-1 d-none d-sm-inline">{t('textSize')}</span>
              <button 
                type="button" 
                className={`font-scaler-btn ${fontSize === 15 ? 'active' : ''}`}
                onClick={() => setFontSize(15)}
                title="Small text"
              >
                A-
              </button>
              <button 
                type="button" 
                className={`font-scaler-btn ${fontSize === 17.5 ? 'active' : ''}`}
                onClick={() => setFontSize(17.5)}
                title="Default text"
              >
                A
              </button>
              <button 
                type="button" 
                className={`font-scaler-btn ${fontSize === 20 ? 'active' : ''}`}
                onClick={() => setFontSize(20)}
                title="Large readable text for elderly patients"
              >
                A+
              </button>
              <button 
                type="button" 
                className="font-scaler-btn ms-1 d-flex align-items-center gap-1"
                onClick={() => setHighContrast(!highContrast)}
                title="Toggle High Contrast"
              >
                {highContrast ? <Sun size={13} /> : <Moon size={13} />}
                <span>{t('contrast')}</span>
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Modern Main Navigation for Govt MGM Hospital Warangal */}
      <header className="modern-navbar no-print">
        <div className="container-fluid px-lg-5">
          <div className="d-flex justify-content-between align-items-center">
            <div className="brand-badge" onClick={onHomeClick} role="button" tabIndex={0}>
              <div className="brand-icon">
                <Hospital size={28} />
              </div>
              <div className="brand-title-group">
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <h1 className="mb-0">{t('hospitalTitle')}</h1>
                  <span className="badge bg-primary-subtle text-primary fw-semibold small d-none d-md-inline">
                    KMC Teaching Hospital
                  </span>
                </div>
                <div className="sub-title">
                  {t('hospitalSubtitle')}
                </div>
              </div>
            </div>

            <div className="d-flex align-items-center gap-2">
              {/* Language Selector Pill in Main Header */}
              <div className="btn-group btn-group-sm shadow-sm me-1" role="group" aria-label="Language switcher">
                <button
                  type="button"
                  className={`btn ${language === 'en' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setLanguage('en')}
                >
                  English
                </button>
                <button
                  type="button"
                  className={`btn ${language === 'te' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setLanguage('te')}
                >
                  తెలుగు
                </button>
              </div>

              <button 
                type="button" 
                className="btn btn-outline-danger btn-sm d-none d-sm-flex align-items-center gap-1"
                onClick={() => onOpenBloodRequest('O+')}
              >
                <Droplet size={15} />
                <span>{t('liveBloodBankBtn')}</span>
              </button>
              <button 
                type="button" 
                className="btn btn-primary-custom btn-sm d-flex align-items-center gap-1"
                onClick={onBookOP}
              >
                <PlusCircle size={16} />
                <span>{t('bookFreeOpBtn')}</span>
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

