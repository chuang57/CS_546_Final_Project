const express = require("express");
const router = express.Router();
const { createUser, checkUser } = require("../data/users");
const mongoCollections = require("../config/mongoCollections");
const { ObjectId } = require("mongodb");
const { isLogin } = require("../middleware/auth");
const users = mongoCollections.users;
const apartment = mongoCollections.apartment;

router.get("/login", async (req, res) => {
  //console.log(req.session.user);
  req.session.user = undefined;
  res.render("login", {
    title: "User Login",
    username: req.session.user?.username,
    email: req.session.user?.email,
    isNotLogin: !req.session.user,
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

router.post("/user/bookmark", isLogin, async (req, res) => {
  const user = req.session.user;
  const apartmentId = req.body.apartId;
  const userCollections = await users();
  await userCollections.updateOne(
    { _id: ObjectId(user._id) },
    { $addToSet: { savedApartments: apartmentId } }
  );
 // res.send("success");
 console.log("/user/bookmark");
  res.status(200).render("all-apartment-listing", {success: "Thank you for showing your interest."});
});

router.get("/logout", async (req, res) => {
  req.session.user = undefined; 
  res.render("logout");
});

router.get("/signup", async (req, res) => {


  res.render("signup", {
    title: "User Signup",
  });
  return;
});

router.get("/profile/:email", async (req, res) => {

  const email = req.params.email;
  const userCollections = await users();

  const findemail = await userCollections.findOne({
    email,
  });

  const apartmentCollections = await apartment();
  const allApartmentListing = (
    await apartmentCollections.find({}).toArray()
  ).filter((v) => {
    return findemail.savedApartments.includes(v._id.toString());
  });

  res.render("profile", {
    ...findemail,
    allApartmentListing,
  });
  return;
});

router.post("/signup", async (req, res) => {
  const {
    email,
    password,
    username,
    phonenumber,
    city,
    gender,
    age,
    usertype,
  } = req.body;


  try {
    await createUser(
      email,
      password,
      username,
      phonenumber,
      city,
      gender,
      age,
      usertype
    );
  } catch (e) {
    console.log(e);
  }
  res.redirect("/login");
});

module.exports = router;
