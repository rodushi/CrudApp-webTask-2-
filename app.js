const mysql = require("mysql");
const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const helmet = require("helmet");
const morgan = require("morgan");
const sequelize = require('./config/DB')
const User = require("./config/user")
const Post = require("./config/post")
const auth = require("./Api/users/Authentication/user")
const post = require("./Api/users/Authentication/Post")
app.listen(3000, () => console.log("express server is running at port 3000"));

app.use(express.json());
app.use(helmet());
app.use(morgan("common"));


app.use("/auth",auth)
app.use("/",post)

 User.hasMany(Post,{
      onDelete : "CASCADE"
 })

sequelize.sync();

app.get("/",(req,res)=>{
  res.send("This is home page")
})

console.log("All models were synchronized successfully.");