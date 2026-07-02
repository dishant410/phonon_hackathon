import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormField, Input, Textarea, Select } from '../../components/ui/FormComponents';
import Button from '../../components/ui/Button';
import authService from '../../services/authService';

const ControlForm = ({ control, onSubmit, onCancel, loading }) => {
  const [users, setUsers] = useState([]);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: control || {
      controlId: '',
      title: '',
      description: '',
      type: 'preventive',
      status: 'planned',
      owner: '',
      framework: ['SOC2'],
      soc2Category: 'CC1',
      testingProcedure: '',
      evidenceRequired: true
    }
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await authService.getUsers({ limit: 100 });
        setUsers(data.data || []);
      } catch (err) {
        console.error('Failed to load control owners');
      }
    };
    fetchUsers();
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <FormField label="Control Code ID" error={errors.controlId?.message} required>
          <Input
            type="text"
            placeholder="e.g. AC-01"
            disabled={!!control}
            error={errors.controlId}
            {...register('controlId', { required: 'Control ID is required' })}
          />
        </FormField>

        <div className="col-span-2">
          <FormField label="Control Title" error={errors.title?.message} required>
            <Input
              type="text"
              placeholder="e.g. Multi-Factor Authentication Enforcement"
              error={errors.title}
              {...register('title', { required: 'Title is required' })}
            />
          </FormField>
        </div>
      </div>

      <FormField label="Description" error={errors.description?.message} required>
        <Textarea
          placeholder="Describe how this compliance control mitigates risk or logs activity"
          error={errors.description}
          {...register('description', { required: 'Description is required' })}
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Control Type" error={errors.type?.message} required>
          <Select {...register('type', { required: 'Type is required' })}>
            <option value="preventive">Preventive</option>
            <option value="detective">Detective</option>
            <option value="corrective">Corrective</option>
            <option value="compensating">Compensating</option>
          </Select>
        </FormField>

        <FormField label="Status" error={errors.status?.message} required>
          <Select {...register('status', { required: 'Status is required' })}>
            <option value="planned">Planned (Not Initiated)</option>
            <option value="partial">Partially Implemented</option>
            <option value="implemented">Fully Implemented</option>
            <option value="not_implemented">Not Actioned</option>
          </Select>
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="SOC2 Category Reference" error={errors.soc2Category?.message}>
          <Select {...register('soc2Category')}>
            <option value="CC1">CC1 - Control Environment</option>
            <option value="CC2">CC2 - Communication</option>
            <option value="CC3">CC3 - Risk Assessment</option>
            <option value="CC4">CC4 - Monitoring Activities</option>
            <option value="CC5">CC5 - Control Activities</option>
            <option value="CC6">CC6 - Logical Access</option>
            <option value="CC7">CC7 - System Operations</option>
            <option value="CC8">CC8 - Change Management</option>
            <option value="CC9">CC9 - Risk Mitigation</option>
          </Select>
        </FormField>

        <FormField label="Linked Owner Assignee" error={errors.owner?.message}>
          <Select {...register('owner')}>
            <option value="">Select Auditor / Owner</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>
                {u.name} ({u.role?.replace('_', ' ')})
              </option>
            ))}
          </Select>
        </FormField>
      </div>

      <FormField label="Testing Procedure Instruction" error={errors.testingProcedure?.message}>
        <Textarea
          placeholder="E.g. Check IAM logs, verify MFA setting on all active users monthly..."
          {...register('testingProcedure')}
        />
      </FormField>

      <div className="flex justify-end gap-3 pt-3 border-t border-slate-700/50">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {control ? 'Update Control' : 'Create Control'}
        </Button>
      </div>
    </form>
  );
};

export default ControlForm;
