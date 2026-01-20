
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Modal, ConfirmModal, PageHeader, PrimaryButton } from '../components/common';
import { PlusIcon, EditIcon, DeleteIcon } from '../components/icons';
import type { Vehicle } from '../types';

const Vehicles: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [showModal, setShowModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const vehicleData: Vehicle = {
      id: editingVehicle?.id || `v-${Date.now()}`,
      make: formData.get('make') as string,
      model: formData.get('model') as string,
      year: Number(formData.get('year')),
      registrationNumber: formData.get('registrationNumber') as string,
      mileage: Number(formData.get('mileage')),
      fuelLevel: Number(formData.get('fuelLevel')),
      tankSize: Number(formData.get('tankSize')),
      fuelConsumption: Number(formData.get('fuelConsumption')),
      status: editingVehicle?.status || 'available',
      vehicleType: formData.get('vehicleType') as string,
      fuelType: formData.get('fuelType') as string,
      engineCapacity: Number(formData.get('engineCapacity')),
      bodyType: formData.get('bodyType') as string,
    };

    if (editingVehicle) {
      dispatch({ type: 'UPDATE_VEHICLE', payload: vehicleData });
    } else {
      dispatch({ type: 'ADD_VEHICLE', payload: vehicleData });
    }
    setShowModal(false);
    setEditingVehicle(null);
  };

  const handleDeleteRequest = (vehicleId: string) => {
    setItemToDelete(vehicleId);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      dispatch({ type: 'DELETE_VEHICLE', payload: { vehicleId: itemToDelete } });
      setItemToDelete(null);
    }
  };

  return (
    <div className="p-8">
      <ConfirmModal
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Potwierdź usunięcie"
        message="Czy na pewno chcesz usunąć ten pojazd? Spowoduje to usunięcie wszystkich powiązanych z nim przejazdów i wpisów o kluczach."
      />
      <PageHeader title="Pojazdy">
        <PrimaryButton onClick={() => { setEditingVehicle(null); setShowModal(true); }}>
          <PlusIcon className="w-5 h-5 mr-2" /> Dodaj pojazd
        </PrimaryButton>
      </PageHeader>
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg overflow-hidden">
        <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
          <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-800">
            <tr>
              <th scope="col" className="px-6 py-3">Pojazd</th>
              <th scope="col" className="px-6 py-3">Nr rej.</th>
              <th scope="col" className="px-6 py-3">Typ</th>
              <th scope="col" className="px-6 py-3">Przebieg</th>
              <th scope="col" className="px-6 py-3">Paliwo</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3"><span className="sr-only">Akcje</span></th>
            </tr>
          </thead>
          <tbody>
            {state.vehicles.map(v => (
              <tr key={v.id} className="bg-white dark:bg-slate-900 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">
                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white whitespace-nowrap">{v.make} {v.model} ({v.year})</td>
                <td className="px-6 py-4">{v.registrationNumber}</td>
                <td className="px-6 py-4">{v.vehicleType}</td>
                <td className="px-6 py-4">{v.mileage.toLocaleString('pl-PL')} km</td>
                <td className="px-6 py-4">{v.fuelLevel.toFixed(2)} L / {v.tankSize} L</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${v.status === 'available' ? 'bg-[var(--theme-100)] text-[var(--theme-800)]' : 'bg-yellow-100 text-yellow-800'}`}>
                    {v.status === 'available' ? 'Dostępny' : 'W użyciu'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button onClick={() => { setEditingVehicle(v); setShowModal(true); }} className="text-[var(--theme-600)] hover:text-[var(--theme-800)]"><EditIcon className="w-5 h-5"/></button>
                  <button onClick={() => handleDeleteRequest(v.id)} className="text-red-600 hover:text-red-800"><DeleteIcon className="w-5 h-5"/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <Modal title={editingVehicle ? 'Edytuj pojazd' : 'Dodaj pojazd'} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSave} className="grid grid-cols-2 gap-4">
            <input defaultValue={editingVehicle?.make} name="make" placeholder="Marka" className="p-2 border rounded col-span-1 bg-white dark:bg-slate-700 dark:border-slate-600" required />
            <input defaultValue={editingVehicle?.model} name="model" placeholder="Model" className="p-2 border rounded col-span-1 bg-white dark:bg-slate-700 dark:border-slate-600" required />
            <input defaultValue={editingVehicle?.year} type="number" name="year" placeholder="Rok" className="p-2 border rounded col-span-1 bg-white dark:bg-slate-700 dark:border-slate-600" required />
            <input defaultValue={editingVehicle?.registrationNumber} name="registrationNumber" placeholder="Nr rejestracyjny" className="p-2 border rounded col-span-1 bg-white dark:bg-slate-700 dark:border-slate-600" required />
            <select name="vehicleType" defaultValue={editingVehicle?.vehicleType || 'Osobowe'} className="p-2 border rounded col-span-1 bg-white dark:bg-slate-700 dark:border-slate-600" required>
              <option value="Osobowe">Osobowe</option>
              <option value="Ciężarowe">Ciężarowe</option>
              <option value="BUS">BUS</option>
            </select>
            <select name="fuelType" defaultValue={editingVehicle?.fuelType || 'Benzyna'} className="p-2 border rounded col-span-1 bg-white dark:bg-slate-700 dark:border-slate-600" required>
              <option value="Benzyna">Benzyna</option>
              <option value="Diesel">Diesel</option>
              <option value="LPG">LPG</option>
            </select>
            <input defaultValue={editingVehicle?.engineCapacity} type="number" name="engineCapacity" placeholder="Poj. silnika (cm³)" className="p-2 border rounded col-span-1 bg-white dark:bg-slate-700 dark:border-slate-600" required />
            <input defaultValue={editingVehicle?.bodyType} name="bodyType" placeholder="Rodzaj nadwozia (np. Sedan)" className="p-2 border rounded col-span-1 bg-white dark:bg-slate-700 dark:border-slate-600" />
            <input defaultValue={editingVehicle?.mileage} type="number" name="mileage" placeholder="Przebieg (km)" className="p-2 border rounded col-span-1 bg-white dark:bg-slate-700 dark:border-slate-600" required />
            <input defaultValue={editingVehicle?.fuelConsumption} type="number" step="0.1" name="fuelConsumption" placeholder="Spalanie (L/100km)" className="p-2 border rounded col-span-1 bg-white dark:bg-slate-700 dark:border-slate-600" required />
            <input defaultValue={editingVehicle?.fuelLevel} type="number" step="0.01" name="fuelLevel" placeholder="Poziom paliwa (L)" className="p-2 border rounded col-span-1 bg-white dark:bg-slate-700 dark:border-slate-600" required />
            <input defaultValue={editingVehicle?.tankSize} type="number" name="tankSize" placeholder="Pojemność baku (L)" className="p-2 border rounded col-span-1 bg-white dark:bg-slate-700 dark:border-slate-600" required />
            <div className="col-span-2 text-right">
              <PrimaryButton onClick={() => {}}>Zapisz</PrimaryButton>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Vehicles;
