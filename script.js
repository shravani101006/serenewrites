/* ---------- PAGE SWITCHER ---------- */
function showPage(id) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(id).classList.add("active");

  // hide navbar on login/signup
  if (id === "login-page" || id === "signup-page") {
    document.getElementById("navbar").style.display = "none";
  } else {
    document.getElementById("navbar").style.display = "block";
  }
}

/* ---------- NAVIGATION BUTTONS ---------- */
const navButtons = document.querySelectorAll(".nav-btn");

navButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.page;

    // highlight button
    navButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    // open correct page
    showPage(target);
  });
});

/* ---------- AUTH ---------- */
function signup() {
  const u = document.getElementById("signup-user").value;
  const p = document.getElementById("signup-pass").value;

  if (!u || !p) return alert("Fill everything");

  let users = JSON.parse(localStorage.getItem("users") || "[]");

  if (users.some(x => x.user === u)) return alert("Username already exists!");

  users.push({ user: u, pass: p });
  localStorage.setItem("users", JSON.stringify(users));

  alert("Account created!");
  showPage("login-page");
}

function login() {
  const u = document.getElementById("login-user").value;
  const p = document.getElementById("login-pass").value;

  let users = JSON.parse(localStorage.getItem("users") || "[]");

  if (!users.some(x => x.user === u && x.pass === p))
    return alert("Wrong username or password!");

  localStorage.setItem("currentUser", u);

  showPage("home-page");
  renderPosts();
}

function logout() {
  localStorage.removeItem("currentUser");
  showPage("login-page");
}

/* ---------- POSTS STORAGE ---------- */
let posts = JSON.parse(localStorage.getItem("posts") || "[]");

function savePosts() {
  localStorage.setItem("posts", JSON.stringify(posts));
}

/* ---------- RENDER ALL POSTS ---------- */
function renderPosts() {
  const container = document.getElementById("posts-container");
  const empty = document.getElementById("empty-state");

  container.innerHTML = "";

  if (posts.length === 0) {
    empty.style.display = "block";
    return;
  }

  empty.style.display = "none";

  posts.forEach(post => {
    const card = document.createElement("div");
    card.className = "post-card";
    card.innerHTML = `
      <h3>${post.title}</h3>
      <p>${post.content}</p>
      <span class="post-date">${post.date}</span>
    `;
    card.onclick = () => openPost(post.id);
    container.appendChild(card);
  });
}

/* ---------- CREATE POST ---------- */
document.getElementById("post-form").addEventListener("submit", e => {
  e.preventDefault();

  const title = document.getElementById("post-title").value.trim();
  const content = document.getElementById("post-content").value.trim();

  if (!title || !content) return;

  posts.unshift({
    id: Date.now(),
    title,
    content,
    date: new Date().toLocaleDateString()
  });

  savePosts();
  renderPosts();

  // go to home page
  showPage("home-page");

  // highlight home btn
  document.querySelector('[data-page="home-page"]').classList.add("active");
});

/* ---------- OPEN SINGLE POST ---------- */
function openPost(id) {
  const post = posts.find(p => p.id === id);
  if (!post) return;

  document.getElementById("single-post-content").innerHTML = `
    <h2>${post.title}</h2>
    <span class="post-date">${post.date}</span>
    <div class="post-body">${post.content}</div>
  `;

  showPage("single-post-page");
}
