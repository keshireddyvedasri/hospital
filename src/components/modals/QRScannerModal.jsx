import React, { useEffect, useRef, useState } from 'react';
import { QrCode, Upload, Play, AlertCircle } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';

export default function QRScannerModal({ isOpen, onClose, onScanSuccess }) {
  const [errorMsg, setErrorMsg] = useState(null);
  const scannerRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      startScanner();
    } else {
      stopScanner();
      setErrorMsg(null);
    }
    return () => stopScanner();
  }, [isOpen]);

  const playBeep = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.18);
      }
    } catch (e) { }
  };

  const startScanner = async () => {
    try {
      if (!Html5Qrcode) return;
      const html5Qr = new Html5Qrcode('react-qr-scanner-box');
      scannerRef.current = html5Qr;

      await html5Qr.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 220, height: 220 } },
        (decodedText) => {
          playBeep();
          stopScanner();
          onScanSuccess(decodedText);
          onClose();
        },
        () => { }
      );
    } catch (err) {
      console.warn('QR Scanner init error:', err);
      setErrorMsg('Camera not available or permission denied.');
    }
  };

  const stopScanner = () => {
    if (scannerRef.current) {
      try {
        scannerRef.current.stop().then(() => {
          scannerRef.current.clear();
          scannerRef.current = null;
        }).catch(() => { });
      } catch (e) { }
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const tempScanner = new Html5Qrcode('react-qr-temp-sandbox');
        const text = await tempScanner.scanFile(file, true);
        playBeep();
        onScanSuccess(text);
        onClose();
      } catch (err) {
        alert('Could not detect a valid QR code in this image.');
      }
    }
  };

  const handleSimulate = (token) => {
    playBeep();
    stopScanner();
    onScanSuccess(token);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg">
          
          <div className="modal-header bg-dark text-white py-2">
            <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
              <QrCode size={20} className="text-success" />
              <span>Scan Patient OP Slip QR Code</span>
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>

          <div className="modal-body p-4 text-center">
            {errorMsg && (
              <div className="alert alert-warning py-2 small mb-3">
                <AlertCircle size={15} className="me-1" />
                {errorMsg} You can use the instant simulation or image upload below.
              </div>
            )}

            <div className="qr-scanner-box mb-3">
              <div id="react-qr-scanner-box" style={{ width: '100%', minHeight: '260px' }}></div>
              <div className="qr-scan-reticle"><div className="qr-laser-line"></div></div>
            </div>

            <div className="small text-muted mb-3">
              Aim camera at the QR code printed on the patient's OP slip or phone screen.
            </div>

            <div className="border-top pt-3 text-start">
              <label className="form-label small fw-bold text-secondary mb-1">
                <Upload size={14} className="me-1" /> Or Scan from QR Image File:
              </label>
              <input type="file" accept="image/*" className="form-control form-control-sm mb-2" onChange={handleFileUpload} />
              <div id="react-qr-temp-sandbox" className="d-none"></div>

              <div className="p-2 bg-light rounded small mt-2">
                <span className="text-muted d-block mb-1"><strong>Instant Test Simulation:</strong></span>
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm w-100 d-flex align-items-center justify-content-center gap-1"
                  onClick={() => handleSimulate('SEC-TOKEN-89102-0412')}
                >
                  <Play size={14} />
                  <span>Simulate: Ramesh Kumar (Cardiac Record)</span>
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

