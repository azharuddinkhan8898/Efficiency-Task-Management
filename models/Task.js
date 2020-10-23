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

taskSchema.statics.viewTasks = async function (email) {
  if (email == "senthil.kumaran@kinesso.com") {
    email = ["senthil.kumaran@kinesso.com", "sumit.korade@kinesso.com"];
  } else {
    email = [email];
  }
  let emails = await getEmails([...email]);
  // let emails = [
  //   "azharruddin.khan@kinesso.com",
  //   "ritesh.kumar@kinesso.com",
  //   "karan.shelar@kinesso.com",
  // ];
  let temp1 = [],
    temp2 = [],
    temp3 = [],
    temp4 = [];
  temp1 = await getEmails(emails);
  if (temp1.length) {
    temp2 = await getEmails(temp1);
  }
  if (temp2.length) {
    temp3 = await getEmails(temp2);
  }
  if (temp3.length) {
    temp4 = await getEmails(temp3);
  }
  //console.log([...emails, ...temp1, ...temp2, ...temp3, ...temp4]);

  let allEmails = [...emails, ...temp1, ...temp2, ...temp3, ...temp4];
  //const tasks = await Task.fetchTask(emails);
  const tasks = await fetchTask(allEmails);

  return { tasks, emails: allEmails };
};


const getEmails = async function (reportingEmail) {
  let emailsString = reportingEmail.join("|");
  emailsString = `(${emailsString})`;
  //const user = await UserConnection.find({ reportingEmail });
  const user = await UserConnection.find({
    $or: [{ reportingEmail: { $regex: emailsString, $options: "img" } }],
  });
  let emails = [];
  if (user.length) {
    user.forEach((el) => {
      emails.push(el.email);
    });
  }
  return emails;
};

const fetchTask = async function (emails) {
  let emailsString = emails.join("|");
  emailsString = `(${emailsString})`;
  //console.log(emailsString);
  //emailsString = `(azharruddin.khan@kinesso.com|ritesh.kumar@kinesso.com|karan.shelar@kinesso.com)`;
  try {
    const tasks = await Task.find({
      $or: [{ email: { $regex: emailsString, $options: "img" } }],
    });
    return tasks;
  } catch (err) {
    console.log(err);
  }
  // console.log(Task);
};

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
    let userDoj;
    if (user.length) {
      userDoj = user[0].doj;
    } else {
      userDoj = new Date().getTime();
    }
    var date1 = new Date(parseInt(userDoj));
    var date2 = new Date();
    var diffTime = Math.abs(date2 - date1);
    var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    let oldCat =
      diffDays > 547
        ? "aboveOneYear"
        : diffDays <= 547 && diffDays >= 365
        ? "oneYear"
        : diffDays <= 365 && diffDays >= 182
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
    let numberOfTasks = tasksArray.length
      ? tasksArray
          .map((el) => {
            return parseInt(el.number);
          })
          .reduce((total, num) => {
            return total + num;
          })
      : 0;
    let timeShouldTake = taskConnection
      .map((el) => {
        let timeForOneTask = el[oldCat] / el.number;
        let numberOfTask = search(el.task, tasksArray);
        return timeForOneTask * parseInt(numberOfTask.number);
      })
      .reduce((total, num) => {
        return total + num;
      });

    let finalNumber =
      Math.round(
        ((timeShouldTake / parseInt(timeTaken)) * 10 + Number.EPSILON) * 100
      ) / 100;

    //console.log(numberOfTasks, timeShouldTake, timeTaken / numberOfTasks);

    this.eScore = numberOfTasks
      ? finalNumber
        ? Math.abs(finalNumber)
        : null
      : null;
    if (
      !this.eScore ||
      this.eScore == "NaN" ||
      this.eScore == NaN ||
      parseInt(timeTaken) < 40
    ) {
      this.eScore = null;
    }
  } catch (err) {
    console.log(err);
  }

  next();
});

let count = 0;

taskSchema.statics.addEScore = async function (task, res) {
  let eScore = 0;
  try {
    let type = task.requestType;
    let timeTaken = task.time;
    let email = task.email;
    let tasksArray = task.tasks;
    let user = await UserConnection.find({ email });
    let userDoj;
    if (user.length) {
      userDoj = user[0].doj;
    } else {
      userDoj = new Date().getTime();
    }
    let date1 = new Date(parseInt(userDoj));
    let date2 = new Date();
    let diffTime = Math.abs(date2 - date1);
    let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    let oldCat =
      diffDays > 547
        ? "aboveOneYear"
        : diffDays <= 547 && diffDays >= 365
        ? "oneYear"
        : diffDays <= 365 && diffDays >= 182
        ? "sixMonths"
        : "threeMonths";

    let tasks = task.tasks
      .map((el) => {
        return el.taskName;
      })
      .join("|")
      .split("(")
      .join("\\(")
      .split(")")
      .join("\\)");

    tasks = `(${tasks})`;
    //console.log(type, tasks);
    const taskConnection = await TaskConnection.find({
      taskType: type,
      task: { $regex: tasks, $options: "img" },
    });

    let numberOfTasks = tasksArray.length
      ? tasksArray
          .map((el) => {
            return parseInt(el.number);
          })
          .reduce((total, num) => {
            return total + num;
          })
      : 0;

    let timeShouldTake = taskConnection
      .map((el) => {
        let timeForOneTask = el[oldCat] / el.number;
        let numberOfTask = search(el.task, tasksArray);

        return numberOfTask
          ? timeForOneTask * parseInt(numberOfTask.number)
          : 0;
      })
      .reduce((total, num) => {
        return total + num;
      });

    let finalNumber =
      Math.round(
        ((timeShouldTake / parseInt(timeTaken)) * 10 + Number.EPSILON) * 100
      ) / 100;

    //console.log(numberOfTasks, timeShouldTake, timeTaken / numberOfTasks);

    eScore = numberOfTasks ? finalNumber : null;
    if (
      !eScore ||
      eScore == "NaN" ||
      eScore == NaN ||
      eScore == 0 ||
      parseInt(timeTaken) < 40
    ) {
      eScore = null;
    }

    Task.updateOne(
      { _id: task._id },
      {
        $set: {
          eScore: eScore ? Math.abs(eScore) : null,
        },
      },
      { new: true },
      function (errUpdate, docsUpdate) {
        if (docsUpdate) {
          res.status(201).json({ msg: "changed" });
        }
      }
    );
    console.log(count);
    count++;
  } catch (err) {
    console.log(err, task.email);
    console.log(count);
    count++;
  }
};

function search(taskName, myArray) {
  for (var i = 0; i < myArray.length; i++) {
    if (myArray[i].taskName === taskName) {
      return myArray[i];
    }
  }
}

taskSchema.statics.getCsvData = async function (startDate, endDate, res) {
  let tasks = await Task.find({
    createdAt: {
      $gte: startDate,
      $lt: endDate,
    },
    eScore: { $ne: null },
  });

  let mainData = [];

  tasks.map(async (el, index) => {
    try {
      let data = {
        efficiencyScore: el.eScore,
        shift: "",
        reportingManager: "",
        experience: "",
        name: "",
        date: "",
        timeTaken: "",
        comment: "",
        taskType: "",
        numberOfTasks: 0,
        nameOfTasks: "",
      };
      let user = await UserConnection.find({ email: el.email });
      data.shift = user[0].shift;
      data.reportingManager = user[0].reportingName;
      let userDoj;
      if (user.length) {
        userDoj = user[0].doj;
      } else {
        userDoj = new Date().getTime();
      }
      let date1 = new Date(parseInt(userDoj));
      let date2 = new Date();
      let diffTime = Math.abs(date2 - date1);
      let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      let oldCat =
        diffDays > 547
          ? "Expert"
          : diffDays <= 547 && diffDays >= 365
          ? "Professional"
          : diffDays <= 365 && diffDays >= 182
          ? "Intermediate"
          : "Beginner";
      data.experience = oldCat;
      data.name = user[0].name;
      data.date = el.createdAt;
      data.comment = el.comment;
      data.taskType = el.requestType;
      data.numberOfTasks = el.tasks.length;
      data.nameOfTasks = el.tasks.map((el) => {
        return el.number + ":" + el.taskName;
      });
      data.nameOfTasks =
        data.nameOfTasks.length > 1
          ? data.nameOfTasks.join("$ ")
          : data.nameOfTasks[0];

      data.timeTaken = el.time;

      mainData.push(data);
      if (index + 1 >= tasks.length) {
        res.status(201).json({
          mainData,
        });
      }
    } catch (err) {
      console.log(err, el.email);
    }
  });
  //return tasks;
};

const Task = mongoose.model("tasks", taskSchema);

module.exports = Task;
