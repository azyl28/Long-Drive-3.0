
import React, { useState } from 'react';
import {
  DashboardIcon,
  VehicleIcon,
  DriverIcon,
  KeyIcon,
  GasPumpIcon,
  TripIcon,
  ReportIcon,
  BuildingIcon,
  SettingsIcon,
  CalculatorIcon
} from './components/icons';
import Dashboard from './pages/Dashboard';
import Vehicles from './pages/Vehicles';
import Drivers from './pages/Drivers';
import Keys from './pages/Keys';
import Refuelings from './pages/Refuelings';
import Trips from './pages/Trips';
import TripDetail from './pages/TripDetail';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import CompanyDataPage from './pages/CompanyData';
import Calculators from './pages/Calculators';
import type { Page } from './types';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive, onClick }) => (
  <li
    onClick={onClick}
    className={`flex items-center p-3 my-1 rounded-lg cursor-pointer transition-colors ${
      isActive
        ? 'bg-blue-600 text-white shadow-md'
        : 'text-slate-600 hover:bg-blue-100 hover:text-blue-800'
    }`}
    role="button"
    aria-current={isActive ? 'page' : undefined}
  >
    {icon}
    <span className="ml-4 font-medium">{label}</span>
  </li>
);

interface LayoutProps {
  page: Page;
  setPage: React.Dispatch<React.SetStateAction<Page>>;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ page, setPage, children }) => {
  const navItems = [
    { name: 'dashboard', label: 'Pulpit', icon: <DashboardIcon className="w-6 h-6" /> },
    { name: 'vehicles', label: 'Pojazdy', icon: <VehicleIcon className="w-6 h-6" /> },
    { name: 'drivers', label: 'Kierowcy', icon: <DriverIcon className="w-6 h-6" /> },
    { name: 'keys', label: 'Klucze', icon: <KeyIcon className="w-6 h-6" /> },
    { name: 'refuelings', label: 'Tankowanie', icon: <GasPumpIcon className="w-6 h-6" /> },
    { name: 'trips', label: 'Przejazdy', icon: <TripIcon className="w-6 h-6" /> },
    { name: 'reports', label: 'Raporty', icon: <ReportIcon className="w-6 h-6" /> },
    { name: 'calculators', label: 'Kalkulatory', icon: <CalculatorIcon className="w-6 h-6" /> },
  ];
  const bottomNavItems = [
    { name: 'company-data', label: 'Dane Firmy', icon: <BuildingIcon className="w-6 h-6" /> },
    { name: 'settings', label: 'Ustawienia', icon: <SettingsIcon className="w-6 h-6" /> },
  ];

  return (
    <div className="flex h-screen bg-slate-100">
      <aside className="w-64 bg-white shadow-xl flex flex-col">
        <div className="p-6 border-b border-slate-200">
          <h1 className="text-2xl font-bold text-blue-700 text-center">Long Drive</h1>
        </div>
        <nav className="flex-grow p-4">
          <ul>
            {navItems.map(item => (
              <NavItem
                key={item.name}
                label={item.label}
                icon={item.icon}
                isActive={page.name === item.name}
                onClick={() => setPage({ name: item.name })}
              />
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-slate-200">
          <ul>
            {bottomNavItems.map(item => (
              <NavItem
                key={item.name}
                label={item.label}
                icon={item.icon}
                isActive={page.name === item.name}
                onClick={() => setPage({ name: item.name })}
              />
            ))}
          </ul>
        </div>
        <div className="p-4 text-center text-xs text-slate-400">
          &copy; {new Date().getFullYear()} Long Drive App
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
};

const App: React.FC = () => {
  const [page, setPage] = useState<Page>({ name: 'dashboard' });

  const renderPage = () => {
    switch (page.name) {
      case 'dashboard': return <Dashboard setPage={setPage} />;
      case 'vehicles': return <Vehicles />;
      case 'drivers': return <Drivers />;
      case 'keys': return <Keys />;
      case 'refuelings': return <Refuelings />;
      case 'trips': return <Trips setPage={setPage} />;
      case 'trip-detail': return <TripDetail tripId={page.params?.id} setPage={setPage} />;
      case 'reports': return <Reports />;
      case 'calculators': return <Calculators />;
      case 'settings': return <Settings />;
      case 'company-data': return <CompanyDataPage />;
      default: return <Dashboard setPage={setPage} />;
    }
  };

  return (
    <Layout page={page} setPage={setPage}>
      {renderPage()}
    </Layout>
  );
};

export default App;
