// lib/db.js
//
// Serverless-safe database connection.
// Vercel functions can be invoked concurrently across many cold
// starts, so we cache the connection on the global object to avoid
// exhausting MongoDB's connection limit.
//
// >>> If your existing site already has a db connection helper,
// >>> DELETE this file and import your existing one instead in the
// >>> api/ files below. Do not run two separate DB layers side by side.

const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  // Fail loudly at import time rather than silently writing nowhere.
  console.error('[db] MONGODB_URI is not set. Refusing to start payment endpoints without a database.');
}

let cached = global.__razorpayDbConn;
if (!cached) {
  cached = global.__razorpayDbConn = { conn: null, promise: null };
}

async function connectDb() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        maxPoolSize: 5,
        serverSelectionTimeoutMS: 8000,
      })
      .then((m) => m);
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }

  return cached.conn;
}

module.exports = { connectDb };
