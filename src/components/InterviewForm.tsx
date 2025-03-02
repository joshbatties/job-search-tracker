import React from 'react';
import { useForm } from 'react-hook-form';
import { Database } from '../types/supabase';

type Interview = Omit<Database['public']['Tables']['interviews']['Row'], 'id' | 'created_at'>;

interface InterviewFormProps {
  jobId: string;
  onSubmit: (data: Interview) => void;
  onCancel: () => void;
  defaultValues?: Partial<Interview>;
}

const InterviewForm: React.FC<InterviewFormProps> = ({ 
  jobId, 
  onSubmit, 
  onCancel,
  defaultValues 
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm<Interview>({
    defaultValues: {
      job_id: jobId,
      interview_date: defaultValues?.interview_date || new Date().toISOString().split('T')[0],
      interview_type: defaultValues?.interview_type || 'Phone Screen',
      interviewer: defaultValues?.interviewer || '',
      notes: defaultValues?.notes || '',
      result: defaultValues?.result || 'Pending',
      ...defaultValues
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Interview Date
        </label>
        <input
          type="date"
          {...register('interview_date', { required: 'Date is required' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.interview_date && (
          <p className="mt-1 text-sm text-red-600">{errors.interview_date.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Interview Type
        </label>
        <select
          {...register('interview_type', { required: 'Type is required' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="Phone Screen">Phone Screen</option>
          <option value="Technical">Technical</option>
          <option value="Behavioral">Behavioral</option>
          <option value="Onsite">Onsite</option>
          <option value="Final">Final</option>
          <option value="Other">Other</option>
        </select>
        {errors.interview_type && (
          <p className="mt-1 text-sm text-red-600">{errors.interview_type.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Interviewer (optional)
        </label>
        <input
          type="text"
          {...register('interviewer')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Result
        </label>
        <select
          {...register('result', { required: 'Result is required' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="Pending">Pending</option>
          <option value="Passed">Passed</option>
          <option value="Failed">Failed</option>
          <option value="No Response">No Response</option>
        </select>
        {errors.result && (
          <p className="mt-1 text-sm text-red-600">{errors.result.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Notes (optional)
        </label>
        <textarea
          rows={3}
          {...register('notes')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default InterviewForm;