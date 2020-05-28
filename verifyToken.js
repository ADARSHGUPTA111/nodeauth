const jwt = require("jsonwebtoken");

//here we shall make a middleware and add it to any of the routes we want to verify

module.exports = function(req, res, next) {
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
};
