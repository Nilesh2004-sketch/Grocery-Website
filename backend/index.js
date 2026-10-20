import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from "dotenv";
import { connectDB } from './config/connectDB.js';
dotenv.config();

import userRoutes from './routes/user.routes.js'
import sellerRoutes from './routes/seller.routes.js'
import productRoutes from './routes/product.routes.js'
import orderRoutes from './routes/order.routes.js';
import addressRoutes from './routes/address.routes.js';
import { connectCloudinary } from './config/cloudinary.js';

import cartRoutes from './routes/cart.routes.js'

const app = express();
connectDB();
connectCloudinary();

const allowedOrigins = ["http://localhost:5173"];

// middlewares
app.use(express.json());
app.use(cors({origin:allowedOrigins, credentials:true}));
app.use(cookieParser());

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Api Endpointes

app.use("/images", express.static(path.join(__dirname, "uploads")));
app.use("/api/user", userRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/address", addressRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

