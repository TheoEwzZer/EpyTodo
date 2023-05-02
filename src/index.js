/* eslint-disable no-console */
const express = require("express");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const app = express();

const port = process.env.PORT;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.raw());

require("./routes/user/user")(app, bcrypt);
require("./routes/todos/todos")(app, bcrypt);
require("./routes/auth/auth")(app, bcrypt);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

app.get("/", (req, res) => {
  res.status(200).json({ msg: "Welcome to EpyTodo" });
});

app.use((req, res) => {
  res.status(404).json({ msg: "Not Found" });
});
