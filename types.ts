
export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  registrationNumber: string;
  mileage: number;
  fuelLevel: number;
  tankSize: number;
  fuelConsumption: number;
  status: 'available' | 'in_use';
  vehicleType: string;
  fuelType: string;
  engineCapacity: number;
  bodyType: string;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  email: string;
}

export interface Trip {
  id: string;
  kartaDrogowaNr: string;
  vehicleId: string;
  driverId: string;
  zlecaWyjazd: string;
  routeFrom: string;
  routeTo: string;
  status: 'active' | 'completed';
  startDate: string;
  startMileage: number;
  startFuelLevel: number;
  endDate?: string;
  endMileage?: number;
  fuelAdded?: number;
  distance?: number;
  fuelUsed?: number;
}

export interface KeyLog {
  id: string;
  vehicleId: string;
  driverId: string;
  issuedBy: string;
  checkoutDate: string;
  returnDate?: string;
  status: 'checked_out' | 'returned';
}

export interface CompanyData {
  name: string;
  address: string;
  zipCode: string;
  city: string;
  nip: string;
  regon: string;
  phone: string;
  email: string;
}

export interface Refueling {
    id: string;
    vehicleId: string;
    driverId: string;
    date: string;
    liters: number;
    cost: number;
    mileageAtRefueling: number;
}

export interface FuelPrices {
    pb95: number;
    on: number;
    lpg: number;
}

export interface AppState {
  vehicles: Vehicle[];
  drivers: Driver[];
  trips: Trip[];
  keyLogs: KeyLog[];
  companyData: CompanyData;
  refuelings: Refueling[];
  lastKartaDrogowaNumber: number;
  theme: string;
  fuelPrices: FuelPrices;
  isDarkMode: boolean;
}

export type Action =
  | { type: 'UPDATE_COMPANY_DATA'; payload: CompanyData }
  | { type: 'ADD_REFUELING'; payload: Omit<Refueling, 'id' | 'date'> & { date?: string } }
  | { type: 'CHECKOUT_KEY'; payload: { vehicleId: string; driverId: string; issuedBy: string } }
  | { type: 'RETURN_KEY'; payload: { vehicleId: string } }
  | { type: 'START_TRIP'; payload: { vehicleId: string; driverId: string; zlecaWyjazd: string; routeFrom: string; routeTo: string } }
  | { type: 'END_TRIP'; payload: { tripId: string; endMileage: number; fuelAdded: number } }
  | { type: 'DELETE_TRIP'; payload: { tripId: string } }
  | { type: 'DELETE_VEHICLE'; payload: { vehicleId: string } }
  | { type: 'DELETE_DRIVER'; payload: { driverId: string } }
  | { type: 'RESTORE_STATE'; payload: AppState }
  | { type: 'ADD_VEHICLE'; payload: Vehicle }
  | { type: 'UPDATE_VEHICLE'; payload: Vehicle }
  | { type: 'ADD_DRIVER'; payload: Driver }
  | { type: 'UPDATE_DRIVER'; payload: Driver }
  | { type: 'SET_THEME'; payload: string }
  | { type: 'UPDATE_FUEL_PRICES'; payload: FuelPrices }
  | { type: 'TOGGLE_DARK_MODE' }
  | { type: 'RESET_STATE' };

export interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

export interface Page {
  name: string;
  params?: { [key: string]: any };
}
