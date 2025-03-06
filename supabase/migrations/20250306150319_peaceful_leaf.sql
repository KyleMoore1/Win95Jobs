/*
  # Add count function for filtered jobs

  1. New Functions
    - `count_filtered_jobs`: Returns the total count of jobs matching the filter criteria
      - Takes the same parameters as filter_jobs_v3
      - Returns a single integer count

  2. Implementation Details
    - Uses the same filtering logic as filter_jobs_v3
    - Optimized for counting large result sets
*/

CREATE OR REPLACE FUNCTION count_filtered_jobs(
  metro_filters text[] DEFAULT NULL,
  sub_category_filters text[] DEFAULT NULL,
  seniority_filters text[] DEFAULT NULL,
  sponsors_h1b_filter boolean DEFAULT NULL,
  tech_stack_filters text[] DEFAULT NULL
) RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  total_count integer;
BEGIN
  SELECT COUNT(*)
  INTO total_count
  FROM jobs j
  WHERE
    (metro_filters IS NULL OR EXISTS (
      SELECT 1
      FROM unnest(j.locations) loc
      WHERE loc->>'metro' = ANY(metro_filters)
    ))
    AND (sub_category_filters IS NULL OR j.sub_category = ANY(sub_category_filters))
    AND (seniority_filters IS NULL OR EXISTS (
      SELECT 1
      FROM unnest(j.seniority) s
      WHERE s = ANY(seniority_filters)
    ))
    AND (sponsors_h1b_filter IS NULL OR j.sponsors_h1b = sponsors_h1b_filter)
    AND (tech_stack_filters IS NULL OR EXISTS (
      SELECT 1
      FROM unnest(j.tech_stack) tech
      WHERE tech = ANY(tech_stack_filters)
    ));

  RETURN total_count;
END;
$$;