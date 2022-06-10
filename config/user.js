const Sequelize = require("sequelize")
const sequelize = require("./DB")

const User = sequelize.define("users", {
    username: {
        type: Sequelize.STRING,
        allowNull: false
    }, email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    }, pword: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    }
},
    {
        timestamps: false,
        createdAt: false,
        updatedAt: false
    });

module.exports = User;