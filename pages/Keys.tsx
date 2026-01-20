
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Modal, ConfirmModal, PageHeader, PrimaryButton } from '../components/common';

const Keys: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [showModal, setShowModal] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [itemToReturn, setItemToReturn] = useState<string | null>(null);

  const getKeyStatus = (vehicleId: string) => {
    const log = state.keyLogs.find(k => k.vehicleId === vehicleId && k.status === 'checked_out');
    if (!log) return { status: 'available', text: 'Dostępny', driver: null };
    const driver = state.drivers.find(d => d.id === log.driverId);
    return { status: 'checked_out', text: `Wypożyczony`, driver: driver?.name || 'Nieznany' };
  };

  const handleCheckout = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const driverId = formData.get('driverId') as string;
    const issuedBy = formData.get('issuedBy') as string;
    if (selectedVehicleId && driverId) {
      dispatch({ type: 'CHECKOUT_KEY', payload: { vehicleId: selectedVehicleId, driverId, issuedBy } });
    }
    setShowModal(false);
    setSelectedVehicleId(null);
  };

  const handleReturnRequest = (vehicleId: string) => {
    setItemToReturn(vehicleId);
  };

  const handleConfirmReturn = () => {
    if (itemToReturn) {
      dispatch({ type: 'RETURN_KEY', payload: { vehicleId: itemToReturn } });
      setItemToReturn(null);
    }
  };

  return (
    <div className="p-8">
      <ConfirmModal
        isOpen={!!itemToReturn}
        onClose={() => setItemToReturn(null)}
        onConfirm={handleConfirmReturn}
        title="Potwierdź zwrot"
        message="Czy na pewno chcesz zwrócić ten kluczyk?"
      />
      <PageHeader title="Zarządzanie kluczami" />
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg overflow-hidden">
        <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
          <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-800">
            <tr>
              <th scope="col" className="px-6 py-3">Pojazd</th>
              <th scope="col" className="px-6 py-3">Status klucza</th>
              <th scope="col" className="px-6 py-3">Posiadacz</th>
              <th scope="col" className="px-6 py-3 text-right">Akcja</th>
            </tr>
          </thead>
          <tbody>
            {state.vehicles.map(v => {
              const keyInfo = getKeyStatus(v.id);
              return (
                <tr key={v.id} className="bg-white dark:bg-slate-900 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{v.make} {v.model} ({v.registrationNumber})</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${keyInfo.status === 'available' ? 'bg-[var(--theme-100)] text-[var(--theme-800)]' : 'bg-orange-100 text-orange-800'}`}>
                      {keyInfo.text}
                    </span>
                  </td>
                  <td className="px-6 py-4">{keyInfo.driver || '-'}</td>
                  <td className="px-6 py-4 text-right">
                    {keyInfo.status === 'available' ? (
                      <PrimaryButton onClick={() => { setSelectedVehicleId(v.id); setShowModal(true); }}>Wypożycz</PrimaryButton>
                    ) : (
                      <button onClick={() => handleReturnRequest(v.id)} className="px-4 py-2 bg-cyan-600 text-white font-semibold text-sm rounded-md shadow-sm hover:bg-cyan-700">Zwróć</button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {showModal && selectedVehicleId && (
        <Modal title="Wypożycz kluczyk" onClose={() => setShowModal(false)}>
          <form onSubmit={handleCheckout} className="space-y-4">
            <div>
              <label htmlFor="driverId" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Wybierz kierowcę</label>
              <select id="driverId" name="driverId" className="mt-1 block w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700" required>
                <option value="">Wybierz...</option>
                {state.drivers.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="issuedBy" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Wydający klucze (podpis)</label>
              <input id="issuedBy" name="issuedBy" className="mt-1 block w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700" required />
            </div>
            <div className="text-right pt-4">
              <PrimaryButton onClick={() => {}}>Potwierdź</PrimaryButton>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Keys;
