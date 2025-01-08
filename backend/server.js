const express = require("express");
const bodyParser = require("body-parser");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT;
const MONGO = process.env.MONGO_URI;
const mongoose = require("mongoose");

const recipeRoutes = require("./routes/recipe");
const userRoutes = require("./routes/user");

//cors
const cors = require("cors");
app.use(cors());

//middleware
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json());
app.use((res, req, next) => {
  console.log(res.body);
  next();
});
app.get("/test-compression", (req, res) => {
  res.send("A".repeat(100000));
});
//routes

app.use("/recipe", recipeRoutes);
app.use("/user", userRoutes);

//connect to db
console.log(MONGO);
mongoose
  .connect(MONGO, {
    dbName: "Epicure",
  })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/", (req, res) => {
  console.log("Bucket Name:", process.env.AWS_S3_BUCKET_NAME);
  res.send("Hello World");
  // res.send("Bucket Name:", process.env.AWS_S3_BUCKET_NAME);
});
