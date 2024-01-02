const db = require("../db/dbConfig.js");

const getAllDailyTasksByUserID = async (userID) => {
  try {
    const tasks = await db.any(
      "SELECT * FROM daily_tasks WHERE user_id = $1",
      userID
    );
    return tasks;
  } catch (err) {
    return err;
  }
};

const createDailyTask = async (newTaskData, user_id) => {
  try {
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
  } catch (error) {
    return error;
  }
};

const updateDailyTask = async (id, updatedTaskData) => {
  try {
    const updateTask = await db.one(
      "UPDATE daily_tasks SET task_current = $1, completed = $2 WHERE id = $3 RETURNING *",
      [updatedTaskData.task_current, updatedTaskData.completed, id]
    );
    return updateTask;
  } catch (error) {
    return error;
  }
};

const deleteDailyTask = async (id) => {
  try {
    if (id === null || id === undefined) {
      return false;
    }

    const deleteTask = await db.one(
      "DELETE FROM daily_tasks WHERE id = $1",
      id
    );
    return deleteTask;
  } catch (error) {
    return error;
  }
};

module.exports = {
  getAllDailyTasksByUserID,
  createDailyTask,
  updateDailyTask,
  deleteDailyTask,
};
