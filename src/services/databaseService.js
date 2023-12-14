// databaseService.js
const { MongoClient } = require('mongodb');
require('dotenv').config();

const DB_NAME = process.env.DB_NAME
const mongoURI = process.env.MONGODB_URI;
const mongoClient = new MongoClient(mongoURI);

let usersCollection;
let textsCollection;

async function addUserToDatabase(userId, username, role="user") {
  try {
    await usersCollection.insertOne({
      userId: userId,
      username: username,
      role: role
    });

    console.log(`New user added to the database: ${userId}`);
  } catch (error) {
    console.log('Error adding new user to database: ', error)
  }
}


async function connectToDatabase() {
  
  try {
    await mongoClient.connect();
    console.log('Connected to MongoDB');
    const database = mongoClient.db(DB_NAME);
    usersCollection = database.collection('users');
    textsCollection = database.collection('texts');
  } catch (error) {
    console.error('Error connecting to MongoDB: ', error);
  }
}

async function closeDatabaseConnection() {
  try {
    await mongoClient.close();
    console.log('Closed MongoDB connection');
  } catch (error) {
    console.error('Error closing MongoDB connection: ', error);
  }
}

async function isUserInCollection(userId) {
  if (typeof userId === 'string') {
    userId = parseInt(userId);
  }
  try {
    const user = await usersCollection.findOne({ userId: userId });
    return !!user; // Returns true if the user is found, false otherwise
  } catch (error) {
    console.error('Error checking user in collection: ', error);
    return false;
  }
}

// Function to get a user by ID from the database
async function getUserById(userId) {
  return await usersCollection.findOne({ userId: parseInt(userId) });
}

// Function to get a user by username from the database
async function getUserByUsername(username) {
  return await usersCollection.findOne({ username: username });
}

// Admin caching

let adminCache = [];
let ownerCache;
// Function to initialize the admin user IDs from the database
async function initAdminCache() {
  try {
    const adminUsers = await usersCollection.find({ role: { $in: ['admin', 'owner'] } }).toArray();
    adminCache = adminUsers.map((adminUser) => adminUser.userId);
    console.log('Admin cache initialized: ', adminCache);
    for (let admin of adminUsers) {
      if (admin.role === 'owner') {
        ownerCache = admin.userId;
        console.log(`Owner cache initialized: ${ownerCache}`);
      } else { continue; }
    }
  } catch (error) {
    console.error('Error initializing admin cache: ', error);
    return false;
  }
}
// Function to update a user's role in the database and cache
async function updateRole(userId, newRole) {
  // Update the user's role in the database
  await usersCollection.updateOne({ userId: userId }, { $set: { role: newRole } });

  // Update the adminCache
  if (newRole === 'admin' && !adminCache.includes(userId)) {
    adminCache.push(userId);
  } else if (newRole !== 'admin') {
    adminCache = adminCache.filter(id => id !== userId);
  }
}

let textsCache = {};

async function initTextsCache() {
  try {
    // Assuming you have a 'texts' collection in your database
    const texts = await textsCollection.find().toArray();

    texts.forEach((text) => {
      textsCache[text.section] = text.text;
    });

    console.log('Texts cache initialized');
  } catch (error) {
    console.error('Error initializing texts cache: ', error);
  }
}

async function setTextsCollection(section, text) {
  try {
    await textsCollection.updateOne({ section: section }, { $set: { text: text } }, { upsert: true });
    textsCache[section] = text;
    console.log(`Text for section ${section} set in both collection and cache.`);
  } catch (error) {
    console.error(`Error setting text for section ${section}: `, error);
  }
}

async function getTextsCollection(section) {
  if (!textsCache[section]) {
    console.log(`No text for section ${section} found`);
    return `Текст для данного раздела ещё не добавлен. Используйте команду "/changeText ${section} [текст]" для добавления текста.`;
  }
  return textsCache[section];
}

async function getOwnerCache() {
  console.log(`owner cache: ${ownerCache}`);
  return ownerCache;
}

// Getter function for usersCollection
function getUsersCollection() {
  return usersCollection;
}

// Getter function for adminCache
function getAdminCache() {
  return adminCache;
}

module.exports = {
  addUserToDatabase,
  connectToDatabase,
  closeDatabaseConnection,
  isUserInCollection,
  initAdminCache,
  updateRole,
  getUserById,
  getUserByUsername,
  getUsersCollection,
  getAdminCache,
  initTextsCache,
  setTextsCollection,
  getTextsCollection,
  getOwnerCache
};