const express = require ("express");
const router = express.Router();
const auth = require ("../middleware/authMiddleware");
const { createTodo, getTodos, updateTodo, deleteTodo, toggleTodo } = require ("../controllers/todoController");
const authMiddleware = require("../middleware/authMiddleware");
 
router.post("/",authMiddleware, createTodo);
router.get("/", authMiddleware, getTodos);
router.put("/:id", authMiddleware, updateTodo);
router.delete("/:id", authMiddleware, deleteTodo);
router.patch("/:id/toggle", authMiddleware, toggleTodo);
module.exports = router;