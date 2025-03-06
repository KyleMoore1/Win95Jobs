import { supabase } from './supabase';

export async function filterJobs(
  metros: string[] | null = null,
  specialties: string[] | null = null,
  seniorityLevels: string[] | null = null,
  sponsorsH1b: boolean | null = null,
  page = 0,
  pageSize = 40,
  technologies: string[] | null = null
) {
  const start = page * pageSize;
  const end = start + pageSize - 1; // Subtract 1 since range is inclusive

  console.log('technologies passed to supabase');
  console.log(metros, specialties, seniorityLevels, sponsorsH1b, technologies);
  const { data, error, count } = await supabase
    .rpc(
      'filter_jobs_v3',
      {
        metro_filters: metros,
        sub_category_filters: specialties,
        seniority_filters: seniorityLevels,
        sponsors_h1b_filter: sponsorsH1b,
        tech_stack_filters: technologies,
      },
      { count: 'exact' }
    )
    .range(start, end);

  console.log('data returned from supabase RPC', data);

  if (error) throw error;

  return { data, count };
}