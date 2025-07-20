import React, { useEffect, useState, useContext } from 'react';
import { User as UserIcon, LogOut, Settings } from 'lucide-react';
import { DatabaseService } from '../../utils/database';
import { CurrencyContext } from '../../context/CurrencyContext';

interface NavbarProps {
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onLogout }) => {
  const { activeCurrency, setActiveCurrency } = useContext(CurrencyContext);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    DatabaseService.getCurrentUser().then(user => {
      if (isMounted) {
        setCurrentUser(user);
        setLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, []);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">BudgetTracker</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-blue-100">
                <UserIcon className="w-5 h-5 text-blue-500" />
              </span>
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                {loading
                  ? 'Loading...'
                  : currentUser
                    ? `Welcome, ${currentUser.username}`
                    : 'Not logged in'}
              </span>
            </div>
            <select
              className="px-2 py-1 border rounded text-sm"
              value={activeCurrency}
              onChange={e => setActiveCurrency(e.target.value as any)}
            >
              <option value="KES">Kenya Shillings (KES)</option>
              <option value="USD">US Dollar ($)</option>
              <option value="GBP">British Pound (GBP)</option>
              <option value="EUR">Euro (EUR)</option>
            </select>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={onLogout}
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                disabled={loading || !currentUser}
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};