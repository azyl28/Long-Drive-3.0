
import React, { useState, useMemo, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useAppContext } from '../context/AppContext';
import { PageHeader, PrimaryButton } from '../components/common';
import { KartaDrogowa } from '../components/KartaDrogowa';
import { PolecenieWyjazdu } from '../components/PolecenieWyjazdu';
import { PdfIcon, ReportIcon, SpinnerIcon } from '../components/icons';
import type { Page } from '../types';

interface TripDetailProps {
  tripId?: string;
  setPage: React.Dispatch<React.SetStateAction<Page>>;
}

const TripDetail: React.FC<TripDetailProps> = ({ tripId, setPage }) => {
  const { state, dispatch } = useAppContext();
  const trip = useMemo(() => state.trips.find(t => t.id === tripId), [state.trips, tripId]);
  const vehicle = useMemo(() => trip ? state.vehicles.find(v => v.id === trip.vehicleId) : null, [state.vehicles, trip]);
  const driver = useMemo(() => trip ? state.drivers.find(d => d.id === trip.driverId) : null, [state.drivers, trip]);

  const [endMileage, setEndMileage] = useState(trip?.startMileage || 0);
  const [fuelAdded, setFuelAdded] = useState(0);
  const [isLoadingKarta, setIsLoadingKarta] = useState(false);
  const [isLoadingPolecenie, setIsLoadingPolecenie] = useState(false);
  const kartaRef = useRef<HTMLDivElement>(null);
  const polecenieRef = useRef<HTMLDivElement>(null);

  if (!trip || !vehicle || !driver) {
    return <div className="p-8">Nie znaleziono przejazdu. <button onClick={() => setPage({name: 'trips'})} className="text-teal-500">Wróć do listy</button></div>;
  }

  const handleEndTrip = () => {
    if (endMileage <= trip.startMileage) {
      alert('Przebieg końcowy musi być większy niż początkowy.');
      return;
    }
    if (tripId) {
        dispatch({ type: 'END_TRIP', payload: { tripId, endMileage, fuelAdded } });
    }
  };

  const generatePdf = async (ref: React.RefObject<HTMLDivElement>, filename: string, setLoading: React.Dispatch<React.SetStateAction<boolean>>) => {
    if (!ref.current) return;
    setLoading(true);
    try {
      const canvas = await html2canvas(ref.current, { scale: 3, useCORS: true, backgroundColor: '#ffffff' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const ratio = canvasWidth / canvasHeight;
      const width = pdfWidth - 20;
      const height = width / ratio;
      pdf.addImage(imgData, 'PNG', 10, 10, width, height);
      pdf.save(filename);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setLoading(false);
    }
  };

  const mapTripToKarta = () => {
    const startTime = new Date(trip.startDate);
    const endTime = trip.endDate ? new Date(trip.endDate) : new Date();
    const durationMs = endTime.getTime() - startTime.getTime();
    const durationHours = Math.floor(durationMs / 3600000);
    const durationMinutes = Math.floor((durationMs % 3600000) / 60000);

    const calculatedFuelUsed = trip.status === 'completed' ? trip.fuelUsed : ((endMileage - trip.startMileage) / 100) * vehicle.fuelConsumption;
    const calculatedDistance = trip.status === 'completed' ? trip.distance : (endMileage - trip.startMileage);

    return {
      numerKarty: trip.kartaDrogowaNr,
      data: startTime.toLocaleDateString('pl-PL'),
      pieczecJednostki: state.companyData.name,
      nrRejestracyjny: vehicle.registrationNumber,
      markaTyp: `${vehicle.make} ${vehicle.model}`,
      pojemnoscCylindrow: vehicle.engineCapacity ? `${vehicle.engineCapacity} cm³` : '',
      rodzajPaliwa: vehicle.fuelType,
      rodzajNadwozia: vehicle.bodyType || '',
      grupa: '1',
      nrInwentarzowy: `S-${vehicle.id.slice(-2)}`,
      miejsceGarazowania: state.companyData.address,
      kierowca: driver.name,
      godzinaRozpoczeciaPracy: startTime.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }),
      godzinaZakonczeniaPracy: endTime.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }),
      iloscGodzinPracy: `${durationHours}h ${durationMinutes}m`,
      paliwoStanPoczatkowy: trip.startFuelLevel,
      paliwoPobrano: (trip.fuelAdded || fuelAdded) > 0 ? [{ gdzie: 'Stacja ABC', nrKwitu: 'FV/123', ilosc: trip.fuelAdded || fuelAdded }] : [],
      paliwoStanKoncowy: trip.startFuelLevel + (trip.fuelAdded || fuelAdded) - (calculatedFuelUsed || 0),
      normaZuzyciaPaliwa: vehicle.fuelConsumption,
      zuzyciePaliwa: {
        wgNorm: calculatedFuelUsed || 0,
        rzeczywiste: calculatedFuelUsed || 0,
        oszczednosc: 0,
        przekroczenie: 0,
      },
      wyjazd: {
        data: startTime.toLocaleDateString('pl-PL'),
        godzina: startTime.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }),
        stanLicznika: trip.startMileage,
      },
      powrot: {
        data: endTime.toLocaleDateString('pl-PL'),
        godzina: endTime.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }),
        stanLicznika: trip.endMileage || endMileage,
      },
      wyniki: {
        czasPracy: `${durationHours}h ${durationMinutes}m`,
        przebiegKm: calculatedDistance || 0,
      },
      podpisKierowcySprawny: driver.name,
      podpisZlecajacegoWyjazd: trip.zlecaWyjazd,
      podpisStwierdzajacegoPrzyjazd: trip.zlecaWyjazd,
      podpisWystawiajacegoKarte: 'System',
      podpisKierowcyWyniki: driver.name,
      podpisWynikiObliczyl: 'System',
      podpisKontroliWynikow: trip.zlecaWyjazd,
    };
  };

  const mapTripToPolecenie = () => {
    const startTime = new Date(trip.startDate);
    const endTime = trip.endDate ? new Date(trip.endDate) : new Date();
    return {
      nrZlecenia: trip.id.slice(-5),
      nazwiskoJadacego: driver.name,
      trasa: {
        skadDokad: `${trip.routeFrom} - ${trip.routeTo}`,
        odjazdData: startTime.toLocaleDateString('pl-PL'),
        odjazdGodz: startTime.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }),
        przyjazdData: endTime.toLocaleDateString('pl-PL'),
        przyjazdGodz: endTime.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }),
        stanLicznikaPrzyWyjezdzie: trip.startMileage,
        stanLicznikaPoPowrocie: trip.endMileage || endMileage,
        przebiegKm: trip.distance || (endMileage - trip.startMileage),
      },
      podpisJadacego: driver.name,
      zuzyciePaliwaWgNorm: trip.fuelUsed || 0,
      wyjazdPortier: {
        godzina: startTime.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }),
        podpis: 'Portier Zm. 1'
      },
      wjazdPortier: {
        godzina: endTime.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }),
        podpis: 'Portier Zm. 2'
      }
    };
  };

  return (
    <div className="p-8">
      <PageHeader title={`Szczegóły przejazdu #${trip.id.slice(-5)}`} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Podsumowanie</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>Pojazd:</span> <span className="font-medium">{vehicle.make} {vehicle.model}</span></div>
              <div className="flex justify-between"><span>Kierowca:</span> <span className="font-medium">{driver.name}</span></div>
              <div className="flex justify-between"><span>Trasa:</span> <span className="font-medium">{trip.routeFrom} - {trip.routeTo}</span></div>
              <div className="flex justify-between"><span>Data rozpoczęcia:</span> <span className="font-medium">{new Date(trip.startDate).toLocaleString('pl-PL')}</span></div>
              <div className="flex justify-between"><span>Przebieg początkowy:</span> <span className="font-medium">{trip.startMileage} km</span></div>
            </div>

            {trip.status === 'active' ? (
              <div className="mt-6 pt-6 border-t">
                <h3 className="text-xl font-semibold mb-4">Zakończ przejazd</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="endMileage" className="block text-sm font-medium text-slate-600">Przebieg końcowy (km)</label>
                    <input type="number" id="endMileage" min={trip.startMileage + 1} value={endMileage} onChange={(e) => setEndMileage(Number(e.target.value))} className="mt-1 block w-full p-2 border rounded-md" />
                  </div>
                  <div>
                    <label htmlFor="fuelAdded" className="block text-sm font-medium text-slate-600">Dotankowano paliwa (l)</label>
                    <input type="number" id="fuelAdded" min="0" step="0.01" value={fuelAdded} onChange={(e) => setFuelAdded(Number(e.target.value))} className="mt-1 block w-full p-2 border rounded-md" />
                  </div>
                  <PrimaryButton onClick={handleEndTrip}>Zakończ przejazd</PrimaryButton>
                </div>
              </div>
            ) : (
              <div className="mt-6 pt-6 border-t">
                <h3 className="text-xl font-semibold mb-4">Wyniki</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span>Data zakończenia:</span> <span className="font-medium">{new Date(trip.endDate!).toLocaleString('pl-PL')}</span></div>
                  <div className="flex justify-between"><span>Przebieg końcowy:</span> <span className="font-medium">{trip.endMileage} km</span></div>
                  <div className="flex justify-between"><span>Dystans:</span> <span className="font-bold text-teal-600">{trip.distance} km</span></div>
                  <div className="flex justify-between"><span>Zużyte paliwo:</span> <span className="font-bold text-teal-600">{trip.fuelUsed?.toFixed(2)} L</span></div>
                </div>
              </div>
            )}
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Generuj dokumenty</h3>
            <div className="space-y-4">
              <button onClick={() => generatePdf(kartaRef, `karta_drogowa_${trip.id}.pdf`, setIsLoadingKarta)} disabled={isLoadingKarta} className="w-full inline-flex justify-center items-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 disabled:bg-slate-400">
                {isLoadingKarta ? <SpinnerIcon className="animate-spin -ml-1 mr-3 h-5 w-5" /> : <PdfIcon className="-ml-1 mr-3 h-5 w-5" />}
                {trip.status === 'active' ? 'Generuj Kartę (Wstępną)' : 'Generuj Kartę Drogową'}
              </button>
              <button onClick={() => generatePdf(polecenieRef, `polecenie_wyjazdu_${trip.id}.pdf`, setIsLoadingPolecenie)} disabled={isLoadingPolecenie} className="w-full inline-flex justify-center items-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-400">
                {isLoadingPolecenie ? <SpinnerIcon className="animate-spin -ml-1 mr-3 h-5 w-5" /> : <ReportIcon className="-ml-1 mr-3 h-5 w-5" />}
                Generuj Polecenie Wyjazdu
              </button>
            </div>
          </div>
        </div>
        <div className="lg:col-span-2">
          <h3 className="text-xl font-semibold mb-4">Podgląd Karty Drogowej</h3>
          <div className="transform scale-[0.9] origin-top-left lg:scale-100">
            <KartaDrogowa ref={kartaRef} data={mapTripToKarta()} />
          </div>
        </div>
      </div>
      <div className="absolute -left-[9999px] top-0">
        <PolecenieWyjazdu ref={polecenieRef} data={mapTripToPolecenie()} />
      </div>
    </div>
  );
};

export default TripDetail;
