// TASK 3: Restaurant Management System 
// ● Set up backend using Django or Express.js to handle restaurant operations (orders, tables, inventory). 
// ● Design database models for menu items, orders, tables, reservations, and inventory. 
// ● Create APIs for placing orders, reserving tables, updating inventory, and viewing menu. 
// ● Implement logic for order processing, table availability check, and inventory auto-update. 
// ● Optional: Add reporting features (e.g., daily sales, stock alerts) and admin access panel. 

import { app } from './app.js';
import dotenv from 'dotenv';
import { connectDB } from './db/db.js';


dotenv.config({
    path: './.env'
})


connectDB()
.then(() => {
    app.listen(process.env.PORT || 3000, () => {
        console.log(`Server is running at port : ${process.env.PORT}`);
    })
})
.catch((error) => {
    console.log("MongoDB connection failed : ", error);
})
