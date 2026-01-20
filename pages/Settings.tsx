
import React, { useRef, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { PageHeader, ConfirmModal, PrimaryButton } from '../components/common';
import { DownloadIcon, UploadIcon, ResetIcon, GasPumpIcon } from '../components/icons';
import type { AppState, FuelPrices } from '../types';

const Settings: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [fuelPrices, setFuelPrices] = useState<FuelPrices>(state.fuelPrices);

  const handleBackup = () => {
    try {
      const stateString = JSON.stringify(state, null, 2);
      const blob = new Blob([stateString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const date = new Date().toISOString().slice(0, 10);
      a.download = `longdrive_backup_${date}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      alert('Kopia zapasowa została pomyślnie utworzona!');
    } catch (error) {
      console.error("Błąd podczas tworzenia kopii zapasowej:", error);
      alert('Wystąpił błąd podczas tworzenia kopii zapasowej.');
    }
  };

  const handleRestore = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!window.confirm('Czy na pewno chcesz przywrócić dane z kopii zapasowej? Wszystkie obecne dane zostaną nadpisane!')) {
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') throw new Error("Nie udało się odczytać pliku.");
        const restoredState = JSON.parse(text) as AppState;
        if (restoredState.vehicles && restoredState.drivers && restoredState.trips) {
          dispatch({ type: 'RESTORE_STATE', payload: restoredState });
          alert('Dane zostały pomyślnie przywrócone!');
        } else {
          throw new Error("Plik kopii zapasowej ma nieprawidłową strukturę.");
        }
      } catch (error) {
        alert(`Wystąpił błąd podczas przywracania danych: ${(error as Error).message}`);
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };
    reader.readAsText(file);
  };

  const handleFuelPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFuelPrices({ ...fuelPrices, [e.target.name]: parseFloat(e.target.value) || 0 });
  };

  const handleFuelPriceSave = () => {
    dispatch({ type: 'UPDATE_FUEL_PRICES', payload: fuelPrices });
    alert('Ceny paliw zostały zaktualizowane.');
  };

  const handleReset = () => {
    dispatch({ type: 'RESET_STATE' });
    setIsResetModalOpen(false);
    alert('Aplikacja została zresetowana do ustawień początkowych.');
  };

  return (
    <div className="p-8">
      <PageHeader title="Ustawienia" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4 flex items-center"><GasPumpIcon className="w-6 h-6 mr-3 text-blue-600"/>Aktualne Ceny Paliw</h3>
            <div className="space-y-4">
                <div>
                    <label htmlFor="pb95" className="block text-sm font-medium text-slate-700">Benzyna (PB95)</label>
                    <input type="number" step="0.01" name="pb95" id="pb95" value={fuelPrices.pb95} onChange={handleFuelPriceChange} className="mt-1 block w-full p-2 border border-slate-300 rounded-md" />
                </div>
                <div>
                    <label htmlFor="on" className="block text-sm font-medium text-slate-700">Olej napędowy (ON)</label>
                    <input type="number" step="0.01" name="on" id="on" value={fuelPrices.on} onChange={handleFuelPriceChange} className="mt-1 block w-full p-2 border border-slate-300 rounded-md" />
                </div>
                <div>
                    <label htmlFor="lpg" className="block text-sm font-medium text-slate-700">Gaz (LPG)</label>
                    <input type="number" step="0.01" name="lpg" id="lpg" value={fuelPrices.lpg} onChange={handleFuelPriceChange} className="mt-1 block w-full p-2 border border-slate-300 rounded-md" />
                </div>
                <div className="text-right">
                    <PrimaryButton onClick={handleFuelPriceSave}>Zapisz Ceny</PrimaryButton>
                </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Kopia Zapasowa Danych</h3>
            <p className="text-sm text-slate-600 mb-6">Zapisz lub wczytaj wszystkie dane aplikacji do pliku JSON.</p>
            <div className="flex flex-wrap gap-4">
              <button onClick={handleBackup} className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-semibold text-sm rounded-md shadow-sm hover:bg-blue-700">
                <DownloadIcon className="w-5 h-5 mr-2" /> Utwórz kopię
              </button>
              <button onClick={() => fileInputRef.current?.click()} className="inline-flex items-center px-4 py-2 bg-slate-500 text-white font-semibold text-sm rounded-md shadow-sm hover:bg-slate-600">
                <UploadIcon className="w-5 h-5 mr-2" /> Przywróć z pliku
              </button>
              <input type="file" ref={fileInputRef} className="hidden" accept="application/json" onChange={handleRestore} />
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-red-50 p-6 rounded-lg shadow-lg border border-red-200">
            <h3 className="text-xl font-semibold mb-4 text-red-800 flex items-center"><ResetIcon className="w-6 h-6 mr-3"/>Strefa Niebezpieczna</h3>
            <p className="text-sm text-red-700 mb-6">Tej operacji nie można cofnąć. Spowoduje to usunięcie wszystkich pojazdów, kierowców i przejazdów, przywracając aplikację do stanu początkowego.</p>
            <button onClick={() => setIsResetModalOpen(true)} className="w-full inline-flex justify-center items-center px-4 py-2 bg-red-600 text-white font-semibold text-sm rounded-md shadow-sm hover:bg-red-700">
              Resetuj Aplikację
            </button>
          </div>
        </div>
      </div>
      <ConfirmModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleReset}
        title="Potwierdź Reset Aplikacji"
        message="Czy na pewno chcesz usunąć wszystkie dane i zresetować aplikację? Ta akcja jest nieodwracalna."
      />
    </div>
  );
};

export default Settings;
