const { Sequelize, DataTypes } = require("sequelize");

//CREATE SEQUELIZE DB CONN with credentials

const sequelize = new Sequelize({
	database: "tech_data",
	dialect: "postgres",
	password: "root",
	username: "postgres",
	host: "localhost",
	port: 5432,
});

//CREATE TABLE

const User = sequelize.define("user", {
	userName: { type: DataTypes.STRING, allowNull: true },
	email: { type: DataTypes.STRING, allowNull: false, unique: true },
	password: {
		type: DataTypes.STRING,
		allowNull: false,
	},
});

module.exports = { sequelize, User };
