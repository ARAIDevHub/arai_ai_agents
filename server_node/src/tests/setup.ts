import { connectToMongoDB } from '../utils/mongoHandler';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongoServer: MongoMemoryServer | undefined;
// Optionally set a longer timeout here:
jest.setTimeout(30000);

beforeAll(async () => {
  // Specify a binary version that is supported on Debian 12 (>=7.0.3)
  mongoServer = await MongoMemoryServer.create({
    binary: {
      version: '7.0.3'
    }
  });
  const mongoUri = mongoServer.getUri();
  process.env.MONGODB_URI = mongoUri;
  await connectToMongoDB();
});

afterAll(async () => {
  // Disconnect Mongoose to avoid open handles.
  await mongoose.disconnect(); 
  // Stop the mongoServer only if it was started.
  if (mongoServer) {
    await mongoServer.stop();
  }
}); 