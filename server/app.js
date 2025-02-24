import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import ratesRouter from './src/routes/rates.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', ratesRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
