import React, { useState, useEffect } from 'react';
import { X } from '@/icons/lucideMuiAdapter';

interface Organization {
  id: number;
  name: string;
}

interface BranchFormProps {
  isOpen: boolean;
  isLoading: boolean;
  organizations: Organization[];
  initialData?: {
    id?: number;
    organization_id: number;
    name: string;
    city: string;
  };
  onSubmit: (data: { organization_id: number; name: string; city: string }) => Promise<void>;
  onClose: () => void;
  title?: string;
}

const COMMON_CITIES = [
  'New York',
  'Los Angeles',
  'Chicago',
  'Houston',
  'Phoenix',
  'Philadelphia',
  'San Antonio',
  'San Diego',
  'Dallas',
  'San Jose',
  'London',
  'Tokyo',
  'Sydney',
  'Toronto',
  'Singapore',
  'Dubai',
  'Mumbai',
  'Beijing',
  'Other',
];

export const BranchForm: React.FC<BranchFormProps> = ({
  isOpen,
  isLoading,
  organizations,
  initialData,
  onSubmit,
  onClose,
  title = 'Create Branch',
}) => {
  const [formData, setFormData] = useState({
    organization_id: 0,
    name: '',
    city: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        organization_id: initialData.organization_id || 0,
        name: initialData.name || '',
        city: initialData.city || '',
      });
    } else {
      setFormData({
        organization_id: organizations.length > 0 ? organizations[0].id : 0,
        name: '',
        city: '',
      });
    }
    setErrors({});
    setSubmitError('');
  }, [initialData, isOpen, organizations]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.organization_id) {
      newErrors.organization_id = 'Organization is required';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Branch name is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'organization_id' ? parseInt(value) : value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit({
        organization_id: formData.organization_id,
        name: formData.name.trim(),
        city: formData.city.trim(),
      });
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[var(--surface-0)] rounded-lg shadow-lg max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--surface-border)]">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h3>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {submitError && (
            <div className="p-3 bg-red-100 border border-red-300 rounded-md">
              <p className="text-sm text-red-800">{submitError}</p>
            </div>
          )}

          {/* Organization Select */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Organization *
            </label>
            <select
              name="organization_id"
              value={formData.organization_id}
              onChange={handleChange}
              disabled={isLoading}
              className={`w-full px-3 py-2 border rounded-md bg-[var(--surface-1)] text-[var(--text-primary)] ${
                errors.organization_id
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-[var(--surface-border)] focus:ring-[var(--brand-600)]'
              } focus:outline-none focus:ring-1 disabled:opacity-50`}
            >
              <option value={0}>Select an organization</option>
              {organizations.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name}
                </option>
              ))}
            </select>
            {errors.organization_id && <p className="text-sm text-red-500 mt-1">{errors.organization_id}</p>}
          </div>

          {/* Branch Name */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Branch Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Main Branch, North Office"
              disabled={isLoading}
              className={`w-full px-3 py-2 border rounded-md bg-[var(--surface-1)] text-[var(--text-primary)] placeholder-[var(--text-muted)] ${
                errors.name
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-[var(--surface-border)] focus:ring-[var(--brand-600)]'
              } focus:outline-none focus:ring-1 disabled:opacity-50`}
            />
            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              City *
            </label>
            <datalist id="cities">
              {COMMON_CITIES.map((city) => (
                <option key={city} value={city} />
              ))}
            </datalist>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              list="cities"
              placeholder="Enter city name"
              disabled={isLoading}
              className={`w-full px-3 py-2 border rounded-md bg-[var(--surface-1)] text-[var(--text-primary)] placeholder-[var(--text-muted)] ${
                errors.city
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-[var(--surface-border)] focus:ring-[var(--brand-600)]'
              } focus:outline-none focus:ring-1 disabled:opacity-50`}
            />
            {errors.city && <p className="text-sm text-red-500 mt-1">{errors.city}</p>}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-[var(--surface-border)] text-[var(--text-primary)] rounded-md hover:bg-[var(--surface-1)] disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-[var(--brand-600)] text-white rounded-md hover:bg-[var(--brand-700)] disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Save Branch'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BranchForm;
