// lib/auth.js
//
// >>> REQUIRED WIRING <<<
// This project's real auth system was not available to inspect, so this
// file is a clearly-marked stub. Payment endpoints MUST run behind real
// authentication before going to production — an unauthenticated
// create-order endpoint lets anyone generate orders under someone else's
// account.
//
// Replace the body of getAuthenticatedUser() with a call into your
// existing session/JWT/cookie system, and return at minimum
// { id, email } for the logged-in user, or null if unauthenticated.

async function getAuthenticatedUser(req) {
  // Example if you already issue JWTs (adjust claim names to match yours):
  //
  // const jwt = require('jsonwebtoken');
  // const token = req.headers.authorization?.replace('Bearer ', '') || req.cookies?.token;
  // if (!token) return null;
  // try {
  //   const payload = jwt.verify(token, process.env.AUTH_JWT_SECRET);
  //   return { id: payload.sub, email: payload.email, role: payload.role };
  // } catch {
  //   return null;
  // }

  throw new Error(
    'lib/auth.js is a stub. Wire getAuthenticatedUser() to your existing auth system before deploying payment endpoints.'
  );
}

function isAdmin(user) {
  if (!user) return false;
  const adminIds = (process.env.ADMIN_USER_IDS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  return user.role === 'admin' || adminIds.includes(String(user.id)) || adminIds.includes(user.email);
}

module.exports = { getAuthenticatedUser, isAdmin };
