import React, { useEffect, useState } from 'react';
import { User as UserIcon, LogOut, Settings } from 'lucide-react';
import { DatabaseService } from '../../utils/database';

interface NavbarProps {
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onLogout }) => {
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
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-gray-900">BudgetTracker</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <UserIcon className="w-5 h-5 text-gray-500" />
              <span className="text-sm text-gray-700">
                {loading
                  ? 'Loading...'
                  : currentUser
                    ? `Welcome, ${currentUser.username}`
                    : 'Not logged in'}
              </span>
            </div>
            
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