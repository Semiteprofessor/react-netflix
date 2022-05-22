require("dotenv").config();

const connectDB = require("./config/db");
 
// Data
const userData = require("./data/users");

// Models
const User = require("./models/User");

connectDB();

const importData = async () => {
  try {
    await User.deleteMany({});

    await User.insertMany(userData);

    console.log("Data Import Success");

    process.exit();
  } catch (error) {
    console.error("Error with data import", error);
    process.exit(1);
  }
};

importData();