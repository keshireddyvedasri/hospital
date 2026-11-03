import { useState, useEffect } from 'react';
import { store } from './dataStore';

export function useStore() {
  const [state, setState] = useState(() => store.getState());

  useEffect(() => {
    const unsubscribe = store.subscribe((newState) => {
      setState({ ...newState });
    });
    return unsubscribe;
  }, []);

  return {
    state,
    store,
    patients: state.patients,
    doctors: state.doctors,
    departments: state.departments,
    hospitals: state.hospitals,
    appointments: state.appointments,
    rooms: state.rooms,
    roomBookings: state.roomBookings,
    bloodBank: state.bloodBank,
    bloodRequests: state.bloodRequests,
    medicalRecords: state.medicalRecords,
    labOrders: state.labOrders || [],
    doctorCheckInLogs: state.doctorCheckInLogs || [],
    doctorLeaveRequests: state.doctorLeaveRequests || [],
    scheduleChangeRequests: state.scheduleChangeRequests || []
  };
}

