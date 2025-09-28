import express from "express";
import http from 'http';
import { config } from 'dotenv';
import mongoose from "mongoose";
import cors from 'cors';
config();

// Routes
import shipmentRouter from './Routes/Shipment.js';

const port = Number(process.env.PORT) || 3000;
const app = express();
const server = http.createServer(app);

// Database connection
const dbConncetion = async () => {
    try {
        const conncetion = await mongoose.connect(String(process.env.DATABASE_CONNECTION_STRING));
    } catch(err) {
        console.log(err);
        process.exit();
    }
}
await dbConncetion();

// Middelware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
    origin: '*'
}));

app.get('/', (req, res) => {
    res.json({ text: 'Hello World' });
})

app.use('/api', shipmentRouter);

server.listen(port, () => {
    console.log(`server running on:http://localhost:${port}`);
})