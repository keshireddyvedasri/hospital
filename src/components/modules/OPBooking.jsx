import React, { useState } from 'react';
import { User, Phone, MapPin, Calendar, Clock, CheckCircle2, QrCode, ShieldCheck, CreditCard, Building2, AlertCircle, Search, X, Check, Filter } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const DEPT_KEYWORDS = {
  'DEP-GEN': ['general', 'medicine', 'fever', 'cold', 'cough', 'headache', 'body pain', 'bp', 'sugar', 'diabetes', 'vomiting', 'weakness', 'infections', 'physician'],
  'DEP-CARD': ['cardiology', 'heart', 'cardiac', 'chest pain', 'bp', 'hypertension', 'ecg', 'bypass', 'breathlessness', 'angina', 'palpitations'],
  'DEP-ORTH': ['orthopedics', 'ortho', 'bone', 'bones', 'fracture', 'joint', 'knee', 'pain', 'accident', 'trauma', 'spine', 'back pain', 'arthritis'],
  'DEP-PED': ['pediatrics', 'pedia', 'child', 'children', 'baby', 'kids', 'infant', 'newborn', 'neonatal', 'vaccination', 'growth'],
  'DEP-DERM': ['dermatology', 'skin', 'rash', 'allergy', 'itching', 'hair', 'acne', 'fungal', 'scalp', 'derma', 'skin clinic'],
  'DEP-ENT': ['ent', 'ear', 'nose', 'throat', 'hearing', 'tonsils', 'sinus', 'voice', 'snoring', 'dizziness'],
  'DEP-PULM': ['pulmonology', 'chest', 'lungs', 'breathing', 'asthma', 'allergy', 'tb', 'tuberculosis', 'wheezing', 'respiratory'],
  'DEP-GYN': ['gynecology', 'obstetrics', 'women', 'pregnancy', 'maternity', 'delivery', 'menstrual', 'gyn']
};

const QUICK_FILTERS = [
  { label: 'All', id: 'ALL' },
  { label: '❤️ Heart (Cardio)', id: 'DEP-CARD' },
  { label: '🦴 Bones (Ortho)', id: 'DEP-ORTH' },
  { label: '👶 Child (Pedia)', id: 'DEP-PED' },
  { label: '🩺 General', id: 'DEP-GEN' },
  { label: '✨ Skin (Derma)', id: 'DEP-DERM' },
  { label: '👂 ENT', id: 'DEP-ENT' },
  { label: '🫁 Lungs (Chest)', id: 'DEP-PULM' },
  { label: '🤰 Maternity', id: 'DEP-GYN' }
];

export default function OPBooking({ store, onBookingSuccess }) {
  const { t, language } = useLanguage();
  const [fullName, setFullName] = useState('');
  const [aadharNumber, setAadharNumber] = useState('');
  const [mobile, setMobile] = useState('');
  const [dob, setDob] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [bloodGroup, setBloodGroup] = useState('B+');
  const [address, setAddress] = useState('');
  const [district, setDistrict] = useState('Warangal Urban');
  const [stateName, setStateName] = useState('Telangana');
  const [pinCode, setPinCode] = useState('506007');
  const [departmentId, setDepartmentId] = useState('DEP-CARD');
  const [doctorId, setDoctorId] = useState('DOC-101');
  const [visitDate, setVisitDate] = useState(new Date().toISOString().split('T')[0]);
  const [timeSlot, setTimeSlot] = useState('Morning Slot (09:00 AM - 11:30 AM)');
  const [symptoms, setSymptoms] = useState('');
  const [deptSearchQuery, setDeptSearchQuery] = useState('');
  const [isDeptDropdownOpen, setIsDeptDropdownOpen] = useState(false);

  const [duplicatePatient, setDuplicatePatient] = useState(null);
  const [aadharError, setAadharError] = useState('');
  const [mobileError, setMobileError] = useState('');

  const state = store.getState();
  const hospital = store.getHospital();
  const departments = state.departments || [];
  const doctorsInDept = (state.doctors || []).filter(d => d.departmentId === departmentId);

  const handleSelectDepartment = (dept) => {
    setDepartmentId(dept.id);
    const docs = (state.doctors || []).filter(d => d.departmentId === dept.id);
    if (docs.length > 0) {
      setDoctorId(docs[0].id);
    } else {
      setDoctorId('');
    }
    setIsDeptDropdownOpen(false);
  };

  const filteredDepartments = departments.filter(d => {
    if (!deptSearchQuery.trim()) return true;
    const q = deptSearchQuery.toLowerCase().trim();
    const nameMatch = d.name.toLowerCase().includes(q);
    const codeMatch = (d.code || '').toLowerCase().includes(q);
    const floorMatch = (d.floor || '').toLowerCase().includes(q);
    const keywords = DEPT_KEYWORDS[d.id] || [];
    const keywordMatch = keywords.some(k => k.includes(q) || q.includes(k));
    return nameMatch || codeMatch || floorMatch || keywordMatch;
  });

  const selectedDeptObj = departments.find(d => d.id === departmentId) || departments[0];

  // Sync Age and DOB
  const handleDobChange = (e) => {
    const val = e.target.value;
    setDob(val);
    if (val) {
      const birthYear = new Date(val).getFullYear();
      const currentYear = new Date().getFullYear();
      const calculatedAge = currentYear - birthYear;
      if (calculatedAge >= 0 && calculatedAge <= 120) setAge(calculatedAge);
    }
  };

  const handleAgeChange = (e) => {
    const val = e.target.value;
    setAge(val);
    if (val && !dob) {
      const birthYear = new Date().getFullYear() - parseInt(val, 10);
      setDob(`${birthYear}-01-01`);
    }
  };

  // Format and Validate Aadhaar (12 digits)
  const handleAadharChange = (e) => {
    const rawDigits = e.target.value.replace(/\D/g, '');
    const clean = rawDigits.substring(0, 12);
    setAadharNumber(clean);

    if (clean.length > 0 && clean.length < 12) {
      setAadharError('Aadhaar must be exactly 12 digits');
    } else {
      setAadharError('');
    }

    if (clean.length === 12) {
      const existing = store.getPatientByAadhar(clean);
      if (existing) {
        setDuplicatePatient(existing);
      } else if (mobile.length === 10) {
        const mobExisting = store.getPatientByMobile(mobile);
        setDuplicatePatient(mobExisting || null);
      }
    }
  };

  // Duplicate Check when 10 digits entered
  const handleMobileChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 10) val = val.substring(0, 10);
    setMobile(val);

    if (val.length > 0 && !/^[6-9]/.test(val)) {
      setMobileError('Mobile number must start with 6, 7, 8, or 9');
    } else if (val.length > 0 && val.length < 10) {
      setMobileError('Mobile number must be 10 digits');
    } else {
      setMobileError('');
    }

    if (val.length === 10) {
      const existing = store.getPatientByMobile(val) || (aadharNumber.length === 12 ? store.getPatientByAadhar(aadharNumber) : null);
      if (existing) {
        setDuplicatePatient(existing);
      } else {
        setDuplicatePatient(null);
      }
    } else if (aadharNumber.length !== 12) {
      setDuplicatePatient(null);
    }
  };

  const handleUseSavedProfile = () => {
    if (duplicatePatient) {
      setFullName(duplicatePatient.fullName || '');
      setAadharNumber(duplicatePatient.aadharNumber || aadharNumber);
      setMobile(duplicatePatient.mobile || mobile);
      setAge(duplicatePatient.age || '');
      setDob(duplicatePatient.dob || '');
      setGender(duplicatePatient.gender || 'Male');
      setBloodGroup(duplicatePatient.bloodGroup || 'B+');
      setAddress(duplicatePatient.address || '');
      setDistrict(duplicatePatient.district || 'Warangal Urban');
      setStateName(duplicatePatient.state || 'Telangana');
      setPinCode(duplicatePatient.pinCode || '506007');
      setDuplicatePatient(null);
    }
  };

  const handleDepartmentChange = (e) => {
    const newDeptId = e.target.value;
    setDepartmentId(newDeptId);
    const docs = (state.doctors || []).filter(d => d.departmentId === newDeptId);
    if (docs.length > 0) {
      setDoctorId(docs[0].id);
    } else {
      setDoctorId('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate 12-digit Aadhaar Card Number
    if (!/^\d{12}$/.test(aadharNumber)) {
      alert('Mandatory Requirement: Please enter a valid 12-digit Aadhaar Card Number.');
      return;
    }

    // Validate 10-digit Indian Mobile Number
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      alert('Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.');
      return;
    }

    if (!departmentId || !doctorId) {
      alert('Please select both Department and Attending Doctor.');
      return;
    }

    // Step 1: Check or create patient (No photo required, Aadhaar mandatory)
    let patient = store.getPatientByAadhar(aadharNumber) || store.getPatientByMobile(mobile);
    if (!patient) {
      const patRes = store.createPatient({
        fullName,
        aadharNumber,
        mobile,
        dob,
        age,
        gender,
        bloodGroup,
        address,
        district,
        state: stateName,
        pinCode
      });
      patient = patRes.patient;
    } else {
      // Update patient's Aadhaar if missing
      if (!patient.aadharNumber) {
        store.updatePatient(patient.id, { aadharNumber });
        patient.aadharNumber = aadharNumber;
      }
    }

    // Step 2: Create appointment dedicated to Govt MGM Hospital Warangal
    const apptRes = store.createAppointment({
      patientId: patient.id,
      hospitalId: hospital.id,
      departmentId,
      doctorId,
      date: visitDate,
      timeSlot,
      reason: symptoms || 'General Outpatient Consultation'
    });

    if (apptRes.success) {
      onBookingSuccess({
        appointment: apptRes.appointment,
        patient,
        doctor: state.doctors.find(d => d.id === doctorId),
        department: state.departments.find(d => d.id === departmentId),
        hospital
      });
    }
  };

  // Helper to format Aadhaar for display
  const formatAadharDisplay = (val) => {
    if (!val) return '';
    return val.replace(/(\d{4})/g, '$1 ').trim();
  };

  return (
    <div className="card card-healthcare shadow-sm border-0">
      {/* Card Header dedicated to MGM Hospital Warangal */}
      <div className="card-header-healthcare bg-primary text-white py-3">
        <div className="d-flex align-items-center gap-2">
          <Calendar size={24} />
          <div>
            <h4 className="mb-0 text-white fw-bold">{t('opFormTitle')}</h4>
            <div className="text-white-50 small">{t('opFormSubtitle')}</div>
          </div>
        </div>
        <span className="badge bg-light text-dark px-3 py-2 fw-bold">{t('freeOpBadge')}</span>
      </div>

      <div className="card-body p-4 p-md-5">
        
        {/* Hospital Banner */}
        <div className="p-3 mb-4 rounded-3 bg-light border border-primary-subtle d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div className="d-flex align-items-center gap-3">
            <div className="bg-primary text-white p-2 rounded-3 d-flex align-items-center justify-content-center">
              <Building2 size={28} />
            </div>
            <div>
              <div className="small text-uppercase fw-bold text-primary">{t('dedicatedFacility')}</div>
              <h5 className="fw-bold text-dark mb-0">
                {language === 'te' ? hospital.localName : hospital.name}
              </h5>
              <div className="text-muted small">
                {hospital.address}
              </div>
              <div className="small text-secondary">
                {language === 'te' 
                  ? <><strong>కాకతీయ మెడికల్ కాలేజ్ (KMC)</strong> అనుబంధ బోధనా ఆసుపత్రి &bull; అత్యవసర విభాగం: <strong>{hospital.emergencyPhone}</strong></>
                  : <>Affiliated with <strong>Kakatiya Medical College (KMC)</strong> &bull; Emergency Casualty: <strong>{hospital.emergencyPhone}</strong></>}
              </div>
            </div>
          </div>
          <span className="badge bg-success-subtle text-success fs-6 px-3 py-2 border border-success">
            {t('freeHealthcareBadge')}
          </span>
        </div>

        {/* Duplicate Notice */}
        {duplicatePatient && (
          <div className="alert alert-primary py-3 px-3 mb-4 d-flex align-items-center justify-content-between flex-wrap gap-2">
            <div className="d-flex align-items-center gap-2">
              <CheckCircle2 size={22} className="text-primary flex-shrink-0" />
              <div>
                <strong>{t('existingRecordFound')}</strong> {duplicatePatient.fullName} (ID: {duplicatePatient.id}, Aadhaar: XXXX-XXXX-{duplicatePatient.aadharNumber ? duplicatePatient.aadharNumber.slice(-4) : 'XXXX'})
                <div className="small text-muted">
                  {language === 'te' ? 'మీ పాత వివరాలను ఫారంలో నింపేందుకు క్రింది బటన్ నొక్కండి.' : 'Click below to auto-populate your details from MGM Hospital database.'}
                </div>
              </div>
            </div>
            <button type="button" className="btn btn-sm btn-primary" onClick={handleUseSavedProfile}>
              {t('useSavedProfile')}
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          
          {/* Section 1: Demographics (Aadhaar Mandatory, No Photo Required) */}
          <div className="mb-4">
            <h5 className="text-primary fw-bold border-bottom pb-2 mb-3 d-flex align-items-center justify-content-between">
              <span className="d-flex align-items-center gap-2">
                <User size={20} />
                <span>{t('demographicsSection')}</span>
              </span>
              <span className="badge bg-light text-secondary small fw-normal border">
                {t('noPhotoNeeded')}
              </span>
            </h5>

            <div className="row g-3">
              
              {/* Full Name */}
              <div className="col-md-6">
                <label className="form-label">{t('fullNameLabel')} <span className="text-danger">*</span></label>
                <input
                  type="text"
                  className="form-control"
                  placeholder={t('fullNamePlaceholder')}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              {/* MANDATORY AADHAAR CARD NUMBER */}
              <div className="col-md-6">
                <label className="form-label d-flex justify-content-between align-items-center">
                  <span>{t('aadharLabel')} <span className="text-danger">*</span></span>
                  <span className="badge bg-primary-subtle text-primary">{t('aadharMandatory')}</span>
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted">
                    <CreditCard size={18} />
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    className={`form-control ${aadharError ? 'is-invalid' : aadharNumber.length === 12 ? 'is-valid' : ''}`}
                    placeholder={t('aadharPlaceholder')}
                    value={aadharNumber}
                    onChange={handleAadharChange}
                    maxLength="12"
                    required
                  />
                </div>
                {aadharError ? (
                  <div className="text-danger small mt-1">{aadharError}</div>
                ) : (
                  <div className="form-text text-muted">
                    {t('aadharHelpText')}
                  </div>
                )}
              </div>

              {/* Mobile Number */}
              <div className="col-md-6">
                <label className="form-label">{t('mobileLabel')} <span className="text-danger">*</span></label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted fw-bold">+91</span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    className={`form-control ${mobileError ? 'is-invalid' : mobile.length === 10 ? 'is-valid' : ''}`}
                    placeholder="9876543210"
                    value={mobile}
                    onChange={handleMobileChange}
                    pattern="[6-9][0-9]{9}"
                    maxLength="10"
                    required
                  />
                </div>
                {mobileError ? (
                  <div className="text-danger small mt-1">{mobileError}</div>
                ) : (
                  <div className="form-text text-muted">{t('mobileHelpText')}</div>
                )}
              </div>

              {/* Date of Birth */}
              <div className="col-md-3">
                <label className="form-label">{t('dobLabel')}</label>
                <input
                  type="date"
                  className="form-control"
                  value={dob}
                  onChange={handleDobChange}
                />
              </div>

              {/* Age */}
              <div className="col-md-3">
                <label className="form-label">{t('ageLabel')} <span className="text-danger">*</span></label>
                <input
                  type="number"
                  className="form-control"
                  placeholder={t('yrsPlaceholder')}
                  value={age}
                  min="0"
                  max="120"
                  onChange={handleAgeChange}
                  required
                />
              </div>

              {/* Gender */}
              <div className="col-md-3">
                <label className="form-label">{t('genderLabel')} <span className="text-danger">*</span></label>
                <select className="form-select" value={gender} onChange={(e) => setGender(e.target.value)} required>
                  <option value="Male">{t('genderMale')}</option>
                  <option value="Female">{t('genderFemale')}</option>
                  <option value="Other">{t('genderOther')}</option>
                </select>
              </div>

              {/* Blood Group */}
              <div className="col-md-3">
                <label className="form-label">{t('bloodGroupLabel')}</label>
                <select className="form-select" value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)}>
                  <option value="Unknown">{t('dontKnowBlood')}</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>

              {/* Residential Address */}
              <div className="col-md-6">
                <label className="form-label">{t('addressLabel')} <span className="text-danger">*</span></label>
                <textarea
                  className="form-control"
                  rows="2"
                  placeholder={t('addressPlaceholder')}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                ></textarea>
              </div>

              {/* District (Warangal Focus) */}
              <div className="col-md-4">
                <label className="form-label">{t('districtLabel')} <span className="text-danger">*</span></label>
                <select className="form-select" value={district} onChange={(e) => setDistrict(e.target.value)} required>
                  <option value="Warangal Urban">Warangal Urban</option>
                  <option value="Warangal Rural">Warangal Rural</option>
                  <option value="Hanamkonda">Hanamkonda</option>
                  <option value="Jangaon">Jangaon</option>
                  <option value="Mahabubabad">Mahabubabad</option>
                  <option value="Jayashankar Bhupalpally">Jayashankar Bhupalpally</option>
                  <option value="Mulugu">Mulugu</option>
                  <option value="Karimnagar">Karimnagar</option>
                  <option value="Khammam">Khammam</option>
                  <option value="Other District">Other District</option>
                </select>
              </div>

              {/* State */}
              <div className="col-md-4">
                <label className="form-label">{t('stateLabel')} <span className="text-danger">*</span></label>
                <select className="form-select" value={stateName} onChange={(e) => setStateName(e.target.value)} required>
                  <option value="Telangana">Telangana</option>
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Other">Other State</option>
                </select>
              </div>

              {/* PIN Code */}
              <div className="col-md-4">
                <label className="form-label">{t('pinCodeLabel')} <span className="text-danger">*</span></label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="6-digit PIN"
                  value={pinCode}
                  maxLength="6"
                  onChange={(e) => setPinCode(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 2: Department & Doctor */}
          <div className="mb-4">
            <h5 className="text-primary fw-bold border-bottom pb-2 mb-3 d-flex align-items-center gap-2">
              <Calendar size={20} />
              <span>{t('deptDocSection')}</span>
            </h5>

            <div className="row g-3">
              {/* Medical Department with Search Option */}
              <div className="col-md-6 position-relative">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="form-label fw-bold mb-0">
                    {t('selectDeptLabel')} <span className="text-danger">*</span>
                  </label>
                  {deptSearchQuery && (
                    <button
                      type="button"
                      className="btn btn-link btn-sm p-0 text-decoration-none text-muted small"
                      onClick={() => setDeptSearchQuery('')}
                    >
                      ✕ {t('clearSearch') || 'Clear'}
                    </button>
                  )}
                </div>

                {/* Search Bar Input */}
                <div className="input-group mb-2 shadow-sm rounded-3">
                  <span className="input-group-text bg-white text-primary border-end-0">
                    <Search size={16} />
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0 border-end-0 ps-1"
                    placeholder={t('searchDeptPlaceholder')}
                    value={deptSearchQuery}
                    onChange={(e) => {
                      setDeptSearchQuery(e.target.value);
                      setIsDeptDropdownOpen(true);
                    }}
                    onFocus={() => setIsDeptDropdownOpen(true)}
                    aria-label="Search Department"
                  />
                  {deptSearchQuery ? (
                    <button
                      type="button"
                      className="btn btn-outline-secondary border-start-0 bg-white"
                      onClick={() => setDeptSearchQuery('')}
                      title="Clear"
                    >
                      <X size={14} />
                    </button>
                  ) : (
                    <span className="input-group-text bg-white text-muted border-start-0">
                      <Filter size={14} />
                    </span>
                  )}
                </div>

                {/* Instant Search Results Dropdown List */}
                {isDeptDropdownOpen && deptSearchQuery.trim().length > 0 && (
                  <div
                    className="position-absolute start-0 end-0 bg-white shadow-lg rounded-3 border p-2 mb-2"
                    style={{ zIndex: 1050, top: '75px', maxHeight: '280px', overflowY: 'auto' }}
                  >
                    <div className="d-flex justify-content-between align-items-center px-2 py-1 text-muted small border-bottom mb-1">
                      <span>{filteredDepartments.length} {filteredDepartments.length === 1 ? 'department match' : 'departments match'}</span>
                      <button
                        type="button"
                        className="btn btn-link btn-sm p-0 text-muted"
                        onClick={() => setIsDeptDropdownOpen(false)}
                      >
                        Close ✕
                      </button>
                    </div>

                    {filteredDepartments.length > 0 ? (
                      filteredDepartments.map((d) => {
                        const isSelected = d.id === departmentId;
                        const doctorCount = (state.doctors || []).filter(doc => doc.departmentId === d.id).length;
                        return (
                          <div
                            key={d.id}
                            className={`p-2 rounded-2 d-flex align-items-center justify-content-between mb-1 ${isSelected ? 'bg-primary text-white' : 'hover-bg-light'}`}
                            style={{ cursor: 'pointer', transition: 'background-color 0.15s' }}
                            onClick={() => handleSelectDepartment(d)}
                          >
                            <div>
                              <div className={`fw-bold small ${isSelected ? 'text-white' : 'text-dark'}`}>
                                {d.name}
                              </div>
                              <div className={`small ${isSelected ? 'text-white-50' : 'text-muted'}`} style={{ fontSize: '0.74rem' }}>
                                {d.floor}
                              </div>
                            </div>
                            <div className="d-flex align-items-center gap-2">
                              <span className={`badge ${isSelected ? 'bg-light text-primary' : 'bg-secondary-subtle text-secondary'}`} style={{ fontSize: '0.68rem' }}>
                                {doctorCount} {doctorCount === 1 ? 'Doctor' : 'Doctors'}
                              </span>
                              {isSelected && <Check size={16} className="text-white" />}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-3 text-center text-muted small">
                        <AlertCircle size={20} className="text-warning mb-1 d-block mx-auto" />
                        <div>{t('noDeptFound')} <strong>"{deptSearchQuery}"</strong></div>
                        <div className="text-muted mt-1" style={{ fontSize: '0.72rem' }}>
                          Try searching by organ or symptom: "Heart", "Bone", "Skin", "Child", "Fever", "Lungs", "ENT"
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Native Department Select (Filtered and Accessible) */}
                <select className="form-select shadow-sm" value={departmentId} onChange={handleDepartmentChange} required>
                  {filteredDepartments.length > 0 ? (
                    filteredDepartments.map(d => (
                      <option key={d.id} value={d.id}>{d.name} ({d.floor})</option>
                    ))
                  ) : (
                    departments.map(d => (
                      <option key={d.id} value={d.id}>{d.name} ({d.floor})</option>
                    ))
                  )}
                </select>

                {/* Active Selected Department Indicator Badge */}
                {selectedDeptObj && (
                  <div className="mt-1 d-flex align-items-center gap-1 text-success fw-semibold small" style={{ fontSize: '0.75rem' }}>
                    <CheckCircle2 size={13} className="text-success flex-shrink-0" />
                    <span>{t('selectedDeptLabel')} <strong>{selectedDeptObj.name}</strong> &bull; {selectedDeptObj.floor}</span>
                  </div>
                )}

                {/* Quick Specialty Search Filter Chips */}
                <div className="mt-2">
                  <span className="text-muted small fw-bold d-block mb-1" style={{ fontSize: '0.72rem' }}>
                    {t('quickSpecialties')}
                  </span>
                  <div className="d-flex flex-wrap gap-1">
                    {QUICK_FILTERS.map(chip => {
                      const isActive = chip.id === 'ALL' ? !deptSearchQuery : departmentId === chip.id;
                      return (
                        <button
                          key={chip.id}
                          type="button"
                          className={`btn btn-sm py-0 px-2 rounded-pill ${isActive ? 'btn-primary shadow-sm' : 'btn-outline-secondary'}`}
                          style={{ fontSize: '0.72rem', lineHeight: '1.6' }}
                          onClick={() => {
                            if (chip.id === 'ALL') {
                              setDeptSearchQuery('');
                              setIsDeptDropdownOpen(false);
                            } else {
                              const target = departments.find(d => d.id === chip.id);
                              if (target) {
                                handleSelectDepartment(target);
                                setDeptSearchQuery('');
                              }
                            }
                          }}
                        >
                          {chip.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Doctor with Live GPS Chamber Indicator */}
              <div className="col-md-6">
                <label className="form-label">{t('selectDocLabel')} <span className="text-danger">*</span></label>
                <select className="form-select" value={doctorId} onChange={(e) => setDoctorId(e.target.value)} required>
                  {doctorsInDept.map(doc => {
                    const statusTag = doc.dutyVerification?.isVerified
                      ? `🟢 ${t('inChamberTag')}`
                      : `⚪ ${t('notCheckedInTag')}`;
                    return (
                      <option key={doc.id} value={doc.id}>
                        {doc.name} - {statusTag} - {doc.roomNo}
                      </option>
                    );
                  })}
                </select>
                <div className="form-text text-muted">
                  {t('selectDocHelp')}
                </div>
              </div>

              {/* Visit Date */}
              <div className="col-md-4">
                <label className="form-label">{t('visitDateLabel')} <span className="text-danger">*</span></label>
                <input
                  type="date"
                  className="form-control"
                  value={visitDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setVisitDate(e.target.value)}
                  required
                />
              </div>

              {/* Time Slot */}
              <div className="col-md-4">
                <label className="form-label">{t('timeSlotLabel')} <span className="text-danger">*</span></label>
                <select className="form-select" value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)} required>
                  <option value="Morning Slot (09:00 AM - 11:30 AM)">{t('morningSlot')}</option>
                  <option value="Afternoon Slot (12:00 PM - 03:00 PM)">{t('afternoonSlot')}</option>
                </select>
              </div>

              {/* Token Quota Note */}
              <div className="col-md-4 d-flex align-items-end">
                <div className="p-2 bg-light rounded text-muted small border w-100">
                  <ShieldCheck size={16} className="text-success d-inline me-1" />
                  <strong>{t('opdPolicyNote')}</strong>
                </div>
              </div>

              {/* Symptoms */}
              <div className="col-md-12">
                <label className="form-label">{t('symptomsLabel')}</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder={t('symptomsPlaceholder')}
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center pt-3 border-top flex-wrap gap-2">
            <span className="text-muted small">
              <CheckCircle2 size={15} className="text-success d-inline me-1" />
              {t('instantTicketNote')}
            </span>
            <button type="submit" className="btn btn-primary-custom px-4 py-2 fs-5 d-flex align-items-center gap-2">
              <QrCode size={20} />
              <span>{t('submitOpBtn')}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

