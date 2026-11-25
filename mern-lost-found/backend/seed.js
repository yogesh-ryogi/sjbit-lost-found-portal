/**
 * Seed demo users and sample items.
 * Run: node seed.js  (after setting MONGO_URI in .env)
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Item = require('./models/Item');
const Claim = require('./models/Claim');
const Notification = require('./models/Notification');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 15000,
  });
  console.log('Connected. Clearing old data...');
  await Promise.all([
    User.deleteMany({}),
    Item.deleteMany({}),
    Claim.deleteMany({}),
    Notification.deleteMany({}),
  ]);

  const admin = await User.create({
    name: 'CSE Admin',
    email: 'admin@sjbit.edu',
    role: 'admin',
    password: 'Test@1234',
  });
  const ravi = await User.create({
    name: 'Ravi Kumar',
    email: 'ravi@sjbit.edu',
    usn: '1JB22CS001',
    role: 'student',
    password: 'Test@1234',
  });
  const priya = await User.create({
    name: 'Priya S',
    email: 'priya@sjbit.edu',
    usn: '1JB22CS002',
    role: 'student',
    password: 'Test@1234',
  });

  const items = await Item.insertMany([
    {
      title: 'Black leather wallet',
      description: 'Black wallet with a small scratch near the zip',
      type: 'found',
      category: 'Accessories',
      location: 'CSE Seminar Hall',
      date: new Date('2026-10-01'),
      status: 'claim_pending',
      postedBy: ravi._id,
    },
    {
      title: 'SanDisk 32GB pen drive',
      description: 'Red and black pen drive with a keychain ring',
      type: 'lost',
      category: 'Electronics',
      location: 'CSE Lab 2',
      date: new Date('2026-10-03'),
      status: 'open',
      postedBy: priya._id,
    },
    {
      title: 'College ID card',
      description: 'ID card of a 3rd year student, name starts with A',
      type: 'found',
      category: 'ID Card',
      location: 'Library entrance',
      date: new Date('2026-10-04'),
      status: 'open',
      postedBy: priya._id,
    },
    {
      title: 'Blue steel water bottle',
      description: 'Blue bottle with a sticker of a cat on the side',
      type: 'lost',
      category: 'Accessories',
      location: 'Canteen',
      date: new Date('2026-10-05'),
      status: 'open',
      postedBy: ravi._id,
    },
  ]);

  await Claim.create({
    item: items[0]._id,
    claimant: priya._id,
    proof: 'It has my college ID photo and two 100 rupee notes inside',
    status: 'pending',
  });

  await Notification.create({
    user: ravi._id,
    item: items[0]._id,
    message: 'Someone has submitted a claim on your found item: Black leather wallet',
    read: false,
  });

  console.log('Seed complete.');
  console.log('Demo accounts (password: Test@1234):');
  console.log('  admin@sjbit.edu  (admin)');
  console.log('  ravi@sjbit.edu   (student)');
  console.log('  priya@sjbit.edu  (student)');
  process.exit(0);
};

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
