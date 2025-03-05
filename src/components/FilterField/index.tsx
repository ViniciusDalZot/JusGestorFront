// components/FilterField.tsx
import React from 'react';

interface FilterFieldProps {
  label: string;
  children: React.ReactNode;
}

export const FilterField: React.FC<FilterFieldProps> = ({ label, children }) => {
  return (
    <div className="flex flex-col gap-1 flex-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {children}
    </div>
  );
};
