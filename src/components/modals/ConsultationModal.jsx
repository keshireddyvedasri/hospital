import React, { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle, Stethoscope, AlertTriangle } from 'lucide-react';

export default function ConsultationModal({ isOpen, onClose, appointment, patient, doctor, department, onCompleteConsultation }) {
  const [bp, setBp] = useState('128/82 mmHg');
  const [pulse, setPulse] = useState('74 bpm');
  const [temp, setTemp] = useState('98.4 °F');
  const [spo2, setSpo2] = useState('99%');
  const [weight, setWeight] = useState('70 kg');
  const [symptoms, setSymptoms] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');
  const [followUp, setFollowUp] = useState('In 2 Weeks');

  const [prescriptions, setPrescriptions] = useState([
    { medicine: 'Tab. Paracetamol', dosage: '650 mg', frequency: '1-0-1 (Morning-Night)', duration: '5 Days', instructions: 'After food' }
  ]);

  useEffect(() => {
    if (appointment) {
      setSymptoms(appointment.reason || '');
      setDiagnosis('');
      setNotes('');
      setPrescriptions([
        { medicine: 'Tab. Paracetamol', dosage: '650 mg', frequency: '1-0-1 (Morning-Night)', duration: '5 Days', instructions: 'After food' }
      ]);
    }
  }, [appointment, isOpen]);

  if (!isOpen || !appointment || !patient) return null;

  const handleAddDrug = () => {
    setPrescriptions([...prescriptions, { medicine: '', dosage: '', frequency: '1-0-1 (Morning-Night)', duration: '5 Days', instructions: 'After food' }]);
  };

  const handleRemoveDrug = (index) => {
    setPrescriptions(prescriptions.filter((_, i) => i !== index));
  };

  const handleDrugChange = (index, field, value) => {
    const updated = [...prescriptions];
    updated[index][field] = value;
    setPrescriptions(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!diagnosis.trim()) {
      alert('Please enter a clinical diagnosis');
      return;
    }

    onCompleteConsultation({
      patientId: patient.id,
      appointmentId: appointment.id,
      doctorId: appointment.doctorId,
      doctorName: doctor?.name || 'OPD Doctor',
      departmentId: appointment.departmentId,
      departmentName: department?.name || 'OPD',
      visitDate: new Date().toISOString().split('T')[0],
      symptoms: symptoms ? [symptoms] : ['General complaint'],
      vitals: {
        bloodPressure: bp,
        pulseRate: pulse,
        temperature: temp,
        spo2,
        weight
      },
      diagnosis,
      prescriptions: prescriptions.filter(p => p.medicine.trim()),
      notes,
      nextFollowUp: followUp
    });
  };

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
      <div className="modal-dialog modal-dialog-centered modal-fullscreen">
        <div className="modal-content border-0">
          
          <div className="modal-header bg-dark text-white py-2">
            <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
              <Stethoscope size={20} className="text-primary" />
              <span>Doctor Consultation & E-Prescription Workspace</span>
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>

          <form onSubmit={handleSubmit} className="d-flex flex-column flex-grow-1">
            <div className="modal-body p-3 bg-light flex-grow-1 overflow-auto">
              <div className="row g-3 h-100">
                
                {/* Left Pane: Patient Dossier */}
                <div className="col-lg-4 d-flex flex-column">
                  <div className="card card-healthcare p-3 mb-3">
                    <div className="d-flex align-items-center gap-3">
                      <img src={patient.photo || 'assets/images/emblem.svg'} className="rounded-circle border" width="60" height="60" alt={patient.fullName} />
                      <div>
                        <h4 className="fw-bold text-dark mb-0">{patient.fullName}</h4>
                        <div className="text-primary small">{patient.id}</div>
                        <div className="text-muted small">{patient.age} Yrs &bull; {patient.gender}</div>
                      </div>
                      <span className="badge bg-primary fs-6 ms-auto">Token #{appointment.tokenNo}</span>
                    </div>

                    {patient.allergies && !patient.allergies.includes('No Known Drug Allergies') && (
                      <div className="alert alert-danger py-1 px-2 mt-2 mb-0 small d-flex align-items-center gap-1">
                        <AlertTriangle size={14} />
                        <span>Allergy: {patient.allergies.join(', ')}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Pane: Clinical Entry */}
                <div className="col-lg-8 d-flex flex-column">
                  <div className="card card-healthcare p-4 flex-grow-1">
                    
                    {/* Vitals */}
                    <div className="p-3 bg-light rounded-3 border mb-3">
                      <h6 className="fw-bold text-secondary mb-2">Patient Vitals</h6>
                      <div className="row g-2">
                        <div className="col">
                          <label className="form-label small mb-0">BP</label>
                          <input type="text" className="form-control form-control-sm" value={bp} onChange={(e) => setBp(e.target.value)} />
                        </div>
                        <div className="col">
                          <label className="form-label small mb-0">Pulse</label>
                          <input type="text" className="form-control form-control-sm" value={pulse} onChange={(e) => setPulse(e.target.value)} />
                        </div>
                        <div className="col">
                          <label className="form-label small mb-0">Temp</label>
                          <input type="text" className="form-control form-control-sm" value={temp} onChange={(e) => setTemp(e.target.value)} />
                        </div>
                        <div className="col">
                          <label className="form-label small mb-0">SpO2</label>
                          <input type="text" className="form-control form-control-sm" value={spo2} onChange={(e) => setSpo2(e.target.value)} />
                        </div>
                        <div className="col">
                          <label className="form-label small mb-0">Weight</label>
                          <input type="text" className="form-control form-control-sm" value={weight} onChange={(e) => setWeight(e.target.value)} />
                        </div>
                      </div>
                    </div>

                    {/* Symptoms */}
                    <div className="mb-3">
                      <label className="form-label">Symptoms & Complaints</label>
                      <input type="text" className="form-control" value={symptoms} onChange={(e) => setSymptoms(e.target.value)} />
                    </div>

                    {/* Diagnosis */}
                    <div className="mb-3">
                      <label className="form-label">Clinical Diagnosis <span className="text-danger">*</span></label>
                      <input 
                        type="text" 
                        className="form-control fw-bold text-primary" 
                        value={diagnosis} 
                        onChange={(e) => setDiagnosis(e.target.value)} 
                        placeholder="e.g. Essential Hypertension Grade 1 / Viral Bronchitis"
                        required 
                      />
                    </div>

                    {/* Prescriptions */}
                    <div className="mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <label className="form-label mb-0">Prescription Builder (Rx)</label>
                        <button type="button" className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1" onClick={handleAddDrug}>
                          <Plus size={14} />
                          <span>Add Medicine</span>
                        </button>
                      </div>

                      <table className="table table-sm table-bordered mb-0">
                        <thead>
                          <tr className="table-light">
                            <th>Drug Name</th>
                            <th style={{ width: '110px' }}>Dosage</th>
                            <th style={{ width: '130px' }}>Schedule</th>
                            <th style={{ width: '100px' }}>Duration</th>
                            <th>Instructions</th>
                            <th style={{ width: '45px' }}></th>
                          </tr>
                        </thead>
                        <tbody>
                          {prescriptions.map((rx, idx) => (
                            <tr key={idx}>
                              <td>
                                <input
                                  type="text"
                                  className="form-control form-control-sm"
                                  placeholder="Drug name"
                                  value={rx.medicine}
                                  onChange={(e) => handleDrugChange(idx, 'medicine', e.target.value)}
                                  required
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  className="form-control form-control-sm"
                                  placeholder="650 mg"
                                  value={rx.dosage}
                                  onChange={(e) => handleDrugChange(idx, 'dosage', e.target.value)}
                                />
                              </td>
                              <td>
                                <select
                                  className="form-select form-select-sm"
                                  value={rx.frequency}
                                  onChange={(e) => handleDrugChange(idx, 'frequency', e.target.value)}
                                >
                                  <option value="1-0-1 (Morning-Night)">1-0-1</option>
                                  <option value="1-0-0 (Morning)">1-0-0</option>
                                  <option value="0-0-1 (Night)">0-0-1</option>
                                  <option value="1-1-1 (Thrice)">1-1-1</option>
                                  <option value="1-1-1-1 (SOS)">1-1-1-1 (SOS)</option>
                                </select>
                              </td>
                              <td>
                                <input
                                  type="text"
                                  className="form-control form-control-sm"
                                  value={rx.duration}
                                  onChange={(e) => handleDrugChange(idx, 'duration', e.target.value)}
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  className="form-control form-control-sm"
                                  value={rx.instructions}
                                  onChange={(e) => handleDrugChange(idx, 'instructions', e.target.value)}
                                />
                              </td>
                              <td className="text-center">
                                <button type="button" className="btn btn-sm btn-outline-danger p-1" onClick={() => handleRemoveDrug(idx)}>
                                  <Trash2 size={14} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Notes & Follow Up */}
                    <div className="row g-2">
                      <div className="col-8">
                        <label className="form-label">Doctor Notes & Lifestyle Advice</label>
                        <textarea className="form-control" rows="2" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Diet, hydration, exercise"></textarea>
                      </div>
                      <div className="col-4">
                        <label className="form-label">Next Review</label>
                        <select className="form-select" value={followUp} onChange={(e) => setFollowUp(e.target.value)}>
                          <option value="In 1 Week">In 1 Week</option>
                          <option value="In 2 Weeks">In 2 Weeks</option>
                          <option value="In 1 Month">In 1 Month</option>
                          <option value="SOS (If Needed)">SOS (If Needed)</option>
                        </select>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            </div>

            <div className="modal-footer bg-white py-2">
              <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-success px-4 d-flex align-items-center gap-1">
                <CheckCircle size={16} />
                <span>Mark Completed & Save E-Record</span>
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}

