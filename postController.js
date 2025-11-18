const Post = require("../models/Post");

exports.getPosts = async (req, res) => {
  const posts = await Post.find().sort({ _id: -1 });
  res.json(posts);
};

exports.createPost = async (req, res) => {
  const { title, content } = req.body;

  const newPost = new Post({
    title,
    content,
    userId: req.user.id,
    date: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  });

  await newPost.save();
  res.json({ message: "Post created", post: newPost });
};

exports.getSinglePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  res.json(post);
};

exports.deletePost = async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) return res.status(404).json({ error: "Post not found" });

  if (post.userId.toString() !== req.user.id)
    return res.status(403).json({ error: "Not allowed" });

  await post.deleteOne();
  res.json({ message: "Post deleted" });
};
