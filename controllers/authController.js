const User = require("../models/User");
const jwt = require("jsonwebtoken");
const Task = require("../models/Task");
const TaskConnection = require("../models/TaskConnection");
const UserConnection = require("../models/UserConnection");
//const JSONFormatter = require("json-formatter-js");
// handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: "", password: "" };

  // incorrect email
  if (err.message === "incorrect email") {
    errors.email = "That email is not registered";
  }

  // incorrect password
  if (err.message === "incorrect password") {
    errors.password = "That password is incorrect";
  }

  // duplicate email error
  if (err.code === 11000) {
    errors.email = "that email is already registered";
    return errors;
  }

  // validation errors
  if (err.message.includes("user validation failed")) {
    // console.log(err);
    Object.values(err.errors).forEach(({ properties }) => {
      // console.log(val);
      // console.log(properties);
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

// create json web token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, "net ninja secret", {
    expiresIn: maxAge,
  });
};

// controller actions
module.exports.signup_get = (req, res) => {
  res.render("signup");
};

module.exports.login_get = (req, res) => {
  res.render("login");
};

module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.create({ email, password });
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const authority = await UserConnection.check(email);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id, authority });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports.add_task = async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json({ task: task._id });
  } catch (err) {
    res.status(400).json({ errors: "not saved" });
  }
};

module.exports.logout_get = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};

module.exports.get_data = (req, res) => {
  res.render("data");
};

module.exports.post_data = async (req, res) => {
  const user = await Task.find({});

  res.status(201).json({
    data: user,
  });
};

module.exports.post_setEScore = async (req, res) => {
  const data = await Task.addEScore(req.body.task, res);
};

module.exports.post_getCsvData = async (req, res) => {
  let { startDate, endDate } = req.body;
  let data = await Task.getCsvData(startDate, endDate, res);
  // res.status(201).json({
  //   data,
  // });
};

module.exports.addTaskConnection = async (req, res) => {
  const {
    taskType,
    task,
    methodology,
    number,
    threeMonths,
    sixMonths,
    oneYear,
    aboveOneYear,
  } = req.body;

  try {
    const taskRes = await TaskConnection.create({
      taskType,
      task,
      methodology,
      number,
      threeMonths,
      sixMonths,
      oneYear,
      aboveOneYear,
    });
    res.status(201).json({ task: taskRes });
  } catch (err) {
    res.status(400).json({ error: "can not add" });
  }
};

module.exports.addUserConnection = async (req, res) => {
  const {
    email,
    name,
    reportingName,
    reportingEmail,
    shift,
    authority,
    doj,
  } = req.body;
  console.log(email, name, reportingName, reportingEmail, shift, authority);
  try {
    const userRes = await UserConnection.create({
      email,
      name,
      reportingName,
      reportingEmail,
      shift,
      authority,
      doj,
    });
    res.status(201).json({ user: userRes });
  } catch (err) {
    res.status(400).json({ error: "can not add" });
  }
};

module.exports.get_dashboard = async (req, res) => {
  res.render("dashboard");
};

// module.exports.check_authority = async (email) => {
//   let authority = await UserConnection.findOne({ email: email });
//   return authority.authority;
// };

module.exports.get_addUser = async (req, res) => {
  res.render("addUser");
};

module.exports.get_viewTasks = async (req, res) => {
  res.render("viewTasks");
};

module.exports.post_viewTasks = async (req, res) => {
  const data = await UserConnection.viewTasks(req.body.email);
  res.status(201).json({ data });
};
