const express = require("express");
const jwt = require("jsonwebtoken");
const monthly = express.Router();

const { getUserByID } = require("../queries/users");
const { getAllBots } = require("../queries/bots");

const {
  Wins,
  Games,
  Online,
  Messages,
  Friends,
  AnyBotWins,
  EasyBotWins,
  MediumBotWins,
  HardBotWins,
} = require("../taskPool");

const {
  getAllMonthlyTasksByUserID,
  createMonthlyTask,
  updateMonthlyTask,
  deleteMonthlyTask,
} = require("../queries/monthlyTasks");

const { requireAuth } = require("../validation/requireAuth");
const { scopeAuth } = require("../validation/scopeAuth");

monthly.get(
  "/",
  requireAuth(),
  scopeAuth(["read:user", "write:user"]),
  async (req, res) => {
    const { token } = req.user;
    const decoded = jwt.decode(token);
    const userID = decoded.user.id;

    const checkIfUserExists = await getUserByID(userID);

    if (!checkIfUserExists) {
      return res
        .status(404)
        .json({ error: `User with ID: ${userID} not found` });
    }

    if (checkIfUserExists.is_guest) {
      return res.status(400).json({
        error: `Create an account to complete daily and monthly tasks for rewards.`,
      });
    }

    const getUsersMonthlyTasks = await getAllMonthlyTasksByUserID(
      checkIfUserExists.id
    );

    if (!getUsersMonthlyTasks) {
      return res.status(404).json({
        error: `Monthly tasks not found for user with ID: ${checkIfUserExists.id}`,
      });
    }

    return res.status(200).json({ payload: getUsersMonthlyTasks });
  }
);

monthly.post("/", requireAuth(), async (req, res) => {
  const { token } = req.user;
  const decoded = jwt.decode(token);

  const checkIfUserExists = await getUserByID(decoded.user.id);

  if (!checkIfUserExists) {
    return res
      .status(404)
      .json({ error: `User with ID: ${checkIfUserExists.id} not found` });
  }

  if (checkIfUserExists.is_guest) {
    return res.status(400).json({
      error: `Create an account to complete monthly and monthly tasks for rewards.`,
    });
  }

  const getUsersMonthlyTasks = await getAllMonthlyTasksByUserID(
    checkIfUserExists.id
  );

  if (getUsersMonthlyTasks.length === 4) {
    return;
  }

  const taskPool = [
    Wins,
    Games,
    Online,
    Messages,
    Friends,
    AnyBotWins,
    EasyBotWins,
    MediumBotWins,
    HardBotWins,
  ];
  const usersTasks = [];

  while (usersTasks.length < 4) {
    const randomTaskCategory =
      taskPool[Math.floor(Math.random() * taskPool.length)];

    const randomTask =
      Object.keys(randomTaskCategory)[
        Math.floor(Math.random() * Object.keys(randomTaskCategory).length)
      ];

    const selectedTask = randomTaskCategory[randomTask];

    const numberInName = selectedTask.name.match(/\d+/);
    const updatedNumber = numberInName * 10;
    const updatedTaskName = selectedTask.name.replace(/\d+/, updatedNumber);

    const newTaskData = {
      task_name: updatedTaskName,
      task_current: selectedTask.current,
      task_total: selectedTask.total * 10,
      task_category: selectedTask.category,
      completed: false,
    };
    usersTasks.push(newTaskData);
    const createTask = await createMonthlyTask(
      newTaskData,
      checkIfUserExists.id
    );

    if (!createTask) {
      return res.status(400).json({
        ERROR: `Task has not been created for user with ID: ${checkIfUserExists.id}`,
      });
    }
  }

  return res.status(200).json({ payload: usersTasks });
});

monthly.put(
  "/",
  requireAuth(),
  scopeAuth(["read:user", "write:user"]),
  async (req, res) => {
    const { token } = req.user;
    const decoded = jwt.decode(token);

    const checkIfUserExists = await getUserByID(decoded.user.id);

    if (!checkIfUserExists) {
      return res
        .status(404)
        .json({ error: `User with ID: ${checkIfUserExists.id} not found` });
    }

    const getUsersMonthlyTasks = await getAllMonthlyTasksByUserID(
      checkIfUserExists.id
    );

    const getBots = await getAllBots();
    const oldUserData = req.body;

    for (const task of getUsersMonthlyTasks) {
      if (!task.completed) {
        switch (task.task_category) {
          case "wins":
            const newUserWins = checkIfUserExists.wins;
            const oldUserWins = oldUserData.oldWins;

            if (newUserWins === oldUserWins + 1) {
              console.log("user won a match");

              if (task.task_current === task.task_total) {
                console.log("task completed");
                task.completed = true;
              }

              const updatedTaskData = {
                task_current: task.task_current + 1,
                completed: task.completed,
              };

              await updateMonthlyTask(task.id, updatedTaskData);
            }
            break;

          case "games":
            // console.log("games");
            // Add code for the "games" category
            break;

          case "online":
            // console.log("online");
            // Add code for the "online" category
            break;

          case "messages":
            // console.log("messages");
            // Add code for the "messages" category
            break;

          case "friends":
            // console.log("friends");
            // Add code for the "friends" category
            break;

          case "anybot":
            // console.log("anybot");
            // Add code for the "anybot" category
            break;

          case "easybot":
            // console.log("easybot");
            // Add code for the "easybot" category
            break;

          case "mediumbot":
            // console.log("mediumbot");
            // Add code for the "mediumbot" category
            break;

          case "hardbot":
            // console.log("hardbot");
            // Add code for the "hardbot" category
            break;

          default:
          // console.log("Unknown category");
          // Add code for handling unknown categories
        }
      }
    }
  }
);

monthly.delete(
  "/",
  requireAuth(),
  scopeAuth(["read:user", "write:user"]),
  async (req, res) => {
    const { token } = req.user;
    const decoded = jwt.decode(token);

    const checkIfUserExists = await getUserByID(decoded.user.id);

    if (!checkIfUserExists) {
      return res
        .status(404)
        .json({ error: `User with ID: ${checkIfUserExists.id} not found` });
    }
  }
);

module.exports = monthly;
