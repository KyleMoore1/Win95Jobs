import React from 'react';
import { X, Minus, Square, Briefcase, MapPin, ExternalLink } from 'lucide-react';
import { useJobStore } from '../lib/store';
import type { Job } from '../lib/store';

function JobDetail() {
  const { setActiveWindow, selectedJob } = useJobStore();

  if (!selectedJob) return null;

  const handleClose = () => {
    setActiveWindow('explorer');
  };

  const getLocationDisplay = () => {
    if (selectedJob.locations?.length > 0) {
      return selectedJob.locations.map(loc => `${loc.city}, ${loc.state}`).join(' • ');
    }
    return 'Location not specified';
  };

  const getTechStack = (job: Job) => {
    if (!job.tech_stack?.length) return 'No technologies specified';
    return job.tech_stack.join(', ');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="w-[95%] max-w-[600px] h-[calc(100vh-4rem)] max-h-[500px] win95-window">
        {/* Title Bar */}
        <div className="bg-[#000080] text-white p-1 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            <span className="truncate">{selectedJob.title}.txt</span>
          </div>
          <div className="flex gap-1">
            <div className="win95-button-static p-1">
              <Minus className="w-3 h-3" />
            </div>
            <div className="win95-button-static p-1">
              <Square className="w-3 h-3" />
            </div>
            <button 
              className="win95-button p-1"
              onClick={handleClose}
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col h-[calc(100%-2rem)]">
          <div className="flex-1 m-2 md:m-4 overflow-hidden">
            <div className="win95-inset p-4 h-full overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">{selectedJob.title}</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold">Company:</h3>
                  <p className="break-words">{selectedJob.company}</p>
                </div>
                <div>
                  <h3 className="font-bold">Location:</h3>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <p className="break-words">{getLocationDisplay()}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold">Tech Stack:</h3>
                  <p className="break-words">{getTechStack(selectedJob)}</p>
                </div>
                <div>
                  <h3 className="font-bold">Description:</h3>
                  <p className="whitespace-pre-line">
                    {selectedJob.job_description_summary_short || selectedJob.job_description_summary_long || 'No description available.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Footer */}
          <div className="mx-2 md:mx-4 mb-2 md:mb-4 space-y-2">
            {selectedJob.url && (
              <a
                href={selectedJob.url}
                target="_blank"
                rel="noopener noreferrer"
                className="win95-button flex items-center justify-center gap-2 w-full py-2 bg-[#000080] text-white hover:border-t-[#000000] hover:border-l-[#000000] hover:border-b-[#FFFFFF] hover:border-r-[#FFFFFF]"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Apply for this position</span>
              </a>
            )}
            <a
              href="https://grepjob.com"
              target="_blank"
              rel="noopener noreferrer"
              className="win95-button flex items-center justify-center gap-2 w-full py-2 hover:border-t-[#000000] hover:border-l-[#000000] hover:border-b-[#FFFFFF] hover:border-r-[#FFFFFF]"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Find more jobs on grepjob.com</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobDetail;