// http://vitaly-t.github.io/pg-promise/module-pg-promise.html
const pgp = require("pg-promise")();
require("dotenv").config();

const { DATABASE_URL, PG_HOST, PG_DATABASE, PG_USER, PG_PASSWORD, PG_PORT } =
  process.env;
// https://github.com/vitaly-t/pg-promise/wiki/Connection-Syntax#configuration-object
const cn = DATABASE_URL
  ? {
      connectionString: DATABASE_URL,
      max: 30,
      ssl: {
        rejectUnauthorized: false,
      },
    }
  : {
      // DATABASE_URL: DATABASE_URL,
      host: PG_HOST,
      database: PG_DATABASE,
      user: PG_USER,
      password: PG_PASSWORD,
      port: PG_PORT,
    };

// alt from express docs
// var db = pgp('postgres://username:password@host:port/database')

const db = pgp(cn);

module.exports = db;
