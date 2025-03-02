import React from 'react';
import { Database } from '../types/supabase';

type Job = Database['public']['Tables']['jobs']['Row'];

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, color }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 border-t-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color.replace('border-', 'bg-').replace('-600', '-100')}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

interface JobStatsProps {
  jobs: Job[];
}

export const JobStats: React.FC<JobStatsProps> = ({ jobs }) => {
  const totalApplications = jobs.length;
  
  const statusCounts = jobs.reduce((acc, job) => {
    const status = job.status.toLowerCase();
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const interviewCount = statusCounts['interview'] || 0;
  const offerCount = statusCounts['offer'] || 0;
  const rejectionCount = statusCounts['rejected'] || 0;
  
  // Calculate response rate (interviews + offers + rejections) / total
  const responseRate = totalApplications > 0
    ? Math.round(((interviewCount + offerCount + rejectionCount) / totalApplications) * 100)
    : 0;
    
  return (
    <div className="text-center p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-medium text-gray-900">Response Rate</h3>
      <div className="mt-2 flex justify-center">
        <div className="relative h-24 w-24">
          <svg className="h-full w-full" viewBox="0 0 36 36">
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="3"
            />
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#3B82F6"
              strokeWidth="3"
              strokeDasharray={`${responseRate}, 100`}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-gray-900">{responseRate}%</span>
          </div>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
        <div>
          <p className="font-medium text-blue-600">{interviewCount}</p>
          <p className="text-gray-500">Interviews</p>
        </div>
        <div>
          <p className="font-medium text-green-600">{offerCount}</p>
          <p className="text-gray-500">Offers</p>
        </div>
        <div>
          <p className="font-medium text-red-600">{rejectionCount}</p>
          <p className="text-gray-500">Rejections</p>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;