const { Router } = require("express");
const generateTokens = require("../utils/generateTokens");
const { isValidPassword, isValidEmail } = require("../utils/validations");
const { pgClient } = require("../db");
const router = Router();

// register user
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name) {
    return res.status(400).json({
      message: "please enter your name",
    });
  }
  if (!email || !isValidEmail(email)) {
    return res.status(400).json({
      message: "please enter a valid email",
    });
  }
  if (!password || !isValidPassword(password)) {
    return res.status(400).json({
      message:
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character.",
    });
  }
  const result = await pgClient.query(
    `SELECT EXISTS(SELECT 1 FROM users WHERE email=$1)`,
    [email]
  );
  if (result.rows[0].exists) {
    return res.status(409).json({
      message: `user with email ${email} already exists`,
    });
  }
  try {
    const result = await pgClient.query(
      `INSERT INTO users(username,email,password,sessionid) VALUES($1,$2,$3,$4) RETURNING *;`,
      [name, email, password, null]
    );
    const user = {
      userid: result.rows[0].userid,
    };
    const { accessToken, refreshToken } = await generateTokens(user);
    return res.status(200).json({
      accessToken,
      refreshToken,
      message: "User registered successfully",
    });
  } catch (err) {
    console.log(err, "pg client INSERT user query error");
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

// login user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !isValidEmail(email)) {
      return res.status(400).json({
        message: "please enter a valid email",
      });
    }
    if (!password || !isValidPassword(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character.",
      });
    }
    const user = await pgClient.query(
      `SELECT password,userId,sessionid FROM users WHERE email=$1;`,
      [email]
    );
    if (
      !user.rows[0] ||
      !user.rows[0].password ||
      user.rows[0].password !== password
    ) {
      return res.status(404).json({
        message: "Invalid email or password",
      });
    }
    // if (user.rows[0].sessionid) {
    //   return res.status(409).json({
    //     message: "User already LoggedIn",
    //   });
    // }
    const { accessToken, refreshToken } = await generateTokens(user.rows[0]);
    res.status(200).json({
      accessToken,
      refreshToken,
      message: "Logged in successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

// logout user
router.post("/logout", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        message: "User email is required",
      });
    }
    await pgClient.query(
      `UPDATE users SET sessionid = null WHERE email = $1;`,
      [email]
    );
    res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

module.exports = router;
