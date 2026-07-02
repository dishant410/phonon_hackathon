import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormField, Input, Textarea, Select } from '../../components/ui/FormComponents';
import Button from '../../components/ui/Button';
import controlService from '../../services/controlService';

const EvidenceForm = ({ onSubmit, onCancel, loading }) => {
  const [controls, setControls] = useState([]);
  const [file, setFile] = useState(null);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      title: '',
      description: '',
      control: '',
      evidenceType: 'screenshot',
      period: 'Q2 2026'
    }
  });

  useEffect(() => {
    const fetchControls = async () => {
      try {
        const { data } = await controlService.getAll({ limit: 100 });
        setControls(data.data || []);
      } catch (err) {
        console.error('Failed to get controls map');
      }
    };
    fetchControls();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleFormSubmit = (data) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description || '');
    formData.append('control', data.control);
    formData.append('evidenceType', data.evidenceType);
    formData.append('period', data.period);
    if (file) {
      formData.append('file', file);
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <FormField label="Evidence Title" error={errors.title?.message} required>
        <Input
          type="text"
          placeholder="e.g. AWS CloudTrail Log Output May 2026"
          error={errors.title}
          {...register('title', { required: 'Title is required' })}
        />
      </FormField>

      <FormField label="Associated Control" error={errors.control?.message} required>
        <Select {...register('control', { required: 'Linked Control ID is required' })}>
          <option value="">Select Reference Code</option>
          {controls.map((c) => (
            <option key={c._id} value={c._id}>
              {c.controlId} - {c.title}
            </option>
          ))}
        </Select>
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Evidence Type" error={errors.evidenceType?.message} required>
          <Select {...register('evidenceType', { required: 'Evidence type is required' })}>
            <option value="screenshot">Screenshot (MFA/config)</option>
            <option value="log">Server log / CSV</option>
            <option value="document">PDF Document / Statement</option>
            <option value="policy">Signed Policy / Authorization</option>
            <option value="other">Other report</option>
          </Select>
        </FormField>

        <FormField label="Audit Period" error={errors.period?.message}>
          <Input type="text" placeholder="e.g. Q2 2026" {...register('period')} />
        </FormField>
      </div>

      <FormField label="Comments / Notes" error={errors.description?.message}>
        <Textarea
          placeholder="E.g. Downloaded from AWS IAM dashboard. Verified active status for all admins."
          {...register('description')}
        />
      </FormField>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Upload File <span className="text-red-500">*</span>
        </label>
        <input
          type="file"
          required
          onChange={handleFileChange}
          className="w-full text-sm text-slate-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-900/40 file:text-indigo-400 hover:file:bg-indigo-900/60"
        />
      </div>

      <div className="flex justify-end gap-3 pt-3 border-t border-slate-700/50">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          Submit Evidence
        </Button>
      </div>
    </form>
  );
};

export default EvidenceForm;
