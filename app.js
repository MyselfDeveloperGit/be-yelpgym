import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import Gym from "./models/Gym.js";
import catchAsync from "./utils/catchAsync.js";
import ExpressError from "./utils/ExpressError.js";
import Review from "./models/Review.js";
import { gymJoiSchema, reviewSchema } from "./joiSchemas.js";

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

const validateGym = (req, res, next) => {
  const { error } = gymJoiSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

app.get(
  "/gyms",
  catchAsync(async (req, res) => {
    const gyms = await Gym.find({});
    res.send({ gyms });
  })
);

app.post(
  "/gyms/new",
  validateGym,
  catchAsync(async (req, res) => {
    const gym = new Gym(req.body.gym);
    await gym.save();
    res.send(gym._id);
  })
);

app.get(
  "/gyms/:id",
  catchAsync(async (req, res) => {
    const gym = await Gym.findById(req.params.id).populate("reviews");
    res.send({ gym });
  })
);

app.post(
  "/gyms/:id/reviews",
  validateReview,
  catchAsync(async (req, res) => {
    const gym = await Gym.findById(req.params.id);
    const review = new Review(req.body.review);
    gym.reviews.push(review);
    await review.save();
    await gym.save();
    res.send({ gym });
  })
);

app.get(
  "/gyms/:id/reviews/:reviewId",
  catchAsync(async (req, res) => {
    await Gym.findByIdAndUpdate(req.params.id, {
      $pull: { reviews: req.params.reviewId },
    });
    await Review.findByIdAndDelete(req.params.reviewId);
    res.status(200).send("review deleted");
  })
);

app.post(
  "/gyms/:id/update",
  validateGym,
  catchAsync(async (req, res, next) => {
    const gym = await Gym.findByIdAndUpdate(req.params.id, { ...req.body.gym });
    res.send(gym._id);
  })
);

app.get(
  "/gyms/:id/delete",
  catchAsync(async (req, res) => {
    const gym = await Gym.findByIdAndDelete(req.params.id);
    res.status(200).send("ok");
  })
);

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
