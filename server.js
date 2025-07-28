const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./config/db");
const authRouter = require('./routes/authRoutes');
const postRouter = require('./routes/postRoutes');
require("dotenv").config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

connectDB();
app.use('/api/auth',authRouter);
app.use('/api/posts',postRouter);
app.listen(process.env.PORT || 5000,()=>{
    console.log(`server is listening on port ${process.env.PORT || 5000}`);
})