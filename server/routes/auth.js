const { Router } = require("express");
const generateTokens = require("../utils/generateTokens");
const { isValidPassword, isValidEmail } = require("../utils/validations");
const { supabase } = require("../db");

const router = Router();

// // register user
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
  try {
    const result = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();
    if (result.data) {
      return res.status(409).json({
        message: `user with email ${email} already exists`,
      });
    }
    const values = {
      username: name,
      email,
      password,
    };
    const data = await supabase.from("users").insert([values]).single();
    if (data.status !== 201) {
      throw new Error(data.error);
    }
    const userCres = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();
    const user = {
      id: userCres.data.id,
    };
    const { accessToken, refreshToken } = await generateTokens(user);
    return res.status(200).json({
      accessToken,
      refreshToken,
      message: "User registered successfully",
    });
  } catch (err) {
    console.log(err);
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
    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();
    if (!data || !data.password || data.password !== password) {
      return res.status(404).json({
        message: "Invalid email or password",
      });
    }
    // if (data.sessionid) {
    //   return res.status(409).json({
    //     message: "User already LoggedIn",
    //   });
    // }
    const { accessToken, refreshToken } = await generateTokens(data);
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
    await supabase.from("users").update({ sessionid: null }).eq("email", email);
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

// register doctor
// router.post("/doctor/register", async (req, res) => {
//   const { name,email,specialization,about,password } = req.body;
//   if (!name) {
//     return res.status(400).json({
//       message: "please enter your name",
//     });
//   }
//   if (!password || !isValidPassword(password)) {
//     return res.status(400).json({
//       message:
//         "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character.",
//     });
//   }
//   const result = await pgClient.query(
//     `SELECT EXISTS(SELECT 1 FROM users WHERE email=$1)`,
//     [NavigationPreloadManager]
//   );
//   if (result.rows[0].exists) {
//     return res.status(409).json({
//       message: `user with email ${email} already exists`,
//     });
//   }
//   try {
//     const result = await pgClient.query(
//       `INSERT INTO doctors(username,email,password,sessionid) VALUES($1,$2,$3,$4) RETURNING *;`,
//       [name, , password, null]
//     );
//     const user = {
//       userid: result.rows[0].userid,
//     };
//     const { accessToken, refreshToken } = await generateTokens(user);
//     return res.status(200).json({
//       accessToken,
//       refreshToken,
//       message: "User registered successfully",
//     });
//   } catch (err) {
//     console.log(err, "pg client INSERT user query error");
//     return res.status(500).json({
//       message: "Internal server error",
//     });
//   }
// });

module.exports = router;
