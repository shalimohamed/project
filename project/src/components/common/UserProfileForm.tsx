import React, { useState, useEffect } from 'react';
import { UserProfileData } from './UserProfilePage';

interface UserProfileFormProps {
  onSave: (data: UserProfileData) => void;
  onClose?: () => void;
  initialData?: UserProfileData;
}

const prefixOptions = ['Mr.', 'Ms.', 'Dr.', 'Mrs.', 'Miss', 'Mx.'];
const suffixOptions = ['Jr.', 'Sr.', 'II', 'III', 'IV'];
const genderOptions = ['Male', 'Female', 'Other', 'Prefer not to say'];
const employmentTypes = ['Employed', 'Self-employed', 'Unemployed', 'Student', 'Retired'];

export const UserProfileForm: React.FC<UserProfileFormProps> = ({ onSave, onClose, initialData }) => {
  const [form, setForm] = useState<UserProfileData>({
    prefix: '',
    suffix: '',
    firstName: '',
    middleName: '',
    lastName: '',
    dob: '',
    gender: '',
    occupation: '',
    employmentType: '',
    industry: '',
    email: '',
    phone: '',
    country: '',
    city: '',
  });

  useEffect(() => {
    if (initialData) setForm(initialData);
  }, [initialData]);

  const calculateAge = (dob: string) => {
    if (!dob) return '';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 max-w-2xl">
      <div className="flex space-x-2">
        <div className="flex-1">
          <label className="block text-sm font-medium">Prefix</label>
          <select name="prefix" value={form.prefix} onChange={handleChange} className="w-full border rounded px-2 py-1">
            <option value="">Select</option>
            {prefixOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium">Suffix</label>
          <select name="suffix" value={form.suffix} onChange={handleChange} className="w-full border rounded px-2 py-1">
            <option value="">Select</option>
            {suffixOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
      </div>
      <div className="flex space-x-2">
        <div className="flex-1">
          <label className="block text-sm font-medium">First Name</label>
          <input name="firstName" value={form.firstName} onChange={handleChange} className="w-full border rounded px-2 py-1" required />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium">Middle Name</label>
          <input name="middleName" value={form.middleName} onChange={handleChange} className="w-full border rounded px-2 py-1" />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium">Last Name</label>
          <input name="lastName" value={form.lastName} onChange={handleChange} className="w-full border rounded px-2 py-1" required />
        </div>
      </div>
      <div className="flex space-x-2 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium">Date of Birth</label>
          <input type="date" name="dob" value={form.dob} onChange={handleChange} className="w-full border rounded px-2 py-1" required />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium">Age</label>
          <input value={calculateAge(form.dob)} readOnly className="w-full border rounded px-2 py-1 bg-gray-100" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium">Gender</label>
        <select name="gender" value={form.gender} onChange={handleChange} className="w-full border rounded px-2 py-1">
          <option value="">Select</option>
          {genderOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium">Occupation/Profession</label>
        <input name="occupation" value={form.occupation} onChange={handleChange} className="w-full border rounded px-2 py-1" />
      </div>
      <div className="flex space-x-2">
        <div className="flex-1">
          <label className="block text-sm font-medium">Employment Type</label>
          <select name="employmentType" value={form.employmentType} onChange={handleChange} className="w-full border rounded px-2 py-1">
            <option value="">Select</option>
            {employmentTypes.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium">Industry</label>
          <input name="industry" value={form.industry} onChange={handleChange} className="w-full border rounded px-2 py-1" />
        </div>
      </div>
      <div className="flex space-x-2">
        <div className="flex-1">
          <label className="block text-sm font-medium">Email Address</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full border rounded px-2 py-1" required />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium">Phone Number</label>
          <input name="phone" value={form.phone} onChange={handleChange} className="w-full border rounded px-2 py-1" />
        </div>
      </div>
      <div className="flex space-x-2">
        <div className="flex-1">
          <label className="block text-sm font-medium">Country</label>
          <input name="country" value={form.country} onChange={handleChange} className="w-full border rounded px-2 py-1" />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium">City/State/Region</label>
          <input name="city" value={form.city} onChange={handleChange} className="w-full border rounded px-2 py-1" />
        </div>
      </div>
      <div className="pt-2 flex gap-2 justify-end">
        {onClose && (
          <button type="button" className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300" onClick={onClose}>Cancel</button>
        )}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Save</button>
      </div>
    </form>
  );
};

export default UserProfileForm; 