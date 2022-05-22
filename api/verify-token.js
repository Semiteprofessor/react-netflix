/** @format */

const jwt = require("jsonwebtoken");

const verify = async (req, res, next) => {
	const authHeader = req.headers.token;
	if (authHeader) {
		const token = authHeader.split(" ")[1];

		jwt.verify(token, process.env.SECRET_KEY, (error, user) => {
			if (error) {
				res.status(403).json({
					status: "error",
					message: "Invalid Token",
				});
			}
			req.user = user;
			next();
		});
	} else {
		return res.status(400).json({
			status: "error",
			message: "Invalid token",
		});
	}
};

module.exports = verify;
