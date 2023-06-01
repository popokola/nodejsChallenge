require("dotenv").config({ path: "../.env"});
const expressWinston = require('express-winston');
const winston = require('winston');
require('winston-mongodb');
const path = require("path");

const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}] [${process.pid}] ${message}`;
});

const myLogFormat = printf(({ level, message, metadata }) => {
  const timestamp = //get the Paris timezone date
    new Date().toLocaleString("fr-FR", {
      timeZone: "Europe/Paris",
      }
      );

  return `${timestamp} [${level}] [${process.pid}] ${message} ${metadata ? JSON.stringify(metadata) : ''}`;
});

const logger = createLogger({
  format: combine(
    //format.colorize(),
    timestamp(),
    myFormat
  ),
  transports: [
    new winston.transports.Console({format: format.combine(format.colorize(), myFormat)}),
  ],
});


const expressLogger = expressWinston.logger({
  transports: [
    new winston.transports.MongoDB({
      db: process.env.MONGODB_URI,
      options: { useUnifiedTopology: true },
      format: winston.format.combine(format.json(), format.timestamp(), format.metadata()),
      collection: 'logs',
      level: 'warn',
    }),

    new winston.transports.File({ filename: path.join(__dirname, "..", "logs/combined.log"), level: 'info' }),
    new winston.transports.File({ filename: path.join(__dirname, "..", "logs/error.log"), level: 'error' }),
  ],

  format: winston.format.combine(format.metadata(), myLogFormat),

  statusLevels: true,
});

module.exports = {
  expressWinston: expressLogger,
  logger
};
