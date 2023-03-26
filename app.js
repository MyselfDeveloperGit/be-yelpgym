import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import ExpressError from "./utils/ExpressError.js";
import gyms from "./routes/gyms.js";
import reviews from "./routes/reviews.js";
import session from "express-session";

const app = express();

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

mongoose.set("strictQuery", false);
mongoose.connect("mongodb://localhost:27017/yelpgym");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "database connection error:"));
db.once("open", () => {
  console.log("Mongo database connected");
});

const sessionConfig = {
  secret: "badsecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig));
app.use(cors(corsOptions));
app.use(bodyParser.json());

app.use("/gyms", gyms);
app.use("/gyms/:id/reviews", reviews);

app.get("/", (req, res) => {
  res.send("express app is answering");
});

app.all("*", (req, res, next) => {
  next(new ExpressError("This route doesn´t exist", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).send(message);
});

app.listen(3001, () => {
  console.log("backend yelpgym serving on port 3001");
});
