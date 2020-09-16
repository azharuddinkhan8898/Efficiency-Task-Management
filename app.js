const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const { requireAuth, checkUser } = require("./middleware/authMiddleware");
var subdomain = require("express-subdomain");
const { MONGO_URL } = require("./config/config");

const app = express();

// middleware
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set("view engine", "ejs");

// database connection
const dbURI = MONGO_URL;
mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((result) => {
    console.log("Listening 3000");
    app.listen(process.env.PORT || 3000);
  })
  .catch((err) => console.log(err));

// routes
app.get("*", checkUser);
app.get("/", requireAuth, (req, res) => res.render("home"));
app.get("/mznxbcv", requireAuth, (req, res) => res.render("data"));
app.get("/dashboard", requireAuth, (req, res) => res.render("dashboard"));
//app.get("/smoothies", requireAuth, (req, res) => res.render("smoothies"));
app.use(authRoutes);
//app.use(subdomain("api", authRoutes));
