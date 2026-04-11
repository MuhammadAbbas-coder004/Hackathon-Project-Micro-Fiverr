const mongoose = require('mongoose');
require('dotenv').config({ path: './back-end/.env' });

const MONGO_URI = process.env.MONGO_URI;
console.log('Testing connection to:', MONGO_URI.replace(/:([^@]+)@/, ':****@'));

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB');
    process.exit(0);
  })
  .catch(err => {
    console.error('Connection error:', err);
    process.exit(1);
  });
