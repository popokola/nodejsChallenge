require("dotenv").config();
const { connection } = require("./db");

connection.sync({ force: true }).then(() => {
  console.log("Database synchronized");
  connection.close();
});
