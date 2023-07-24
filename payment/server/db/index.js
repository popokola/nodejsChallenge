const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");

if (process.env.NODE_ENV === "test") {
  const { database } = require("../tests/testConfig");
  connection = new Sequelize({
    dialect: "sqlite",
    storage: database,
  });
} else {
  console.log(process.env.DATABASE_URL);
  connection = new Sequelize(process.env.DATABASE_URL);
}

const db = {
  connection,
};

fs.readdirSync(path.join(__dirname, "models")).forEach((file) => {
  const model = require(path.join(__dirname, "models", file))(connection);
  console.log(model.name, model.prototype.constructor.name);
  db[model.name] = model;
});

module.exports = db;
