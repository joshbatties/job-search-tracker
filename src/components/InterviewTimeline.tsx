import React from 'react';
import { Database } from '../types/supabase';
import { format } from 'date-fns';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

type Interview = Database['public']['Tables']['interviews']['Row'];

interface InterviewTimelineProps {
  interviews: Interview[];
}

const InterviewTimeline: React.FC<InterviewTimelineProps> = ({ interviews }) => {
  if (interviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No interviews recorded yet.</p>
      </div>
    );
  }

  const getResultIcon = (result: string) => {
    switch (result.toLowerCase()) {
      case 'passed':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'failed':
        return <XCircle className="text-red-500" size={20} />;
      default:
        return <Clock className="text-blue-500" size={20} />;
    }
  };

  const getResultColor = (result: string) => {
    switch (result.toLowerCase()) {
      case 'passed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'no response':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {interviews.map((interview, idx) => (
          <li key={interview.id}>
            <div className="relative pb-8">
              {idx !== interviews.length - 1 ? (
                <span
                  className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                />
              ) : null}
              <div className="relative flex space-x-3">
                <div>
                  <span className="h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white bg-gray-100">
                    {getResultIcon(interview.result)}
                  </span>
                </div>
                <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                  <div>
                    <p className="text-sm text-gray-900 font-medium">
                      {interview.interview_type} Interview
                      {interview.interviewer && ` with ${interview.interviewer}`}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {interview.notes}
                    </p>
                  </div>
                  <div className="text-right text-sm whitespace-nowrap">
                    <time dateTime={interview.interview_date}>
                      {format(new Date(interview.interview_date), 'MMM d, yyyy')}
                    </time>
                    <div className={`mt-1 inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${getResultColor(interview.result)}`}>
                      {interview.result}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InterviewTimeline;