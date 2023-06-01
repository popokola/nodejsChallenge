const { Router } = require("express");

module.exports = function (userService) {
  const router = Router();


  router.post("/register", async function (req, res) {
    const user = await userService.create(req.body);

    //create a token with jwt for email verification
    const jwt = require("jsonwebtoken");
    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const { emailProvider } = require("../libs/email");
    emailProvider.sendEmail({
      "From": "contact@charlesparames.com",
      "To": "charles258@hotmail.fr",
      "Subject": "Email verification",
      "HtmlBody": "<html><body><h1>Click on the link below to verify your email</h1><a href='http://localhost:3000/verify/" + token + "'>Verify your email</a></body></html>",
      "TextBody": "Click on the link below to verify your email http://localhost:3000/verify/" + token,
      //"MessageStream": "outbound"
    }); 
    return res.json(user);
  });

  return router;
};
