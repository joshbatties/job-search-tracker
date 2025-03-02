import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useJobStore } from '../stores/jobStore';
import InterviewTimeline from '../components/InterviewTimeline';
import InterviewForm from '../components/InterviewForm';
import { format } from 'date-fns';
import { 
  Building2, MapPin, Calendar, Briefcase, DollarSign, 
  ExternalLink, Edit, Trash2, PlusCircle, X 
} from 'lucide-react';

const JobDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    currentJob, 
    interviews, 
    loading, 
    fetchJob, 
    fetchInterviews, 
    deleteJob,
    addInterview
  } = useJobStore();
  const [showInterviewForm, setShowInterviewForm] = useState(false);

  useEffect(() => {
    if (id) {
      fetchJob(id);
      fetchInterviews(id);
    }
  }, [id, fetchJob, fetchInterviews]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      await deleteJob(id!);
      navigate('/jobs');
    }
  };

  const handleAddInterview = async (data: any) => {
    await addInterview(data);
    setShowInterviewForm(false);
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
        <p className="text-gray-500 mb-6">The job application you're looking for doesn't exist or has been deleted.</p>
        <Link
          to="/jobs"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          Back to Applications
        </Link>
      </div>
    );
  }

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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">{currentJob.position}</h1>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(currentJob.status)}`}>
              {currentJob.status}
            </span>
          </div>
          <p className="text-lg text-gray-600">{currentJob.company}</p>
        </div>
        
        <div className="flex space-x-2">
          <Link
            to={`/jobs/${id}/edit`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Edit size={18} className="mr-2" />
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
          >
            <Trash2 size={18} className="mr-2" />
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-medium text-gray-900 mb-4">Job Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <Building2 size={20} className="text-gray-500 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Company</p>
                  <p className="font-medium">{currentJob.company}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <MapPin size={20} className="text-gray-500 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium">{currentJob.location}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Calendar size={20} className="text-gray-500 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Application Date</p>
                  <p className="font-medium">{format(new Date(currentJob.application_date), 'MMMM d, yyyy')}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Briefcase size={20} className="text-gray-500 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Job Type</p>
                  <p className="font-medium">{currentJob.job_type}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <DollarSign size={20} className="text-gray-500 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Salary Range</p>
                  <p className="font-medium">{currentJob.salary_range}</p>
                </div>
              </div>
              
              {currentJob.url && (
                <div className="flex items-start">
                  <ExternalLink size={20} className="text-gray-500 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Job URL</p>
                    <a 
                      href={currentJob.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-medium text-blue-600 hover:text-blue-800"
                    >
                      View Job Posting
                    </a>
                  </div>
                </div>
              )}
            </div>
            
            {currentJob.notes && (
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900 mb-2">Notes</h3>
                <p className="text-gray-700 whitespace-pre-line">{currentJob.notes}</p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-medium text-gray-900">Interview Timeline</h2>
              {!showInterviewForm && (
                <button
                  onClick={() => setShowInterviewForm(true)}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  <PlusCircle size={16} className="mr-1" />
                  Add Interview
                </button>
              )}
            </div>
            
            {showInterviewForm ? (
              <div className="mb-6 border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Add New Interview</h3>
                  <button
                    onClick={() => setShowInterviewForm(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={18} />
                  </button>
                </div>
                <InterviewForm 
                  jobId={id!} 
                  onSubmit={handleAddInterview} 
                  onCancel={() => setShowInterviewForm(false)} 
                />
              </div>
            ) : null}
            
            <InterviewTimeline interviews={interviews} />
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-medium text-gray-900 mb-4">Application Status</h2>
            <div className="space-y-4">
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                      Progress
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-blue-600">
                      {currentJob.status === 'Applied' ? '25%' : 
                       currentJob.status === 'Interview' ? '50%' : 
                       currentJob.status === 'Offer' ? '100%' : 
                       currentJob.status === 'Rejected' ? '0%' : '0%'}
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                  <div 
                    style={{ 
                      width: currentJob.status === 'Applied' ? '25%' : 
                             currentJob.status === 'Interview' ? '50%' : 
                             currentJob.status === 'Offer' ? '100%' : 
                             currentJob.status === 'Rejected' ? '0%' : '0%' 
                    }} 
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                  ></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className={`flex items-center ${currentJob.status === 'Applied' || currentJob.status === 'Interview' || currentJob.status === 'Offer' ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`rounded-full h-6 w-6 flex items-center justify-center mr-2 ${currentJob.status === 'Applied' || currentJob.status === 'Interview' || currentJob.status === 'Offer' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                    1
                  </div>
                  <span>Application Submitted</span>
                </div>
                
                <div className={`flex items-center ${currentJob.status === 'Interview' || currentJob.status === 'Offer' ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`rounded-full h-6 w-6 flex items-center justify-center mr-2 ${currentJob.status === 'Interview' || currentJob.status === 'Offer' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                    2
                  </div>
                  <span>Interview Process</span>
                </div>
                
                <div className={`flex items-center ${currentJob.status === 'Offer' ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`rounded-full h-6 w-6 flex items-center justify-center mr-2 ${currentJob.status === 'Offer' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                    3
                  </div>
                  <span>Offer Received</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-medium text-gray-900 mb-4">Interview Stats</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Interviews</span>
                <span className="font-bold">{interviews.length}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Passed</span>
                <span className="font-bold text-green-600">
                  {interviews.filter(i => i.result.toLowerCase() === 'passed').length}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Failed</span>
                <span className="font-bold text-red-600">
                  {interviews.filter(i => i.result.toLowerCase() === 'failed').length}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Pending</span>
                <span className="font-bold text-blue-600">
                  {interviews.filter(i => i.result.toLowerCase() === 'pending').length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;