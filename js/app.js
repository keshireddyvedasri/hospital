/**
 * Arogya Care: Modern Digital Hospital & Health Records
 * Core Application Controller
 */

class AppController {
  constructor() {
    this.currentRole = 'landing'; // 'landing', 'patient', 'staff', 'doctor', 'admin'
    this.currentLandingTab = 'opBookingTab'; // 'opBookingTab', 'roomBookingTab', 'bloodBankTab', 'doctorStatusTab'
    this.currentUser = null;
    this.activeConsultationAppt = null;
    this.capturedPhotoBase64 = null;
  }

  init() {
    this.bindGlobalEvents();
    this.initAccessibility();
    this.initOPRegistrationForm();
    this.initRoomBooking();
    this.initBloodBank();
    this.initDoctorDirectory();
    this.switchRole('landing');
    console.log('Arogya Care Hospital System initialized successfully.');
  }

  // --- Accessibility Tools ---
  initAccessibility() {
    let currentScale = 17.5;
    const fontSmall = document.getElementById('btnFontSmall');
    const fontNormal = document.getElementById('btnFontNormal');
    const fontLarge = document.getElementById('btnFontLarge');
    const highContrastBtn = document.getElementById('btnHighContrast');

    if (fontSmall) {
      fontSmall.addEventListener('click', () => {
        currentScale = 15;
        document.documentElement.style.fontSize = `${currentScale}px`;
      });
    }
    if (fontNormal) {
      fontNormal.addEventListener('click', () => {
        currentScale = 17.5;
        document.documentElement.style.fontSize = `${currentScale}px`;
      });
    }
    if (fontLarge) {
      fontLarge.addEventListener('click', () => {
        currentScale = 20;
        document.documentElement.style.fontSize = `${currentScale}px`;
      });
    }
    if (highContrastBtn) {
      highContrastBtn.addEventListener('click', () => {
        document.body.classList.toggle('high-contrast');
      });
    }
  }

  // --- Global Event Bindings ---
  bindGlobalEvents() {
    // Quick Demo Role Switcher
    document.querySelectorAll('.role-pill-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const role = btn.dataset.role;
        const targetId = btn.dataset.targetId || null;
        this.switchRole(role, targetId);
      });
    });

    // Reset Demo Data
    const resetBtn = document.getElementById('btnResetDemoData');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('Reset database to default demonstration state?')) {
          window.dbStore.resetToDefault();
          this.showToast('Database reset to default seed records successfully.', 'success');
          this.switchRole(this.currentRole);
          this.renderRoomsList();
          this.renderBloodStock();
          this.renderDoctorDirectory();
        }
      });
    }

    // Camera Capture Modal Handlers
    this.bindCameraEvents();

    // QR Scanner Modal Handlers
    this.bindQRScannerEvents();

    // Landing Module Tabs (OP Booking, Room Booking, Blood Bank, Doctor Status)
    document.querySelectorAll('#landingMainTabs .nav-link').forEach(tab => {
      tab.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('#landingMainTabs .nav-link').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const targetTab = tab.dataset.tab;
        this.currentLandingTab = targetTab;

        ['opBookingTab', 'roomBookingTab', 'bloodBankTab', 'doctorStatusTab'].forEach(tId => {
          const el = document.getElementById(tId);
          if (el) el.classList.toggle('d-none', tId !== targetTab);
        });

        if (targetTab === 'roomBookingTab') this.renderRoomsList();
        if (targetTab === 'bloodBankTab') this.renderBloodStock();
        if (targetTab === 'doctorStatusTab') this.renderDoctorDirectory();
      });
    });
  }

  // --- View & Role Routing ---
  switchRole(role, targetId = null) {
    this.currentRole = role;

    document.querySelectorAll('.role-pill-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.role === role);
    });

    const views = ['landingView', 'patientView', 'staffView', 'doctorView', 'adminView'];
    views.forEach(vId => {
      const el = document.getElementById(vId);
      if (el) el.classList.add('d-none');
    });

    const targetEl = document.getElementById(`${role}View`);
    if (targetEl) {
      targetEl.classList.remove('d-none');
      targetEl.classList.add('fade-in');
    }

    if (role === 'landing') {
      this.currentUser = null;
      this.renderRoomsList();
      this.renderBloodStock();
      this.renderDoctorDirectory();
    } else if (role === 'patient') {
      const patId = targetId || 'GH-2026-89102';
      this.currentUser = window.dbStore.getPatientById(patId);
      this.loadPatientDashboard();
    } else if (role === 'staff') {
      this.currentUser = window.dbStore.getState().users.find(u => u.role === 'staff');
      this.loadStaffDashboard();
    } else if (role === 'doctor') {
      const docId = targetId || 'DOC-101';
      this.currentUser = window.dbStore.getDoctorById(docId);
      this.loadDoctorDashboard();
    } else if (role === 'admin') {
      this.currentUser = window.dbStore.getState().users.find(u => u.role === 'admin');
      this.loadAdminDashboard();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // =========================================================================
  // 1. PATIENT OP REGISTRATION MODULE
  // =========================================================================

  initOPRegistrationForm() {
    const form = document.getElementById('opRegistrationForm');
    if (!form) return;

    const hospSelect = document.getElementById('regHospital');
    const deptSelect = document.getElementById('regDepartment');
    const docSelect = document.getElementById('regDoctor');
    const dateInput = document.getElementById('regVisitDate');

    if (hospSelect) {
      const hospitals = window.dbStore.getHospitals();
      hospSelect.innerHTML = hospitals.map(h => `<option value="${h.id}">${h.name} (${h.city})</option>`).join('');
    }

    const populateDepartments = () => {
      if (!deptSelect) return;
      const depts = window.dbStore.getDepartments();
      deptSelect.innerHTML = '<option value="">-- Choose Medical Department --</option>' +
        depts.map(d => `<option value="${d.id}">${d.name} (${d.floor})</option>`).join('');
    };
    populateDepartments();

    // When department changes, show doctors with online/offline status
    if (deptSelect && docSelect) {
      deptSelect.addEventListener('change', () => {
        const deptId = deptSelect.value;
        if (!deptId) {
          docSelect.innerHTML = '<option value="">-- First Select Department --</option>';
          return;
        }
        const doctors = window.dbStore.getDoctors(deptId);
        if (doctors.length === 0) {
          docSelect.innerHTML = '<option value="">No doctors assigned to this department</option>';
        } else {
          docSelect.innerHTML = doctors.map(doc => {
            const statusLabel = doc.onlineStatus === 'online' ? '🟢 ONLINE (In Chamber)' : '⚪ OFFLINE (On Rounds)';
            return `<option value="${doc.id}">${doc.name} - ${statusLabel} - ${doc.roomNo}</option>`;
          }).join('');
        }
      });
    }

    // Date Constraints
    if (dateInput) {
      const today = new Date().toISOString().split('T')[0];
      const maxDate = new Date();
      maxDate.setDate(maxDate.getDate() + 7);
      dateInput.min = today;
      dateInput.max = maxDate.toISOString().split('T')[0];
      dateInput.value = today;
    }

    // Synchronize DOB and Age
    const dobInput = document.getElementById('regDob');
    const ageInput = document.getElementById('regAge');
    if (dobInput && ageInput) {
      dobInput.addEventListener('change', () => {
        if (dobInput.value) {
          const birthYear = new Date(dobInput.value).getFullYear();
          const curYear = new Date().getFullYear();
          const age = curYear - birthYear;
          if (age >= 0 && age <= 125) ageInput.value = age;
        }
      });
      ageInput.addEventListener('input', () => {
        const age = parseInt(ageInput.value, 10);
        if (age >= 0 && age <= 120 && !dobInput.value) {
          const year = new Date().getFullYear() - age;
          dobInput.value = `${year}-01-01`;
        }
      });
    }

    // 10-Digit Mobile duplicate detection
    const mobileInput = document.getElementById('regMobile');
    const dupAlert = document.getElementById('duplicatePatientNotice');

    if (mobileInput) {
      mobileInput.addEventListener('input', () => {
        let val = mobileInput.value.replace(/\D/g, '');
        if (val.length > 10) val = val.substring(0, 10);
        mobileInput.value = val;

        if (val.length === 10) {
          const existing = window.dbStore.getPatientByMobile(val);
          if (existing && dupAlert) {
            dupAlert.innerHTML = `
              <div class="alert alert-primary py-2 px-3 mb-0 d-flex align-items-center justify-content-between">
                <div>
                  <i class="bi bi-person-check-fill me-2 fs-5 text-primary"></i>
                  <strong>Existing Patient Found:</strong> ${existing.fullName} (ID: ${existing.id}, Age: ${existing.age})
                </div>
                <button type="button" class="btn btn-sm btn-primary" id="btnAutofillExisting">
                  Use Saved Profile
                </button>
              </div>`;
            dupAlert.classList.remove('d-none');

            document.getElementById('btnAutofillExisting')?.addEventListener('click', () => {
              this.autofillPatientData(existing);
              dupAlert.classList.add('d-none');
            });
          } else if (dupAlert) {
            dupAlert.classList.add('d-none');
          }
        } else if (dupAlert) {
          dupAlert.classList.add('d-none');
        }
      });
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleOPRegistrationSubmit(form);
    });
  }

  autofillPatientData(patient) {
    document.getElementById('regFullName').value = patient.fullName;
    document.getElementById('regMobile').value = patient.mobile;
    document.getElementById('regDob').value = patient.dob || '';
    document.getElementById('regAge').value = patient.age || '';
    document.getElementById('regGender').value = patient.gender || 'Male';
    document.getElementById('regBloodGroup').value = patient.bloodGroup || 'Unknown';
    document.getElementById('regAddress').value = patient.address || '';
    document.getElementById('regDistrict').value = patient.district || '';
    document.getElementById('regState').value = patient.state || 'Metro State';
    document.getElementById('regPinCode').value = patient.pinCode || '';
    if (patient.photo) {
      this.capturedPhotoBase64 = patient.photo;
      const preview = document.getElementById('patientPhotoPreview');
      if (preview) {
        preview.src = patient.photo;
        preview.classList.remove('d-none');
      }
    }
    this.showToast(`Autofilled profile for ${patient.fullName}`, 'info');
  }

  handleOPRegistrationSubmit(form) {
    const fullName = document.getElementById('regFullName').value.trim();
    const mobile = document.getElementById('regMobile').value.trim();
    const age = document.getElementById('regAge').value.trim();
    const dob = document.getElementById('regDob').value;
    const gender = document.getElementById('regGender').value;
    const bloodGroup = document.getElementById('regBloodGroup').value;
    const address = document.getElementById('regAddress').value.trim();
    const district = document.getElementById('regDistrict').value.trim();
    const state = document.getElementById('regState').value;
    const pinCode = document.getElementById('regPinCode').value.trim();
    const hospitalId = document.getElementById('regHospital').value;
    const departmentId = document.getElementById('regDepartment').value;
    const doctorId = document.getElementById('regDoctor').value;
    const visitDate = document.getElementById('regVisitDate').value;
    const timeSlot = document.getElementById('regTimeSlot').value;
    const reason = document.getElementById('regSymptoms').value.trim();

    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(mobile)) {
      alert('Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.');
      document.getElementById('regMobile').focus();
      return;
    }

    if (!departmentId || !doctorId) {
      alert('Please select both Department and Attending Doctor.');
      return;
    }

    let patient = window.dbStore.getPatientByMobile(mobile);
    if (!patient) {
      const patResult = window.dbStore.createPatient({
        fullName,
        mobile,
        dob,
        age,
        gender,
        bloodGroup,
        address,
        district,
        state,
        pinCode,
        photo: this.capturedPhotoBase64
      });
      patient = patResult.patient;
    } else {
      if (this.capturedPhotoBase64) {
        window.dbStore.updatePatient(patient.id, { photo: this.capturedPhotoBase64, address, pinCode });
        patient.photo = this.capturedPhotoBase64;
      }
    }

    const apptResult = window.dbStore.createAppointment({
      patientId: patient.id,
      hospitalId,
      departmentId,
      doctorId,
      date: visitDate,
      timeSlot,
      reason: reason || 'Outpatient Consultation'
    });

    if (apptResult.success) {
      this.showToast('OP Registration successful! Digital QR pass generated.', 'success');
      form.reset();
      this.capturedPhotoBase64 = null;
      const preview = document.getElementById('patientPhotoPreview');
      if (preview) preview.classList.add('d-none');

      this.showOPSlipModal(apptResult.appointment.id);
    }
  }

  // =========================================================================
  // 2. ROOM & BED BOOKING MODULE
  // =========================================================================

  initRoomBooking() {
    this.renderRoomsList();

    const bookForm = document.getElementById('bedBookingForm');
    if (bookForm) {
      bookForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleBedBookingSubmit();
      });
    }
  }

  renderRoomsList() {
    const container = document.getElementById('roomsListContainer');
    if (!container) return;

    const rooms = window.dbStore.getRooms();

    container.innerHTML = rooms.map(r => {
      const available = r.totalBeds - r.occupiedBeds;
      const pct = Math.round((r.occupiedBeds / r.totalBeds) * 100);
      const isFull = available <= 0;

      return `
        <div class="col-lg-4 col-md-6">
          <div class="room-card">
            <div class="room-header d-flex justify-content-between align-items-start">
              <div>
                <span class="badge bg-primary-subtle text-primary fw-bold mb-1">${r.category}</span>
                <h5 class="fw-bold mb-0 text-dark">${r.type}</h5>
                <small class="text-muted"><i class="bi bi-geo-alt me-1"></i> ${r.floor}</small>
              </div>
              <span class="badge ${isFull ? 'bg-danger' : 'bg-success'} fs-6">
                ${isFull ? 'Ward Full' : `${available} Beds Free`}
              </span>
            </div>

            <div class="p-3 flex-grow-1">
              <div class="d-flex justify-content-between align-items-center small mb-1">
                <span class="text-muted">Bed Occupancy:</span>
                <strong>${r.occupiedBeds} / ${r.totalBeds} Beds Occupied</strong>
              </div>
              <div class="bed-capacity-bar">
                <div class="bed-capacity-fill" style="width: ${pct}%;"></div>
              </div>

              <div class="my-3">
                <strong class="small text-secondary d-block mb-1">Ward Amenities:</strong>
                <div class="d-flex flex-wrap">
                  ${r.amenities.map(a => `<span class="amenity-tag">${a}</span>`).join('')}
                </div>
              </div>

              <div class="d-flex justify-content-between align-items-center pt-2 border-top">
                <div>
                  <small class="text-muted d-block">Hospital Charges</small>
                  <strong class="text-dark">${r.pricePerDay}</strong>
                </div>
                <button type="button" class="btn btn-sm ${isFull ? 'btn-secondary disabled' : 'btn-primary-custom'}" 
                  onclick="window.appController.openBedBookingModal('${r.id}')">
                  <i class="bi bi-door-open-fill me-1"></i> ${isFull ? 'Waitlist' : 'Book Bed / Room'}
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  openBedBookingModal(roomId) {
    const room = window.dbStore.getRoomById(roomId);
    if (!room) return;

    document.getElementById('bedBookRoomId').value = room.id;
    document.getElementById('bedBookRoomName').textContent = room.type;
    document.getElementById('bedBookCategory').textContent = `${room.category} &bull; ${room.pricePerDay}`;
    const available = room.totalBeds - room.occupiedBeds;
    document.getElementById('bedBookFreeCount').textContent = `${available} Beds Available`;

    // Pre-fill patient details if patient logged in
    const curPat = this.currentUser || window.dbStore.getPatients()[0];
    if (curPat) {
      document.getElementById('bedBookPatientName').value = curPat.fullName;
      document.getElementById('bedBookPatientId').value = curPat.id;
      document.getElementById('bedBookMobile').value = curPat.mobile;
    }

    const modalEl = document.getElementById('roomBookingModal');
    if (modalEl && typeof bootstrap !== 'undefined') {
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    }
  }

  handleBedBookingSubmit() {
    const roomId = document.getElementById('bedBookRoomId').value;
    const patientName = document.getElementById('bedBookPatientName').value.trim();
    const patientId = document.getElementById('bedBookPatientId').value.trim();
    const admitDate = document.getElementById('bedBookDate').value;
    const durationDays = document.getElementById('bedBookDays').value;
    const department = document.getElementById('bedBookDept').value;
    const notes = document.getElementById('bedBookNotes').value.trim();

    if (!patientName) {
      alert('Please enter patient name');
      return;
    }

    const res = window.dbStore.bookRoom({
      roomTypeId: roomId,
      patientId: patientId || `GH-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
      patientName,
      admitDate,
      durationDays,
      department,
      notes
    });

    if (res.success) {
      this.showToast(`Bed Allotted Successfully! Allocated: ${res.booking.bedNumber}`, 'success');
      const modalEl = document.getElementById('roomBookingModal');
      const m = bootstrap.Modal.getInstance(modalEl);
      if (m) m.hide();

      this.renderRoomsList();

      // Show Allotment Pass
      this.showBedAllotmentSlip(res.booking);
    } else {
      alert(res.message);
    }
  }

  showBedAllotmentSlip(booking) {
    document.getElementById('allotBookingId').textContent = booking.id;
    document.getElementById('allotBedNo').textContent = booking.bedNumber;
    document.getElementById('allotPatientName').textContent = booking.patientName;
    document.getElementById('allotPatientId').textContent = booking.patientId;
    document.getElementById('allotRoomType').textContent = booking.roomTypeName;
    document.getElementById('allotAdmitDate').textContent = booking.admitDate;
    document.getElementById('allotDuration').textContent = `${booking.durationDays} Days`;
    document.getElementById('allotDept').textContent = booking.department;

    window.qrEngine.generateQR('allotQrBox', {
      type: 'BED_ALLOTMENT',
      bkId: booking.id,
      bed: booking.bedNumber,
      pid: booking.patientId
    }, { size: 140 });

    const modalEl = document.getElementById('bedAllotmentSlipModal');
    if (modalEl && typeof bootstrap !== 'undefined') {
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    }
  }

  // =========================================================================
  // 3. BLOOD BANK REAL-TIME INVENTORY & REQUEST
  // =========================================================================

  initBloodBank() {
    this.renderBloodStock();

    const reqForm = document.getElementById('bloodRequestForm');
    if (reqForm) {
      reqForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleBloodRequestSubmit();
      });
    }
  }

  renderBloodStock() {
    const container = document.getElementById('bloodInventoryGrid');
    if (!container) return;

    const stock = window.dbStore.getBloodStock();

    container.innerHTML = stock.map(b => {
      let badgeClass = 'bg-success';
      if (b.status === 'Critical Low') badgeClass = 'bg-danger';
      else if (b.status === 'Low Stock') badgeClass = 'bg-warning text-dark';

      return `
        <div class="col-lg-3 col-md-4 col-6">
          <div class="blood-inventory-card">
            <div class="blood-drop-icon">
              <i class="bi bi-droplet-fill"></i>
            </div>
            <div class="blood-group-title">${b.group}</div>
            <div class="blood-units-count mb-1">${b.units} <span class="fs-6 text-muted fw-normal">Units</span></div>
            <span class="badge ${badgeClass} mb-2">${b.status}</span>
            <div class="small text-muted mb-3">Donors Today: <strong>${b.donorCountToday}</strong></div>
            <button type="button" class="btn btn-outline-danger btn-sm w-100" 
              onclick="window.appController.openBloodRequestModal('${b.group}')">
              <i class="bi bi-plus-circle me-1"></i> Request Unit
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  openBloodRequestModal(bloodGroup) {
    if (bloodGroup) {
      document.getElementById('bldReqGroup').value = bloodGroup;
    }

    const curPat = this.currentUser || window.dbStore.getPatients()[0];
    if (curPat) {
      document.getElementById('bldReqPatientName').value = curPat.fullName;
      document.getElementById('bldReqPatientId').value = curPat.id;
    }

    const modalEl = document.getElementById('bloodRequestModal');
    if (modalEl && typeof bootstrap !== 'undefined') {
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    }
  }

  handleBloodRequestSubmit() {
    const bloodGroup = document.getElementById('bldReqGroup').value;
    const unitsRequested = document.getElementById('bldReqUnits').value;
    const patientName = document.getElementById('bldReqPatientName').value.trim();
    const patientId = document.getElementById('bldReqPatientId').value.trim();
    const urgency = document.getElementById('bldReqUrgency').value;
    const doctor = document.getElementById('bldReqDoctor').value.trim();

    if (!patientName) {
      alert('Please enter patient name');
      return;
    }

    const res = window.dbStore.requestBlood({
      bloodGroup,
      unitsRequested,
      patientName,
      patientId,
      urgency,
      doctor
    });

    if (res.success) {
      this.showToast(`Blood Unit Request Logged! Status: ${res.request.status}`, 'success');
      const modalEl = document.getElementById('bloodRequestModal');
      const m = bootstrap.Modal.getInstance(modalEl);
      if (m) m.hide();

      this.renderBloodStock();
    } else {
      alert(res.message);
    }
  }

  // =========================================================================
  // 4. DOCTOR DIRECTORY & ONLINE / OFFLINE AVAILABILITY
  // =========================================================================

  initDoctorDirectory() {
    this.renderDoctorDirectory();
  }

  renderDoctorDirectory() {
    const container = document.getElementById('doctorDirectoryList');
    if (!container) return;

    const doctors = window.dbStore.getState().doctors || [];

    container.innerHTML = doctors.map(d => {
      const dept = window.dbStore.getDepartmentById(d.departmentId);
      const isOnline = d.onlineStatus === 'online';

      return `
        <div class="col-lg-4 col-md-6">
          <div class="card card-healthcare p-4 h-100">
            <div class="d-flex justify-content-between align-items-start mb-3">
              <div class="d-flex align-items-center gap-3">
                <img src="${d.avatar || 'assets/images/doc-anita.png'}" class="rounded-circle border" width="55" height="55" onerror="this.src=window.dbStore.generateDefaultAvatar('${d.name}')">
                <div>
                  <h5 class="fw-bold mb-0 text-dark">${d.name}</h5>
                  <small class="text-primary fw-semibold">${d.designation}</small>
                  <div class="small text-muted">${d.qualification}</div>
                </div>
              </div>
            </div>

            <!-- Online / Offline Indicator -->
            <div class="mb-3">
              <span class="doctor-status-badge ${isOnline ? 'doctor-status-online' : 'doctor-status-offline'}">
                <span class="status-dot ${isOnline ? 'status-dot-online' : 'status-dot-offline'}"></span>
                ${isOnline ? 'Online - In OPD Chamber' : 'Offline - Away / On Rounds'}
              </span>
              <div class="small text-muted mt-1">${d.statusNote}</div>
            </div>

            <div class="p-2 bg-light rounded-3 small mb-3">
              <div class="d-flex justify-content-between">
                <span class="text-muted">Chamber:</span>
                <strong>${d.roomNo}</strong>
              </div>
              <div class="d-flex justify-content-between">
                <span class="text-muted">Department:</span>
                <strong>${dept ? dept.name : 'OPD'}</strong>
              </div>
              <div class="d-flex justify-content-between">
                <span class="text-muted">Daily Token Quota:</span>
                <strong>${d.tokenQuota} Tokens / Day</strong>
              </div>
            </div>

            <div class="mt-auto d-flex gap-2">
              <button type="button" class="btn btn-sm btn-primary-custom flex-grow-1" 
                onclick="window.appController.quickBookWithDoctor('${d.id}', '${d.departmentId}')">
                <i class="bi bi-calendar-plus me-1"></i> Book Token
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  quickBookWithDoctor(doctorId, deptId) {
    // Switch to OP Booking tab and pre-select
    document.querySelectorAll('#landingMainTabs .nav-link').forEach(t => t.classList.remove('active'));
    document.querySelector('#landingMainTabs [data-tab="opBookingTab"]')?.classList.add('active');

    ['opBookingTab', 'roomBookingTab', 'bloodBankTab', 'doctorStatusTab'].forEach(tId => {
      const el = document.getElementById(tId);
      if (el) el.classList.toggle('d-none', tId !== 'opBookingTab');
    });

    const deptSelect = document.getElementById('regDepartment');
    const docSelect = document.getElementById('regDoctor');

    if (deptSelect && docSelect) {
      deptSelect.value = deptId;
      const doctors = window.dbStore.getDoctors(deptId);
      docSelect.innerHTML = doctors.map(doc => {
        const statusLabel = doc.onlineStatus === 'online' ? '🟢 ONLINE' : '⚪ OFFLINE';
        return `<option value="${doc.id}">${doc.name} - ${statusLabel} (${doc.roomNo})</option>`;
      }).join('');
      docSelect.value = doctorId;
    }

    document.getElementById('bookingSection')?.scrollIntoView({ behavior: 'smooth' });
    this.showToast('Selected doctor in registration form', 'info');
  }

  // =========================================================================
  // 5. WEBCAM & SELFIE CAPTURE
  // =========================================================================

  bindCameraEvents() {
    const btnLaunchCam = document.getElementById('btnOpenCamModal');
    const btnSnap = document.getElementById('btnSnapPhoto');
    const btnRetake = document.getElementById('btnRetakePhoto');
    const btnAcceptPhoto = document.getElementById('btnAcceptPhoto');
    const video = document.getElementById('camVideoPreview');
    const canvas = document.getElementById('camCanvas');
    const camModalEl = document.getElementById('cameraCaptureModal');
    const fileInput = document.getElementById('patientPhotoFile');

    let camModal = null;
    if (camModalEl && typeof bootstrap !== 'undefined') {
      camModal = new bootstrap.Modal(camModalEl);
    }

    if (btnLaunchCam && video) {
      btnLaunchCam.addEventListener('click', async () => {
        if (camModal) camModal.show();
        const errEl = document.getElementById('camErrorNotice');
        const ok = await window.cameraService.startCamera(video, errEl);
        if (ok) {
          video.classList.remove('d-none');
          canvas.classList.add('d-none');
          btnSnap.classList.remove('d-none');
          btnRetake.classList.add('d-none');
          btnAcceptPhoto.classList.add('d-none');
        }
      });
    }

    if (camModalEl) {
      camModalEl.addEventListener('hidden.bs.modal', () => {
        window.cameraService.stopCamera();
      });
    }

    if (btnSnap && video && canvas) {
      btnSnap.addEventListener('click', () => {
        try {
          const photoData = window.cameraService.captureFrame(video, canvas);
          video.classList.add('d-none');
          canvas.classList.remove('d-none');
          btnSnap.classList.add('d-none');
          btnRetake.classList.remove('d-none');
          btnAcceptPhoto.classList.remove('d-none');
        } catch (e) {
          alert('Failed to capture frame: ' + e.message);
        }
      });
    }

    if (btnRetake && video && canvas) {
      btnRetake.addEventListener('click', () => {
        video.classList.remove('d-none');
        canvas.classList.add('d-none');
        btnSnap.classList.remove('d-none');
        btnRetake.classList.add('d-none');
        btnAcceptPhoto.classList.add('d-none');
      });
    }

    if (btnAcceptPhoto) {
      btnAcceptPhoto.addEventListener('click', () => {
        this.capturedPhotoBase64 = window.cameraService.currentPhotoData;
        const preview = document.getElementById('patientPhotoPreview');
        if (preview && this.capturedPhotoBase64) {
          preview.src = this.capturedPhotoBase64;
          preview.classList.remove('d-none');
        }
        window.cameraService.stopCamera();
        if (camModal) camModal.hide();
        this.showToast('Photograph captured successfully.', 'success');
      });
    }

    if (fileInput) {
      fileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (file) {
          try {
            const dataUrl = await window.cameraService.readFileAsBase64(file);
            this.capturedPhotoBase64 = dataUrl;
            const preview = document.getElementById('patientPhotoPreview');
            if (preview) {
              preview.src = dataUrl;
              preview.classList.remove('d-none');
            }
            this.showToast('Photograph uploaded from device.', 'success');
          } catch (err) {
            alert(err.message);
          }
        }
      });
    }
  }

  // =========================================================================
  // 6. QR CODE & OP SLIP GENERATION
  // =========================================================================

  showOPSlipModal(appointmentId) {
    const appt = window.dbStore.getAppointmentById(appointmentId);
    if (!appt) return;

    const patient = window.dbStore.getPatientById(appt.patientId);
    const doctor = window.dbStore.getDoctorById(appt.doctorId);
    const dept = window.dbStore.getDepartmentById(appt.departmentId);
    const hosp = window.dbStore.getHospitalById(appt.hospitalId);

    document.getElementById('slipHospitalName').textContent = hosp ? hosp.name : 'Central Government Hospital';
    document.getElementById('slipHospitalCity').textContent = hosp ? hosp.address : 'Hospital Campus';
    document.getElementById('slipTokenNo').textContent = `#${appt.tokenNo}`;
    document.getElementById('slipOpId').textContent = appt.id;
    document.getElementById('slipPatientId').textContent = patient.id;
    document.getElementById('slipPatientName').textContent = patient.fullName;
    document.getElementById('slipPatientDemographics').textContent = `${patient.age} Yrs / ${patient.gender} • Blood: ${patient.bloodGroup || 'B+'}`;
    document.getElementById('slipPatientMobile').textContent = `+91 ${patient.mobile.substring(0, 3)}****${patient.mobile.substring(7)}`;
    document.getElementById('slipDoctorName').textContent = doctor ? doctor.name : 'OPD Physician';
    document.getElementById('slipDepartment').textContent = dept ? dept.name : 'Outpatient Department';
    document.getElementById('slipRoomNo').textContent = doctor ? doctor.roomNo : 'Room 101';
    document.getElementById('slipVisitDate').textContent = appt.date;
    document.getElementById('slipTimeSlot').textContent = appt.timeSlot;

    const statusBadge = document.getElementById('slipStatusBadge');
    if (statusBadge) {
      statusBadge.className = `badge-status badge-status-${appt.status.toLowerCase().replace(/\s+/g, '-')}`;
      statusBadge.textContent = appt.status;
    }

    const avatarEl = document.getElementById('slipPatientAvatar');
    if (avatarEl) {
      avatarEl.src = patient.photo || window.dbStore.generateDefaultAvatar(patient.fullName);
    }

    const qrPayload = {
      v: 1,
      pid: patient.id,
      op: appt.id,
      tok: appt.qrToken || `SEC-TOKEN-${patient.id}`,
      hosp: appt.hospitalId
    };

    window.qrEngine.generateQR('slipQrCodeBox', qrPayload, { size: 160 });

    const modalEl = document.getElementById('opSlipModal');
    if (modalEl && typeof bootstrap !== 'undefined') {
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    }
  }

  // =========================================================================
  // 7. QR CODE SCANNER & MEDICAL HISTORY MODAL
  // =========================================================================

  bindQRScannerEvents() {
    const btnOpenStaffScanner = document.getElementById('btnStaffOpenQRScanner');
    const btnOpenDoctorScanner = document.getElementById('btnDoctorOpenQRScanner');
    const scannerModalEl = document.getElementById('qrScannerModal');
    const qrUploadInput = document.getElementById('qrImageUploadInput');
    const btnSimulateScan1 = document.getElementById('btnSimulateRameshScan');

    let scannerModal = null;
    if (scannerModalEl && typeof bootstrap !== 'undefined') {
      scannerModal = new bootstrap.Modal(scannerModalEl);
    }

    const openScanner = () => {
      if (scannerModal) scannerModal.show();
      const statusText = document.getElementById('qrScannerStatus');
      if (statusText) statusText.textContent = 'Align Patient OP Slip QR Code inside the box...';

      window.qrEngine.startScanner('qrScannerVideoBox', (decodedText) => {
        window.qrEngine.stopScanner();
        if (scannerModal) scannerModal.hide();
        this.processScannedQRCode(decodedText);
      }).catch(err => {
        if (statusText) {
          statusText.innerHTML = `<span class="text-warning">Camera unavailable. You can upload an image or simulate a scan below.</span>`;
        }
      });
    };

    if (btnOpenStaffScanner) btnOpenStaffScanner.addEventListener('click', openScanner);
    if (btnOpenDoctorScanner) btnOpenDoctorScanner.addEventListener('click', openScanner);

    if (scannerModalEl) {
      scannerModalEl.addEventListener('hidden.bs.modal', () => {
        window.qrEngine.stopScanner();
      });
    }

    if (qrUploadInput) {
      qrUploadInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (file) {
          try {
            const decoded = await window.qrEngine.scanFile(file);
            if (scannerModal) scannerModal.hide();
            this.processScannedQRCode(decoded);
          } catch (err) {
            alert(err.message);
          }
        }
      });
    }

    if (btnSimulateScan1) {
      btnSimulateScan1.addEventListener('click', () => {
        if (scannerModal) scannerModal.hide();
        this.processScannedQRCode('SEC-TOKEN-89102-0412');
      });
    }
  }

  processScannedQRCode(tokenString) {
    const result = window.dbStore.verifyQRToken(tokenString);
    if (!result.success) {
      alert(`QR Code Verification Failed: ${result.message}`);
      return;
    }

    this.showToast(`Verified: ${result.patient.fullName} (PID: ${result.patient.id})`, 'success');
    this.showPatientRecordModal(result);
  }

  showPatientRecordModal(verifiedResult) {
    const { patient, currentAppointment, records, isNewPatient } = verifiedResult;

    document.getElementById('recModalAvatar').src = patient.photo || window.dbStore.generateDefaultAvatar(patient.fullName);
    document.getElementById('recModalName').textContent = patient.fullName;
    document.getElementById('recModalPid').textContent = patient.id;
    document.getElementById('recModalAbha').textContent = patient.abhaId || 'ABHA Linked';
    document.getElementById('recModalDemog').textContent = `${patient.age} Yrs • ${patient.gender} • Blood: ${patient.bloodGroup || 'Unknown'}`;
    document.getElementById('recModalMobile').textContent = `+91 ${patient.mobile}`;
    document.getElementById('recModalAddress').textContent = `${patient.address}, ${patient.district}, ${patient.state} - ${patient.pinCode}`;

    const allergyEl = document.getElementById('recModalAllergies');
    if (allergyEl) {
      if (patient.allergies && patient.allergies.length > 0 && !patient.allergies.includes('No Known Drug Allergies')) {
        allergyEl.innerHTML = `
          <div class="alert alert-danger py-2 px-3 mb-3 d-flex align-items-center">
            <i class="bi bi-exclamation-triangle-fill fs-4 me-2"></i>
            <div>
              <strong>KNOWN ALLERGIES:</strong> ${patient.allergies.join('; ')}
            </div>
          </div>`;
      } else {
        allergyEl.innerHTML = `
          <div class="alert alert-success py-2 px-3 small mb-3">
            <i class="bi bi-check-circle-fill me-1"></i> No severe drug allergies reported.
          </div>`;
      }
    }

    const timelineEl = document.getElementById('recModalTimeline');
    if (timelineEl) {
      if (isNewPatient || records.length === 0) {
        timelineEl.innerHTML = `
          <div class="card bg-light border-0 text-center py-4 px-3">
            <h6 class="fw-bold text-dark">No Previous Medical Records Available</h6>
            <p class="text-muted small mb-0">This patient is visiting for their first outpatient consultation in this hospital.</p>
          </div>`;
      } else {
        timelineEl.innerHTML = records.map(rec => `
          <div class="card card-healthcare p-3 mb-3">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <div>
                <h6 class="fw-bold text-primary mb-0">${rec.diagnosis}</h6>
                <small class="text-muted">${rec.visitDate} &bull; ${rec.doctorName} (${rec.departmentName})</small>
              </div>
              <span class="badge bg-success-subtle text-success">Completed</span>
            </div>

            <div class="row g-2 mb-2 p-2 bg-light rounded text-center small">
              <div class="col"><strong>BP:</strong> ${rec.vitals.bloodPressure || 'N/A'}</div>
              <div class="col"><strong>Pulse:</strong> ${rec.vitals.pulseRate || 'N/A'}</div>
              <div class="col"><strong>Temp:</strong> ${rec.vitals.temperature || 'N/A'}</div>
              <div class="col"><strong>SpO2:</strong> ${rec.vitals.spo2 || 'N/A'}</div>
            </div>

            <div class="small mb-2">
              <strong class="text-secondary">Reported Symptoms:</strong> ${(rec.symptoms || []).join(', ')}
            </div>

            <div class="mb-2">
              <strong class="small text-secondary">Prescriptions:</strong>
              <div class="mt-1">
                ${(rec.prescriptions || []).map(rx => `
                  <span class="badge bg-light text-dark border me-1">${rx.medicine} (${rx.dosage}) - ${rx.frequency}</span>
                `).join('')}
              </div>
            </div>

            <div class="small text-muted border-top pt-2">
              <strong>Advice:</strong> ${rec.notes}
            </div>
          </div>
        `).join('');
      }
    }

    const consultBtn = document.getElementById('recModalStartConsultBtn');
    if (consultBtn) {
      if (this.currentRole === 'doctor' && currentAppointment && currentAppointment.status !== 'Completed') {
        consultBtn.classList.remove('d-none');
        consultBtn.onclick = () => {
          const recModalEl = document.getElementById('patientRecordModal');
          const m = bootstrap.Modal.getInstance(recModalEl);
          if (m) m.hide();
          this.openDoctorConsultationWorkspace(currentAppointment.id);
        };
      } else {
        consultBtn.classList.add('d-none');
      }
    }

    const modalEl = document.getElementById('patientRecordModal');
    if (modalEl && typeof bootstrap !== 'undefined') {
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    }
  }

  // =========================================================================
  // 8. PATIENT DASHBOARD
  // =========================================================================

  loadPatientDashboard() {
    const patient = this.currentUser || window.dbStore.getPatientById('GH-2026-89102');
    if (!patient) return;

    document.getElementById('patDashName').textContent = patient.fullName;
    document.getElementById('patDashId').textContent = patient.id;
    document.getElementById('patDashAvatar').src = patient.photo || window.dbStore.generateDefaultAvatar(patient.fullName);
    document.getElementById('patDashAbha').textContent = patient.abhaId || 'ABHA Active';
    document.getElementById('patDashMobile').textContent = `+91 ${patient.mobile}`;
    document.getElementById('patDashAgeGender').textContent = `${patient.age} Yrs / ${patient.gender} • Blood Group: ${patient.bloodGroup || 'B+'}`;

    const appointments = window.dbStore.getAppointments({ patientId: patient.id });
    const upcomingContainer = document.getElementById('patUpcomingApptsList');
    const pastContainer = document.getElementById('patPastApptsList');

    const upcoming = appointments.filter(a => a.status !== 'Completed' && a.status !== 'Cancelled');
    const past = appointments.filter(a => a.status === 'Completed' || a.status === 'Cancelled');

    if (upcomingContainer) {
      if (upcoming.length === 0) {
        upcomingContainer.innerHTML = `<div class="text-center py-4 text-muted">No active appointments scheduled.</div>`;
      } else {
        upcomingContainer.innerHTML = upcoming.map(a => {
          const doc = window.dbStore.getDoctorById(a.doctorId);
          const dept = window.dbStore.getDepartmentById(a.departmentId);
          return `
            <div class="card card-healthcare mb-3 p-3 border-start border-4 border-primary">
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <div class="d-flex align-items-center gap-2 mb-1">
                    <span class="badge bg-primary fs-6">Token #${a.tokenNo}</span>
                    <span class="badge-status badge-status-${a.status.toLowerCase()}">${a.status}</span>
                  </div>
                  <h6 class="fw-bold mb-0 text-dark">${doc ? doc.name : 'Physician'}</h6>
                  <p class="text-muted small mb-1">${dept ? dept.name : 'OPD'} &bull; Chamber: <strong>${doc ? doc.roomNo : 'Chamber 101'}</strong></p>
                  <p class="small mb-0 text-secondary"><i class="bi bi-clock me-1"></i> ${a.date} | ${a.timeSlot}</p>
                </div>
                <button class="btn btn-sm btn-outline-primary" onclick="window.appController.showOPSlipModal('${a.id}')">
                  <i class="bi bi-qr-code me-1"></i> View OP Slip
                </button>
              </div>
            </div>`;
        }).join('');
      }
    }

    if (pastContainer) {
      if (past.length === 0) {
        pastContainer.innerHTML = `<div class="text-muted small p-2">No prior completed visits.</div>`;
      } else {
        pastContainer.innerHTML = past.map(a => {
          const doc = window.dbStore.getDoctorById(a.doctorId);
          return `
            <div class="list-group-item d-flex justify-content-between align-items-center px-0 py-2">
              <div>
                <strong>${doc ? doc.name : 'Doctor'}</strong>
                <div class="text-muted small">${a.date} &bull; Token #${a.tokenNo}</div>
              </div>
              <button class="btn btn-sm btn-light border" onclick="window.appController.showOPSlipModal('${a.id}')">
                <i class="bi bi-file-earmark-text"></i> Slip
              </button>
            </div>`;
        }).join('');
      }
    }

    // Patient Room Bookings
    const roomContainer = document.getElementById('patRoomBookingsList');
    if (roomContainer) {
      const roomBookings = window.dbStore.getRoomBookings(patient.id);
      if (roomBookings.length === 0) {
        roomContainer.innerHTML = `<div class="text-muted small">No active room/bed admissions.</div>`;
      } else {
        roomContainer.innerHTML = roomBookings.map(b => `
          <div class="card p-3 border-start border-4 border-success mb-2">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <strong class="text-dark">${b.roomTypeName}</strong>
                <div class="text-success fw-bold">${b.bedNumber}</div>
                <small class="text-muted">Admitted: ${b.admitDate} &bull; Dept: ${b.department}</small>
              </div>
              <button class="btn btn-sm btn-outline-success" onclick="window.appController.showBedAllotmentSlip(window.dbStore.getRoomBookings('${patient.id}')[0])">
                <i class="bi bi-qr-code"></i> Allotment Pass
              </button>
            </div>
          </div>
        `).join('');
      }
    }
  }

  // =========================================================================
  // 9. HOSPITAL REGISTRATION STAFF DASHBOARD
  // =========================================================================

  loadStaffDashboard() {
    this.refreshStaffQueueTable();

    const searchInput = document.getElementById('staffSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        this.filterStaffQueueTable(searchInput.value);
      });
    }
  }

  refreshStaffQueueTable() {
    const tableBody = document.getElementById('staffQueueTableBody');
    if (!tableBody) return;

    const appointments = window.dbStore.getAppointments({ date: new Date().toISOString().split('T')[0] });

    if (appointments.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-muted">No patient registrations for today yet.</td></tr>`;
      return;
    }

    tableBody.innerHTML = appointments.map(a => {
      const p = window.dbStore.getPatientById(a.patientId);
      const doc = window.dbStore.getDoctorById(a.doctorId);
      const dept = window.dbStore.getDepartmentById(a.departmentId);

      return `
        <tr>
          <td><span class="badge bg-primary fs-6">#${a.tokenNo}</span></td>
          <td>
            <div class="d-flex align-items-center gap-2">
              <img src="${p ? p.photo : ''}" class="rounded-circle border" width="40" height="40" style="object-fit:cover;">
              <div>
                <strong class="text-dark d-block">${p ? p.fullName : 'Unknown'}</strong>
                <span class="text-muted small">${p ? p.id : a.patientId} &bull; ${p ? p.age : ''}Y/${p ? p.gender[0] : ''}</span>
              </div>
            </div>
          </td>
          <td>
            <div class="fw-semibold text-dark">${dept ? dept.name : 'General'}</div>
            <div class="text-muted small">${doc ? doc.name : 'Physician'} (${doc ? doc.roomNo : 'OPD'})</div>
          </td>
          <td><span class="badge-status badge-status-${a.status.toLowerCase().replace(/\s+/g, '-')}">${a.status}</span></td>
          <td>
            <div class="btn-group btn-group-sm">
              ${a.status === 'Confirmed' ? `
                <button class="btn btn-outline-success" title="Check-In" onclick="window.appController.updateStaffApptStatus('${a.id}', 'Waiting')">
                  Check-In
                </button>
              ` : ''}
              ${a.status === 'Waiting' ? `
                <button class="btn btn-outline-primary" title="Send In" onclick="window.appController.updateStaffApptStatus('${a.id}', 'With Doctor')">
                  Send In
                </button>
              ` : ''}
              <button class="btn btn-outline-secondary" title="Print Slip" onclick="window.appController.showOPSlipModal('${a.id}')">
                <i class="bi bi-printer"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  filterStaffQueueTable(query) {
    if (!query) {
      this.refreshStaffQueueTable();
      return;
    }
    const results = window.dbStore.searchRegistry(query);
    const tableBody = document.getElementById('staffQueueTableBody');
    if (!tableBody) return;

    if (results.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-muted">No records match "${query}".</td></tr>`;
      return;
    }

    tableBody.innerHTML = results.map(item => {
      const p = item.patient;
      const a = item.appointment || { tokenNo: '-', status: 'Profile Saved', id: 'N/A' };
      return `
        <tr class="table-info-subtle">
          <td><span class="badge bg-secondary fs-6">#${a.tokenNo}</span></td>
          <td>
            <div class="d-flex align-items-center gap-2">
              <img src="${p.photo}" class="rounded-circle border" width="40" height="40" style="object-fit:cover;">
              <div>
                <strong class="text-dark d-block">${p.fullName}</strong>
                <span class="text-muted small">${p.id} &bull; Mob: ${p.mobile}</span>
              </div>
            </div>
          </td>
          <td><span class="badge bg-secondary">${a.status}</span></td>
          <td>
            <button class="btn btn-sm btn-primary" onclick="window.appController.showPatientRecordModal(window.dbStore.verifyQRToken('${p.id}'))">
              <i class="bi bi-folder2-open me-1"></i> Open Record
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  updateStaffApptStatus(apptId, newStatus) {
    window.dbStore.updateAppointmentStatus(apptId, newStatus);
    this.showToast(`Updated status to: ${newStatus}`, 'info');
    this.refreshStaffQueueTable();
  }

  // =========================================================================
  // 10. DOCTOR OPD SUITE WITH LIVE AVAILABILITY TOGGLE
  // =========================================================================

  loadDoctorDashboard() {
    const doctor = this.currentUser || window.dbStore.getDoctorById('DOC-101');
    if (!doctor) return;

    document.getElementById('docDashName').textContent = doctor.name;
    document.getElementById('docDashDesignation').textContent = doctor.designation;
    document.getElementById('docDashRoom').textContent = doctor.roomNo;
    const dept = window.dbStore.getDepartmentById(doctor.departmentId);
    document.getElementById('docDashDepartment').textContent = dept ? dept.name : 'Cardiology';

    // Doctor Live Status toggle button
    const toggleBtn = document.getElementById('btnToggleDoctorAvailability');
    if (toggleBtn) {
      const isOnline = doctor.onlineStatus === 'online';
      toggleBtn.className = `btn btn-sm ${isOnline ? 'btn-success' : 'btn-secondary'}`;
      toggleBtn.innerHTML = `<i class="bi bi-toggle-${isOnline ? 'on' : 'off'} me-1"></i> Status: <strong>${isOnline ? 'ONLINE' : 'OFFLINE'}</strong>`;
      toggleBtn.onclick = () => {
        const res = window.dbStore.toggleDoctorStatus(doctor.id);
        if (res.success) {
          this.showToast(`Your status is now ${res.doctor.onlineStatus.toUpperCase()}`, 'info');
          this.loadDoctorDashboard();
          this.renderDoctorDirectory();
        }
      };
    }

    this.refreshDoctorQueue(doctor.id);
  }

  refreshDoctorQueue(doctorId) {
    const appointments = window.dbStore.getAppointments({
      doctorId: doctorId,
      date: new Date().toISOString().split('T')[0]
    });

    const waiting = appointments.filter(a => a.status === 'Waiting' || a.status === 'Confirmed');
    const completed = appointments.filter(a => a.status === 'Completed');

    document.getElementById('docWaitingCount').textContent = waiting.length;
    document.getElementById('docCompletedCount').textContent = completed.length;

    const waitingListEl = document.getElementById('docWaitingQueueList');
    if (waitingListEl) {
      if (waiting.length === 0) {
        waitingListEl.innerHTML = `<div class="text-center py-4 text-muted">No patients currently waiting.</div>`;
      } else {
        waitingListEl.innerHTML = waiting.map(a => {
          const p = window.dbStore.getPatientById(a.patientId);
          return `
            <div class="card card-healthcare mb-2 p-3 d-flex flex-row justify-content-between align-items-center">
              <div class="d-flex align-items-center gap-3">
                <span class="badge bg-primary fs-5 px-3 py-2">#${a.tokenNo}</span>
                <img src="${p ? p.photo : ''}" class="rounded-circle border" width="48" height="48" style="object-fit:cover;">
                <div>
                  <strong class="text-dark d-block fs-6">${p ? p.fullName : 'Patient'}</strong>
                  <div class="text-muted small">${p ? p.id : ''} &bull; ${p ? p.age : ''}Y/${p ? p.gender[0] : ''}</div>
                  <div class="text-secondary small fst-italic">"${a.reason}"</div>
                </div>
              </div>
              <div class="d-flex gap-2">
                <button class="btn btn-outline-info btn-sm" onclick="window.appController.showPatientRecordModal(window.dbStore.verifyQRToken('${p ? p.id : ''}'))">
                  History
                </button>
                <button class="btn btn-primary-custom btn-sm" onclick="window.appController.openDoctorConsultationWorkspace('${a.id}')">
                  <i class="bi bi-stethoscope me-1"></i> Consult
                </button>
              </div>
            </div>
          `;
        }).join('');
      }
    }

    const completedListEl = document.getElementById('docCompletedQueueList');
    if (completedListEl) {
      if (completed.length === 0) {
        completedListEl.innerHTML = `<div class="text-muted small p-2">No consultations completed yet today.</div>`;
      } else {
        completedListEl.innerHTML = completed.map(a => {
          const p = window.dbStore.getPatientById(a.patientId);
          return `
            <div class="list-group-item d-flex justify-content-between align-items-center px-0 py-2">
              <div>
                <strong>Token #${a.tokenNo}: ${p ? p.fullName : 'Patient'}</strong>
                <span class="text-muted small ms-2">${p ? p.id : ''}</span>
              </div>
              <button class="btn btn-sm btn-outline-secondary" onclick="window.appController.showPatientRecordModal(window.dbStore.verifyQRToken('${p ? p.id : ''}'))">
                View
              </button>
            </div>
          `;
        }).join('');
      }
    }
  }

  openDoctorConsultationWorkspace(appointmentId) {
    const appt = window.dbStore.getAppointmentById(appointmentId);
    if (!appt) return;

    this.activeConsultationAppt = appt;
    window.dbStore.updateAppointmentStatus(appointmentId, 'With Doctor');

    const patient = window.dbStore.getPatientById(appt.patientId);
    const records = window.dbStore.getMedicalRecords(patient.id);

    document.getElementById('consPatientAvatar').src = patient.photo || window.dbStore.generateDefaultAvatar(patient.fullName);
    document.getElementById('consPatientName').textContent = patient.fullName;
    document.getElementById('consPatientId').textContent = patient.id;
    document.getElementById('consPatientDemog').textContent = `${patient.age} Yrs / ${patient.gender} • Blood: ${patient.bloodGroup || 'B+'}`;
    document.getElementById('consTokenBadge').textContent = `Token #${appt.tokenNo}`;

    const allergyBox = document.getElementById('consAllergyAlert');
    if (allergyBox) {
      if (patient.allergies && patient.allergies.length > 0 && !patient.allergies.includes('No Known Drug Allergies')) {
        allergyBox.innerHTML = `<div class="alert alert-danger small py-2 mb-3"><strong>ALLERGY:</strong> ${patient.allergies.join('; ')}</div>`;
      } else {
        allergyBox.innerHTML = '';
      }
    }

    document.getElementById('consSymptomsInput').value = appt.reason || '';
    document.getElementById('consDiagnosisInput').value = '';
    document.getElementById('consNotesInput').value = '';

    this.resetPrescriptionTable();

    const modalEl = document.getElementById('doctorConsultationModal');
    if (modalEl && typeof bootstrap !== 'undefined') {
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    }
  }

  resetPrescriptionTable() {
    const tableBody = document.getElementById('consRxTableBody');
    if (!tableBody) return;
    tableBody.innerHTML = `
      <tr>
        <td><input type="text" class="form-control form-control-sm rx-name" placeholder="Drug name" value="Tab. Paracetamol"></td>
        <td><input type="text" class="form-control form-control-sm rx-dosage" placeholder="650 mg" value="650 mg"></td>
        <td>
          <select class="form-select form-select-sm rx-freq">
            <option value="1-0-1 (Morning-Night)">1-0-1</option>
            <option value="1-0-0 (Morning)">1-0-0</option>
            <option value="0-0-1 (Night)">0-0-1</option>
            <option value="1-1-1 (Thrice)">1-1-1</option>
          </select>
        </td>
        <td><input type="text" class="form-control form-control-sm rx-dur" placeholder="5 Days" value="5 Days"></td>
        <td><input type="text" class="form-control form-control-sm rx-inst" placeholder="After food" value="After food"></td>
        <td class="text-center"><button type="button" class="btn btn-sm btn-outline-danger" onclick="this.closest('tr').remove()"><i class="bi bi-trash"></i></button></td>
      </tr>
    `;
  }

  addPrescriptionRow() {
    const tableBody = document.getElementById('consRxTableBody');
    if (!tableBody) return;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><input type="text" class="form-control form-control-sm rx-name" placeholder="Drug name"></td>
      <td><input type="text" class="form-control form-control-sm rx-dosage" placeholder="Dosage"></td>
      <td>
        <select class="form-select form-select-sm rx-freq">
          <option value="1-0-1 (Morning-Night)">1-0-1</option>
          <option value="1-0-0 (Morning)">1-0-0</option>
          <option value="0-0-1 (Night)">0-0-1</option>
          <option value="1-1-1 (Thrice)">1-1-1</option>
        </select>
      </td>
      <td><input type="text" class="form-control form-control-sm rx-dur" placeholder="Duration"></td>
      <td><input type="text" class="form-control form-control-sm rx-inst" placeholder="Instructions"></td>
      <td class="text-center"><button type="button" class="btn btn-sm btn-outline-danger" onclick="this.closest('tr').remove()"><i class="bi bi-trash"></i></button></td>
    `;
    tableBody.appendChild(tr);
  }

  saveConsultationAndComplete() {
    if (!this.activeConsultationAppt) return;

    const appt = this.activeConsultationAppt;
    const doctor = window.dbStore.getDoctorById(appt.doctorId);
    const dept = window.dbStore.getDepartmentById(appt.departmentId);

    const symptoms = document.getElementById('consSymptomsInput').value.trim();
    const diagnosis = document.getElementById('consDiagnosisInput').value.trim() || 'Clinical Review Completed';
    const notes = document.getElementById('consNotesInput').value.trim() || 'Prescription provided.';
    const nextFollowUp = document.getElementById('consFollowUpInput').value || 'In 2 Weeks';

    const vitals = {
      bloodPressure: document.getElementById('consBpInput').value || '120/80 mmHg',
      pulseRate: document.getElementById('consPulseInput').value || '72 bpm',
      temperature: document.getElementById('consTempInput').value || '98.6 °F',
      spo2: document.getElementById('consSpo2Input').value || '99%',
      weight: document.getElementById('consWeightInput').value || '65 kg'
    };

    const prescriptions = [];
    document.querySelectorAll('#consRxTableBody tr').forEach(row => {
      const name = row.querySelector('.rx-name')?.value.trim();
      const dosage = row.querySelector('.rx-dosage')?.value.trim();
      const freq = row.querySelector('.rx-freq')?.value;
      const dur = row.querySelector('.rx-dur')?.value.trim();
      const inst = row.querySelector('.rx-inst')?.value.trim();
      if (name) {
        prescriptions.push({ medicine: name, dosage, frequency: freq, duration: dur, instructions: inst });
      }
    });

    const res = window.dbStore.addMedicalRecord({
      patientId: appt.patientId,
      appointmentId: appt.id,
      hospitalId: appt.hospitalId,
      departmentId: appt.departmentId,
      doctorId: appt.doctorId,
      doctorName: doctor ? doctor.name : 'OPD Doctor',
      departmentName: dept ? dept.name : 'OPD',
      visitDate: new Date().toISOString().split('T')[0],
      symptoms: symptoms ? [symptoms] : ['General complaint'],
      vitals,
      diagnosis,
      prescriptions,
      notes,
      nextFollowUp
    });

    if (res.success) {
      this.showToast('Consultation saved and record updated.', 'success');
      const modalEl = document.getElementById('doctorConsultationModal');
      const modal = bootstrap.Modal.getInstance(modalEl);
      if (modal) modal.hide();

      this.refreshDoctorQueue(appt.doctorId);
    }
  }

  // =========================================================================
  // 11. HOSPITAL ADMIN CONSOLE
  // =========================================================================

  loadAdminDashboard() {
    const stats = window.dbStore.getAdminStats();

    document.getElementById('adminStatTotalPatients').textContent = stats.totalPatients;
    document.getElementById('adminStatTodayOP').textContent = stats.todayTotalOP;
    document.getElementById('adminStatWaiting').textContent = stats.todayWaiting;
    document.getElementById('adminStatDoctors').textContent = `${stats.onlineDoctorsCount} / ${stats.totalDoctorsCount}`;
    document.getElementById('adminStatWaitTime').textContent = `${stats.avgWaitTimeMinutes}m`;

    window.analyticsService.initAdminCharts();
  }

  showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;

    const toastEl = document.createElement('div');
    const bg = type === 'success' ? 'bg-success text-white' : 'bg-primary text-white';
    toastEl.className = `toast align-items-center ${bg} border-0 show mb-2`;
    toastEl.innerHTML = `
      <div class="d-flex">
        <div class="toast-body d-flex align-items-center gap-2">
          <i class="bi bi-info-circle-fill"></i>
          <span>${message}</span>
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
      </div>`;

    toastContainer.appendChild(toastEl);
    setTimeout(() => {
      try { toastEl.remove(); } catch (e) { }
    }, 4000);
  }
}

window.appController = new AppController();
document.addEventListener('DOMContentLoaded', () => {
  window.appController.init();
});
