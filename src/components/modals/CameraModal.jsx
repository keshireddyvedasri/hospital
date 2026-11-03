import React, { useRef, useState, useEffect } from 'react';
import { Camera, RotateCcw, Check, X, AlertTriangle } from 'lucide-react';

export default function CameraModal({ isOpen, onClose, onPhotoAccepted }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [capturedUrl, setCapturedUrl] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
      setCapturedUrl(null);
      setErrorMsg(null);
    }
    return () => stopCamera();
  }, [isOpen]);

  const startCamera = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access not supported by browser. Please upload photo file.');
      }
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
      setErrorMsg(null);
    } catch (err) {
      console.warn('Camera error:', err);
      setErrorMsg(err.message || 'Unable to access camera.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(t => {
        try { t.stop(); } catch (e) { }
      });
      setStream(null);
    }
  };

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const width = video.videoWidth || 640;
    const height = video.videoHeight || 480;

    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, width, height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
    setCapturedUrl(dataUrl);
  };

  const handleRetake = () => {
    setCapturedUrl(null);
  };

  const handleAccept = () => {
    if (capturedUrl) {
      onPhotoAccepted(capturedUrl);
      stopCamera();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg">
          
          <div className="modal-header bg-dark text-white py-2">
            <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
              <Camera size={20} />
              <span>Capture Patient Photograph / Selfie</span>
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>

          <div className="modal-body p-4 text-center">
            {errorMsg && (
              <div className="alert alert-warning py-2 small d-flex align-items-center gap-2 mb-3">
                <AlertTriangle size={16} />
                <span>{errorMsg} You can close this and use the "Upload Photo" button instead.</span>
              </div>
            )}

            <div className="camera-container mb-3">
              {capturedUrl ? (
                <img src={capturedUrl} alt="Captured" className="camera-video" />
              ) : (
                <video ref={videoRef} playsInline autoPlay muted className="camera-video" />
              )}
              <canvas ref={canvasRef} className="d-none" />
              <div className="camera-guide-overlay"></div>
            </div>

            <div className="small text-muted mb-3">
              Position patient face inside the oval guide.
            </div>

            <div className="d-flex justify-content-center gap-2">
              {!capturedUrl ? (
                <button type="button" className="btn btn-primary-custom d-flex align-items-center gap-1" onClick={handleCapture}>
                  <Camera size={16} />
                  <span>Snap Photo</span>
                </button>
              ) : (
                <>
                  <button type="button" className="btn btn-outline-secondary d-flex align-items-center gap-1" onClick={handleRetake}>
                    <RotateCcw size={16} />
                    <span>Retake</span>
                  </button>
                  <button type="button" className="btn btn-success d-flex align-items-center gap-1" onClick={handleAccept}>
                    <Check size={16} />
                    <span>Use This Photo</span>
                  </button>
                </>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

