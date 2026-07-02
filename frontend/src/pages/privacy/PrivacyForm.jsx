import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormField, Input, Textarea, Select } from '../../components/ui/FormComponents';
import Button from '../../components/ui/Button';
import authService from '../../services/authService';

const PrivacyForm = ({ obligation, onSubmit, onCancel, loading }) => {
  const [users, setUsers] = useState([]);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: obligation || {
      title: '',
      description: '',
      obligationType: 'consent',
      dpdpSection: 'Section 6',
      status: 'pending',
      responsibleParty: '',
      dataSubjectCategory: 'customer',
      dataCategories: []
    }
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await authService.getUsers({ limit: 100 });
        setUsers(data.data || []);
      } catch (err) {
        console.error('Failed to load GRC officers');
      }
    };
    fetchUsers();
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormField label="Obligation Title" error={errors.title?.message} required>
        <Input
          type="text"
          placeholder="e.g. Implement Consent Manager API interface"
          error={errors.title}
          {...register('title', { required: 'Title is required' })}
        />
      </FormField>

      <FormField label="DPDP Section Code" error={errors.dpdpSection?.message} required>
        <Input
          type="text"
          placeholder="e.g. Section 6 (Consent parameters)"
          error={errors.dpdpSection}
          {...register('dpdpSection', { required: 'DPDP Section is required' })}
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Obligation Type" error={errors.obligationType?.message} required>
          <Select {...register('obligationType', { required: 'Type is required' })}>
            <option value="consent">Consent Management</option>
            <option value="notice">Notice & Authorization</option>
            <option value="dsar">Data Principal Request (DSAR)</option>
            <option value="breach_notification">Breach Notification</option>
            <option value="data_retention">Data Retention & Deletion</option>
            <option value="cross_border_transfer">Cross Border Transfer</option>
          </Select>
        </FormField>

        <FormField label="Status" error={errors.status?.message} required>
          <Select {...register('status', { required: 'Status is required' })}>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="not_applicable">Not Applicable</option>
          </Select>
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Data Subject Category" error={errors.dataSubjectCategory?.message}>
          <Select {...register('dataSubjectCategory')}>
            <option value="customer">Customer / End User</option>
            <option value="employee">Employee / Internal</option>
            <option value="vendor">Vendor / Partner</option>
            <option value="public">Public</option>
            <option value="other">Other</option>
          </Select>
        </FormField>

        <FormField label="Responsible Officer (Consent Officer)" error={errors.responsibleParty?.message} required>
          <Select {...register('responsibleParty', { required: 'Responsible GRC officer is required' })}>
            <option value="">Select Officer Assignee</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>
                {u.name} ({u.role?.replace('_', ' ')})
              </option>
            ))}
          </Select>
        </FormField>
      </div>

      <FormField label="Audit Deadline / Due Date" error={errors.dueDate?.message}>
        <Input
          type="date"
          error={errors.dueDate}
          {...register('dueDate')}
        />
      </FormField>

      <FormField label="Obligation Scope Description" error={errors.description?.message}>
        <Textarea
          placeholder="Details of required data architecture, consent storage parameters and testing guidelines..."
          {...register('description')}
        />
      </FormField>

      <div className="flex justify-end gap-3 pt-3 border-t border-slate-700/50">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {obligation ? 'Modify Obligation' : 'Add DPDP Obligation'}
        </Button>
      </div>
    </form>
  );
};

export default PrivacyForm;
