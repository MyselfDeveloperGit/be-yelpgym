import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import Gym from "./models/Gym.js";

const app = express();

const corsOptions = {
  origin: "http://localhost:3000",
};

mongoose.set("strictQuery", false);
mongoose.connect("mongodb://localhost:27017/yelpgym");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "database connection error:"));
db.once("open", () => {
  console.log("Mongo database connected");
});

app.use(cors(corsOptions));

app.get("/gyms", async (req, res) => {
  const gyms = await Gym.find({});
  res.send({ gyms });
});

app.get("/", (req, res) => {
  res.send("express app is answering");
});
app.listen(3001, () => {
  console.log("backend yelpgym serving on port 3001");
});
