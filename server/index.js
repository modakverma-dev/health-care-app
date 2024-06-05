const fs = require("fs");
// Express App Setup
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { validateSession } = require("./utils/validations");
const app = express();
app.use(cors());
app.use(bodyParser.json());
const { pgClient } = require("./db");
const authRoutes = require("./routes/auth");
const tokenRoutes = require("./routes/appointments");
const hospitalRoutes = require("./routes/hospital");
const homeRoutes = require("./routes/home");
const { extractToken } = require("./middlewares");

fs.readFile("./db/schema.sql", "utf8", (err, data) => {
  if (err) {
    console.error("Error reading schema.sql", err);
    return;
  }
  pgClient.connect((err, client, done) => {
    if (err) {
      console.error("Error fetching client from pool", err);
      return;
    }
    client.query(data, (err) => {
      done();
      if (err) {
        console.error("Error executing sql schema", err);
        return;
      }
      console.log("schema created successfully !");
    });
  });
});

// Express route handlers
app.get("/health", extractToken, async (req, res) => {
  return res.status(200).json({
    message: "Everything is good here! 👀",
  });
});
app.use("/auth", authRoutes);
app.use("/appointment", tokenRoutes);
app.use("/hospital", hospitalRoutes);
app.use("/home", homeRoutes);

app.listen(6000, (err) => {
  console.log("Listening on PORT:", 6000);
});
