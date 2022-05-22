/** @format */

const router = require("express").Router();
const Movie = require("../models/Movie");
const verify = require("../verify-token");

// GET all movies
router.get("/", async (req, res) => {
	try {
		const movies = await Movie.find({});
		res.status(200).json(movies);
	} catch (error) {
		res.status(500).json(error);
	}
});

// GET movie 
router.get("/:id", async (req, res) => {
	try {
		const movie = await Movie.findById(req.params.id);
		res.status(200).json(movie);
	} catch (error) {
		res.status(500).json(error);
	}
});

// GET  random
router.get("/random", async (req, res) => {
	const type = req.query.type;
	let movie;
	try {
		if (type === "series") {
			movie = await Movie.aggregate([
				{
					$match: { isSeries: false },
				},
				{
					$sample: { soze: 1 },
				},
			]);
		}
		res.status(200).json(movie);
	} catch (error) {
		res.status(500).json(error);
	}
});

// CREATE Movie
router.post("/create", verify, async (req, res) => {
	if (req.user.isAdmin) {
		const newMovie = new Movie(req.body);

		try {
			const saveMovie = newMovie.save();
			res.status(200).json({
				status: "success",
				message: "Movie saved successfully",
				saveMovie,
			});
		} catch (error) {
			res.status(500).json({
				status: "error",
				message: "An error occurred while saving the movie",
				error,
			});
		}
	} else {
		res.status(403).json({
			status: "error",
			message: "You are not allowed to create movie",
		});
	}
});

// UPDATE movie by ID
router.put("/:id", verify, async (req, res) => {
	if (req.user.isAdmin) {
		try {
			const updateMovie = await Movie.findByIdAndUpdate(
				req.params.id,
				{
					$set: req.body,
				},
				{ new: true },
			);

			res.status(200).json({
				status: "success",
				message: "Movie updated successfully",
				updateMovie,
			});
		} catch (error) {
			res.status(500).json({
				status: "error",
				message: "An error occurred while updating the movie",
				error,
			});
		}
	}
});

// DELETE movie
router.delete(":id", verify, async (req, res) => {
	if (req.user.isAdmin) {
		try {
			await Movie.findByIdAndDelete(req.params.id);

			res.status(200).json({
				status: "success",
				message: "Movie deleted successfully",
			});
		} catch (error) {
			res.status(500).json({
				status: "error",
				message: "Movie deletion failed",
				error,
			});
		}
	} else {
		res.status(403).json({
			status: "error",
			message: "You are not allowed to delete movie",
		});
	}
});

module.exports = router;
