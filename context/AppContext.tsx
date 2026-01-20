
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { AppState, Action, AppContextType } from '../types';
import { getInitialState } from '../data/mock';

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialState = getInitialState();

const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'SET_THEME':
        return { ...state, theme: action.payload };
    case 'TOGGLE_DARK_MODE':
        return { ...state, isDarkMode: !state.isDarkMode };
    case 'UPDATE_FUEL_PRICES':
        return { ...state, fuelPrices: action.payload };
    case 'RESET_STATE':
        localStorage.removeItem('fleetmanState');
        return initialState;
    case 'UPDATE_COMPANY_DATA':
      return { ...state, companyData: action.payload };
    case 'ADD_REFUELING': {
      const newRefueling = { ...action.payload, id: `refuel-${Date.now()}`, date: new Date().toISOString() };
      return {
        ...state,
        refuelings: [...state.refuelings, newRefueling],
        vehicles: state.vehicles.map(v =>
          v.id === action.payload.vehicleId
            ? { ...v, fuelLevel: Math.min(v.tankSize, v.fuelLevel + action.payload.liters) }
            : v
        )
      };
    }
    case 'CHECKOUT_KEY': {
      const { vehicleId, driverId, issuedBy } = action.payload;
      const isAlreadyCheckedOut = state.keyLogs.some(k => k.vehicleId === vehicleId && k.status === 'checked_out');
      if (isAlreadyCheckedOut) {
        alert('Kluczyk do tego pojazdu jest już wypożyczony.');
        return state;
      }
      const newKeyLog = {
        id: `key-${Date.now()}`,
        vehicleId,
        driverId,
        issuedBy,
        checkoutDate: new Date().toISOString(),
        status: 'checked_out' as const,
      };
      return { ...state, keyLogs: [...state.keyLogs, newKeyLog] };
    }
    case 'RETURN_KEY': {
      const { vehicleId } = action.payload;
      const vehicle = state.vehicles.find(v => v.id === vehicleId);
      if (vehicle?.status === 'in_use') {
        alert('Nie można zwrócić kluczyka, gdy przejazd jest w toku.');
        return state;
      }
      return {
        ...state,
        keyLogs: state.keyLogs.map(k =>
          (k.vehicleId === vehicleId && k.status === 'checked_out')
            ? { ...k, status: 'returned' as const, returnDate: new Date().toISOString() }
            : k
        ),
      };
    }
    case 'START_TRIP': {
      const { vehicleId, driverId, zlecaWyjazd, routeFrom, routeTo } = action.payload;
      const vehicle = state.vehicles.find(v => v.id === vehicleId);
      const hasKey = state.keyLogs.some(k => k.vehicleId === vehicleId && k.driverId === driverId && k.status === 'checked_out');
      if (!hasKey) {
        alert('Nie można rozpocząć przejazdu. Kierowca musi najpierw wypożyczyć kluczyk do tego pojazdu.');
        return state;
      }
      if (!vehicle || vehicle.status === 'in_use') return state;
      const newKartaNr = state.lastKartaDrogowaNumber + 1;
      const newTrip = {
        id: `trip-${Date.now()}`,
        kartaDrogowaNr: `${newKartaNr}/${new Date().getFullYear()}`,
        vehicleId,
        driverId,
        zlecaWyjazd,
        routeFrom,
        routeTo,
        status: 'active' as const,
        startDate: new Date().toISOString(),
        startMileage: vehicle.mileage,
        startFuelLevel: vehicle.fuelLevel,
      };
      return {
        ...state,
        trips: [...state.trips, newTrip],
        vehicles: state.vehicles.map(v => v.id === vehicleId ? { ...v, status: 'in_use' as const } : v),
        lastKartaDrogowaNumber: newKartaNr,
      };
    }
    case 'END_TRIP': {
      const trip = state.trips.find(t => t.id === action.payload.tripId);
      if (!trip) return state;
      const vehicle = state.vehicles.find(v => v.id === trip.vehicleId);
      if (!vehicle) return state;
      const distance = action.payload.endMileage - trip.startMileage;
      const fuelUsed = (distance / 100) * vehicle.fuelConsumption;
      const newFuelLevel = trip.startFuelLevel + (action.payload.fuelAdded || 0) - fuelUsed;
      return {
        ...state,
        trips: state.trips.map(t => t.id === action.payload.tripId ? {
          ...t,
          status: 'completed' as const,
          endDate: new Date().toISOString(),
          endMileage: action.payload.endMileage,
          fuelAdded: action.payload.fuelAdded,
          distance,
          fuelUsed,
        } : t),
        vehicles: state.vehicles.map(v => v.id === trip.vehicleId ? {
          ...v,
          status: 'available' as const,
          mileage: action.payload.endMileage,
          fuelLevel: parseFloat(newFuelLevel.toFixed(2)),
        } : v),
        keyLogs: state.keyLogs.map(k =>
          (k.vehicleId === trip.vehicleId && k.status === 'checked_out')
            ? { ...k, status: 'returned' as const, returnDate: new Date().toISOString() }
            : k
        ),
      };
    }
    case 'DELETE_TRIP': {
        const tripToDelete = state.trips.find(t => t.id === action.payload.tripId);
        if (!tripToDelete) return state;
        let vehicles = state.vehicles;
        if (tripToDelete.status === 'completed') {
            vehicles = state.vehicles.map(v => {
                if (v.id === tripToDelete.vehicleId) {
                    return { ...v, mileage: tripToDelete.startMileage, fuelLevel: tripToDelete.startFuelLevel, status: 'available' as const };
                }
                return v;
            });
        } else if (tripToDelete.status === 'active') {
            vehicles = state.vehicles.map(v => v.id === tripToDelete.vehicleId ? { ...v, status: 'available' as const } : v);
        }
        return {
            ...state,
            trips: state.trips.filter(t => t.id !== action.payload.tripId),
            vehicles,
        };
    }
    case 'DELETE_VEHICLE': {
      const { vehicleId } = action.payload;
      return {
        ...state,
        vehicles: state.vehicles.filter(v => v.id !== vehicleId),
        trips: state.trips.filter(t => t.vehicleId !== vehicleId),
        keyLogs: state.keyLogs.filter(k => k.vehicleId !== vehicleId),
      };
    }
    case 'DELETE_DRIVER': {
      const { driverId } = action.payload;
      return {
        ...state,
        drivers: state.drivers.filter(d => d.id !== driverId),
      };
    }
    case 'RESTORE_STATE':
      return action.payload;
    case 'ADD_VEHICLE':
      return { ...state, vehicles: [...state.vehicles, action.payload] };
    case 'UPDATE_VEHICLE':
      return { ...state, vehicles: state.vehicles.map(v => v.id === action.payload.id ? action.payload : v) };
    case 'ADD_DRIVER':
      return { ...state, drivers: [...state.drivers, action.payload] };
    case 'UPDATE_DRIVER':
      return { ...state, drivers: state.drivers.map(d => d.id === action.payload.id ? action.payload : d) };
    default:
      return state;
  }
};

const usePersistentReducer = () => {
  const [state, dispatch] = useReducer(appReducer, initialState, (initial) => {
    try {
      const storedState = localStorage.getItem('fleetmanState');
      if (storedState) {
        const parsed = JSON.parse(storedState);
        return { ...initial, ...parsed };
      }
      return initial;
    } catch (error) {
      console.error("Could not parse localStorage state:", error);
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('fleetmanState', JSON.stringify(state));
    } catch (error) {
      console.error("Could not save state to localStorage:", error);
    }
  }, [state]);

  return { state, dispatch };
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state, dispatch } = usePersistentReducer();
  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
