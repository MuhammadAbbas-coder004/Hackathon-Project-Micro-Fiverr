// Service Card Component - Used in Service Listing
import React from 'react';

const ServiceCard = ({ service }) => {
  return (
    <div className="service-card">
      <h3>{service?.title}</h3>
    </div>
  );
};

export default ServiceCard;
