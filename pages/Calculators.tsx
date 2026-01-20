
import React, { useState, useMemo, useEffect } from 'react';
import { PageHeader } from '../components/common';
import { useAppContext } from '../context/AppContext';
import type { FuelPrices } from '../types';
import { GasPumpIcon } from '../components/icons';

const CalculatorCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg">
    <h3 className="text-xl font-semibold text-slate-800 mb-4 border-b pb-2">{title}</h3>
    <div className="space-y-4">{children}</div>
  </div>
);

const InputField: React.FC<{ label: string; type: string; value: string | number; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder?: string; unit?: string }> = ({ label, type, value, onChange, placeholder, unit }) => (
  <div>
    <label className="block text-sm font-medium text-slate-600">{label}</label>
    <div className="mt-1 relative rounded-md shadow-sm">
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="block w-full p-3 border-slate-300 rounded-md"
        min="0"
        step="0.01"
      />
      {unit && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <span className="text-gray-500 sm:text-sm">{unit}</span>
        </div>
      )}
    </div>
  </div>
);

const ResultDisplay: React.FC<{ label: string; value: string; unit: string }> = ({ label, value, unit }) => (
  <div className="bg-slate-50 p-4 rounded-lg text-center">
    <p className="text-sm text-slate-500">{label}</p>
    <p className="text-2xl font-bold text-blue-600">
      {value} <span className="text-lg font-medium text-slate-600">{unit}</span>
    </p>
  </div>
);

const Calculators: React.FC = () => {
  const { state } = useAppContext();

  // Fuel Cost Calculator State
  const [distance, setDistance] = useState('');
  const [consumption, setConsumption] = useState('');
  const [price, setPrice] = useState<string | number>('');
  const [fuelType, setFuelType] = useState<keyof FuelPrices>('pb95');

  useEffect(() => {
    setPrice(state.fuelPrices[fuelType]);
  }, [fuelType, state.fuelPrices]);

  const fuelCost = useMemo(() => {
    const numDistance = parseFloat(distance);
    const numConsumption = parseFloat(consumption);
    const numPrice = parseFloat(price as string);
    if (numDistance > 0 && numConsumption > 0 && numPrice > 0) {
      return ((numDistance / 100) * numConsumption * numPrice).toFixed(2);
    }
    return '0.00';
  }, [distance, consumption, price]);

  // Trip Time Calculator State
  const [tripDistance, setTripDistance] = useState('');
  const [avgSpeed, setAvgSpeed] = useState('');

  const tripTime = useMemo(() => {
    const numDistance = parseFloat(tripDistance);
    const numSpeed = parseFloat(avgSpeed);
    if (numDistance > 0 && numSpeed > 0) {
      const hours = numDistance / numSpeed;
      const h = Math.floor(hours);
      const minutes = (hours - h) * 60;
      const m = Math.round(minutes);
      return `${h}h ${m}m`;
    }
    return '0h 0m';
  }, [tripDistance, avgSpeed]);

  // Fuel Consumption Calculator
  const [drivenKm, setDrivenKm] = useState('');
  const [fueledLiters, setFueledLiters] = useState('');
  const avgConsumption = useMemo(() => {
      const numDriven = parseFloat(drivenKm);
      const numLiters = parseFloat(fueledLiters);
      if (numDriven > 0 && numLiters > 0) {
          return ((numLiters / numDriven) * 100).toFixed(2);
      }
      return '0.00';
  }, [drivenKm, fueledLiters]);

  // Tire Size Calculator
  const [tire1, setTire1] = useState('');
  const [tire2, setTire2] = useState('');
  const parseTire = (tireStr: string) => {
      const match = tireStr.match(/(\d{3})\/(\d{2})R(\d{2})/);
      if (!match) return null;
      const width = parseInt(match[1], 10);
      const ratio = parseInt(match[2], 10);
      const rim = parseInt(match[3], 10);
      const sidewall = width * (ratio / 100);
      const diameter = (sidewall * 2) + (rim * 25.4);
      return { diameter, circumference: diameter * Math.PI };
  };
  const tireComparison = useMemo(() => {
      const t1 = parseTire(tire1);
      const t2 = parseTire(tire2);
      if (t1 && t2) {
          const diff = ((t2.diameter - t1.diameter) / t1.diameter) * 100;
          const speedDiff = (100 * t2.circumference / t1.circumference).toFixed(1);
          return {
              t1Diameter: t1.diameter.toFixed(1),
              t2Diameter: t2.diameter.toFixed(1),
              diff: diff.toFixed(2),
              speedAt100: speedDiff,
          };
      }
      return null;
  }, [tire1, tire2]);

  return (
    <div className="p-8">
      <PageHeader title="Kalkulatory" />
      
      <div className="mb-6 bg-white p-4 rounded-lg shadow-md flex items-center justify-around text-center">
        <div className="flex items-center text-slate-500">
            <GasPumpIcon className="w-6 h-6 mr-2 text-blue-600"/>
            <span className="font-semibold">Aktualne Ceny Paliw:</span>
        </div>
        <div><span className="font-bold text-slate-700">PB95:</span> {state.fuelPrices.pb95.toFixed(2)} PLN</div>
        <div><span className="font-bold text-slate-700">ON:</span> {state.fuelPrices.on.toFixed(2)} PLN</div>
        <div><span className="font-bold text-slate-700">LPG:</span> {state.fuelPrices.lpg.toFixed(2)} PLN</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <CalculatorCard title="Kalkulator kosztów paliwa">
          <InputField label="Dystans" type="number" value={distance} onChange={(e) => setDistance(e.target.value)} placeholder="np. 350" unit="km" />
          <InputField label="Średnie spalanie" type="number" value={consumption} onChange={(e) => setConsumption(e.target.value)} placeholder="np. 6.5" unit="L/100km" />
          <div>
            <label className="block text-sm font-medium text-slate-600">Rodzaj i cena paliwa</label>
            <div className="mt-1 grid grid-cols-3 gap-2">
                <select value={fuelType} onChange={(e) => setFuelType(e.target.value as keyof FuelPrices)} className="col-span-1 p-3 border-slate-300 rounded-md">
                    <option value="pb95">PB95</option>
                    <option value="on">ON</option>
                    <option value="lpg">LPG</option>
                </select>
                <div className="col-span-2 relative">
                    <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="block w-full p-3 border-slate-300 rounded-md" />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"><span className="text-gray-500 sm:text-sm">PLN</span></div>
                </div>
            </div>
          </div>
          <ResultDisplay label="Szacowany koszt przejazdu" value={fuelCost} unit="PLN" />
        </CalculatorCard>

        <CalculatorCard title="Kalkulator czasu przejazdu">
          <InputField label="Dystans" type="number" value={tripDistance} onChange={(e) => setTripDistance(e.target.value)} placeholder="np. 500" unit="km" />
          <InputField label="Średnia prędkość" type="number" value={avgSpeed} onChange={(e) => setAvgSpeed(e.target.value)} placeholder="np. 90" unit="km/h" />
          <ResultDisplay label="Szacowany czas przejazdu" value={tripTime.split(' ')[0]} unit={tripTime.split(' ')[1]} />
        </CalculatorCard>

        <CalculatorCard title="Kalkulator Spalania">
            <InputField label="Przejechany dystans" type="number" value={drivenKm} onChange={(e) => setDrivenKm(e.target.value)} placeholder="np. 450" unit="km" />
            <InputField label="Zatankowane paliwo" type="number" value={fueledLiters} onChange={(e) => setFueledLiters(e.target.value)} placeholder="np. 32" unit="L" />
            <ResultDisplay label="Średnie spalanie" value={avgConsumption} unit="L/100km" />
        </CalculatorCard>

        <CalculatorCard title="Kalkulator Rozmiaru Opon">
            <InputField label="Oryginalny rozmiar" type="text" value={tire1} onChange={(e) => setTire1(e.target.value)} placeholder="205/55R16" />
            <InputField label="Nowy rozmiar" type="text" value={tire2} onChange={(e) => setTire2(e.target.value)} placeholder="225/45R17" />
            {tireComparison ? (
                <div className="bg-slate-50 p-4 rounded-lg text-sm space-y-2">
                    <p>Różnica w średnicy: <span className={`font-bold ${parseFloat(tireComparison.diff) > 0 ? 'text-red-600' : 'text-green-600'}`}>{tireComparison.diff}%</span></p>
                    <p>Średnica 1: {tireComparison.t1Diameter} mm</p>
                    <p>Średnica 2: {tireComparison.t2Diameter} mm</p>
                    <p>Gdy licznik pokazuje 100 km/h, rzeczywista prędkość to <span className="font-bold">{tireComparison.speedAt100} km/h</span>.</p>
                </div>
            ) : <div className="text-center text-slate-500 text-sm p-4">Wprowadź oba rozmiary w formacie XXX/XXRXX.</div>}
        </CalculatorCard>
      </div>
    </div>
  );
};

export default Calculators;
