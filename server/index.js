import express from 'express';
import dotenv from 'dotenv';
import cors from "cors"
import connectDB from './config/db.js';
import authroute from "./routes/auth.js";
import productRoutes from "./routes/product.js"
import userInfoRoutes from "./routes/userinformation.js"
import subscriptionRoutes from "./routes/Subscription.js"
import deliveryRoutes from "./routes/deliveryroutes.js"
import deliveryboiRoutes from "./routes/deliveryboi.js"
dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());
app.use('/api/auth',authroute);
app.use('/api/products', productRoutes);
app.use('/api/userinfo', userInfoRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/deliveries', deliveryRoutes);
app.use('/api/deliveryboi', deliveryboiRoutes);
// app.use('/api/addtocart', deliveryboiRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
