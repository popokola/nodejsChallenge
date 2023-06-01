const express = require("express");
require("dotenv").config();

const app = express();
const cookieParser = require("cookie-parser");
const GenericRouter = require("./routes/genericCRUD");
const GenericController = require("./controllers/genericCRUD");
const userService = require("./services/user");
const productService = require("./services/product");
const { cookieJwtAuth } = require("./middleware/cookieJwtAuth");
const rateLimiter = require("./middleware/redisRateLimiter");
const { expressWinston, logger } = require("./libs/logger");

app.use(express.json());
app.use(cookieParser());
app.use(expressWinston);
app.use(rateLimiter.rateLimiter);
app.use(require("./routes/uploader")());

const ProviderFactory = require('./libs/providerFactory');
const config = require('./config.json');
const factory = new ProviderFactory();

// Initialize providers
Object.entries(config).forEach(([provider, value]) => {
  const { client_id, client_secret, redirect_uri } = value;
  factory.create(provider, client_id, client_secret, redirect_uri);
});


app.use(require("./routes/registration")(userService));
app.use(require("./routes/security")(userService, factory));
app.use("/products", cookieJwtAuth, new GenericRouter(new GenericController(productService)));

app.use("/users2", require("./routes/user"));
app.use("/users", cookieJwtAuth, new GenericRouter(new GenericController(userService)));


app.get("/", (req, res) => {
  logger.info("Hello world");
  res.send("Hello world");
});

app.post("/", (req, res) => {
  res.json(req.body);
});


app.get('/callback', async (req, res) => {
  const state = req.query.state;
  const provider = factory.getProvider(state);
  const token = await provider.getAccessToken(req);
  const result = await provider.validateToken(token);
  if (!result) {
    res.status(401).send('Unauthorized');
  }
  res.json(result);
});

//console.log(factory.getProviders());

app.listen(3000, () => console.log("Server started on port 3000"));
