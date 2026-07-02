import express from "express";
import cors from 'cors';

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({extended: true, limit: "16kb"}))


// Import routes
import urlRoutes from './routes/url.route.js';


// Routes declaration
app.use('/url', urlRoutes);


export {app}