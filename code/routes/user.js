const express = require("express");
const router = express.Router();
const { createUser, checkUser, getReviewfromId } = require("../data/users");
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
  try {
  res.render("signup", {
    signup: "User Signup",
  });
}catch(e)
{
  res.send(e);
}
  return;
});


router.get("/profile/:email/checkAllReviews", async (req, res) => {
  let arr = [];
  try {
    const email = req.params.email;
    const userCollections = await users(); 
    const findemail2 = await userCollections.findOne({
      email,
    });

    let genderCheck2 = ''; 
    if(findemail2.gender === 'female')
    {
      genderCheck2 = 'female'
    }
    console.log("findemail2",findemail2.gender);
    console.log("genderCheck2",genderCheck2);

    let reviewLength2 = findemail2.reviewsWritten.length;
  for(let i=0;i<reviewLength2;i++){
   
   let r2 = await getReviewfromId(findemail2.reviewsWritten[i])
   arr.push(r2);
   //console.log("r2...........",r2);
  // console.log("r2.rating...........",r2);
  
  }
 console.log(arr)
   res.render("checkAllReviews", {
    ...findemail2,
    arr,
    genderCheck2,
     
  });

 //console.log("findemail2",findemail2);
  
}catch(e)
{
  res.send(e);
}
  return;
});


router.get("/checkAllApartments", async (req, res) => {
  try {
  res.render("checkAllApartments", {
    signup: "User Signup",
  });
}catch(e)
{
  res.send(e);
}
  return;
});

router.get("/profile/:email", async (req, res) => {
  
  let positiveRatingCount = 0;
  let negativeRatingCount = 0;
  let neutralRatingCount = 0;
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

  console.log("findemail-----",findemail);
  /* console.log("reviewsWritten-----",findemail.reviewsWritten);
  console.log("reviewsWrittenLength",findemail.reviewsWritten.length);
  console.log("findemail.gender",findemail.gender); */

  let reviewLength = findemail.reviewsWritten.length;
  for(let i=0;i<reviewLength;i++){
   
   let r = await getReviewfromId(findemail.reviewsWritten[i])
   //console.log("r...........",r);
   console.log("r.rating...........",r.rating);

   if(r.rating === "5" || r.rating === "4"){
    positiveRatingCount = positiveRatingCount + 1;
   } 
   else if(r.rating === "3"){
    neutralRatingCount = neutralRatingCount + 1;
   }else{
     negativeRatingCount = negativeRatingCount + 1;
   }

  }

 let postiveRatingRatio = (positiveRatingCount/reviewLength)*100;
 let negativeRatingRatio = (negativeRatingCount/reviewLength)*100;
 let neutralRatingRatio = (neutralRatingCount/reviewLength)*100;


  let apartmentLength = findemail.savedApartments.length;
  let genderCheck ; 
  if(findemail.gender === 'female')
  {
    genderCheck = 'female'
  }


 // console.log("allRevieWritten",allReviewsWritten);
  //console.log("allApartmentListing",allApartmentListing);
  res.render("profile", {
    ...findemail,
    allApartmentListing,
    reviewLength,
    apartmentLength,
    genderCheck,
    positiveRatingCount,
    neutralRatingCount,
    negativeRatingCount,
    postiveRatingRatio,
    negativeRatingRatio,
    neutralRatingRatio

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
