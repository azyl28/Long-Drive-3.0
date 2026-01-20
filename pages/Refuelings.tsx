
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Modal, PageHeader, PrimaryButton } from '../components/common';
import { PlusIcon } from '../components/icons';

const Refuelings: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [showModal, setShowModal] = useState(false);

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const refuelingData = {
      vehicleId: formData.get('vehicleId') as string,
      driverId: formData.get('driverId') as string,
      liters: Number(formData.get('liters')),
      cost: Number(formData.get('cost')),
      mileageAtRefueling: Number(formData.get('mileageAtRefueling')),
    };
    dispatch({ type: 'ADD_REFUELING', payload: refuelingData });
    setShowModal(false);
  };

  const getVehicle = (id: string) => state.vehicles.find(v => v.id === id);
  const getDriver = (id: string) => state.drivers.find(d => d.id === id);

  return (
    <div className="p-8">
      <PageHeader title="Tankowanie">
        <PrimaryButton onClick={() => setShowModal(true)}>
          <PlusIcon className="w-5 h-5 mr-2" /> Dodaj wpis
        </PrimaryButton>
      </PageHeader>
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg overflow-hidden">
        <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
          <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-800">
            <tr>
              <th scope="col" className="px-6 py-3">Data</th>
              <th scope="col" className="px-6 py-3">Pojazd</th>
              <th scope="col" className="px-6 py-3">Kierowca</th>
              <th scope="col" className="px-6 py-3">Ilość (L)</th>
              <th scope="col" className="px-6 py-3">Koszt (PLN)</th>
              <th scope="col" className="px-6 py-3">Przebieg</th>
            </tr>
          </thead>
          <tbody>
            {[...state.refuelings].reverse().map(r => {
              const vehicle = getVehicle(r.vehicleId);
              const driver = getDriver(r.driverId);
              return (
                <tr key={r.id} className="bg-white dark:bg-slate-900 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">
                  <td className="px-6 py-4">{new Date(r.date).toLocaleString('pl-PL')}</td>
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{vehicle?.make} {vehicle?.model}</td>
                  <td className="px-6 py-4">{driver?.name}</td>
                  <td className="px-6 py-4">{r.liters.toFixed(2)}</td>
                  <td className="px-6 py-4">{r.cost.toFixed(2)}</td>
                  <td className="px-6 py-4">{r.mileageAtRefueling.toLocaleString('pl-PL')} km</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {showModal && (
        <Modal title="Dodaj wpis tankowania" onClose={() => setShowModal(false)}>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label htmlFor="vehicleId" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Pojazd</label>
              <select id="vehicleId" name="vehicleId" className="mt-1 block w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700" required>
                <option value="">Wybierz pojazd...</option>
                {state.vehicles.map(v => (
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
              <input type="number" step="0.01" name="liters" placeholder="Ilość litrów" className="p-2 border rounded bg-white dark:bg-slate-700 dark:border-slate-600" required />
              <input type="number" step="0.01" name="cost" placeholder="Koszt (PLN)" className="p-2 border rounded bg-white dark:bg-slate-700 dark:border-slate-600" required />
            </div>
            <input type="number" name="mileageAtRefueling" placeholder="Przebieg w momencie tankowania" className="p-2 border rounded w-full bg-white dark:bg-slate-700 dark:border-slate-600" required />
            <div className="text-right pt-4">
              <PrimaryButton onClick={() => {}}>Zapisz</PrimaryButton>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Refuelings;
