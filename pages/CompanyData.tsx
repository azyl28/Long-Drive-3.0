
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { PageHeader, PrimaryButton } from '../components/common';
import type { CompanyData } from '../types';

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
    <input {...props} className="mt-1 block w-full p-2 border border-slate-300 rounded-md dark:bg-slate-800 dark:border-slate-600" />
);

const Label: React.FC<{ htmlFor: string, children: React.ReactNode }> = ({ htmlFor, children }) => (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-700 dark:text-slate-300">{children}</label>
);

const CompanyDataPage: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [companyData, setCompanyData] = useState<CompanyData>(state.companyData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompanyData({ ...companyData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch({ type: 'UPDATE_COMPANY_DATA', payload: companyData });
    alert('Dane firmy zostały zaktualizowane.');
  };

  return (
    <div className="p-8">
      <PageHeader title="Dane Firmy" />
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-lg max-w-2xl">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Nazwa firmy</Label>
            <Input type="text" name="name" id="name" value={companyData.name} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="address">Adres</Label>
            <Input type="text" name="address" id="address" value={companyData.address} onChange={handleChange} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="zipCode">Kod pocztowy</Label>
              <Input type="text" name="zipCode" id="zipCode" value={companyData.zipCode} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="city">Miasto</Label>
              <Input type="text" name="city" id="city" value={companyData.city} onChange={handleChange} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nip">NIP</Label>
              <Input type="text" name="nip" id="nip" value={companyData.nip} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="regon">REGON</Label>
              <Input type="text" name="regon" id="regon" value={companyData.regon} onChange={handleChange} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Telefon</Label>
              <Input type="text" name="phone" id="phone" value={companyData.phone} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input type="email" name="email" id="email" value={companyData.email} onChange={handleChange} />
            </div>
          </div>
        </div>
        <div className="mt-6 text-right">
          <PrimaryButton onClick={() => {}}>Zapisz zmiany</PrimaryButton>
        </div>
      </form>
    </div>
  );
};

export default CompanyDataPage;
