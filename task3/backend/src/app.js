import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors({
    origin: process.env.CORS_ORGIN,
    credentials: true
}))

app.use(express.json({limit: '16kb'}))
app.use(express.urlencoded({limit: '16kb', extended: true}))
app.use(cookieParser())


// routes import
import userRouter from '';

// routes declaration
app.use('/api/v1/users', userRouter)


export { app }
