const db = require("../db/dbConfig.js");

const getAllDailyTasksByUserID = async (userID) => {
  const tasks = await db.any(
    "SELECT * FROM daily_tasks WHERE user_id = $1",
    userID
  );
  return tasks;
};

const createDailyTask = async (newTaskData, user_id) => {
  const newTask = await db.one(
    "INSERT INTO daily_tasks (task_name, task_current, task_total, task_category, user_id, completed) VALUES($1, $2, $3, $4, $5, $6)",
    [
      newTaskData.task_name,
      newTaskData.task_current,
      newTaskData.task_total,
      newTaskData.task_category,
      user_id,
      newTaskData.completed,
    ]
  );
  return newTask;
};

const updateDailyTask = async (id, updatedTaskData) => {
  const updateTask = await db.one(
    "UPDATE daily_tasks SET task_current = $1, completed = $2 WHERE id = $3 RETURNING *",
    [updatedTaskData.task_current, updatedTaskData.completed, id]
  );
  return updateTask;
};

const deleteDailyTask = async (id) => {
  if (id === null || id === undefined) {
    return false;
  }

  const deleteTask = await db.one("DELETE FROM daily_tasks WHERE id = $1", id);
  return deleteTask;
};

module.exports = {
  getAllDailyTasksByUserID,
  createDailyTask,
  updateDailyTask,
  deleteDailyTask,
};
