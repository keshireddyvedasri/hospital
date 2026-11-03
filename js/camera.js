/**
 * e-Arogya OP & Digital Health Record System
 * Camera & Patient Photograph Module
 * Supports live camera selfie capture via WebRTC and device file upload
 */

class CameraService {
  constructor() {
    this.stream = null;
    this.currentPhotoData = null;
  }

  /**
   * Start video stream in specified video element
   * @param {HTMLVideoElement} videoElement 
   * @param {HTMLElement} errorElement 
   */
  async startCamera(videoElement, errorElement = null) {
    this.stopCamera(); // Stop any existing stream
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API is not supported in this browser environment. Please use image upload.');
      }

      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        },
        audio: false
      });

      videoElement.srcObject = this.stream;
      await videoElement.play();
      if (errorElement) errorElement.classList.add('d-none');
      return true;
    } catch (err) {
      console.warn('Camera access error:', err);
      if (errorElement) {
        errorElement.textContent = `Camera Access Notice: ${err.message || 'Unable to access webcam. You can upload a photo instead.'}`;
        errorElement.classList.remove('d-none');
      }
      return false;
    }
  }

  /**
   * Capture photo frame from video element
   * @param {HTMLVideoElement} videoElement 
   * @param {HTMLCanvasElement} canvasElement 
   * @returns {string} base64 data URL
   */
  captureFrame(videoElement, canvasElement) {
    if (!videoElement || !videoElement.videoWidth) {
      throw new Error('Video stream not ready for capture');
    }

    const width = videoElement.videoWidth;
    const height = videoElement.videoHeight;

    canvasElement.width = width;
    canvasElement.height = height;
    const ctx = canvasElement.getContext('2d');

    // Draw video frame to canvas
    ctx.drawImage(videoElement, 0, 0, width, height);

    // Convert to JPEG data URL
    const dataUrl = canvasElement.toDataURL('image/jpeg', 0.88);
    this.currentPhotoData = dataUrl;
    return dataUrl;
  }

  /**
   * Stop active camera stream and release hardware
   */
  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => {
        try { track.stop(); } catch (e) { }
      });
      this.stream = null;
    }
  }

  /**
   * Read image file from file input and return base64
   * @param {File} file 
   * @returns {Promise<string>}
   */
  readFileAsBase64(file) {
    return new Promise((resolve, reject) => {
      if (!file) return reject(new Error('No file selected'));
      if (!file.type.startsWith('image/')) return reject(new Error('Selected file must be an image'));

      const reader = new FileReader();
      reader.onload = (e) => {
        this.currentPhotoData = e.target.result;
        resolve(e.target.result);
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }
}

// Global Camera Service Instance
window.cameraService = new CameraService();

