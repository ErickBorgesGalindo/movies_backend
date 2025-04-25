const { Router } = require("express");
const userController = require("../controllers/user.controller");
const { loginUser } = require("../controllers/user.controller");


const router = Router();

router.post("/user", userController.createUser);
router.post("/login", loginUser);
router.get("/user", userController.getAllUsers);
router.get("/user/:id", userController.getUserById);
router.get("/user-with-comments", userController.getUsersWithCommentCount);
router.get("/user-with-comments/:id", userController.getUserWithCommentCountById);
router.put("/user/:id", userController.updateUser);
router.delete("/user/:id", userController.deleteUser);

module.exports = router;
