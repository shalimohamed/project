import React, { useEffect, useState, useContext } from 'react';
import { User as UserIcon, LogOut, Settings } from 'lucide-react';
import { DatabaseService } from '../../utils/database';
import { Link } from 'react-router-dom';

interface NavbarProps {
  onLogout: () => void;
  onSettings?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onLogout, onSettings }) => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchProfile = () => {
      DatabaseService.getCurrentUser().then(user => {
        if (isMounted) {
          setCurrentUser(user);
          setLoading(false);
          if (user) {
            DatabaseService.getUserProfile().then(profileData => {
              if (isMounted) setProfile(profileData);
            });
          }
        }
      });
    };

    fetchProfile();

    const handleProfileUpdated = () => {
      fetchProfile();
    };

    window.addEventListener('profileUpdated', handleProfileUpdated);

    return () => {
      isMounted = false;
      window.removeEventListener('profileUpdated', handleProfileUpdated);
    };
  }, []);

  let welcomeMsg = 'Not logged in';
  if (loading) {
    welcomeMsg = 'Loading...';
  } else if (currentUser) {
    if (profile && (profile.prefix || profile.last_name)) {
      welcomeMsg = `Welcome, ${profile.prefix ? profile.prefix + ' ' : ''}${profile.last_name || ''}`.trim();
    } else {
      welcomeMsg = `Welcome, ${currentUser.username}`;
    }
  }

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
      <div className="flex items-center">
        <h1 className="text-xl font-bold text-gray-900">BudgetTracker</h1>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Link to="/profile" className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-blue-100 focus:outline-none">
            <UserIcon className="w-5 h-5 text-blue-500" />
          </Link>
          <span className="text-xs font-medium px-3 py-1 rounded-full bg-gray-100 text-gray-700">
            {welcomeMsg}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors" onClick={onSettings}>
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  );
};