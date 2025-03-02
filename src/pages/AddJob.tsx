import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useJobStore } from '../stores/jobStore';
import JobForm from '../components/JobForm';
import { Database } from '../types/supabase';

type JobFormData = Omit<Database['public']['Tables']['jobs']['Row'], 'id' | 'created_at'>;

const AddJob: React.FC = () => {
  const navigate = useNavigate();
  const { addJob, loading } = useJobStore();

  const handleSubmit = async (data: JobFormData) => {
    const jobId = await addJob(data);
    if (jobId) {
      navigate(`/jobs/${jobId}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Add New Application</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <JobForm onSubmit={handleSubmit} />
        )}
      </div>
    </div>
  );
};

export default AddJob;