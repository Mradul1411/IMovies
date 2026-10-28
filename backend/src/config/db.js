const mongoose = require('mongoose');
const { seedDatabase } = require('./seedData');

async function connectDB() {
  const isProd = process.env.NODE_ENV === 'production';
  const primaryUri = process.env.MONGODB_URI || (isProd ? null : 'mongodb://127.0.0.1:27017/imovies');

  if (primaryUri) {
    try {
      console.log(`Connecting to MongoDB at: ${primaryUri.replace(/:([^:@]{4})[^:@]*@/, ':****@')} ...`);
      await mongoose.connect(primaryUri, {
        serverSelectionTimeoutMS: 5000
      });
      console.log('🚀 Connected to MongoDB instance successfully.');
      await seedDatabase();
      return;
    } catch (err) {
      console.warn(`⚠️ Could not connect to primary MongoDB (${err.message}).`);
      if (isProd) {
        throw new Error(
          'Production MongoDB connection failed. Please ensure a valid MONGODB_URI (e.g. MongoDB Atlas cluster) is configured in your environment variables.'
        );
      }
    }
  }

  // In development / local testing: graceful fallback to in-memory MongoDB
  console.log('🔄 Spinning up embedded in-memory MongoDB server for seamless zero-setup execution...');
  try {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create();
    const inMemoryUri = mongod.getUri();
    console.log(`✨ In-memory MongoDB started at: ${inMemoryUri}`);

    await mongoose.connect(inMemoryUri);
    console.log('🚀 Connected to in-memory MongoDB instance successfully.');
    await seedDatabase();
  } catch (memErr) {
    console.error('❌ Failed to start in-memory MongoDB:', memErr.message);
    throw memErr;
  }
}

module.exports = connectDB;
