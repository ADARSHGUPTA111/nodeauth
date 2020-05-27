const router = require("express").Router();
const bcrypt = require("bcryptjs");

const User = require("../model/user");
const { registerValidation } = require("../validation");

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
    res.send(savedUser);
  } catch (err) {
    res.status(400).send(err);
  }
});
router.post("/login");

module.exports = router;
