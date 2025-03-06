import { create } from 'zustand';

export type Location = {
  city: string;
  metro: string;
  state: string;
  country: string;
};

export type Job = {
  id: string;
  title: string;
  company: string;
  location?: string;
  description: string;
  tech_stack?: string[];
  seniority?: string[];
  sponsors_h1b?: boolean;
  date_posted: string;
  locations?: Location[];
  job_description_full?: string;
  job_description_summary_short?: string;
  job_description_summary_long?: string;
  url?: string;
};

type JobFilters = {
  tech_stack_filters: string[] | null;
  metro_filters: string[] | null;
  seniority_filters: string[] | null;
  sponsors_h1b_filter: boolean | null;
};

type JobStore = {
  jobs: Job[];
  filters: JobFilters;
  isLoading: boolean;
  activeWindow: string | null;
  selectedJob: Job | null;
  selectedLocation: string | null;
  selectedSeniority: string | null;
  currentPage: number;
  totalJobs: number;
  setJobs: (jobs: Job[]) => void;
  setFilters: (filters: Partial<JobFilters>) => void;
  setIsLoading: (loading: boolean) => void;
  setActiveWindow: (window: string | null) => void;
  setSelectedJob: (job: Job | null) => void;
  setSelectedLocation: (location: string | null) => void;
  setSelectedSeniority: (seniority: string | null) => void;
  setCurrentPage: (page: number) => void;
  setTotalJobs: (total: number) => void;
};

export const useJobStore = create<JobStore>((set) => ({
  jobs: [],
  filters: {
    tech_stack_filters: null,
    metro_filters: null,
    seniority_filters: null,
    sponsors_h1b_filter: null,
  },
  isLoading: false,
  activeWindow: 'explorer',
  selectedJob: null,
  selectedLocation: null,
  selectedSeniority: null,
  currentPage: 1,
  totalJobs: 0,
  setJobs: (jobs) => set({ jobs }),
  setFilters: (filters) => set((state) => ({ 
    filters: { ...state.filters, ...filters }
  })),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setActiveWindow: (window) => set({ activeWindow: window }),
  setSelectedJob: (job) => set({ selectedJob: job }),
  setSelectedLocation: (location) => set({ selectedLocation: location }),
  setSelectedSeniority: (seniority) => set({ selectedSeniority: seniority }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setTotalJobs: (total) => set({ totalJobs: total }),
}));