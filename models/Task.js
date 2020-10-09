const mongoose = require("mongoose");
const TaskConnection = require("./TaskConnection");
const UserConnection = require("./UserConnection");

const taskSchema = new mongoose.Schema(
  {
    email: {
      type: String,
    },
    requestType: {
      type: String,
    },
    tasks: {
      type: Array,
    },
    comment: {
      type: String,
    },
    time: {
      type: String,
    },
    paused: {
      type: Boolean,
    },
    eScore: {
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

// // fire a function before doc saved to db
// userSchema.pre("save", async function (next) {
//   const salt = await bcrypt.genSalt();
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// // static method to login user
// userSchema.statics.login = async function (email, password) {
//   const user = await this.findOne({ email });
//   if (user) {
//     const auth = await bcrypt.compare(password, user.password);
//     if (auth) {
//       return user;
//     }
//     throw Error("incorrect password");
//   }
//   throw Error("incorrect email");
// };

taskSchema.statics.fetchTask = async function (emails) {
  let emailsString = emails.join("|");
  emailsString = `(${emailsString})`;
  //emailsString = `(azharruddin.khan@kinesso.com|ritesh.kumar@kinesso.com|karan.shelar@kinesso.com)`;
  const tasks = await this.find({
    $or: [{ email: { $regex: emailsString, $options: "img" } }],
  });
  return tasks;
};

taskSchema.pre("save", async function (next) {
  this.eScore = 0;
  try {
    let type = this.requestType;
    let timeTaken = this.time;
    let email = this.email;
    let tasksArray = this.tasks;
    let user = await UserConnection.find({ email });
    let userDoj = user[0].doj;
    var date1 = new Date(parseInt(userDoj));
    var date2 = new Date();
    var diffTime = Math.abs(date2 - date1);
    var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    let oldCat =
      diffDays > 365
        ? "aboveOneYear"
        : diffDays <= 365 && diffDays >= 182
        ? "oneYear"
        : diffDays <= 182 && diffDays >= 91
        ? "sixMonths"
        : "threeMonths";

    let tasks = this.tasks
      .map((el) => {
        return el.taskName;
      })
      .join("|")
      .split("(")
      .join("\\(")
      .split(")")
      .join("\\)");

    tasks = `(${tasks})`;
    console.log(type, tasks);
    const taskConnection = await TaskConnection.find({
      taskType: type,
      task: { $regex: tasks, $options: "img" },
    });
    let numberOfTasks = tasksArray
      .map((el) => {
        return parseInt(el.number);
      })
      .reduce((total, num) => {
        return total + num;
      });
    let timeShouldTake = taskConnection
      .map((el) => {
        return el[oldCat] / el.number;
      })
      .reduce((total, num) => {
        return total + num;
      });
    //console.log(numberOfTasks, timeShouldTake, timeTaken / numberOfTasks);
    this.eScore = (timeShouldTake / (timeTaken / numberOfTasks)) * 10;
  } catch (err) {
    console.log(err);
  }

  next();
});

const Task = mongoose.model("tasks", taskSchema);

module.exports = Task;
