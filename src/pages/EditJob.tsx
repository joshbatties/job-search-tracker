import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useJobStore } from '../stores/jobStore';
import JobForm from '../components/JobForm';
import { Database } from '../types/supabase';

type JobFormData = Omit<Database['public']['Tables']['jobs']['Row'], 'id' | 'created_at'>;

const EditJob: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentJob, loading, fetchJob, updateJob } = useJobStore();

  useEffect(() => {
    if (id) {
      fetchJob(id);
    }
  }, [id, fetchJob]);

  const handleSubmit = async (data: JobFormData) => {
    if (id) {
      await updateJob(id, data);
      navigate(`/jobs/${id}`);
    }
  };

  if (loading && !currentJob) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!currentJob) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Job not found</h3>
        <p className="text-gray-500">The job application you're trying to edit doesn't exist or has been deleted.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Edit Application</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <JobForm onSubmit={handleSubmit} defaultValues={currentJob} />
      </div>
    </div>
  );
};

export default EditJob;