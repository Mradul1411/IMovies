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
      return true;
    } catch (err) {
      console.warn(`⚠️ Could not connect to primary MongoDB (${err.message}).`);
      if (isProd) {
        console.warn('👉 Please verify MONGODB_URI in Render and ensure Network Access (0.0.0.0/0) is allowed in MongoDB Atlas.');
        return false;
      }
    }
  }

  // In development / local testing: graceful fallback to in-memory MongoDB
  try {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    console.log('🔄 Spinning up embedded in-memory MongoDB server for seamless zero-setup execution...');
    const mongod = await MongoMemoryServer.create();
    const inMemoryUri = mongod.getUri();
    console.log(`✨ In-memory MongoDB started at: ${inMemoryUri}`);

    await mongoose.connect(inMemoryUri);
    console.log('🚀 Connected to in-memory MongoDB instance successfully.');
    await seedDatabase();
    return true;
  } catch (memErr) {
    console.warn('⚠️ In-memory MongoDB not available in production without devDependencies.');
    console.warn('👉 Server running in standby mode. Please set MONGODB_URI in your Render environment variables to activate full database functionality.');
    return false;
  }
}

module.exports = connectDB;
