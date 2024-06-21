const jwt = require("jsonwebtoken");
const { supabase } = require("../db");

const generateTokens = async (user) => {
  try {
    const payload = { userid: user.id };
    const accessToken = jwt.sign(payload, "PRIVATE_TOKEN_KEY", {
      expiresIn: "30d", // 14m,
    });
    const refreshToken = jwt.sign(payload, "PRIVATE_TOKEN_KEY", {
      expiresIn: "30d",
    });
    const res = await supabase
      .from("users")
      .update({ sessionid: accessToken })
      .eq("id", user.id);
    if (res.error) throw new Error(res.error);
    return Promise.resolve({ accessToken, refreshToken });
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

module.exports = generateTokens;
