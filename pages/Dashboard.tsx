
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { PageHeader } from '../components/common';
import type { Page } from '../types';

interface DashboardProps {
  setPage: React.Dispatch<React.SetStateAction<Page>>;
}

const StatCard: React.FC<{ title: string; value: string | number; onClick?: () => void }> = ({ title, value, onClick }) => (
  <div
    onClick={onClick}
    className={`bg-white dark:bg-slate-900 p-6 rounded-lg shadow-lg transition-all duration-300 ${
      onClick ? 'cursor-pointer hover:shadow-xl hover:scale-105 hover:bg-slate-50 dark:hover:bg-slate-800' : ''
    }`}
  >
    <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">{title}</h3>
    <p className="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-2">{value}</p>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ setPage }) => {
  const { state } = useAppContext();
  const activeTrips = state.trips.filter(t => t.status === 'active');
  const keysCheckedOut = state.keyLogs.filter(k => k.status === 'checked_out');

  return (
    <div className="p-8">
      <PageHeader title="Pulpit" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Liczba pojazdów" value={state.vehicles.length} onClick={() => setPage({ name: 'vehicles' })} />
        <StatCard title="Liczba kierowców" value={state.drivers.length} onClick={() => setPage({ name: 'drivers' })} />
        <StatCard title="Aktywne przejazdy" value={activeTrips.length} onClick={() => setPage({ name: 'trips' })} />
        <StatCard title="Wypożyczone klucze" value={keysCheckedOut.length} onClick={() => setPage({ name: 'keys' })} />
      </div>
    </div>
  );
};

export default Dashboard;
