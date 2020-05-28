const express = require("express");
var cors = require("cors");
var app = express();

app.use(cors());
const mongoose = require("mongoose");
const dotenv = require("dotenv"); // this helps us to keep the pasword secret
dotenv.config();

//import Routes

const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");

//connect to db
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () =>
  console.log("Connected to database")
);

//Middlewares
app.use(express.json());

//Route Middlewares
app.use("/api/user", authRoute);
app.use("/api/posts", postRoute); //we are protecting this route

app.listen(3000, () => console.log("Server Running"));
