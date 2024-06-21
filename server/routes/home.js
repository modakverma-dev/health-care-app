const { Router } = require("express");
const { supabase } = require("../db");
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
    const userResult = await supabase
      .from("users")
      .select(
        `username,image,
         tokens(id,
          slotId:slots (startTime,endTime,available,created_at),
          dateId: doctor_dates (id, date)
        )`
      )
      .eq("id", user_id);
    res.status(200).json(userResult.data[0]);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
