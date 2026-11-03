/**
 * e-Arogya OP & Digital Health Record System
 * QR Code Engine: Generation & Live Camera Scanning
 * Powered by QRCode.js & Html5Qrcode
 */

class QREngine {
  constructor() {
    this.html5QrCode = null;
    this.isScanning = false;
    this.audioCtx = null;
  }

  /**
   * Play high-pitched electronic verification beep on successful scan
   */
  playBeep() {
    try {
      if (!this.audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) this.audioCtx = new AudioContext();
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      if (this.audioCtx) {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, this.audioCtx.currentTime); // A5 note
        osc.frequency.exponentialRampToValueAtTime(1320, this.audioCtx.currentTime + 0.12); // Chime up
        gain.gain.setValueAtTime(0.2, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.18);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start();
        osc.stop(this.audioCtx.currentTime + 0.18);
      }
    } catch (e) {
      console.log('Audio feedback not permitted without prior user gesture');
    }
  }

  /**
   * Generate QR Code into a container element
   * @param {HTMLElement|string} container 
   * @param {Object|string} payload 
   * @param {Object} options 
   */
  generateQR(container, payload, options = {}) {
    const el = typeof container === 'string' ? document.getElementById(container) : container;
    if (!el) return null;

    el.innerHTML = ''; // Clear previous

    const textPayload = typeof payload === 'object' ? JSON.stringify(payload) : String(payload);
    const size = options.size || 180;

    try {
      if (typeof QRCode !== 'undefined') {
        const qr = new QRCode(el, {
          text: textPayload,
          width: size,
          height: size,
          colorDark: options.colorDark || '#0b2447',
          colorLight: options.colorLight || '#ffffff',
          correctLevel: QRCode.CorrectLevel ? QRCode.CorrectLevel.H : 2
        });
        return qr;
      } else {
        // Fallback placeholder
        el.innerHTML = `<div class="p-3 text-center border bg-light text-muted small">QR Generator Initializing...<br><span class="fw-bold">${textPayload.substring(0, 24)}</span></div>`;
      }
    } catch (e) {
      console.error('Error generating QR code:', e);
      el.innerHTML = `<div class="text-danger small">QR Generation Error</div>`;
    }
  }

  /**
   * Start Live Camera QR Code Scanner
   * @param {string} readerElementId 
   * @param {Function} onScanSuccess 
   * @param {Function} onScanError 
   */
  async startScanner(readerElementId, onScanSuccess, onScanError = null) {
    if (this.isScanning) {
      await this.stopScanner();
    }

    try {
      if (typeof Html5Qrcode === 'undefined') {
        throw new Error('Html5Qrcode scanner library is not loaded');
      }

      this.html5QrCode = new Html5Qrcode(readerElementId);
      this.isScanning = true;

      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
      };

      await this.html5QrCode.start(
        { facingMode: 'environment' }, // Prefer back camera, fallback to front/webcam
        config,
        (decodedText, decodedResult) => {
          this.playBeep();
          if (onScanSuccess) onScanSuccess(decodedText, decodedResult);
        },
        (errorMessage) => {
          // Continuous scanning errors can be ignored
          if (onScanError) onScanError(errorMessage);
        }
      );
      return true;
    } catch (err) {
      console.warn('Unable to start live camera scanner:', err);
      this.isScanning = false;
      throw err;
    }
  }

  /**
   * Scan QR Code from an image file upload
   * @param {File} imageFile 
   */
  async scanFile(imageFile) {
    if (typeof Html5Qrcode === 'undefined') {
      throw new Error('Html5Qrcode library is not loaded');
    }
    const tempScanner = new Html5Qrcode('qr-file-scan-sandbox');
    try {
      const decodedText = await tempScanner.scanFile(imageFile, true);
      this.playBeep();
      return decodedText;
    } catch (err) {
      throw new Error('Could not detect a valid QR code in the uploaded image. Please try a clearer picture.');
    } finally {
      try { tempScanner.clear(); } catch (e) { }
    }
  }

  /**
   * Stop active scanner
   */
  async stopScanner() {
    if (this.html5QrCode && this.isScanning) {
      try {
        await this.html5QrCode.stop();
        this.html5QrCode.clear();
      } catch (err) {
        console.warn('Error stopping scanner:', err);
      } finally {
        this.isScanning = false;
        this.html5QrCode = null;
      }
    }
  }
}

// Global QR Engine Instance
window.qrEngine = new QREngine();

