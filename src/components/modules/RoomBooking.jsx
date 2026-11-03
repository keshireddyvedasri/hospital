import React from 'react';
import { DoorOpen, Plus, CheckCircle2, Bed } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function RoomBooking({ rooms, onOpenBookingModal }) {
  const { t } = useLanguage();

  return (
    <div className="container-fluid px-lg-5">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h3 className="fw-bold text-dark mb-1">{t('roomBookingTitle')}</h3>
          <p className="text-muted mb-0">{t('roomBookingDesc')}</p>
        </div>
        <button
          type="button"
          className="btn btn-primary-custom d-flex align-items-center gap-1"
          onClick={() => onOpenBookingModal(rooms[0])}
        >
          <Plus size={18} />
          <span>{t('bookBedBtn')}</span>
        </button>
      </div>

      <div className="row g-4">
        {rooms.map((r) => {
          const available = r.totalBeds - r.occupiedBeds;
          const pct = Math.round((r.occupiedBeds / r.totalBeds) * 100);
          const isFull = available <= 0;

          return (
            <div key={r.id} className="col-lg-4 col-md-6">
              <div className="room-card">
                
                <div className="room-header d-flex justify-content-between align-items-start">
                  <div>
                    <span className="badge bg-primary-subtle text-primary fw-bold mb-1">{r.category}</span>
                    <h4 className="fw-bold mb-0 text-dark">{r.type}</h4>
                    <small className="text-muted">{r.floor}</small>
                  </div>
                  <span className={`badge ${isFull ? 'bg-danger' : 'bg-success'} fs-6`}>
                    {isFull ? 'Ward Full' : `${available} Beds Free`}
                  </span>
                </div>

                <div className="p-3 flex-grow-1 d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-center small mb-1">
                    <span className="text-muted">Occupancy:</span>
                    <strong>{r.occupiedBeds} / {r.totalBeds} Beds Occupied</strong>
                  </div>

                  <div className="bed-capacity-bar mb-3">
                    <div className="bed-capacity-fill" style={{ width: `${pct}%` }}></div>
                  </div>

                  <div className="mb-3">
                    <strong className="small text-secondary d-block mb-1">Ward Amenities:</strong>
                    <div className="d-flex flex-wrap">
                      {r.amenities.map((a, i) => (
                        <span key={i} className="amenity-tag">{a}</span>
                      ))}
                    </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center pt-3 border-top mt-auto">
                    <div>
                      <small className="text-muted d-block">Hospital Charges</small>
                      <strong className="text-dark">{r.pricePerDay}</strong>
                    </div>
                    <button
                      type="button"
                      className={`btn btn-sm ${isFull ? 'btn-secondary disabled' : 'btn-primary-custom'} d-flex align-items-center gap-1`}
                      disabled={isFull}
                      onClick={() => onOpenBookingModal(r)}
                    >
                      <DoorOpen size={15} />
                      <span>{isFull ? 'Waitlist' : 'Book Bed / Room'}</span>
                    </button>
                  </div>

                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

