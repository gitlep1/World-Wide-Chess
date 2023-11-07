const schedule = require("node-schedule");
const db = require("./dbConfig");

// delete guest token & data after 1 day
schedule.scheduleJob("0 0 * * *", async () => {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  await db.any("DELETE FROM sessions WHERE type = $1 AND created_at < $2", [
    "guest",
    oneDayAgo,
  ]);
});

// delete user token after 30 days
schedule.scheduleJob("0 0 * * 0", async () => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  await db.any("DELETE FROM sessions WHERE type = $1 AND last_accessed < $2", [
    "user",
    thirtyDaysAgo,
  ]);
});
