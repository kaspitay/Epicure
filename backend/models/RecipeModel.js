const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ingredientSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  quantity:{type: Number,
    required: true},
  measurement:{type: String,
    required: true}
  // You can add more fields as needed, such as unit of measurement, notes, etc.
});

const stepsSchema = new Schema({
  description: {
    type: String,
    required: true
  },
  stepImage: {
    type: String
    },
  // You can add more fields as needed, such as unit of measurement, notes, etc.
});

const tagsSchema = new Schema({
  tag:{
    type: String,
    required: true
  },
  // You can add more fields as needed, such as unit of measurement, notes, etc.
});

const photosSchema = new Schema({
  image: String,
  // You can add more fields as needed, such as unit of measurement, notes, etc.
});

const recipeSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    ingredients: [ingredientSchema],
    steps: [stepsSchema],
    tags: [tagsSchema],
    photos: [photosSchema],
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

  },
  { timestamps: true },
  { collection: "Recipe" }
);

module.exports = mongoose.model("Recipe", recipeSchema);
