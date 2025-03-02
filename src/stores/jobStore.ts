import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';

type Job = Database['public']['Tables']['jobs']['Row'];
type Interview = Database['public']['Tables']['interviews']['Row'];

interface JobState {
  jobs: Job[];
  currentJob: Job | null;
  interviews: Interview[];
  loading: boolean;
  error: string | null;
  fetchJobs: () => Promise<void>;
  fetchJob: (id: string) => Promise<void>;
  fetchInterviews: (jobId: string) => Promise<void>;
  addJob: (job: Omit<Job, 'id' | 'created_at'>) => Promise<string | null>;
  updateJob: (id: string, job: Partial<Job>) => Promise<void>;
  deleteJob: (id: string) => Promise<void>;
  addInterview: (interview: Omit<Interview, 'id' | 'created_at'>) => Promise<string | null>;
  updateInterview: (id: string, interview: Partial<Interview>) => Promise<void>;
  deleteInterview: (id: string) => Promise<void>;
}

export const useJobStore = create<JobState>((set, get) => ({
  jobs: [],
  currentJob: null,
  interviews: [],
  loading: false,
  error: null,

  fetchJobs: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('application_date', { ascending: false });
      
      if (error) throw error;
      set({ jobs: data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  fetchJob: async (id) => {
    set({ loading: true, error: null, currentJob: null });
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      set({ currentJob: data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  fetchInterviews: async (jobId) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('interviews')
        .select('*')
        .eq('job_id', jobId)
        .order('interview_date', { ascending: true });
      
      if (error) throw error;
      set({ interviews: data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  addJob: async (job) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('jobs')
        .insert([job])
        .select()
        .single();
      
      if (error) throw error;
      
      // Update the jobs list with the new job
      set((state) => ({ 
        jobs: [data, ...state.jobs],
        loading: false 
      }));
      
      return data.id;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      return null;
    }
  },

  updateJob: async (id, job) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('jobs')
        .update(job)
        .eq('id', id);
      
      if (error) throw error;
      
      // Update the jobs list and current job
      set((state) => ({
        jobs: state.jobs.map(j => j.id === id ? { ...j, ...job } : j),
        currentJob: state.currentJob && state.currentJob.id === id 
          ? { ...state.currentJob, ...job } 
          : state.currentJob,
        loading: false
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  deleteJob: async (id) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Remove the job from the jobs list
      set((state) => ({
        jobs: state.jobs.filter(j => j.id !== id),
        loading: false
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  addInterview: async (interview) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('interviews')
        .insert([interview])
        .select()
        .single();
      
      if (error) throw error;
      
      // Update the interviews list with the new interview
      set((state) => ({ 
        interviews: [...state.interviews, data],
        loading: false 
      }));
      
      return data.id;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      return null;
    }
  },

  updateInterview: async (id, interview) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('interviews')
        .update(interview)
        .eq('id', id);
      
      if (error) throw error;
      
      // Update the interviews list
      set((state) => ({
        interviews: state.interviews.map(i => i.id === id ? { ...i, ...interview } : i),
        loading: false
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  deleteInterview: async (id) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('interviews')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Remove the interview from the interviews list
      set((state) => ({
        interviews: state.interviews.filter(i => i.id !== id),
        loading: false
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
}));