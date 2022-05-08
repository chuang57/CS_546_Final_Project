const express = require("express");
const router = express.Router();
const data = require("../data");
const reviewsData = data.reviews;
const { ObjectId } = require("mongodb");
const { isLogin } = require("../middleware/auth");

router.get("/reviews/:id", isLogin, async (req, res) => {
  console.log("in get routes of reviews", req.params.id, req.body);
  res.render("reviews", {
    apartmentId: req.params.id,
    username: req.session.user?.username,
    email: req.session.user?.email,
    isNotLogin: !req.session.user,
  });
  return;
});

router.post("/reviews/:id", isLogin, async (req, res) => {
 const reviewsInfo = req.body;
  req.params.id = req.params.id.trim();
  let sessionUser = req.session.user.username;
  let userSessionId = req.session.user._id;

  //console.log("sessionUser", sessionUser);
  //console.log("req.params.id", req.params.id);

  if (reviewsInfo.rating === "" || reviewsInfo.rating === "undefined") {
    res.status(400).render("reviews", { error: "Please provide rating from 1-5", apartmentId: req.params.id });
    return;
  }
  if (reviewsInfo.description === "" || reviewsInfo.description === "undefined") {
    res.status(400).render("reviews", { error: "Please provide your feedback", apartmentId: req.params.id });
    return;
  }
  if (reviewsInfo.rating > 5 || reviewsInfo.rating < 1) {
    res.status(400).render("reviews", { error: "Given rating value should be a range from 1 to 5.", apartmentId: req.params.id });
    return;
  }
  console.log("isvalidrating", isValidRating(reviewsInfo.rating));
  if (isValidRating(reviewsInfo.rating) === false) {
    res.status(400).render("reviews", { error: "Decimal values in rating is not accepted.", apartmentId: req.params.id });
    return;
  }
  // console.log(albumInfo,req.params.id);
  //If the JSON is valid and the album can be created successful, you will return all the
  //band data showing the albums  (as shown below) with a 200 status code.
  //while create() func in data/albums.js returing newly created album only.
  try {
    const newReview = await reviewsData.create(
      req.params.id,
      userSessionId,
      sessionUser,
      reviewsInfo.rating,
      reviewsInfo.description
    );
    console.log("newReview", newReview);
    //eachApartmentListing
    res.status(200).redirect("/apartment/" + newReview.apartmentid);
  } catch (e) {
    res.status(400).json({ error: e });
  }
});


router.get('/reviews/delete/:id', isLogin, async (req, res) => {
  req.params.id = req.params.id.trim();
  let sessionUser = req.session.user.username;
  let userSessionId = req.session.user._id;
  let userEmail = req.session.user.email;
  //console.log("sessionUser", sessionUser);
  //console.log("userSessionId", userSessionId);
  //console.log("req.session.user...",req.session.user );

  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json({ error: 'Provided review id is not a valid object ID.' });
    return;
  }
  if (typeof req.params.id !== 'string') {
    res.status(400).json({ error: 'Id must be a string.' });
    return;
  }
  if (req.params.id.trim().length === 0) {
    res.status(400).json({ error: 'review Id cannot be an empty string or just spaces.' });
    return;
  }

  try {
    let deletedReviews = await reviewsData.remove(req.params.id, userSessionId, sessionUser);

    //console.log("inside delete review route 3", deletedReviews);
    if (deletedReviews === undefined) {
      res.status(404).json({ error: 'Could not delete review with id' });
    }
    //res.status(200).json({ "Review Id": req.params.id, "deleted": true, "modifiedcount": deletedReviews });
    res.status(200).redirect("/profile/"+userEmail+"/checkAllReviews");
    
  } catch (e) {
    if (e === 'review does not exists') {
      res.status(404).json({ error: e });
    } else res.status(400).json({ error: e });
  }
});


function isValidRating(rating) {
  if (rating.toString().includes(".")) {
    if (rating.toString().split(".").length !== '1') {
      return false;
    } else {
      return true;
    }
  } else {
    return true;
  }
}

module.exports = router;
