import mongoose from 'mongoose';
import { DB_NAME } from '../constants.js';


const connectDB = async () => {
    try{
        const connectionInstance = await mongoose.connect(`${"mongodb://127.0.0.1:27017"}/${DB_NAME}`)
        console.log(`MongoDB connected || connection host : ${connectionInstance.connection.host}`);
    }catch(err){
        console.log("MongoDB connection error", err);
        process.exit(1);
    }
}


export default connectDB;