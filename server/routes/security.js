const { Router } = require("express");
const jwt = require("jsonwebtoken");
const postmark = require("postmark");
const { sendMailTest } = require("../libs/email");
const emailProvider = new postmark.ServerClient(process.env.POSTMARK_API_TOKEN);


module.exports = function (userService, factory) {
  const router = Router();

  router.get('/login', (req, res) => {
    const providers = factory.getProviders();
    let html = `
      <h1>Login</h1>
    `;
  
    providers.forEach((provider) => {
      html += `<a href="${provider.getAuthorizationUrl()}">Login with ${provider.constructor.getName()}</a><br>`;
    });
  
    res.send(html);
  });

  router.post("/login", async function (req, res) {
    const { email, password } = req.body;
    //const [user] = await userService.findAll({ email });
    const user = await userService.findBy({ email });
    if (!user) {
      return res.sendStatus(401);
    }
    if (!user.checkPassword(password)) {
      return res.sendStatus(401);
    }

    //create a token with jwt for email verification
    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });


    emailProvider.sendEmail({
      "From": process.env.POSTMARK_FROM,
      "To": user.email,
      "Subject": "Email verification",
      //"HtmlBody": "<html><body><h1>Click on the link below to verify your email</h1><a href='http://localhost:3000/users/verify/" + token + "'>Verify your email</a></body></html>",
      "TextBody": "Click on the link below to verify your email http://localhost:3000/users/verify/" + token,
      //"MessageStream": "outbound"
    });
   

    sendMailTest(
      "charles258@hotmail.fr", 
      "Reset password", 
      "Click on the link below to reset your password http://localhost:3000/forgot-password/reset/" + token, 
      "Click on the link below to reset your password http://localhost:3000/forgot-password/reset/" + token
    );

    res.json({ token: user.generateToken() });
  });

  router.get("/verify/:token", async function (req, res) {
    try {
      const { email } = jwt.verify(req.params.token, process.env.JWT_SECRET);
      const user = await userService.findBy({ email });
      if (!user) {
          return res.sendStatus(401);
      }
      if (user.isVerified) {
          return res.json({ message: "Already verified" });
      }
      user.isVerified = true;
      await user.patch(
          { id: user.id },
          { isVerified: true }
      );
      return res.json({ message: "Email verified" });
    } catch (error) {
      return res.sendStatus(401);
    }
  });

  router.post("/forgot-password", async function (req, res) {
    const { email } = req.body;
    const user = await userService.findBy({ email });

    if (!user) {
      return res.sendStatus(401);
    }

    //create a token with jwt for email verification
    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });


    emailProvider.sendEmail({
      "From": process.env.POSTMARK_FROM,
      "To": "charles258@hotmail.fr", //user.email,
      "Subject": "Reset password",
      "HtmlBody": "<html><body><h1>Click on the link below to verify your email</h1><a href='http://localhost:3000/forgot-password/verify/" + token + "'>Verify your email</a></body></html>",
      "TextBody": "Click on the link below to verify your email http://localhost:3000/forgot-password/verify/" + token,
      //"MessageStream": "outbound"
    });

    return res.json({ message: "Email sent" });
  });

  router.get("/forgot-password/verify/:token", async function (req, res) {
    //verify the token
    try {
      const { email } = jwt.verify(req.params.token, process.env.JWT_SECRET);
      const token = jwt.sign({ email: email }, process.env.JWT_SECRET, {
        expiresIn: "15min",
      });
      return res.json({ token });
    } catch (error) {
      return res.sendStatus(401);
    }
  });


  router.patch("/password-reset/:token", async function (req, res) {

    try {
      const { email } = jwt.verify(req.params.token, process.env.JWT_SECRET);
      const user = await userService.findBy({ email: email });
      if (req.body.password === undefined || req.body.password === "") {
        return res.sendStatus(401); 
      }
      //update the password;
      const [updatedUser] = await userService.update(
        { id: parseInt(user.id) },
        { password: req.body.password }
      );
      if (!updatedUser) return res.sendStatus(401);
      return res.json(updatedUser);
    } catch (error) {
      return res.sendStatus(401);
    }
  });

  return router;
};
