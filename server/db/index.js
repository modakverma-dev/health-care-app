// // Postgres Client Setup
// const { Pool } = require("pg");
const keys = require("../keys");

// const pgClient = new Pool({
//   user: keys.pgUser,
//   host: keys.pgHost,
//   database: keys.pgDatabase,
//   password: keys.pgPassword,
//   port: keys.pgPort,
//   ssl:
//     process.env.NODE_ENV !== "production"
//       ? false
//       : { rejectUnauthorized: false },
// });

// const pgClient = new Pool({
//   user: "hcapp",
//   host: "localhost",
//   database: "hcappdb",
//   password: "password",
//   port: 5432,
//   ssl:
//     process.env.NODE_ENV !== "production"
//       ? false
//       : { rejectUnauthorized: false },
// });
// module.exports = { pgClient };

const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = keys.supabaseUrl;
const supabaseKey = keys.supabaseKey;
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = { supabase };
