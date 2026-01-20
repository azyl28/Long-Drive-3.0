
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Modal, ConfirmModal, PageHeader, PrimaryButton } from '../components/common';
import { PlusIcon, EditIcon, DeleteIcon } from '../components/icons';
import type { Driver } from '../types';

const Drivers: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [showModal, setShowModal] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const driverData: Driver = {
      id: editingDriver?.id || `d-${Date.now()}`,
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
    };

    if (editingDriver) {
      dispatch({ type: 'UPDATE_DRIVER', payload: driverData });
    } else {
      dispatch({ type: 'ADD_DRIVER', payload: driverData });
    }
    setShowModal(false);
    setEditingDriver(null);
  };

  const handleDeleteRequest = (driverId: string) => {
    setItemToDelete(driverId);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      dispatch({ type: 'DELETE_DRIVER', payload: { driverId: itemToDelete } });
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
        message="Czy na pewno chcesz usunąć tego kierowcę? Przejazdy wykonane przez tego kierowcę pozostaną w systemie."
      />
      <PageHeader title="Kierowcy">
        <PrimaryButton onClick={() => { setEditingDriver(null); setShowModal(true); }}>
          <PlusIcon className="w-5 h-5 mr-2" /> Dodaj kierowcę
        </PrimaryButton>
      </PageHeader>
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg overflow-hidden">
        <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
          <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-800">
            <tr>
              <th scope="col" className="px-6 py-3">Imię i nazwisko</th>
              <th scope="col" className="px-6 py-3">Telefon</th>
              <th scope="col" className="px-6 py-3">Email</th>
              <th scope="col" className="px-6 py-3"><span className="sr-only">Akcje</span></th>
            </tr>
          </thead>
          <tbody>
            {state.drivers.map(d => (
              <tr key={d.id} className="bg-white dark:bg-slate-900 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">
                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white whitespace-nowrap">{d.name}</td>
                <td className="px-6 py-4">{d.phone}</td>
                <td className="px-6 py-4">{d.email}</td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button onClick={() => { setEditingDriver(d); setShowModal(true); }} className="text-[var(--theme-600)] hover:text-[var(--theme-800)]"><EditIcon className="w-5 h-5"/></button>
                  <button onClick={() => handleDeleteRequest(d.id)} className="text-red-600 hover:text-red-800"><DeleteIcon className="w-5 h-5"/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <Modal title={editingDriver ? 'Edytuj kierowcę' : 'Dodaj kierowcę'} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSave} className="grid grid-cols-2 gap-4">
            <input defaultValue={editingDriver?.name} name="name" placeholder="Imię i nazwisko" className="p-2 border rounded col-span-2 bg-white dark:bg-slate-700 dark:border-slate-600" required />
            <input defaultValue={editingDriver?.phone} name="phone" placeholder="Telefon" className="p-2 border rounded col-span-1 bg-white dark:bg-slate-700 dark:border-slate-600" />
            <input defaultValue={editingDriver?.email} type="email" name="email" placeholder="Email" className="p-2 border rounded col-span-1 bg-white dark:bg-slate-700 dark:border-slate-600" />
            <div className="col-span-2 text-right">
              <PrimaryButton onClick={() => {}}>Zapisz</PrimaryButton>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Drivers;
