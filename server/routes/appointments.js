const { Router } = require("express");
const router = Router();
const { pgClient } = require("../db");
const keys = require("../keys");
const util = require("util");
const jwt = require("jsonwebtoken");

// Redis Client Setup
const redis = require("redis");
const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000,
});
// const redisPublisher = redisClient.duplicate();

router.get("/all", async (req, res) => {
  try {
    let finalRes = [];
    const doctorDetailsResponse = await pgClient.query(
      `SELECT * FROM doctors where doctorid=$1`,
      [4]
    );
    const { departmentid } = doctorDetailsResponse.rows[0];
    const availableTokens = await pgClient.query(
      `SELECT * from tokens where departmentid=$1`,
      [departmentid]
    );
    for (let obj of availableTokens.rows) {
      let userInfo = await pgClient.query(
        `SELECT * FROM users WHERE userid=$1`,
        [obj.userid]
      );
      delete userInfo.rows[0].password;
      delete userInfo.rows[0].sessionid;
      let userSlotInfo = await pgClient.query(
        `SELECT * FROM slots WHERE slot_id=$1`,
        [obj.slotid]
      );
      finalRes = [
        ...finalRes,
        {
          tokenId: obj.tokenid,
          ...userInfo.rows[0],
          ...userSlotInfo.rows[0],
        },
      ];
    }
    console.log(finalRes, "finalRes");
    res.status(200).json(finalRes);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal server error !",
    });
  }
});

router.post("/generate-token", async (req, res) => {
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
    const existingUser = await pgClient.query(
      `SELECT * FROM users WHERE userid=$1`,
      [user_id]
    );
    if (!existingUser.rows.length) {
      return res.status(404).json({
        message: "User not Found !",
      });
    }

    const { doctor_id, slot_id, department_id } = req.body;

    if (!doctor_id || !slot_id || !department_id) {
      return res.status(400).json({
        message: "provide required fields",
      });
    }

    const existingToken = await pgClient.query(
      `SELECT * FROM tokens WHERE userid=$1 AND departmentid=$2`,
      [user_id, department_id]
    );
    if (existingToken.rows.length) {
      return res.status(409).json({
        message: "1 Active token for user already exists !",
      });
    }

    // ** check whether doctor_id,dept_id and slot_id exists **

    const key = `department-${department_id}:doctor-${doctor_id}:slot-${slot_id}`;
    let llen = util.promisify(redisClient.llen).bind(redisClient);
    const lengthOfQueue = await llen(key);
    let lrange = util.promisify(redisClient.lrange).bind(redisClient);
    const tokenArray = await lrange(key, 0, -1);
    let alreadyContains = false;
    for (i = 0; i < tokenArray.length; i++) {
      const parseObj = JSON.parse(tokenArray[i]);
      if (parseObj.user_id === user_id) alreadyContains = true;
    }
    if (alreadyContains) {
      return res.status(409).json({
        message: "Token for user already exists",
      });
    }
    let lindex = util.promisify(redisClient.lindex).bind(redisClient);
    const lastElement = await lindex(key, 0);

    if (lengthOfQueue < 4) {
      const value = {
        user_id: user_id,
        token_no: lastElement ? JSON.parse(lastElement).token_no + 1 : 0,
      };
      await pgClient.query(
        `INSERT into tokens (userid,slotid,departmentid) VALUES($1,$2,$3);`,
        [user_id, slot_id, department_id]
      );
      await redisClient.lpush(key, JSON.stringify(value));
      // redisPublisher.publish("generate", JSON.stringify(value));
      return res.status(200).json({
        message: "Successfully generated token",
      });
    } else {
      await pgClient.query(
        `UPDATE slots SET available=false WHERE slot_id=$1`,
        [slot_id]
      );
      return res.status(409).json({
        message: "Slot queue full",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal server error !",
    });
  }
});

router.get("/all-tokens", (req, res) => {
  try {
  } catch (err) {}
});

module.exports = router;
