import React, { useContext } from 'react';
import { CurrencyContext } from '../../context/CurrencyContext';

interface SettingsPageProps {
  onLogout: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ onLogout }) => {
  const { activeCurrency, setActiveCurrency } = useContext(CurrencyContext);

  return (
    <div className="max-w-xl mx-auto mt-12 p-6 bg-white rounded shadow border flex flex-col">
      <h2 className="text-2xl font-bold mb-6">Settings</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Default Currency</label>
        <select
          className="px-3 py-2 border rounded w-full text-base"
          value={activeCurrency}
          onChange={e => setActiveCurrency(e.target.value as any)}
        >
          <option value="KES">Kenya Shillings (KES)</option>
          <option value="USD">US Dollar ($)</option>
          <option value="GBP">British Pound (GBP)</option>
          <option value="EUR">Euro (EUR)</option>
        </select>
      </div>
      <button
        className="mt-8 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-semibold text-base"
        onClick={onLogout}
      >
        Log Out
      </button>
    </div>
  );
};

export default SettingsPage; 