const mongoose = require('mongoose');
require('dotenv').config({ path: './back-end/.env' });

const MONGO_URI = process.env.MONGO_URI;

const collections = [
  'users',
  'services',
  'jobs',
  'bookings',
  'messages',
  'reviews',
  'transactions'
];

async function prepareCollections() {
  console.log('⏳ Connecting to MongoDB...');
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected successfully!');

    for (const colName of collections) {
      console.log(`📦 Creating collection: ${colName}...`);
      // MongoDB creates the collection when the first document is inserted
      // We create it and then delete the dummy document
      const collection = mongoose.connection.collection(colName);
      await collection.insertOne({ _temp: true });
      await collection.deleteOne({ _temp: true });
      console.log(`✅ ${colName} is ready.`);
    }

    console.log('\n✨ All important collections are now visible in MongoDB Compass!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    if (err.message.includes('querySrv ECONNREFUSED')) {
      console.log('\n💡 TIP: Ye error DNS ya Network ki wajah se hai.');
      console.log('1. Check karei ke aap ke internet mein MongoDB Atlas block toh nahi?');
      console.log('2. MongoDB Atlas Dashboard mein jaa kar "Network Access" mein "0.0.0.0/0" (All IPs) allow karein.');
    }
    process.exit(1);
  }
}

prepareCollections();
