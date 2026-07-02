import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormField, Input, Textarea, Select } from '../../components/ui/FormComponents';
import Button from '../../components/ui/Button';
import authService from '../../services/authService';

const RiskForm = ({ risk, onSubmit, onCancel, loading }) => {
  const [users, setUsers] = useState([]);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: risk || {
      title: '',
      description: '',
      category: 'technical',
      likelihood: 2,
      impact: 2,
      owner: '',
      mitigationPlan: '',
      framework: ['SOC2'],
      status: 'open'
    }
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await authService.getUsers({ limit: 100 });
        setUsers(data.data || []);
      } catch (err) {
        console.error('Failed to load owners');
      }
    };
    fetchUsers();
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormField label="Risk Title" error={errors.title?.message} required>
        <Input
          type="text"
          placeholder="e.g. Unauthorized access to production database"
          error={errors.title}
          {...register('title', { required: 'Title is required' })}
        />
      </FormField>

      <FormField label="Description" error={errors.description?.message} required>
        <Textarea
          placeholder="Describe the threat, consequences, and scenario in detail"
          error={errors.description}
          {...register('description', { required: 'Description is required' })}
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Category" error={errors.category?.message} required>
          <Select {...register('category', { required: 'Category is required' })}>
            <option value="technical">Technical / Security</option>
            <option value="operational">Operational</option>
            <option value="compliance">Compliance</option>
            <option value="financial">Financial</option>
            <option value="reputational">Reputational</option>
            <option value="data_privacy">Data Privacy (DPDP)</option>
          </Select>
        </FormField>

        <FormField label="Status" error={errors.status?.message}>
          <Select {...register('status')}>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="mitigated">Mitigated</option>
            <option value="accepted">Accepted</option>
            <option value="closed">Closed</option>
          </Select>
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Likelihood" error={errors.likelihood?.message} required>
          <Select {...register('likelihood', { valueAsNumber: true })}>
            <option value={1}>1 - Low</option>
            <option value={2}>2 - Medium</option>
            <option value={3}>3 - High</option>
            <option value={4}>4 - Critical</option>
          </Select>
        </FormField>

        <FormField label="Impact Severity" error={errors.impact?.message} required>
          <Select {...register('impact', { valueAsNumber: true })}>
            <option value={1}>1 - Low</option>
            <option value={2}>2 - Medium</option>
            <option value={3}>3 - High</option>
            <option value={4}>4 - Critical</option>
          </Select>
        </FormField>
      </div>

      <FormField label="Risk Owner" error={errors.owner?.message} required>
        <Select {...register('owner', { required: 'Owner assignment is required' })}>
          <option value="">Select Assignee</option>
          {users.map((u) => (
            <option key={u._id} value={u._id}>
              {u.name} ({u.role?.replace('_', ' ')})
            </option>
          ))}
        </Select>
      </FormField>

      <FormField label="Mitigation Plan" error={errors.mitigationPlan?.message}>
        <Textarea
          placeholder="E.g. Deploy MFA, restrict IAM roles, implement encryption..."
          {...register('mitigationPlan')}
        />
      </FormField>

      <div className="flex justify-end gap-3 pt-3 border-t border-slate-700/50">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {risk ? 'Save Modifications' : 'Create Risk Log'}
        </Button>
      </div>
    </form>
  );
};

export default RiskForm;
