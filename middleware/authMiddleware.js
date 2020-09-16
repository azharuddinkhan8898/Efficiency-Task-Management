const jwt = require("jsonwebtoken");
const { check_authority } = require("../controllers/authController");
const User = require("../models/User");
const UserConnection = require("../models/UserConnection");

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  // check json web token exists & is verified
  if (token) {
    jwt.verify(token, "net ninja secret", (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect("/login");
      } else {
        console.log(decodedToken);
        next();
      }
    });
  } else {
    res.redirect("/login");
  }
};

// check current user
const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, "net ninja secret", async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        let user = await User.findById(decodedToken.id);
        let authority = await UserConnection.check(user.email);
        //let authority = await UserConnection.findOne({ email: user.email });
        user.authority = authority;
        res.locals.user = user;
        if (
          req.url === "/dashboard" ||
          req.url === "/manage-user" ||
          req.url === "/view-tasks"
        ) {
          if (
            user.authority !== "admin" &&
            user.authority !== "lead" &&
            (req.url === "/dashboard" || req.url === "/view-tasks")
          ) {
            res.redirect("/");
          } else if (user.authority !== "admin" && req.url === "/manage-user") {
            res.redirect("/");
          } else {
            next();
          }
        } else {
          next();
        }
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

module.exports = { requireAuth, checkUser };
