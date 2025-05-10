const app = require("./app");
const mongoose = require("mongoose");

const DB = process.env.DB;
mongoose
  .connect(DB)
  .then(() => console.log("Your Database Has Been Connected Successfuly"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`your server is listening on port: ${port}`);
});

module.exports = server;
