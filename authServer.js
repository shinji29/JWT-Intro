const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();

let refreshTokens = [];

const PORT = process.env.PORT2 || 4000;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

const app = express();
app.use(express.json());

function generateAccessToken(user) {
  return jwt.sign(user, ACCESS_TOKEN_SECRET, { expiresIn: "30s" });
}

app.delete("/logout", (req, res) => {
  refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
  return res.sendStatus(204);
});

app.post("/token", (req, res) => {
  const refreshToken = req.body.token;

  if (refreshToken == null) return res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);

  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (error, user) => {
    if (error) return res.sendStatus(403);
    const accessToken = generateAccessToken({
      username: user.username,
      password: user.password,
    });
    res.json({ accessToken: accessToken });
  });
});

app.post("/login", (req, res) => {
  const uName = req.body.username;
  const pwd = req.body.password;

  const user = {
    username: uName,
    password: pwd,
  };

  const accessToken = generateAccessToken(user);
  const refreshToken = jwt.sign(user, REFRESH_TOKEN_SECRET);
  refreshTokens.push(refreshToken);

  return res.json({
    accessToken: accessToken,
    refreshToken: refreshToken,
  });
});

app.listen(PORT, () => {
  console.log(`Auth-Server listening on port ${PORT}`);
});
