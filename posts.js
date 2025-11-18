const express = require("express");
const router = express.Router();
const {
  getPosts,
  createPost,
  getSinglePost,
  deletePost
} = require("../controllers/postController");

const auth = require("../middleware/authMiddleware");

router.get("/", getPosts);
router.post("/", auth, createPost);
router.get("/:id", getSinglePost);
router.delete("/:id", auth, deletePost);

module.exports = router;
