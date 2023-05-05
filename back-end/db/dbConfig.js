const pgp = require("pg-promise")();
require("dotenv").config();

const { DATABASE_URL, PG_HOST, PG_DATABASE, PG_USER, PG_PASSWORD, PG_PORT } =
  process.env;

const cn = DATABASE_URL
  ? {
      connectionString: DATABASE_URL,
      max: 30,
      ssl: {
        rejectUnauthorized: false,
      },
    }
  : {
      host: PG_HOST,
      database: PG_DATABASE,
      user: PG_USER,
      password: PG_PASSWORD,
      port: PG_PORT,
    };

const db = pgp(cn);

module.exports = db;
