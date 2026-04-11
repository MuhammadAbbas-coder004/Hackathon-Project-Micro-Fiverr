// Utility helper functions

// Format date to readable string
export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

// Truncate text with ellipsis
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

// Format price with currency
export const formatPrice = (price) => {
  return `Rs. ${Number(price).toLocaleString()}`;
};

// Get star rating display
export const getStars = (rating) => {
  return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
};

// Categories list for services
export const CATEGORIES = [
  'Plumbing',
  'Electrician',
  'Tutoring',
  'Cleaning',
  'Painting',
  'Carpentry',
  'AC Repair',
  'Cooking',
  'Delivery',
  'IT Support',
  'Graphic Design',
  'Photography',
  'Other',
];
