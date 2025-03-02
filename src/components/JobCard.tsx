import React from 'react';
import { Link } from 'react-router-dom';
import { Database } from '../types/supabase';
import { format } from 'date-fns';
import { ExternalLink, Edit, Trash2 } from 'lucide-react';

type Job = Database['public']['Tables']['jobs']['Row'];

interface JobCardProps {
  job: Job;
  onDelete: (id: string) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onDelete }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'applied':
        return 'bg-blue-100 text-blue-800';
      case 'interview':
        return 'bg-purple-100 text-purple-800';
      case 'offer':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{job.position}</h3>
          <p className="text-gray-600 font-medium">{job.company}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(job.status)}`}>
          {job.status}
        </span>
      </div>
      
      <div className="mt-4 text-gray-500">
        <p>{job.location} • {job.job_type}</p>
        <p>Applied: {format(new Date(job.application_date), 'MMM d, yyyy')}</p>
      </div>
      
      <div className="mt-6 flex justify-between items-center">
        <Link 
          to={`/jobs/${job.id}`}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          View Details
        </Link>
        
        <div className="flex space-x-2">
          {job.url && (
            <a 
              href={job.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-100"
            >
              <ExternalLink size={18} />
            </a>
          )}
          
          <Link 
            to={`/jobs/${job.id}/edit`}
            className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-100"
          >
            <Edit size={18} />
          </Link>
          
          <button 
            onClick={() => onDelete(job.id)}
            className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-100"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;