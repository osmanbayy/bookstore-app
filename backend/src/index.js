import express from 'express';
import "dotenv/config";
import authRoutes from './routes/authRoutes.js';
import { connectDatabase } from './lib/database.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT} port.`);
  connectDatabase();
});