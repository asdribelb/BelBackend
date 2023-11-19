// src/config/session.js
import session from 'express-session';
import mongoose from 'mongoose';

const sessionConfig = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: new session.MemoryStore(), 
};

export default sessionConfig;