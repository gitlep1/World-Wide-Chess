const db = require("../db/dbConfig.js");

const getAllMonthlyTasksByUserID = async (userID) => {
  const tasks = await db.any(
    "SELECT * FROM monthly_tasks WHERE user_id = $1",
    userID
  );
  return tasks;
};

const createMonthlyTask = async (newTaskData, user_id) => {
  const newTask = await db.one(
    "INSERT INTO monthly_tasks (task_name, task_current, task_total, task_category, user_id, completed) VALUES($1, $2, $3, $4, $5, $6)",
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

const updateMonthlyTask = async (id, updatedTaskData) => {
  const updateTask = await db.one(
    "UPDATE monthly_tasks SET task_current = $1, completed = $2 WHERE id = $3 RETURNING *",
    [updatedTaskData.task_current, updatedTaskData.completed, id]
  );
  return updateTask;
};

const deleteMonthlyTask = async (id) => {
  if (id === null || id === undefined) {
    return false;
  }

  const deleteTask = await db.one(
    "DELETE FROM monthly_tasks WHERE id = $1",
    id
  );
  return deleteTask;
};

module.exports = {
  getAllMonthlyTasksByUserID,
  createMonthlyTask,
  updateMonthlyTask,
  deleteMonthlyTask,
};
