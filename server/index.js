const express = require("express");
require("dotenv").config();
const http2 = require("http2");
const fs = require("fs");
const http2Express = require('http2-express-bridge')
const path = require("path");

const app = http2Express(express);
const server = http2.createSecureServer({
  key: fs.readFileSync(path.join(__dirname, "private.pem")),
  cert: fs.readFileSync(path.join(__dirname,  "cert.pem")),
  allowHTTP1: true,
}, app);


const cookieParser = require("cookie-parser");
const GenericRouter = require("./routes/genericCRUD");
const GenericController = require("./controllers/genericCRUD");
const userService = require("./services/user");
const productService = require("./services/product");
const { cookieJwtAuth } = require("./middleware/cookieJwtAuth");
const rateLimiter = require("./middleware/redisRateLimiter");
const { expressWinston, logger } = require("./libs/logger");
const sse = require("./libs/sse");
const cheerio = require("cheerio");

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


//app.use(require("./routes/sse")());
//app.use(sse());
app.use(require("./routes/registration")(userService));
app.use(require("./routes/security")(userService, factory));
app.use("/products", cookieJwtAuth, new GenericRouter(new GenericController(productService)));

app.use("/users2", require("./routes/user"));
app.use("/users", cookieJwtAuth, new GenericRouter(new GenericController(userService)));

const Redis = require('ioredis');
let redisSubscriber = null;
app.get("/sse/:id", (req, res) => {

  if (req.httpVersionMajor === 1) {
    res.setHeader('Connection', 'keep-alive');
  }
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');


  const intervalId = setInterval(() => {
    res.write(':\n\n');
  }, 1000);

  if (!redisSubscriber) {
    redisSubscriber = new Redis(process.env.REDIS_CONN_URl);

    // Event listener for receiving messages from Redis
    redisSubscriber.on('message', (channel, message) => {
      // Send the message to the client through SSE
      const messageObject = JSON.parse(message);
      console.log(messageObject, req.params.id);

      if (messageObject.userId == req.params.id) {
        console.log( req.params.id, messageObject);
        res.write(`data: ${message}\n\n`);

      }

        
    });
  }


  // Subscribe to the Redis channel
  const channel = 'orders';

  // Subscribe to the Redis channel
  redisSubscriber.subscribe(channel);  


  res.on('close', () => {
    clearInterval(intervalId);
    res.end();
    redisSubscriber.unsubscribe(channel);
    redisSubscriber.quit();
    redisSubscriber = null;
  });

});

app.get("/", (req, res) => {
  logger.info("Hello world");
  res.send("Hello world");
});

app.post("/", (req, res) => {
  res.json(req.body);
});


app.get('/convert', require('./controllers/convert').currencyController);


app.get("/test", async (req, res) => {
  let redisPublisher = new Redis(process.env.REDIS_CONN_URl);
  res.send("Hello world");
  const response = await fetch('https://zenquotes.io/api/random');
  const data = await response.json();
  const quote = data[0].q;

  const messageObject = {
    userId: 3,
    quote,
  };

  const messageObject2 = {
    userId: 4,
    quote,
  };
  redisPublisher.publish('orders', JSON.stringify(messageObject));
  redisPublisher.publish('orders', JSON.stringify(messageObject2));
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

//app.listen(3000, () => console.log("Server started on port 3000"));
server.listen(8443, () => console.log("Server started on port 8443"));
