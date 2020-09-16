const mongoose = require("mongoose");
const Task = require("./Task");

const userConnectionSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    reportingName: {
      type: String,
      required: true,
    },
    reportingEmail: {
      type: String,
      required: true,
    },
    shift: {
      type: String,
      required: true,
    },
    authority: {
      type: String,
      required: true,
    },
    doj: {
      type: Number,
      required: true,
    },
    eScore: {
      type: String,
      default: "NA",
    },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

userConnectionSchema.statics.check = async function (email) {
  const user = await this.findOne({ email });
  if (user) {
    return user.authority;
  } else {
    return "user";
  }
};

userConnectionSchema.statics.viewTasks = async function (email) {
  let emails = [];
  // let emails = [
  //   "azharruddin.khan@kinesso.com",
  //   "ritesh.kumar@kinesso.com",
  //   "karan.shelar@kinesso.com",
  // ];
  const user = await this.find({ reportingEmail: email });
  if (user.length) {
    user.forEach((el) => {
      emails.push(el.email);
    });
  }
  //const tasks = await Task.fetchTask(emails);
  const tasks = await Task.fetchTask(emails);

  return { tasks, emails };
};

const UserConnection = mongoose.model("userConnection", userConnectionSchema);

module.exports = UserConnection;
