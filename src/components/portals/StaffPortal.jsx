import React, { useState } from 'react';
import { 
  Search, QrCode, UserPlus, CheckCircle, ArrowRight, Printer, FolderOpen, 
  FlaskConical, ClipboardList, CheckCircle2, Clock, AlertCircle, TestTube, FileText 
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function StaffPortal({ 
  store, 
  appointments, 
  patients, 
  doctors, 
  departments, 
  labOrders = [],
  staffCategory = 'receptionist',
  setStaffCategory,
  onScanQR, 
  onRegisterWalkIn, 
  onViewSlip, 
  onViewRecord,
  onViewLabReport
}) {
  const { t, language } = useLanguage();
  const [receptionistSearch, setReceptionistSearch] = useState('');
  const [labSearch, setLabSearch] = useState('');
  const [labStatusFilter, setLabStatusFilter] = useState('all');

  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppts = appointments.filter(a => a.date === todayStr);

  // Receptionist filtered queue
  const filteredAppts = receptionistSearch.trim()
    ? todayAppts.filter(a => {
        const p = patients.find(pat => pat.id === a.patientId);
        const q = receptionistSearch.toLowerCase();
        return (
          a.id.toLowerCase().includes(q) ||
          String(a.tokenNo) === q ||
          p?.fullName.toLowerCase().includes(q) ||
          p?.id.toLowerCase().includes(q) ||
          p?.mobile.includes(q) ||
          p?.aadharNumber?.includes(q)
        );
      })
    : todayAppts;

  // Lab Technician filtered orders
  const allLabOrders = store.getLabOrders();
  const filteredLabOrders = allLabOrders.filter(order => {
    const matchesFilter = labStatusFilter === 'all' || 
      (labStatusFilter === 'pending' && order.status === 'Pending Collection') ||
      (labStatusFilter === 'collected' && order.status === 'Sample Collected') ||
      (labStatusFilter === 'in_progress' && order.status === 'Testing In Progress') ||
      (labStatusFilter === 'ready' && order.status === 'Report Ready');

    if (!matchesFilter) return false;

    if (!labSearch.trim()) return true;
    const q = labSearch.toLowerCase();
    return (
      order.id.toLowerCase().includes(q) ||
      order.patientName.toLowerCase().includes(q) ||
      order.patientId.toLowerCase().includes(q) ||
      order.testName.toLowerCase().includes(q) ||
      (order.aadharNumber && order.aadharNumber.includes(q))
    );
  });

  const handleStatusUpdate = (apptId, newStatus) => {
    store.updateAppointmentStatus(apptId, newStatus);
  };

  const handleCollectSample = (orderId) => {
    store.updateLabOrderStatus(orderId, 'Sample Collected', null, 'M. Suresh, Lab Tech (KMC MGM)');
  };

  const handleStartAnalysis = (orderId) => {
    store.updateLabOrderStatus(orderId, 'Testing In Progress', null, 'M. Suresh, Lab Tech (KMC MGM)');
  };

  const handleEnterLabResults = (order) => {
    let sampleResults = {
      hemoglobin: '13.5 g/dL (Normal)',
      bloodSugarFasting: '96 mg/dL (Normal: 70 - 100)',
      serumCreatinine: '0.9 mg/dL (Normal: 0.7 - 1.2)',
      leukocyteCount: '6,800 /uL',
      plateletCount: '2.6 Lakhs/uL'
    };

    if (order.testName.includes('Lipid')) {
      sampleResults = {
        totalCholesterol: '178 mg/dL (< 200 mg/dL)',
        serumTriglycerides: '138 mg/dL (< 150 mg/dL)',
        hdlGoodCholesterol: '48 mg/dL (> 40 mg/dL)',
        ldlBadCholesterol: '102 mg/dL (< 100 mg/dL)'
      };
    } else if (order.testName.includes('X-Ray')) {
      sampleResults = {
        radiologicalFindings: 'Bony architecture intact. Joint alignment preserved.',
        impression: 'Normal anatomical study. No fracture or acute lesion detected.'
      };
    }

    store.updateLabOrderStatus(order.id, 'Report Ready', sampleResults, 'M. Suresh, Sr. Technologist');
  };

  return (
    <div className="container-fluid px-lg-5 py-4">
      
      {/* Category Switcher Tabs: Receptionist vs Lab Technician */}
      <div className="card card-healthcare p-2 mb-4 bg-white border shadow-sm">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
          
          <div className="d-flex align-items-center gap-2">
            <span className="text-muted fw-bold small me-2">Staff Category:</span>
            
            {/* Category 1: Receptionist */}
            <button
              type="button"
              className={`btn btn-sm d-flex align-items-center gap-2 px-3 py-2 ${staffCategory === 'receptionist' ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setStaffCategory('receptionist')}
            >
              <ClipboardList size={16} />
              <span className="fw-semibold">{t('categoryReceptionist')}</span>
            </button>

            {/* Category 2: Lab Technician */}
            <button
              type="button"
              className={`btn btn-sm d-flex align-items-center gap-2 px-3 py-2 ${staffCategory === 'lab_technician' ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setStaffCategory('lab_technician')}
            >
              <FlaskConical size={16} />
              <span className="fw-semibold">{t('categoryLabTech')}</span>
            </button>
          </div>

          <div className="text-muted small">
            {staffCategory === 'receptionist' ? (
              <span>Counter 03 &bull; Outpatient Admissions Desk</span>
            ) : (
              <span>Central Diagnostic Lab Room 14 &bull; KMC Pathology Wing</span>
            )}
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* VIEW A: RECEPTIONIST DESK (OP ADMISSIONS & TOKEN DISPATCH)    */}
      {/* ============================================================== */}
      {staffCategory === 'receptionist' && (
        <div>
          {/* Header Bar */}
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3 bg-white p-3 rounded-3 shadow-sm border">
            <div>
              <h3 className="fw-bold mb-0 text-dark">{t('receptionistHeader')}</h3>
              <small className="text-muted">{t('receptionistStaffInfo')}</small>
            </div>
            <div className="d-flex align-items-center gap-2">
              <button type="button" className="btn btn-success btn-sm d-flex align-items-center gap-1" onClick={onScanQR}>
                <QrCode size={16} />
                <span>{t('scanQrBtn')}</span>
              </button>
              <button type="button" className="btn btn-primary-custom btn-sm d-flex align-items-center gap-1" onClick={onRegisterWalkIn}>
                <UserPlus size={16} />
                <span>{t('registerWalkInBtn')}</span>
              </button>
            </div>
          </div>

          {/* Quick Search Bar */}
          <div className="card card-healthcare mb-4 p-3 border-0">
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0"><Search size={18} className="text-primary" /></span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder={t('staffSearchPlaceholder')}
                value={receptionistSearch}
                onChange={(e) => setReceptionistSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Today's Queue Table */}
          <div className="card card-healthcare shadow-sm">
            <div className="card-header-healthcare">
              <span>{t('todaysQueue')}</span>
              <span className="badge bg-secondary-subtle text-secondary">{filteredAppts.length} Patients Today</span>
            </div>
            
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: '80px' }}>Token</th>
                    <th>Patient Details</th>
                    <th>Department & Doctor</th>
                    <th>Status</th>
                    <th>Receptionist Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppts.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-4 text-muted">
                        No matching patient registrations found for today.
                      </td>
                    </tr>
                  ) : (
                    filteredAppts.map((a) => {
                      const p = patients.find(pat => pat.id === a.patientId);
                      const doc = doctors.find(d => d.id === a.doctorId);
                      const dept = departments.find(d => d.id === a.departmentId);

                      return (
                        <tr key={a.id}>
                          <td><span className="badge bg-primary fs-6">#{a.tokenNo}</span></td>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <div className="rounded-circle bg-light border d-flex align-items-center justify-content-center text-primary fw-bold" style={{ width: 42, height: 42, fontSize: '0.85rem' }}>
                                {p?.fullName ? p.fullName.substring(0, 2).toUpperCase() : 'PT'}
                              </div>
                              <div>
                                <strong className="text-dark d-block">{p?.fullName || 'Patient'}</strong>
                                <span className="text-muted small">
                                  {p?.id} &bull; Aadhaar: {p?.aadharNumber ? `XXXX-${p.aadharNumber.slice(-4)}` : 'N/A'}
                                </span>
                                <div className="text-secondary small">
                                  {p?.age}Y/{p?.gender?.[0]} &bull; Mob: {p?.mobile}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="fw-semibold text-dark">{dept?.name || 'General'}</div>
                            <div className="text-muted small">{doc?.name || 'Physician'} ({doc?.roomNo || 'OPD'})</div>
                          </td>
                          <td>
                            <span className={`badge-status badge-status-${a.status?.toLowerCase()}`}>{a.status}</span>
                          </td>
                          <td>
                            <div className="btn-group btn-group-sm">
                              {a.status === 'Confirmed' && (
                                <button
                                  type="button"
                                  className="btn btn-outline-success d-flex align-items-center gap-1"
                                  onClick={() => handleStatusUpdate(a.id, 'Waiting')}
                                  title="Mark Checked-In"
                                >
                                  <CheckCircle size={14} />
                                  <span>{t('checkInAction')}</span>
                                </button>
                              )}
                              {a.status === 'Waiting' && (
                                <button
                                  type="button"
                                  className="btn btn-outline-primary d-flex align-items-center gap-1"
                                  onClick={() => handleStatusUpdate(a.id, 'With Doctor')}
                                  title="Send to Doctor Chamber"
                                >
                                  <ArrowRight size={14} />
                                  <span>{t('sendInAction')}</span>
                                </button>
                              )}
                              <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() => onViewSlip(a.id)}
                                title="Print Official OP Slip"
                              >
                                <Printer size={14} />
                              </button>
                              <button
                                type="button"
                                className="btn btn-outline-info"
                                onClick={() => onViewRecord(p?.id)}
                                title="View Patient Medical History"
                              >
                                <FolderOpen size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* VIEW B: LAB TECHNICIAN DESK (DIAGNOSTICS & SAMPLES)           */}
      {/* ============================================================== */}
      {staffCategory === 'lab_technician' && (
        <div>
          {/* Lab Header Bar */}
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3 bg-white p-3 rounded-3 shadow-sm border">
            <div className="d-flex align-items-center gap-3">
              <div className="bg-success text-white p-2 rounded-3">
                <FlaskConical size={28} />
              </div>
              <div>
                <h3 className="fw-bold mb-0 text-dark">{t('labTechHeader')}</h3>
                <small className="text-muted">{t('labTechStaffInfo')}</small>
              </div>
            </div>
            <div className="d-flex align-items-center gap-2">
              <button type="button" className="btn btn-success btn-sm d-flex align-items-center gap-1" onClick={onScanQR}>
                <QrCode size={16} />
                <span>Scan Patient Lab Token</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="row g-3 mb-4">
            <div className="col-md-3 col-6">
              <div className="stat-widget">
                <div className="stat-icon-box stat-blue"><TestTube size={24} /></div>
                <div>
                  <h3 className="fw-bold mb-0 text-dark">{allLabOrders.length}</h3>
                  <span className="text-muted small">Total Test Orders</span>
                </div>
              </div>
            </div>

            <div className="col-md-3 col-6">
              <div className="stat-widget">
                <div className="stat-icon-box stat-amber"><Clock size={24} /></div>
                <div>
                  <h3 className="fw-bold mb-0 text-dark">
                    {allLabOrders.filter(o => o.status === 'Pending Collection').length}
                  </h3>
                  <span className="text-muted small">{t('pendingCollection')}</span>
                </div>
              </div>
            </div>

            <div className="col-md-3 col-6">
              <div className="stat-widget">
                <div className="stat-icon-box stat-purple"><FlaskConical size={24} /></div>
                <div>
                  <h3 className="fw-bold mb-0 text-dark">
                    {allLabOrders.filter(o => o.status === 'Testing In Progress' || o.status === 'Sample Collected').length}
                  </h3>
                  <span className="text-muted small">{t('inProgress')}</span>
                </div>
              </div>
            </div>

            <div className="col-md-3 col-6">
              <div className="stat-widget">
                <div className="stat-icon-box stat-teal"><CheckCircle2 size={24} /></div>
                <div>
                  <h3 className="fw-bold mb-0 text-dark">
                    {allLabOrders.filter(o => o.status === 'Report Ready').length}
                  </h3>
                  <span className="text-muted small">{t('reportsReady')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Lab Search & Filter Bar */}
          <div className="card card-healthcare mb-4 p-3 border-0">
            <div className="row g-3 align-items-center">
              <div className="col-md-6">
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0"><Search size={18} className="text-success" /></span>
                  <input
                    type="text"
                    className="form-control border-start-0"
                    placeholder="Search test by Patient Name, Aadhaar, Order ID, or Investigation..."
                    value={labSearch}
                    onChange={(e) => setLabSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className="col-md-6 d-flex gap-2 justify-content-md-end flex-wrap">
                <button
                  type="button"
                  className={`btn btn-sm ${labStatusFilter === 'all' ? 'btn-dark' : 'btn-outline-secondary'}`}
                  onClick={() => setLabStatusFilter('all')}
                >
                  All ({allLabOrders.length})
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${labStatusFilter === 'pending' ? 'btn-warning text-dark' : 'btn-outline-warning text-dark'}`}
                  onClick={() => setLabStatusFilter('pending')}
                >
                  Pending
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${labStatusFilter === 'collected' ? 'btn-info text-white' : 'btn-outline-info'}`}
                  onClick={() => setLabStatusFilter('collected')}
                >
                  Collected
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${labStatusFilter === 'in_progress' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setLabStatusFilter('in_progress')}
                >
                  Processing
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${labStatusFilter === 'ready' ? 'btn-success' : 'btn-outline-success'}`}
                  onClick={() => setLabStatusFilter('ready')}
                >
                  Ready
                </button>
              </div>
            </div>
          </div>

          {/* Diagnostic Test Queue Table */}
          <div className="card card-healthcare shadow-sm">
            <div className="card-header-healthcare d-flex justify-content-between align-items-center">
              <span>{t('labOrdersTitle')}</span>
              <span className="badge bg-secondary-subtle text-secondary">{filteredLabOrders.length} Lab Requisitions</span>
            </div>

            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Order ID & Urgency</th>
                    <th>Patient Details</th>
                    <th>Doctor & Dept</th>
                    <th>Investigation & Sample</th>
                    <th>Diagnostic Status</th>
                    <th>Technician Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLabOrders.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4 text-muted">
                        No diagnostic orders matching the selected filter.
                      </td>
                    </tr>
                  ) : (
                    filteredLabOrders.map((order) => {
                      let statusBadge = 'badge bg-warning text-dark';
                      if (order.status === 'Sample Collected') statusBadge = 'badge bg-info text-white';
                      else if (order.status === 'Testing In Progress') statusBadge = 'badge bg-primary';
                      else if (order.status === 'Report Ready') statusBadge = 'badge bg-success';

                      return (
                        <tr key={order.id}>
                          <td>
                            <strong className="text-dark d-block">{order.id}</strong>
                            <span className={`badge ${order.urgency === 'Urgent' ? 'bg-danger' : 'bg-secondary-subtle text-secondary'} small`}>
                              {order.urgency}
                            </span>
                          </td>

                          <td>
                            <strong className="text-dark d-block">{order.patientName}</strong>
                            <div className="small text-muted">
                              {order.patientId} &bull; Aadhaar: {order.aadharNumber ? `XXXX-${order.aadharNumber.slice(-4)}` : 'Verified'}
                            </div>
                          </td>

                          <td>
                            <div className="fw-semibold text-dark">{order.doctorName}</div>
                            <small className="text-muted">{order.department}</small>
                          </td>

                          <td>
                            <strong className="text-primary d-block">{order.testName}</strong>
                            <span className="badge bg-light text-dark border small">
                              {order.sampleType}
                            </span>
                          </td>

                          <td>
                            <span className={`${statusBadge} px-2 py-1`}>
                              {order.status}
                            </span>
                            <div className="text-muted small mt-1">{order.technicianName}</div>
                          </td>

                          <td>
                            <div className="d-flex align-items-center gap-1 flex-wrap">
                              {order.status === 'Pending Collection' && (
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-warning text-dark d-flex align-items-center gap-1"
                                  onClick={() => handleCollectSample(order.id)}
                                >
                                  <TestTube size={14} />
                                  <span>{t('collectSampleBtn')}</span>
                                </button>
                              )}

                              {order.status === 'Sample Collected' && (
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
                                  onClick={() => handleStartAnalysis(order.id)}
                                >
                                  <FlaskConical size={14} />
                                  <span>{t('startAnalysisBtn')}</span>
                                </button>
                              )}

                              {order.status === 'Testing In Progress' && (
                                <button
                                  type="button"
                                  className="btn btn-sm btn-primary d-flex align-items-center gap-1"
                                  onClick={() => handleEnterLabResults(order)}
                                >
                                  <FileText size={14} />
                                  <span>{t('enterResultsBtn')}</span>
                                </button>
                              )}

                              {order.status === 'Report Ready' && (
                                <button
                                  type="button"
                                  className="btn btn-sm btn-success d-flex align-items-center gap-1"
                                  onClick={() => onViewLabReport(order)}
                                >
                                  <Printer size={14} />
                                  <span>{t('printReportBtn')}</span>
                                </button>
                              )}

                              <button
                                type="button"
                                className="btn btn-sm btn-outline-info"
                                onClick={() => onViewRecord(order.patientId)}
                                title="View Patient Medical History"
                              >
                                <FolderOpen size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
