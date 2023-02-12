import mongoose from "mongoose";
const Schema = mongoose.Schema;

const GymSchema = new Schema({
  title: String,
  price: Number,
  description: String,
  location: String,
  image: String,
});

export default mongoose.model("Gym", GymSchema);
