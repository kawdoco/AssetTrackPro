import React, { useState, useEffect } from 'react';
import { X } from '@/icons/lucideMuiAdapter';

interface Building {
  id: number;
  name: string;
  branch?: {
    id: number;
    name: string;
    organization?: {
      id: number;
      name: string;
    };
  };
}

interface ZoneFormProps {
  isOpen: boolean;
  isLoading: boolean;
  buildings: Building[];
  initialData?: {
    id?: number;
    building_id: number;
    zone_name: string;
    zone_type: string;
    description?: string | null;
  };
  onSubmit: (data: { building_id: number; zone_name: string; zone_type: string; description?: string }) => Promise<void>;
  onClose: () => void;
  title?: string;
}

const ZONE_TYPES = [
  { value: 'STORAGE', label: 'Storage' },
  { value: 'OFFICE', label: 'Office' },
  { value: 'EXIT', label: 'Exit' },
  { value: 'SECURE', label: 'Secure' },
];

export const ZoneForm: React.FC<ZoneFormProps> = ({
  isOpen,
  isLoading,
  buildings,
  initialData,
  onSubmit,
  onClose,
  title = 'Create Zone',
}) => {
  const [formData, setFormData] = useState({
    building_id: 0,
    zone_name: '',
    zone_type: '',
    description: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        building_id: initialData.building_id || 0,
        zone_name: initialData.zone_name || '',
        zone_type: initialData.zone_type || '',
        description: initialData.description || '',
      });
    } else {
      setFormData({
        building_id: buildings.length > 0 ? buildings[0].id : 0,
        zone_name: '',
        zone_type: '',
        description: '',
      });
    }
    setErrors({});
    setSubmitError('');
  }, [initialData, isOpen, buildings]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.building_id) {
      newErrors.building_id = 'Building is required';
    }

    if (!formData.zone_name.trim()) {
      newErrors.zone_name = 'Zone name is required';
    }

    if (!formData.zone_type) {
      newErrors.zone_type = 'Zone type is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
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
        building_id: formData.building_id,
        zone_name: formData.zone_name.trim(),
        zone_type: formData.zone_type,
        description: formData.description.trim() || undefined,
      });
    } catch (error: any) {
      setSubmitError(error?.response?.data?.message || error.message || 'An error occurred');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--surface-0)] rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--surface-border)]">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-md text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text-primary)] transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Building Selection */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Building *
            </label>
            <select
              name="building_id"
              value={formData.building_id}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 ${
                errors.building_id
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-[var(--surface-border)] focus:ring-[var(--brand-600)]'
              } bg-[var(--surface-1)] text-[var(--text-primary)]`}
              disabled={isLoading}
            >
              <option value={0}>Select a building...</option>
              {buildings.map(building => (
                <option key={building.id} value={building.id}>
                  {building.name}
                  {building.branch && ` (${building.branch.name})`}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              Zones live inside buildings. If this list is empty, create a branch and building first.
            </p>
            {errors.building_id && (
              <p className="mt-1 text-sm text-red-600">{errors.building_id}</p>
            )}
          </div>

          {/* Zone Name */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Zone Name *
            </label>
            <input
              type="text"
              name="zone_name"
              value={formData.zone_name}
              onChange={handleChange}
              placeholder="Enter zone name"
              className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 ${
                errors.zone_name
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-[var(--surface-border)] focus:ring-[var(--brand-600)]'
              } bg-[var(--surface-1)] text-[var(--text-primary)] placeholder-[var(--text-muted)]`}
              disabled={isLoading}
            />
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              Example: Loading Dock, Server Room, Storage Room, Main Exit.
            </p>
            {errors.zone_name && (
              <p className="mt-1 text-sm text-red-600">{errors.zone_name}</p>
            )}
          </div>

          {/* Zone Type */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Zone Type *
            </label>
            <select
              name="zone_type"
              value={formData.zone_type}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 ${
                errors.zone_type
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-[var(--surface-border)] focus:ring-[var(--brand-600)]'
              } bg-[var(--surface-1)] text-[var(--text-primary)]`}
              disabled={isLoading}
            >
              <option value="">Select zone type...</option>
              {ZONE_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              Type helps reports and alerts explain what kind of area the asset moved through.
            </p>
            {errors.zone_type && (
              <p className="mt-1 text-sm text-red-600">{errors.zone_type}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter zone description (optional)"
              rows={3}
              className="w-full px-3 py-2 border border-[var(--surface-border)] rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[var(--brand-600)] bg-[var(--surface-1)] text-[var(--text-primary)] placeholder-[var(--text-muted)] resize-none"
              disabled={isLoading}
            />
          </div>

          {/* Submit Error */}
          {submitError && (
            <div className="p-3 bg-red-100/10 border border-red-500/20 rounded-md">
              <p className="text-sm text-red-600">{submitError}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-[var(--surface-border)] rounded-md text-[var(--text-primary)] font-medium hover:bg-[var(--surface-1)] disabled:opacity-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-[var(--brand-600)] text-white rounded-md font-medium hover:bg-[var(--brand-700)] disabled:opacity-50 transition-all"
            >
              {isLoading ? 'Saving...' : (initialData ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};