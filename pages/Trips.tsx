
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Modal, ConfirmModal, PageHeader, PrimaryButton } from '../components/common';
import { PlusIcon, DeleteIcon, KeyIcon } from '../components/icons';
import type { Page } from '../types';

interface TripsProps {
  setPage: React.Dispatch<React.SetStateAction<Page>>;
}

const Trips: React.FC<TripsProps> = ({ setPage }) => {
  const { state, dispatch } = useAppContext();
  const [showModal, setShowModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const handleStartTrip = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const vehicleId = formData.get('vehicleId') as string;
    const driverId = formData.get('driverId') as string;
    const zlecaWyjazd = formData.get('zlecaWyjazd') as string;
    const routeFrom = formData.get('routeFrom') as string;
    const routeTo = formData.get('routeTo') as string;

    dispatch({ type: 'START_TRIP', payload: { vehicleId, driverId, zlecaWyjazd, routeFrom, routeTo } });
    setShowModal(false);
  };

  const handleDeleteRequest = (tripId: string) => {
    setItemToDelete(tripId);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      dispatch({ type: 'DELETE_TRIP', payload: { tripId: itemToDelete } });
      setItemToDelete(null);
    }
  };

  const getVehicle = (id: string) => state.vehicles.find(v => v.id === id);
  const getDriver = (id: string) => state.drivers.find(d => d.id === id);

  return (
    <div className="p-8">
      <ConfirmModal
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Potwierdź usunięcie"
        message="Na pewno usunąć ten przejazd? Spowoduje to przywrócenie stanu pojazdu sprzed przejazdu."
      />
      <PageHeader title="Przejazdy">
        <PrimaryButton onClick={() => setShowModal(true)}>
          <PlusIcon className="w-5 h-5 mr-2" /> Rozpocznij przejazd
        </PrimaryButton>
      </PageHeader>
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg overflow-hidden">
        <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
          <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-800">
            <tr>
              <th scope="col" className="px-6 py-3">Data</th>
              <th scope="col" className="px-6 py-3">Pojazd</th>
              <th scope="col" className="px-6 py-3">Kierowca</th>
              <th scope="col" className="px-6 py-3">Dystans</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3"><span className="sr-only">Akcje</span></th>
            </tr>
          </thead>
          <tbody>
            {[...state.trips].reverse().map(t => {
              const vehicle = getVehicle(t.vehicleId);
              const driver = getDriver(t.driverId);
              return (
                <tr key={t.id} className="bg-white dark:bg-slate-900 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">
                  <td className="px-6 py-4">{new Date(t.startDate).toLocaleString('pl-PL')}</td>
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{vehicle?.make} {vehicle?.model}</td>
                  <td className="px-6 py-4">{driver?.name}</td>
                  <td className="px-6 py-4">{t.distance ? `${t.distance} km` : '-'}</td>
                  <td className="px-6 py-4">
                    <span onClick={() => setPage({ name: 'trip-detail', params: { id: t.id } })} className={`px-2 py-1 text-xs font-medium rounded-full cursor-pointer ${t.status === 'completed' ? 'bg-[var(--theme-100)] text-[var(--theme-800)]' : 'bg-yellow-100 text-yellow-800 animate-pulse'}`}>
                      {t.status === 'completed' ? 'Zakończony' : 'W trakcie'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleDeleteRequest(t.id)} className="text-red-600 hover:text-red-800"><DeleteIcon className="w-5 h-5"/></button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {showModal && (
        <Modal title="Rozpocznij nowy przejazd" onClose={() => setShowModal(false)}>
          <form onSubmit={handleStartTrip} className="space-y-4">
            <div>
              <label htmlFor="vehicleId" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Pojazd</label>
              <select id="vehicleId" name="vehicleId" className="mt-1 block w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700" required>
                <option value="">Wybierz pojazd...</option>
                {state.vehicles.filter(v => v.status === 'available').map(v => (
                  <option key={v.id} value={v.id}>{v.make} {v.model} ({v.registrationNumber})</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="driverId" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Kierowca</label>
              <select id="driverId" name="driverId" className="mt-1 block w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700" required>
                <option value="">Wybierz kierowcę...</option>
                {state.drivers.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input name="routeFrom" placeholder="Trasa: Skąd" className="p-2 border rounded bg-white dark:bg-slate-700 dark:border-slate-600" required />
              <input name="routeTo" placeholder="Trasa: Dokąd" className="p-2 border rounded bg-white dark:bg-slate-700 dark:border-slate-600" required />
            </div>
            <div>
              <label htmlFor="zlecaWyjazd" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Zleca wyjazd (podpis)</label>
              <input id="zlecaWyjazd" name="zlecaWyjazd" className="mt-1 block w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700" required />
            </div>
            <p className="text-xs text-orange-600 flex items-center"><KeyIcon className="w-4 h-4 mr-2"/>Pamiętaj, aby najpierw wypożyczyć kluczyk w module "Klucze".</p>
            <div className="text-right pt-4">
              <PrimaryButton onClick={() => {}}>Rozpocznij</PrimaryButton>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Trips;
