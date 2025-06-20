import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import listingRouter from "./routes/listing.route.js";
import cookieParser from "cookie-parser";
import bodyParser  from "body-parser";


dotenv.config();

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log(`Connected to the database`);
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

// app.use(express.json());
app.use(cookieParser());

app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

app.listen(3000, () => {
  console.log("Server Listening port 3000...");
});

app.use("/server/user", userRouter);
app.use("/server/auth", authRouter);
app.use("/server/listing", listingRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  // const message = err.message + " from next()" || "Internal Server Error!!";
  const message = err.message || "Internal Server Error!!";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
