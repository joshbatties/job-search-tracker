import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Database } from '../types/supabase';
import { format, parseISO, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from 'date-fns';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

type Job = Database['public']['Tables']['jobs']['Row'];

interface ApplicationsOverTimeProps {
  jobs: Job[];
}

const ApplicationsOverTime: React.FC<ApplicationsOverTimeProps> = ({ jobs }) => {
  // Get the last 6 months
  const today = new Date();
  const sixMonthsAgo = subMonths(today, 5);
  
  const months = eachMonthOfInterval({
    start: startOfMonth(sixMonthsAgo),
    end: endOfMonth(today)
  });

  // Count applications per month
  const applicationsByMonth = months.map(month => {
    const startDate = startOfMonth(month);
    const endDate = endOfMonth(month);
    
    return jobs.filter(job => {
      const applicationDate = parseISO(job.application_date);
      return applicationDate >= startDate && applicationDate <= endDate;
    }).length;
  });

  const data = {
    labels: months.map(month => format(month, 'MMM yyyy')),
    datasets: [
      {
        label: 'Applications',
        data: applicationsByMonth,
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Applications Over Time</h3>
      <Line options={options} data={data} />
    </div>
  );
};

export default ApplicationsOverTime;