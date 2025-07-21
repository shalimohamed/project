import React, { useState, useEffect } from 'react';
import { UserProfileForm } from './UserProfileForm';
import { DatabaseService } from '../../utils/database';

export interface UserProfileData {
  prefix: string;
  suffix: string;
  firstName: string;
  middleName: string;
  lastName: string;
  dob: string;
  gender: string;
  occupation: string;
  employmentType: string;
  industry: string;
  email: string;
  phone: string;
  country: string;
  city: string;
}

function calculateAge(dob: string) {
  if (!dob) return '';
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

function mapProfileFromBackend(data: any): UserProfileData {
  return {
    prefix: data?.prefix || '',
    suffix: data?.suffix || '',
    firstName: data?.first_name || '',
    middleName: data?.middle_name || '',
    lastName: data?.last_name || '',
    dob: data?.dob || '',
    gender: data?.gender || '',
    occupation: data?.occupation || '',
    employmentType: data?.employment_type || '',
    industry: data?.industry || '',
    email: data?.email || '',
    phone: data?.phone || '',
    country: data?.country || '',
    city: data?.city || '',
  };
}

function mapProfileToBackend(data: UserProfileData): any {
  return {
    prefix: data.prefix,
    suffix: data.suffix,
    first_name: data.firstName,
    middle_name: data.middleName,
    last_name: data.lastName,
    dob: data.dob,
    gender: data.gender,
    occupation: data.occupation,
    employment_type: data.employmentType,
    industry: data.industry,
    email: data.email,
    phone: data.phone,
    country: data.country,
    city: data.city,
  };
}

export const UserProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const backendProfile = await DatabaseService.getUserProfile();
        if (backendProfile) {
          setProfile(mapProfileFromBackend(backendProfile));
        } else {
          setProfile(null);
        }
      } catch (err) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async (data: UserProfileData) => {
    setError(null);
    setLoading(true);
    try {
      await DatabaseService.upsertUserProfile(mapProfileToBackend(data));
      setProfile(data);
      setEditing(false);
    } catch (err) {
      setError('Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="max-w-2xl mx-auto py-8 px-4">Loading profile...</div>;
  }

  if (editing || !profile) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-4">{profile ? 'Edit Profile' : 'Add Your Details'}</h1>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <UserProfileForm
          onClose={() => setEditing(false)}
          onSave={handleSave}
          initialData={profile || undefined}
        />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-4">User Profile</h1>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <div className="bg-white rounded shadow p-6 space-y-4">
        <div className="flex justify-end">
          <button className="text-blue-600 hover:underline" onClick={() => setEditing(true)}>Edit</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><strong>Prefix:</strong> {profile.prefix}</div>
          <div><strong>Suffix:</strong> {profile.suffix}</div>
          <div><strong>First Name:</strong> {profile.firstName}</div>
          <div><strong>Middle Name:</strong> {profile.middleName}</div>
          <div><strong>Last Name:</strong> {profile.lastName}</div>
          <div><strong>Date of Birth:</strong> {profile.dob}</div>
          <div><strong>Age:</strong> {calculateAge(profile.dob)}</div>
          <div><strong>Gender:</strong> {profile.gender}</div>
          <div><strong>Occupation:</strong> {profile.occupation}</div>
          <div><strong>Employment Type:</strong> {profile.employmentType}</div>
          <div><strong>Industry:</strong> {profile.industry}</div>
          <div><strong>Email:</strong> {profile.email}</div>
          <div><strong>Phone:</strong> {profile.phone}</div>
          <div><strong>Country:</strong> {profile.country}</div>
          <div><strong>City/State/Region:</strong> {profile.city}</div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage; 