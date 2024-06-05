const { Router } = require("express");
const { pgClient } = require("../db");
const router = Router();
const jwt = require("jsonwebtoken");

router.get("/", async (req, res) => {
  try {
    const bearerToken = req.headers["authorization"];
    if (!bearerToken) {
      return res?.status(401).json({
        message: "Unauthorized",
      });
    }
    let user_id = null;
    const token = bearerToken.slice("Bearer ".length);
    jwt.verify(token, "PRIVATE_TOKEN_KEY", (err, decoded) => {
      if (err) {
        console.error(err);
      } else {
        user_id = decoded.userid;
      }
    });
    if (!user_id) {
      return res.status(401).json({
        message: "User not found! Unauthorized access",
      });
    }
    const userResult = await pgClient.query(
      `SELECT * FROM(SELECT u.*,t.tokenid FROM users u LEFT JOIN tokens t ON u.userid=t.userid) WHERE userid=$1;`,
      [user_id]
    );
    const result = await pgClient.query(
      `SELECT end_time FROM slots s JOIN (SELECT * FROM(SELECT u.*,t.tokenid,t.slotid FROM users u LEFT JOIN tokens t ON u.userid=t.userid) WHERE userid=$1) ut ON s.slot_id=ut.slotid;`,
      [user_id]
    );
    if (!userResult.rows.length) {
      return res.status(404).json({
        message: "user not found!",
      });
    }
    delete userResult.rows[0].password;
    delete userResult.rows[0].sessionid;
    res
      .status(200)
      .json({
        ...userResult.rows[0],
        token_lifetime: result.rows[0] ? result.rows[0].end_time : null,
      });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
