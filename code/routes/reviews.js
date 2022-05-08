const express = require("express");
const router = express.Router();
const data = require("../data");
const reviewsData = data.reviews;
const { ObjectId } = require("mongodb");
const { isLogin } = require("../middleware/auth");

router.get("/reviews/:id", isLogin, async (req, res) => {

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

  if (isValidRating(reviewsInfo.rating) === false) {
    res.status(400).render("reviews", { error: "Decimal values in rating is not accepted.", apartmentId: req.params.id });
    return;
  }

  try {
    const newReview = await reviewsData.create(
      req.params.id,
      userSessionId,
      sessionUser,
      reviewsInfo.rating,
      reviewsInfo.description
    );

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

    console.log("inside delete review route 3", deletedReviews);
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






function isValidDateString(dateString) {
  if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString)) return false;
  let splitDate = dateString.split("/");
  let month = parseInt(splitDate[0], 10);
  let day = parseInt(splitDate[1], 10);
  let year = parseInt(splitDate[2], 10);
  if (year < 1900 || year > 2022 || month == 0 || month > 12) {
    return false;
  }
  let monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)) {
    monthLength[1] = 29;
  }
  return day > 0 && day <= monthLength[month - 1];
}

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
