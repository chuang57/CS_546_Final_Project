const express = require("express");
const app = express();
const { createUser, checkUser } = require("./users");
const session = require("express-session");
const { auth } = require("./middlewares/auth");
const { logging } = require("./middlewares/logging");

const { engine } = require("express-handlebars");
const router = require("./routers");
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.use(
  session({
    name: "AuthCookie",
    secret: "some secret string!",
    resave: false,
    saveUninitialized: true,
  })
);
app.get("/", logging, (req, res) => {
  const isAuthenticated = false;
  if (isAuthenticated) {
    res.redirect("/private");
    return;
  }
  res.render("login");
});

app.get("/signup", logging, (req, res) => {
  const isAuthenticated = false;
  if (isAuthenticated) {
    res.redirect("/private");
    return;
  }
  res.render("signup");
});

app.post("/signup", logging, async (req, res) => {
  const { username, password, email, phonenumber, city, gender } = req.body;
  console.log(username, password);
  try {
    await createUser(username, password, email, phonenumber, city, gender);
    res.send("Sign up Success");
  } catch (e) {
    res.send(`"error", ${e.message}`);
  }
});

app.post("/login", logging, async (req, res) => {
  const { email, password } = req.body;
  try {
    await checkUser(email, password);
    req.session.user = { email };
    res.send("Sign in Success");
  } catch (e) {
    res.send(`"error", ${e.message}`);
    return;
  }
});

app.get("/private", logging, auth, async (req, res) => {
  res.render("private", { username: req.session.user.username });
});

app.get("/logout", logging, async (req, res) => {
  req.session.user = undefined;
  res.render("logout");
});

router(app);

app.listen(4000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:4000");
});
