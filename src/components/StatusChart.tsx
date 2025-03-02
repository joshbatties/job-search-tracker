import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { Database } from '../types/supabase';

ChartJS.register(ArcElement, Tooltip, Legend);

type Job = Database['public']['Tables']['jobs']['Row'];

interface StatusChartProps {
  jobs: Job[];
}

const StatusChart: React.FC<StatusChartProps> = ({ jobs }) => {
  const statusCounts = jobs.reduce((acc, job) => {
    const status = job.status;
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statuses = Object.keys(statusCounts);
  const counts = Object.values(statusCounts);

  const data = {
    labels: statuses,
    datasets: [
      {
        data: counts,
        backgroundColor: [
          '#3B82F6', // blue
          '#8B5CF6', // purple
          '#10B981', // green
          '#EF4444', // red
          '#F59E0B', // amber
        ],
        borderColor: [
          '#2563EB',
          '#7C3AED',
          '#059669',
          '#DC2626',
          '#D97706',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = counts.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Application Status</h3>
      <div className="h-64">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};

export default StatusChart;