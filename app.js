import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";
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
app.use(bodyParser.json());

app.get("/gyms", async (req, res) => {
  const gyms = await Gym.find({});
  res.send({ gyms });
});

app.post("/gyms/new", async (req, res) => {
  const gym = new Gym(req.body);
  await gym.save();
  res.send(gym._id);
});

app.get("/gyms/:id", async (req, res) => {
  const gym = await Gym.findById(req.params.id);
  res.send({ gym });
});

app.post("/gyms/:id/update", async (req, res) => {
  const gym = await Gym.findByIdAndUpdate(req.params.id, { ...req.body });
  res.send(gym._id);
});

app.get("/gyms/:id/delete", async (req, res) => {
  const gym = await Gym.findByIdAndDelete(req.params.id);
  res.status(200).send("ok");
});

app.get("/", (req, res) => {
  res.send("express app is answering");
});
app.listen(3001, () => {
  console.log("backend yelpgym serving on port 3001");
});
