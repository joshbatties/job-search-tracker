import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useJobStore } from '../stores/jobStore';
import { StatsCard, JobStats } from '../components/StatsCard';
import StatusChart from '../components/StatusChart';
import ApplicationsOverTime from '../components/ApplicationsOverTime';
import { Briefcase, Building2, Calendar, Clock, PlusCircle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { jobs, loading, fetchJobs } = useJobStore();

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  if (loading && jobs.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Calculate stats
  const totalApplications = jobs.length;
  
  const activeApplications = jobs.filter(
    job => !['rejected', 'withdrawn'].includes(job.status.toLowerCase())
  ).length;
  
  const interviewsScheduled = jobs.filter(
    job => job.status.toLowerCase() === 'interview'
  ).length;
  
  const lastWeekApplications = jobs.filter(job => {
    const applicationDate = new Date(job.application_date);
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return applicationDate >= oneWeekAgo;
  }).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <Link
          to="/jobs/add"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <PlusCircle size={18} className="mr-2" />
          Add Application
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Applications"
          value={totalApplications}
          icon={<Briefcase size={24} className="text-blue-600" />}
          color="border-blue-600"
        />
        <StatsCard
          title="Active Applications"
          value={activeApplications}
          icon={<Clock size={24} className="text-green-600" />}
          color="border-green-600"
        />
        <StatsCard
          title="Interviews Scheduled"
          value={interviewsScheduled}
          icon={<Calendar size={24} className="text-purple-600" />}
          color="border-purple-600"
        />
        <StatsCard
          title="Applied Last Week"
          value={lastWeekApplications}
          icon={<Building2 size={24} className="text-amber-600" />}
          color="border-amber-600"
        />
      </div>

      {jobs.length > 0 ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ApplicationsOverTime jobs={jobs} />
            </div>
            <div>
              <JobStats jobs={jobs} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <StatusChart jobs={jobs} />
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Applications</h3>
              <div className="space-y-4">
                {jobs.slice(0, 5).map(job => (
                  <Link 
                    key={job.id} 
                    to={`/jobs/${job.id}`}
                    className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{job.position}</h4>
                        <p className="text-sm text-gray-500">{job.company}</p>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        job.status.toLowerCase() === 'applied' ? 'bg-blue-100 text-blue-800' :
                        job.status.toLowerCase() === 'interview' ? 'bg-purple-100 text-purple-800' :
                        job.status.toLowerCase() === 'offer' ? 'bg-green-100 text-green-800' :
                        job.status.toLowerCase() === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {job.status}
                      </span>
                    </div>
                  </Link>
                ))}
                
                {jobs.length > 5 && (
                  <Link 
                    to="/jobs"
                    className="block text-center text-sm font-medium text-blue-600 hover:text-blue-500 mt-4"
                  >
                    View all applications
                  </Link>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <Briefcase size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No job applications yet</h3>
          <p className="text-gray-500 mb-6">Start tracking your job search by adding your first application.</p>
          <Link
            to="/jobs/add"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <PlusCircle size={18} className="mr-2" />
            Add Your First Application
          </Link>
        </div>
      )}
    </div>
  );
};

export default Dashboard;