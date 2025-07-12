// backend/seedTags.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Tag from './models/tagModel.js';
import connectDB from './config/db.js';

dotenv.config();
await connectDB();

const tags = [
  { name: 'javascript' },
  { name: 'react' },
  { name: 'nodejs' },
  { name: 'mongodb' },
  { name: 'html' },
  { name: 'css' },
];

try {
  await Tag.deleteMany(); // Optional: Clear old tags
  await Tag.insertMany(tags);
  console.log('✅ Tags seeded successfully!');
  process.exit();
} catch (error) {
  console.error('❌ Error seeding tags:', error);
  process.exit(1);
}
