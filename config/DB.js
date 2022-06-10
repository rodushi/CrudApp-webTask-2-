const Sequelize = require("sequelize")

const sequelize = new Sequelize("crudapp","root","",{
  dialect:"mysql",
  host:"localhost"
})

module.exports = sequelize