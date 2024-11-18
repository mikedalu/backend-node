const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { User } = require("./db");

dotenv.config();
const authenticateToken = async (req, res, next) => {
	const header = req.headers["authorization"];
	const secret = process.env.SECRET_KEY;

	const token = header && header.split(" ")[1];

	if (!token) {
		return res.status(401).json({ message: "Access denied. No token provided." });
	}
	const decoded = await jwt.verify(token, secret, (error, user) => {
		if (error) {
			return res.status(401).json({ message: "Invalid token" });
		}
		req.user = user;
		next();
	});
};

const checkIfUserExist = async (req, res, next) => {
	const { email } = req.body;
	try {
		const user = await User.findOne({ where: { email } });
		if (!user) {
			next();
		} else {
			return res.status(409).json({ message: "Email already exist" });
		}
	} catch (error) {
		res.status(500).json({ message: "Internal server error" });
	}
};

module.exports = { authenticateToken, checkIfUserExist };
