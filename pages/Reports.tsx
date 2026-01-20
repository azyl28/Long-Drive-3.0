
import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { PageHeader } from '../components/common';

const Reports: React.FC = () => {
  const { state } = useAppContext();
  const [reportType, setReportType] = useState('vehicle');
  const [selectedId, setSelectedId] = useState('');

  const reportData = useMemo(() => {
    if (!selectedId) return null;

    if (reportType === 'vehicle') {
      const vehicle = state.vehicles.find(v => v.id === selectedId);
      if (!vehicle) return null;
      const vehicleTrips = state.trips.filter(t => t.vehicleId === selectedId && t.status === 'completed');
      const totalDistance = vehicleTrips.reduce((sum, t) => sum + (t.distance || 0), 0);
      const totalFuel = vehicleTrips.reduce((sum, t) => sum + (t.fuelUsed || 0), 0);
      return {
        title: `${vehicle.make} ${vehicle.model} (${vehicle.registrationNumber})`,
        stats: [
          { label: 'Całkowity dystans', value: `${totalDistance.toLocaleString('pl-PL')} km` },
          { label: 'Całkowite zużycie paliwa', value: `${totalFuel.toFixed(2)} L` },
          { label: 'Średnie zużycie paliwa', value: totalDistance > 0 ? `${((totalFuel / totalDistance) * 100).toFixed(2)} L/100km` : 'N/A' },
          { label: 'Liczba przejazdów', value: vehicleTrips.length },
        ],
        trips: vehicleTrips,
      };
    } else {
      const driver = state.drivers.find(d => d.id === selectedId);
      if (!driver) return null;
      const driverTrips = state.trips.filter(t => t.driverId === selectedId && t.status === 'completed');
      const totalDistance = driverTrips.reduce((sum, t) => sum + (t.distance || 0), 0);
      return {
        title: driver.name,
        stats: [
          { label: 'Całkowity dystans', value: `${totalDistance.toLocaleString('pl-PL')} km` },
          { label: 'Liczba przejazdów', value: driverTrips.length },
        ],
        trips: driverTrips,
      };
    }
  }, [selectedId, reportType, state]);

  const getVehicle = (id: string) => state.vehicles.find(v => v.id === id);
  const getDriver = (id: string) => state.drivers.find(d => d.id === id);

  return (
    <div className="p-8">
      <PageHeader title="Raporty" />
      <div className="flex space-x-4 mb-6">
        <select onChange={(e) => { setReportType(e.target.value); setSelectedId(''); }} value={reportType} className="p-2 border rounded-md bg-white dark:bg-slate-800 dark:border-slate-600">
          <option value="vehicle">Raport dla pojazdu</option>
          <option value="driver">Raport dla kierowcy</option>
        </select>
        <select onChange={(e) => setSelectedId(e.target.value)} value={selectedId} className="flex-grow p-2 border rounded-md bg-white dark:bg-slate-800 dark:border-slate-600">
          <option value="">Wybierz...</option>
          {reportType === 'vehicle'
            ? state.vehicles.map(v => <option key={v.id} value={v.id}>{v.make} {v.model} ({v.registrationNumber})</option>)
            : state.drivers.map(d => <option key={d.id} value={d.id}>{d.name}</option>)
          }
        </select>
      </div>

      {reportData && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-bold mb-4 text-slate-800 dark:text-slate-100">{reportData.title}</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {reportData.stats.map(stat => (
              <div key={stat.label} className="bg-slate-50 dark:bg-slate-800 p-4 rounded-md">
                <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
                <p className="text-xl font-bold text-slate-800 dark:text-slate-200">{stat.value}</p>
              </div>
            ))}
          </div>
          <h4 className="text-xl font-semibold mb-2 text-slate-800 dark:text-slate-200">Historia przejazdów</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
              <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-800">
                <tr>
                  <th className="px-4 py-2">Data</th>
                  {reportType === 'driver' && <th className="px-4 py-2">Pojazd</th>}
                  {reportType === 'vehicle' && <th className="px-4 py-2">Kierowca</th>}
                  <th className="px-4 py-2">Dystans</th>
                  <th className="px-4 py-2">Zużycie paliwa</th>
                </tr>
              </thead>
              <tbody className="dark:divide-slate-700">
                {reportData.trips.map(trip => (
                  <tr key={trip.id} className="border-b dark:border-slate-700">
                    <td className="px-4 py-2">{new Date(trip.startDate).toLocaleDateString('pl-PL')}</td>
                    {reportType === 'driver' && <td className="px-4 py-2">{getVehicle(trip.vehicleId)?.make} {getVehicle(trip.vehicleId)?.model}</td>}
                    {reportType === 'vehicle' && <td className="px-4 py-2">{getDriver(trip.driverId)?.name}</td>}
                    <td className="px-4 py-2">{trip.distance?.toLocaleString('pl-PL')} km</td>
                    <td className="px-4 py-2">{trip.fuelUsed?.toFixed(2)} L</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
