const express = require("express");
const router = express.Router();
// const verify = require("./verifyToken");

function verify(req, res, next) {
  //when we assigned the token at the same time we send it as a response in the header so we get access to it in the  middleware (when users logs in)
  const token = req.header("auth-token");
  //auth-token is the name that we had given
  if (!token) return res.status(401).send("Access Denied");

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    //we would again need that secret which only we have at our database
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send("Invalid Token");
  }
}

//now we shall protect the route by adding the verify token
router.get("/", verify, (req, res) => {
  res.json({
    posts: {
      title: "confidential",
      description: "Don't touch if not authorised "
    }
  });
  // res.send(req.user);
});

module.exports = router;
