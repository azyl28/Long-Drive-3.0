
import type { Vehicle, Driver, Trip, KeyLog, CompanyData, Refueling, AppState } from '../types';

export const mockVehicles: Vehicle[] = [
  {
    id: 'v1',
    make: 'Toyota',
    model: 'Corolla',
    year: 2021,
    registrationNumber: 'EL 12345',
    mileage: 125400,
    fuelLevel: 35.0,
    tankSize: 50,
    fuelConsumption: 7.5,
    status: 'available',
    vehicleType: 'Osobowe',
    fuelType: 'Benzyna',
    engineCapacity: 1798,
    bodyType: 'Sedan',
  },
  {
    id: 'v2',
    make: 'Skoda',
    model: 'Octavia',
    year: 2022,
    registrationNumber: 'EP 54321',
    mileage: 89210,
    fuelLevel: 42.5,
    tankSize: 55,
    fuelConsumption: 6.8,
    status: 'available',
    vehicleType: 'Osobowe',
    fuelType: 'Diesel',
    engineCapacity: 1968,
    bodyType: 'Kombi',
  },
  {
    id: 'v3',
    make: 'Ford',
    model: 'Transit',
    year: 2020,
    registrationNumber: 'EZG 98765',
    mileage: 210500,
    fuelLevel: 65.0,
    tankSize: 80,
    fuelConsumption: 9.2,
    status: 'available',
    vehicleType: 'BUS',
    fuelType: 'Diesel',
    engineCapacity: 1995,
    bodyType: 'Furgon',
  },
];

export const mockDrivers: Driver[] = [
  {
    id: 'd1',
    name: 'Jan Kowalski',
    phone: '123-456-789',
    email: 'jan.kowalski@example.com',
  },
  {
    id: 'd2',
    name: 'Anna Nowak',
    phone: '987-654-321',
    email: 'anna.nowak@example.com',
  },
  {
    id: 'd3',
    name: 'Piotr Wiśniewski',
    phone: '555-444-333',
    email: 'piotr.wisniewski@example.com',
  },
];

export const mockTrips: Trip[] = [];
export const mockKeyLogs: KeyLog[] = [];
export const mockRefuelings: Refueling[] = [];

export const mockCompanyData: CompanyData = {
  name: 'Twoja Firma Sp. z o.o.',
  address: 'ul. Główna 123',
  zipCode: '00-001',
  city: 'Warszawa',
  nip: '123-456-78-90',
  regon: '123456789',
  phone: '+48 22 123 45 67',
  email: 'biuro@twojafirma.pl'
};

export const getInitialState = (): AppState => ({
    vehicles: mockVehicles,
    drivers: mockDrivers,
    trips: mockTrips,
    keyLogs: mockKeyLogs,
    companyData: mockCompanyData,
    refuelings: mockRefuelings,
    lastKartaDrogowaNumber: 0,
    theme: 'teal',
    fuelPrices: {
        pb95: 6.59,
        on: 6.49,
        lpg: 2.99,
    },
    isDarkMode: false,
});
