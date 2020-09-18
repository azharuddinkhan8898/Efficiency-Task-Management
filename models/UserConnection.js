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
  let emails = await getEmails([email]);
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

  const tasks = await Task.fetchTask(allEmails);

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

const UserConnection = mongoose.model("userConnection", userConnectionSchema);

module.exports = UserConnection;
