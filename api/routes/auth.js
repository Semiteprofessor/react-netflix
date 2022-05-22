/** @format */

const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const { check, validationResult } = require("express-validator");

// REGISTER user
router.post(
	"/register",
	check("name", "Name is required").notEmpty(),
	check("email", "Please include a valid email").isEmail(),
	check(
		"password",
		"Please enter a password with 6 or more characters",
	).isLength({ min: 6 }),
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		const avatar = gravatar.url(req.body.email, {
			s: "200", // Sized
			r: "pg", // Rating
			d: "mm", //Default
		});
		const newUser = new User({
			name: req.body.name,
			username: req.body.username,
			email: req.body.email,
			avatar,
			password: CryptoJS.AES.encrypt(
				req.body.password,
				process.env.SECRET_KEY,
			).toString(),
		});
		const alreadyInUse = await User.findOne({ email: req.body.email });
		if (alreadyInUse) {
			return res.status(400).json({ email: "Email already in use" });
		}
		try {
			const user = await newUser.save();
			res.status(200).json({
				status: "success",
				message: "User registered successfully",
				user,
			});
		} catch (error) {
			res.status(500).json({
				status: "error",
				message: "User registered error",
			});
		}
	}, 
);

// LOGIN
router.post("/login", async (req, res) => {
	try {
		const user = await User.findOne({
			email: req.body.email,
		});
		!user &&
			res.status(400).json({
				status: "error",
				message: "Invalid username or password",
			});
		const bytes = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY);
		const originalPassword = bytes.toString(CryptoJS.enc.Utf8);

		originalPassword !== req.body.password &&
			res.status(400).json({ status: "error", message: "Invalid credentials" });

		const accessToken = jwt.sign(
			{ id: user._id, isAdmin: user.isAdmin },
			process.env.SECRET_KEY,
			{ expiresIn: "48h" },
		);

		const { password, ...info } = user._doc;
		res.status(200).json({
			status: "success",
			message: "Login successful",
			...info,
			accessToken,
		});
	} catch (error) {
		res.status(500).json({
			status: "error",
			message: "Login failed",
		});
	}
});

module.exports = router;
