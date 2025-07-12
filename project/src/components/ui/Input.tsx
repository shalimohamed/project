import React from 'react';

interface InputProps {
  type?: 'text' | 'number' | 'email' | 'password' | 'date';
  label?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
  size?: 'default' | 'compact'; // new prop for compact variant
}

export const Input: React.FC<InputProps> = ({
  type = 'text',
  label,
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  error,
  className = '',
  size = 'default',
}) => {
  const inputClasses = `
    w-full
    ${size === 'compact' ? 'px-2 py-1 text-sm rounded-lg' : 'px-4 py-2 text-base rounded-xl'}
    border border-gray-200
    bg-white
    shadow-sm
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400
    placeholder-gray-400
    disabled:bg-gray-100 disabled:text-gray-400
    ${type === 'number' ? 'font-semibold tracking-wide' : ''}
    ${error ? 'border-red-400 focus:ring-red-400 focus:border-red-400' : ''}
    ${className}
  `.trim();

  return (
    <div className={`w-full ${size === 'compact' ? '' : 'mb-2'}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={inputClasses}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};