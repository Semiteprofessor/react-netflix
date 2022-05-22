/** @format */

const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const verify = require("../verify-token");

// GET all users
router.get("/", verify, async (req, res) => {
	const query = req.query.new;
	if (req.user.isAdmin) {
		try {
			const users = query
				? await User.find().sort({ _id: -1 }).limit(10)
				: await User.find({});
			res.status(200).json(users);
		} catch (error) {
			res.status(500).json({
				status: "error",
				message: "Can't find user",
				error,
			});
		}
	} else {
		res.status(403).json({
			status: "error",
			message: "You must be an administrator to see all users.",
		});
	}
});

// GET user by ID
router.get("/:id", verify, async (req, res) => {
	try {
		const user = await User.findById({ _id: req.params.id });
		const { password, ...info } = user._doc;
		res.status(200).json(info);
	} catch (error) {
		res.status(500).json({
			status: "error",
			message: "User not found",
			error,
		});
	}
});

// UPDATE routes
router.put("/:id", verify, async (req, res) => {
	if (req.user.id === req.params.id || req.user.isAdmin) {
		if (req.body.password) {
			req.body.password = CryptoJS.AES.encrypt(
				req.body.password,
				process.env.SECRET_KEY,
			).toString();
		}
		try {
			const updateUser = await User.findByIdAndUpdate(
				req.params.id,
				{
					$set: req.body,
				},
				{ new: true },
			);
			res.status(200).json({
				status: "success",
				message: "Updated successfully",
				updateUser,
			});
		} catch (error) {
			res.status(500).json({
				status: "error",
				message: "An error has occurred while updating the user",
				error,
			});
		}
	} else {
		res.status(403).json({
			status: "403 Forbidden",
			message: "You can update only your account!",
		});
	}
});

// DELETE users by ID
router.delete("/:id", verify, async (req, res) => {
	if (req.user.id === req.params.id || req.user.isAdmin) {
		try {
			await User.findByIdAndDelete(req.params.id);
			res.status(200).json({
				status: "success",
				message: "User deleted successfully",
			});
		} catch (error) {
			res.status(500).json({
				status: "error",
				message: "An error has occurred while deleting the user",
				error,
			});
		}
	} else {
		res.status(403).json({
			status: "error",
			message: "You can only delete your account",
		});
	}
});

// GET user statistics
router.get("/stats", async (req, res) => {
	var today = new Date();
	var lastYear = today.getFullYear(today.getFullYear() - 1);

	const months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];

	try {
		const data = await User.aggregate([
			{
				$project: {
					month: { $year: "$createdAt" },
				},
			},
			{
				$group: {
					_id: "$month",
					total: { $sum: 1 },
				},
			},
		]);
		res.status(200).json({
			status: "success",
			message: "User statistics Success",
			data,
		});
	} catch (error) {
		res.status(500).json({
			status: "error",
			message: "User statistics failed",
			error,
		});
	}
});

module.exports = router;
