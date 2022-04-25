const express = require("express");
const router = express.Router();
const { createUser, checkUser } = require("../users");
const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;

router.get("/login", async (req, res) => {
  //console.log(req.session.user);
  res.render("login", {
    title: "User Login",
    username: req.session.user?.username,
  });
  return;
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    await checkUser(email, password, req);
    res.redirect("/");
  } catch (e) {
    res.send(`"error", ${e.message}`);
    return;
  }
});

router.get("/logout", async (req, res) => {
  req.session.user = undefined;
  res.render("logout");
});

router.get("/signup", async (req, res) => {
  //console.log(req.session.user);

  res.render("signup", {
    title: "User Signup",
  });
  return;
});

router.get("/profile/:email", async (req, res) => {
  //console.log(req.session.user);
  const email = req.params.email;
  const userCollections = await users();

  const findemail = await userCollections.findOne({
    email,
  });

  res.render("profile", {
    ...findemail,
  });
  return;
});

router.post("/signup", async (req, res) => {
  const { email, password, username, phonenumber, city, gender, age } =
    req.body;
  try {
    await createUser(email, password, username, phonenumber, city, gender, age);
  } catch (e) {
    console.log(e);
  }
  res.redirect("/");
});

module.exports = router;
