// import express from "express";

const bcrypt = require("bcrypt");
const { User, sequelize } = require("./db.js");
const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const dotenv = require("dotenv");
const { authenticateToken, checkIfUserExist } = require("./authMiddleware.js");
dotenv.config();
app.use(express.json());

app.post("/login", async (req, res) => {
	//login route
	const { email, password } = req.body;
	const secret = process.env.SECRET_KEY;
	try {
		const user = await User.findOne({ where: { email } });

		if (!user) {
			return res.status(404).json({ message: "User not registered" });
		}
		//check password
		const isValidPassword = await bcrypt.compare(password, user.password);
		if (!isValidPassword) {
			return res.status(401).json({ message: "Invalid password" });
		} else {
			const token = jwt.sign({ id: user.id, email: user.email }, secret, { expiresIn: "1h" });

			return res.status(200).json({ message: "Login successful", data: { accessToken: token } });
		}
	} catch (error) {
		res.status(500).json({ message: "Error logging in", error });
	}
});

app.post("/register", checkIfUserExist, async (req, res) => {
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

app.get("/users", async (req, res) => {
	try {
		const users = await User.findAll({ attributes: ["id", "userName", "email"] });
		res.status(200).json({ data: users, message: "All users fetched" });
	} catch (error) {
		res.status(400).json({ message: "Error fetching users" });
	}
});

app.get("/user", authenticateToken, (req, res) => {
	console.log(req.user);
	res.status(200).json({ message: "User authenticated", data: req.user });
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
