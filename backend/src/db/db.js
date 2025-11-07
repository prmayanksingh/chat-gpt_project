const mongoose = require("mongoose");

async function connectToDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("connect to MongoDB successfully")
  } catch (err) {
    console.log("Error connecting to the database",err);
  }
}

module.exports = connectToDB;
