import React from 'react';
import { useForm } from 'react-hook-form';
import { Database } from '../types/supabase';
import { useAuthStore } from '../stores/authStore';

type JobFormData = Omit<Database['public']['Tables']['jobs']['Row'], 'id' | 'created_at'>;

interface JobFormProps {
  onSubmit: (data: JobFormData) => void;
  defaultValues?: Partial<JobFormData>;
}

const JobForm: React.FC<JobFormProps> = ({ onSubmit, defaultValues }) => {
  const { user } = useAuthStore();
  
  const { register, handleSubmit, formState: { errors } } = useForm<JobFormData>({
    defaultValues: {
      user_id: user?.id || '',
      company: defaultValues?.company || '',
      position: defaultValues?.position || '',
      location: defaultValues?.location || '',
      job_type: defaultValues?.job_type || 'Full-time',
      salary_range: defaultValues?.salary_range || '',
      application_date: defaultValues?.application_date || new Date().toISOString().split('T')[0],
      status: defaultValues?.status || 'Applied',
      notes: defaultValues?.notes || '',
      url: defaultValues?.url || '',
      ...defaultValues
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <input type="hidden" {...register('user_id')} value={user?.id} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Company
          </label>
          <input
            type="text"
            {...register('company', { required: 'Company is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.company && (
            <p className="mt-1 text-sm text-red-600">{errors.company.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Position
          </label>
          <input
            type="text"
            {...register('position', { required: 'Position is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.position && (
            <p className="mt-1 text-sm text-red-600">{errors.position.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <input
            type="text"
            {...register('location', { required: 'Location is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.location && (
            <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Job Type
          </label>
          <select
            {...register('job_type', { required: 'Job type is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Freelance">Freelance</option>
            <option value="Internship">Internship</option>
          </select>
          {errors.job_type && (
            <p className="mt-1 text-sm text-red-600">{errors.job_type.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Salary Range
          </label>
          <input
            type="text"
            {...register('salary_range', { required: 'Salary range is required' })}
            placeholder="e.g. $80,000 - $100,000"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.salary_range && (
            <p className="mt-1 text-sm text-red-600">{errors.salary_range.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Application Date
          </label>
          <input
            type="date"
            {...register('application_date', { required: 'Application date is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.application_date && (
            <p className="mt-1 text-sm text-red-600">{errors.application_date.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            {...register('status', { required: 'Status is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
            <option value="Withdrawn">Withdrawn</option>
          </select>
          {errors.status && (
            <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Job URL (optional)
          </label>
          <input
            type="url"
            {...register('url')}
            placeholder="https://example.com/job-posting"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Notes (optional)
          </label>
          <textarea
            rows={4}
            {...register('notes')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default JobForm;