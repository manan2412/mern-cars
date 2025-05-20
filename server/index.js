import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';

dotenv.config()

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log(`Connected to the database`);
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();
app.use(express.json());


app.listen(3000, () => {
  console.log("Server Listening port 3000...");
});


app.use('/server/user', userRouter);
app.use('/server/auth', authRouter);