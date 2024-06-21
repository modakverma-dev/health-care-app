// module.exports = {
//   // redisHost: "127.0.0.1",
//   // redisPort: 6379,
//   redisHost: process.env.REDIS_HOST,
//   redisPort: process.env.REDIS_PORT,
//   pgUser: process.env.PGUSER,
//   pgHost: process.env.PGHOST,
//   pgDatabase: process.env.PGDATABASE,
//   pgPassword: process.env.PGPASSWORD,
//   pgPort: process.env.PGPORT,
// };

module.exports = {
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseKey: process.env.SUPABASE_KEY,
};
