import React, { useState, useEffect } from 'react';
import { X } from '@/icons/lucideMuiAdapter';

interface OrganizationFormProps {
  isOpen: boolean;
  isLoading: boolean;
  initialData?: {
    id?: number;
    name: string;
    industry_type?: string;
  };
  onSubmit: (data: { name: string; industry_type?: string }) => Promise<void>;
  onClose: () => void;
  title?: string;
}

const INDUSTRY_TYPES = [
  'Technology',
  'Healthcare',
  'Finance',
  'Manufacturing',
  'Retail',
  'Education',
  'Government',
  'Telecommunications',
  'Energy',
  'Transportation',
  'Hospitality',
  'Other',
];

export const OrganizationForm: React.FC<OrganizationFormProps> = ({
  isOpen,
  isLoading,
  initialData,
  onSubmit,
  onClose,
  title = 'Create Organization',
}) => {
  const [formData, setFormData] = useState({
    name: '',
    industry_type: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        industry_type: initialData.industry_type || '',
      });
    } else {
      setFormData({ name: '', industry_type: '' });
    }
    setErrors({});
    setSubmitError('');
  }, [initialData, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Organization name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
        name: formData.name.trim(),
        industry_type: formData.industry_type || undefined,
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

          {/* Organization Name */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Organization Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter organization name"
              disabled={isLoading}
              className={`w-full px-3 py-2 border rounded-md bg-[var(--surface-1)] text-[var(--text-primary)] placeholder-[var(--text-muted)] ${
                errors.name
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-[var(--surface-border)] focus:ring-[var(--brand-600)]'
              } focus:outline-none focus:ring-1 disabled:opacity-50`}
            />
            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
          </div>

          {/* Industry Type */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Industry Type
            </label>
            <select
              name="industry_type"
              value={formData.industry_type}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-[var(--surface-border)] rounded-md bg-[var(--surface-1)] text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-600)] disabled:opacity-50"
            >
              <option value="">Select industry type</option>
              {INDUSTRY_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-[var(--surface-border)] rounded-md text-[var(--text-primary)] font-medium hover:bg-[var(--surface-1)] disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-[var(--brand-600)] text-white rounded-md font-medium hover:bg-[var(--brand-700)] disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
