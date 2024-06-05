const { pgClient } = require("../db");

const isValidEmail = (email) => {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
};
const isValidPassword = (password) => {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
    password
  );
};

const validateSession = async (sessionId) => {
  try {
    const result = await pgClient.query(
      "SELECT * FROM users WHERE sessionId=$1;",
      [sessionId]
    );
    if (result.rowCount === 0) {
      return null;
    } else {
      return {
        userName: result.rows[0].username,
      };
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  isValidEmail,
  isValidPassword,
  validateSession,
};
