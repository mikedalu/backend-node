// import express from "express";

const bcrypt = require("bcrypt");
const { User, sequelize } = require("./db.js");
const express = require("express");
const app = express();

app.use(express.json());

app.post("/login", async (req, res) => {
	//login route
	console.log(req.body);

	res.status(400).json({ message: "Nice one bro, " });
});

app.post("/register", async (req, res) => {
	const { firstName, email, password } = req.body;
	console.log(req.body);

	//hash password

	try {
		const hadshedPassword = await bcrypt.hash(password, 10);
		// register user

		const createUser = await User.create({ password: hadshedPassword, userName: firstName, email: email });
		res.status(201).json({ message: "User created successfully", data: createUser?.email });
	} catch (error) {
		console.log(error);
		res.status(400).json({ message: "Error registering user" });
	}
});

app.get("/user", async (req, res) => {
	try {
		const users = await User.findAll({ attributes: ["id", "userName", "email", "password"] });
		res.status(200).json({ data: users, message: "All users fetched" });
	} catch (error) {
		res.status(400).json({ message: "Error fetching users" });
	}
});

app.get("/", (req, res) => {
	return res.status(200).json({ message: "Password correct" });
});

app.listen(4000, () => {
	console.log("App running on port 4000");
	sequelize
		.sync({ force: false })
		.then((res) => console.log(res))
		.catch((err) => console.log(err));
});
