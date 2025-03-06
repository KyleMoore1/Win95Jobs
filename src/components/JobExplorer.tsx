import React, { useEffect } from 'react';
import { X, Minus, Square, Search, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { useJobStore } from '../lib/store';
import { LOCATIONS, SENIORITY_LEVELS } from '../lib/constants';
import { filterJobs } from '../lib/api';
import type { Job } from '../lib/store';

function JobExplorer() {
  const { 
    jobs, 
    isLoading, 
    selectedLocation,
    selectedSeniority,
    currentPage,
    totalJobs,
    setSelectedLocation,
    setSelectedSeniority,
    setJobs,
    setIsLoading,
    setSelectedJob,
    setActiveWindow,
    setCurrentPage,
    setTotalJobs
  } = useJobStore();

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      
      try {
        const metros = selectedLocation ? [selectedLocation] : null;
        const seniorityLevels = selectedSeniority ? [selectedSeniority] : null;
        
        const { data, count } = await filterJobs(
          metros,
          null, // specialties
          seniorityLevels,
          null, // sponsorsH1b
          currentPage - 1, // Convert to 0-based index
          40, // pageSize
          null // technologies
        );

        setJobs(data || []);
        setTotalJobs(count || 0);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, [selectedLocation, selectedSeniority, currentPage]);

  const totalPages = Math.ceil(totalJobs / 40);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Date not available';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleJobClick = (job: Job) => {
    setSelectedJob(job);
    setActiveWindow('detail');
  };

  const getLocationDisplay = (job: Job) => {
    if (job.locations?.length > 0) {
      return job.locations.map(loc => `${loc.city}, ${loc.state}`).join(' • ');
    }
    return 'Location not specified';
  };

  const getTechStack = (job: Job) => {
    if (!job.tech_stack?.length) return 'No technologies specified';
    return job.tech_stack.join(', ');
  };

  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-[800px] h-[calc(100vh-4rem)] max-h-[600px] win95-window">
      {/* Title Bar */}
      <div className="bg-[#000080] text-white p-1 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4" />
          <span className="truncate">Job Explorer</span>
        </div>
        <div className="flex gap-1">
          <div className="win95-button-static p-1">
            <Minus className="w-3 h-3" />
          </div>
          <div className="win95-button-static p-1">
            <Square className="w-3 h-3" />
          </div>
          <div className="win95-button-static p-1">
            <X className="w-3 h-3" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="h-[calc(100%-2rem)] flex flex-col">
        {/* Filter Section */}
        <div className="p-2">
          <div className="win95-inset p-2">
            <h3 className="font-bold mb-2">Search Parameters:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <label className="block mb-1 text-sm" htmlFor="location">Location:</label>
                <select 
                  id="location"
                  className="win95-select w-full !appearance-none"
                  value={selectedLocation || ''}
                  onChange={(e) => {
                    setSelectedLocation(e.target.value || null);
                    setCurrentPage(1);
                  }}
                >
                  <option value="">Any Location</option>
                  {LOCATIONS.map((location) => (
                    <option key={location.value} value={location.value}>
                      {location.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-1 text-sm" htmlFor="seniority">Seniority:</label>
                <select 
                  id="seniority"
                  className="win95-select w-full !appearance-none"
                  value={selectedSeniority || ''}
                  onChange={(e) => {
                    setSelectedSeniority(e.target.value || null);
                    setCurrentPage(1);
                  }}
                >
                  <option value="">Any Level</option>
                  {SENIORITY_LEVELS.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Jobs List */}
        <div className="flex-1 min-h-0 px-2">
          <div className="win95-inset h-full overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-full p-4">
                <p>Loading jobs...</p>
              </div>
            ) : (
              <div className="p-2 space-y-2">
                {jobs.map((job) => (
                  <div 
                    key={job.id}
                    className="p-2 hover:bg-[#000080] hover:text-white cursor-pointer group"
                    onClick={() => handleJobClick(job)}
                  >
                    <div className="flex items-center gap-2">
                      <Search className="w-4 h-4 flex-shrink-0" />
                      <span className="font-bold truncate">{job.title}</span>
                    </div>
                    <div className="ml-6 space-y-1">
                      <p className="truncate">{job.company}</p>
                      <div className="flex items-center gap-1 text-sm">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{getLocationDisplay(job)}</span>
                      </div>
                      <p className="text-sm truncate">
                        Tech: {getTechStack(job)}
                      </p>
                      <p className="text-sm text-gray-600 group-hover:text-white">
                        Posted {formatDate(job.date_posted)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Status Bar with Pagination */}
        <div className="win95-inset h-8 mx-2 mb-2 flex items-center px-2 justify-between">
          <span className="text-sm">
            {totalJobs} items found
          </span>
          <div className="flex items-center gap-2">
            <button
              className="win95-button px-2 py-0.5 flex items-center gap-1"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-3 h-3" />
              <span>Prev</span>
            </button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="win95-button px-2 py-0.5 flex items-center gap-1"
              onClick={handleNextPage}
              disabled={currentPage >= totalPages}
            >
              <span>Next</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobExplorer;