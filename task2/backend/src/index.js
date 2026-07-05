// TASK 2: Event Registration System 
// ● Set up backend using Django or Express.js to manage routes and logic. 
// ● Create models for events and user registrations in your database (like PostgreSQL, MongoDB etc.). 
// ● Build API endpoints to view event list, event details, and submit registration forms. 
// ● Link registrations to users and events, and allow users to manage (view/cancel) their registrations. 
// ● Optional: Add admin panel or authentication for event organizers.

import { app } from "./app.js";
import dotenv from 'dotenv';
import { connectDB } from "./db/db.js";

dotenv.config({
    path: './.env'
});

connectDB()
.then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server running on port : ${process.env.PORT}`);
    })
})

.catch((err) => {
    console.log("MongoDB connection error", err);
})