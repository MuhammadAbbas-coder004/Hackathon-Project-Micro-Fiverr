// Job Card Component - Used in Job Listing
import React from 'react';

const JobCard = ({ job }) => {
  return (
    <div className="job-card">
      <h3>{job?.title}</h3>
    </div>
  );
};

export default JobCard;
