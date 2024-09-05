const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const PORT = process.env.PORT || 3000;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

const posts = [
  {
    username: "nirmit64",
    password: "pwd12345",
    title: "User #1",
  },
  {
    username: "john65",
    password: "pwd12346",
    title: "User #2",
  },
  {
    username: "jim66",
    password: "pwd12347",
    title: "User #3",
  },
];

const app = express();
app.use(express.json());

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, ACCESS_TOKEN_SECRET, (error, user) => {
    if (error) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.get("/posts", authenticateToken, (req, res) => {
  return res.json(posts.filter((post) => post.username === req.user.username));
});

app.post("/login", (req, res) => {
  const uName = req.body.username;
  const pwd = req.body.password;

  const user = {
    username: uName,
    password: pwd,
  };

  const accessToken = jwt.sign(user, ACCESS_TOKEN_SECRET);
  return res.json({
    accessToken: accessToken,
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
