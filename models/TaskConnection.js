const mongoose = require("mongoose");

const taskConnectionSchema = new mongoose.Schema(
  {
    taskType: {
      type: String,
    },
    task: {
      type: String,
    },
    methodology: {
      type: String,
    },
    number: {
      type: Number,
    },
    threeMonths: {
      type: Number,
    },
    sixMonths: {
      type: Number,
    },
    oneYear: {
      type: Number,
    },
    aboveOneYear: {
      type: Number,
    },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

const TaskConnection = mongoose.model("tasksConnection", taskConnectionSchema);

module.exports = TaskConnection;
