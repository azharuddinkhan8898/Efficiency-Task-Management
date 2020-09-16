const { Router } = require("express");
const authController = require("../controllers/authController");
const router = Router();

router.get("/signup", authController.signup_get);
router.post("/signup", authController.signup_post);
router.get("/login", authController.login_get);
router.post("/login", authController.login_post);
router.get("/logout", authController.logout_get);
router.post("/addTask", authController.add_task);
router.get("/mznxbcv", authController.get_data);
router.post("/data", authController.post_data);
router.post("/addTaskConnection", authController.addTaskConnection);
router.post("/addUserConnection", authController.addUserConnection);
router.get("/dashboard", authController.get_dashboard);
router.get("/manage-user", authController.get_addUser);
router.get("/view-tasks", authController.get_viewTasks);
router.post("/view-tasks", authController.post_viewTasks);

module.exports = router;


// 2020-09-07: 3587
// 2020-09-09: 1801
// 2020-09-10: 4712
// 2020-09-12: 48355
// 2020-09-15: 1804