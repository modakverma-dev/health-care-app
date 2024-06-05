const jwt = require("jsonwebtoken");
const { pgClient } = require("../db");

const generateTokens = async (user) => {
  console.log(user, user.userid);
  try {
    const payload = { userid: user.userid };
    const accessToken = jwt.sign(payload, "PRIVATE_TOKEN_KEY", {
      expiresIn: "30d", // 14m,
    });
    const refreshToken = jwt.sign(payload, "PRIVATE_TOKEN_KEY", {
      expiresIn: "30d",
    });
    const result = await pgClient.query(`SELECT * FROM users WHERE userid=$1`, [
      user.userid,
    ]);
    if (result.rows[0].userid) {
      await pgClient.query(`UPDATE users SET sessionId=$1 WHERE userid=$2`, [
        accessToken,
        user.userid,
      ]);
    }
    return Promise.resolve({ accessToken, refreshToken });
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

module.exports = generateTokens;
