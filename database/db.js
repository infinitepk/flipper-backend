const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "flipper",
  password: "9059859008@Pk",
  port: 5432,
});

module.exports = pool;