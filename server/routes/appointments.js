const { Router } = require("express");
const router = Router();
const { supabase } = require("../db");
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
    const tokensList = await supabase
      .from("tokens")
      .select(`id, created_at , users (username,image,dob)`)
      .eq("doctorId", 3);
    console.log(tokensList.data, "tokensList");
    res.status(200).json(tokensList.data);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal server error !",
    });
  }
});

router.get("/details", async (req, res) => {
  try {
    const alotedDates = await supabase
      .from("doctor_dates")
      .select("*,slots(startTime,endTime)")
      .eq("doctorId", 3);
    res.status(200).json(alotedDates.data);
  } catch (err) {
    console.log(err);
  }
});

router.post("/update-slots", async (req, res) => {
  try {
    console.log(req.body, "body");
    res.status(201).json({ message: "cool" });
    return;

    const { data, error } = await supabase.from("doctors_dates").insert(
      {
        doctor_id: doctorId,
        date: "2024-06-14",
      },
      { returning: "minimal" }
    );

    if (error) {
      // Handle error
    } else {
      const doctorDateId = data[0].id;

      const slotsToInsert = [
        {
          doctors_date_id: doctorDateId,
          start_time: "08:00",
          end_time: "09:00",
        },
        {
          doctors_date_id: doctorDateId,
          start_time: "09:00",
          end_time: "10:00",
        },
      ];

      const { error: slotsError } = await supabase
        .from("slots")
        .insert(slotsToInsert);
    }
  } catch (err) {
    console.log(err);
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

    const { doctor_id, slot_id, date_id } = req.body;
    console.log("called", user_id, date_id, doctor_id, slot_id);

    if (!doctor_id || !slot_id || !date_id) {
      return res.status(400).json({
        message: "provide required fields",
      });
    }

    const existingSlots = await supabase
      .from("doctor_dates")
      .select(`*, doctors(id)`)
      .select("*,slots(*)")
      .eq("id", slot_id)
      .eq("id", date_id);

    if (!existingSlots.data.length)
      return res.status(404).json({ message: "slot not found !" });

    const existingTokenForSlot = await supabase
      .from("tokens")
      .select("*")
      .eq(`slotId`, slot_id)
      .eq("dateId", date_id)
      .eq("userId", user_id);

    if (existingTokenForSlot.data.length) {
      return res.status(409).json({
        message: "1 Active token for this slot already exists !",
      });
    }

    // ** check whether doctor_id,dept_id and slot_id exists **

    const key = `doctor-${doctor_id}:date-${date_id}:slot-${slot_id}`;
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
      const generateTokenRes = await supabase.from("tokens").insert([
        {
          doctorId: doctor_id,
          dateId: date_id,
          slotId: slot_id,
          userId: user_id,
        },
      ]);
      console.log(generateTokenRes, "generateTokenRes");

      await redisClient.lpush(key, JSON.stringify(value));
      return res.status(200).json({
        message: "Successfully generated token",
      });
    } else {
      await supabase
        .from("slots")
        .update({ available: false })
        .eq("id", slot_id);
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

// module.exports.generateToken = async (socket) => {
//   socket.user = { ...socket.request.session.user };
//   socket.join(socket.user.userid);
//   await redisClient.hset(
//     `userid:${socket.user.username}`,
//     "userid",
//     socket.user.userid,
//     "connected",
//     true
//   );
// };
