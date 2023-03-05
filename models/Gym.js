import mongoose from "mongoose";
import Review from "./Review.js";
const Schema = mongoose.Schema;

const GymSchema = new Schema({
  title: String,
  price: Number,
  description: String,
  location: String,
  image: String,
  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
});

GymSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: { $in: doc.reviews },
    });
  }
});

export default mongoose.model("Gym", GymSchema);
