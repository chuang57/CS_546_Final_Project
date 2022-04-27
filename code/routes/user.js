const express = require("express");
const router = express.Router();
const { createUser, checkUser } = require("../data/users");
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
   // res.redirect("/");
   console.log("user in post login route",req.session.user);
   console.log("req.params.id", req.session.user._id);
   console.log("req.params.username",req.session.user.username);
    res.render("city-choosing", {
      username: req.session.user?.username,
    // username: req.session.user.username,
     //userId: req.session.user._id.toString()
    });

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
  const { email, password, username, phonenumber, city, gender, age, usertype } =
    req.body;
    

    console.log(req.body);
  try {
    await createUser(email, password, username, phonenumber, city, gender, age, usertype);
  } catch (e) {
    console.log(e);
  }
  res.render("login",{success:"welcome! Please login now to proceed further"});
});

module.exports = router;


