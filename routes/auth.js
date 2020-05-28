const router = require("express").Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../model/user");
const { registerValidation, loginValidation } = require("../validation");

router.get("/register", (req, res) => {
  return res.status(200).json({
    message: "hey there "
  });
});

router.post("/register", async (req, res, next) => {
  //lets validate the data befor we make the user
  // const validation = schema.validate(req.body);
  // res.send(validation);
  // this shows only on the error part message

  //upar async use kiya hai toh inside that we can use multiple awaits (like chaining of promises)

  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //checking if the user is already in the database
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send("Email already exists");

  //hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  //create  a new user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword
  });
  try {
    const savedUser = await user.save();
    res.send({ user: user._id });
    //we want to send only the user id as the response for security reasons
  } catch (err) {
    res.status(400).send(err);
  }
});

//login

router.post("/login", async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //check if the user is there or not
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Please enter valid email");

  //check if password matches the email or not
  //user.password is the hashed password that we have kept in the database
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send("Please enter valid password");

  //create and assign a jsonwebtoken
  //jwt is just a token that helps us to prove that we had been logged in at least once
  //this token when decoded sends the id of the user same as in the database

  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  //we assign a token to the id and also use the secret token (we can also make it expire after some time)
  res.header("auth-token", token).send(token);

  //auth-token is just an identifier
});

module.exports = router;
