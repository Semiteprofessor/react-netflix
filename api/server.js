/** @format */

require("dotenv").config();
const express = require("express");
const app = express();
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const movieRoutes = require("./routes/movies");

connectDB();

// Middlewarek 
app.use(express.json());
app.use("/api", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/movies", movieRoutes);

app.get("/", (req, res) => {
	res.send({ message: "API running..." });
});

app.get("/", (req, res) => {
	res.sendFile("/");
});

const PORT =  5000 || process.env.PORT;

app.listen(PORT, () =>
	console.log(`Server running on http://localhost:${PORT}`),
);
