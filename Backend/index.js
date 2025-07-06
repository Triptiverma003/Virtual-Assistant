    import express from 'express';
    import dotenv from 'dotenv';
    dotenv.config();
    import connectDB from './configs/db.js';
    import authRoutes from './routes/auth.routes.js';
    import cookieParser from 'cookie-parser';
    import cors from "cors";
    import userRoutes from './routes/user.routes.js';
    import geminiResponse from './gemini.js';

    const app = express ();
    app.use(cors({
        origin: "https://virtual-assistant-76zl.onrender.com",
        credentials: true
    }))
    const port = process.env.PORT || 5000;

    app.use(express.json());
    app.use(cookieParser());
    app.use("/api/auth" , authRoutes);
    app.use("/api/auth/user" , userRoutes);



    app.listen(port , ()=>{
        connectDB();
        console.log(`Server is running on port ${port}`);
    })
