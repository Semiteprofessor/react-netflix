/** @format */

const mongoose = require("mongoose");

const ListSchema = new mongoose.Schema(
	{
		title: { type: String, required: true, unique: true },
		type: { type: String },
		genre: { type: String },
		content: { type: String },
	},
	{ timestamps: true },
);

const List = mongoose.model("List", ListSchema);

module.exports = List;
