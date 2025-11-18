// ===============================
// CONFIG
// ===============================
const API_BASE = "http://localhost:5000/api";  // backend URL
let authToken = localStorage.getItem("token") || "";
let posts = [];


// ===============================
// PAGE ELEMENTS
// ===============================
const pages = {
  home: document.getElementById("home-page"),
  newPost: document.getElementById("new-post-page"),
  singlePost: document.getElementById("single-post-page"),
};

const navButtons = document.querySelectorAll(".nav-btn");
const postForm = document.getElementById("post-form");
const postsContainer = document.getElementById("posts-container");
const emptyState = document.getElementById("empty-state");
const backBtn = document.getElementById("back-btn");
const singlePostContent = document.getElementById("single-post-content");


// ===============================
// INITIALIZATION
// ===============================

function init() {
  loadPostsFromBackend();
  attachEventListeners();
}

async function loadPostsFromBackend() {
  const res = await fetch(`${API_BASE}/posts`);
  posts = await res.json();
  renderPosts();
}


// ===============================
// EVENT LISTENERS
// ===============================

function attachEventListeners() {
  navButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      navigateTo(btn.dataset.page);
      updateActiveNavButton(btn);
    });
  });

  postForm.addEventListener("submit", handleFormSubmit);

  backBtn.addEventListener("click", () => navigateTo("home"));
}


// ===============================
// NAVIGATION
// ===============================

function navigateTo(pageName) {
  Object.values(pages).forEach((page) => page.classList.remove("active"));
  pages[pageName].classList.add("active");
}

function updateActiveNavButton(activeBtn) {
  navButtons.forEach((btn) => btn.classList.remove("active"));
  activeBtn.classList.add("active");
}


// ===============================
// POST CREATION
// ===============================

async function handleFormSubmit(e) {
  e.preventDefault();

  const title = document.getElementById("post-title").value.trim();
  const content = document.getElementById("post-content").value.trim();

  if (!title || !content) return;

  if (!authToken) {
    alert("You must be logged in to create a post!");
    return;
  }

  const newPost = { title, content };

  await fetch(`${API_BASE}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: authToken,
    },
    body: JSON.stringify(newPost),
  });

  postForm.reset();
  navigateTo("home");
  updateActiveNavButton(document.querySelector('[data-page="home"]'));
  loadPostsFromBackend();
}


// ===============================
// RENDER POSTS
// ===============================

function renderPosts() {
  postsContainer.innerHTML = "";

  if (posts.length === 0) {
    emptyState.style.display = "block";
    return;
  }

  emptyState.style.display = "none";

  posts.forEach((post) => {
    const card = createPostCard(post);
    postsContainer.appendChild(card);
  });
}

function createPostCard(post) {
  const card = document.createElement("div");
  card.className = "post-card";

  card.innerHTML = `
    <h3>${escapeHtml(post.title)}</h3>
    <p>${escapeHtml(post.content)}</p>
    <span class="post-date">${post.date}</span>
  `;

  card.addEventListener("click", () => showSinglePost(post._id));
  return card;
}


// ===============================
// SINGLE POST VIEW
// ===============================

async function showSinglePost(id) {
  const res = await fetch(`${API_BASE}/posts/${id}`);
  const post = await res.json();

  singlePostContent.innerHTML = `
    <h2>${escapeHtml(post.title)}</h2>
    <span class="post-date">${post.date}</span>
    <div class="post-body">${escapeHtml(post.content)}</div>
  `;

  if (authToken) {
    let deleteBtn = document.createElement("button");
    deleteBtn.className = "btn-submit";
    deleteBtn.style.background = "#ff6b6b";
    deleteBtn.style.marginTop = "20px";
    deleteBtn.innerText = "🗑 Delete Post";

    deleteBtn.onclick = () => deletePost(id);

    singlePostContent.appendChild(deleteBtn);
  }

  navigateTo("single-post");
}


// ===============================
// DELETE POST
// ===============================

async function deletePost(id) {
  if (!confirm("Are you sure you want to delete this post?")) return;

  await fetch(`${API_BASE}/posts/${id}`, {
    method: "DELETE",
    headers: { Authorization: authToken },
  });

  alert("Post deleted!");

  navigateTo("home");
  loadPostsFromBackend();
}


// ===============================
// AUTH FUNCTIONS (REGISTER + LOGIN)
// ===============================

async function register(username, password) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();
  alert(data.message);
}

async function login(username, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();

  if (data.token) {
    authToken = data.token;
    localStorage.setItem("token", authToken);
    alert("Login successful!");
  } else {
    alert(data.error);
  }
}


// ===============================
// UTIL
// ===============================

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}


// ===============================
// START APP
// ===============================
init();
