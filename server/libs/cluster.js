require("dotenv").config({ path: "../.env"});
const cluster = require("cluster");
const os = require("os");
const path = require("path");
const { logger } = require("./logger");


const cpuCount = os.cpus().length;

logger.info(`The total number of CPUs is ${cpuCount}`);
logger.info(`Primary pid=${process.pid}`);
cluster.setupPrimary({
  exec: path.join(__dirname, "..", "index.js"),
});

for (let i = 0; i < cpuCount; i++) {
  cluster.fork();
}
cluster.on("exit", (worker, code, signal) => {
  logger.info(`worker ${worker.process.pid} has been killed`);
  logger.info("Starting another worker");
  cluster.fork();
});
