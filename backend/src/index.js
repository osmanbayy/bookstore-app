import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import "dotenv/config";
import authRoutes from './routes/authRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT} port.`);
});