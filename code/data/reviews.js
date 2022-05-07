const mongoCollections = require('../config/mongoCollections');
const apartment = mongoCollections.apartment;
const apartmentData = require('./apartment');
const users = mongoCollections.users;
const usersData = require('./users');
const { ObjectId } = require('mongodb');

module.exports = {

  async create(apartmentId, userSessionId, sessionUser, rating, description) {
    let updatedInfo2;
    if (rating === "" || rating === "undefined") throw "Please provide rating from 1-5";
    if (description === "" || description === "undefined") throw "Please provide your feedback";
    if (rating > 5 || rating < 1) throw "Given rating value should be a range from 1 to 5.";
    if (isValidRating(reviewsInfo.rating) === false) throw "Decimal values in rating is not accepted.";

    let review = {
      _id: ObjectId(),
      name: sessionUser,
      apartmentid: apartmentId,
      rating: rating,
      description: description

    };

    let singleApartment = await apartmentData.getApartmentById(apartmentId);

    //console.log("singleApartment", singleApartment);
    //console.log("singleApartment reviews", singleApartment.reviews, "singleApartment type", typeof singleApartment);

    singleApartment[0].reviews.push(review);
    //console.log("inside reviews data folder single review", singleApartment);
   
    const apartmentCollection = await apartment();
    const updatedInfo = await apartmentCollection.updateOne({ _id: ObjectId(apartmentId) }, { $addToSet: { reviews: review } });

    if (!updatedInfo.matchedCount && !updatedInfo.modifiedCount)
      throw 'could not update apartment successfully';

    if (updatedInfo.modifiedCount === 1) {

      const usersCollection = await users();
      updatedInfo2 = await usersCollection.updateOne({ _id: ObjectId(userSessionId) }, { $addToSet: { reviewsWritten: review._id.toString() } });

    }

    return review;

  },


  async remove(reviewId, userSessionId, sessionUser) {
    if (arguments.length !== 3) throw "Number of arguments should be 1";
    if (!reviewId) throw 'You must provide an review id to search for';
    if (typeof reviewId !== 'string') throw 'review Id must be a string';
    if (reviewId.trim().length === 0)
      throw 'reviewId cannot be an empty string or just spaces';
    reviewId = reviewId.trim();
    if (!ObjectId.isValid(reviewId)) throw 'review Id is not a valid object ID';

    const apartmentCollection = await apartment();
    const apartReview = await apartmentCollection.find({ 'reviews._id': ObjectId(reviewId) }).toArray();

    if (apartReview.length !== 0) {
      let apartmentInfo = '';
      apartmentInfo = await apartmentCollection.updateOne({ _id: apartReview[0]._id }, { $pull: { reviews: { _id: ObjectId(reviewId) } } });

      if (apartmentInfo.modifiedCount === 1) {
        /*  console.log("review has been deleted successfully from apartment", apartmentInfo);
         console.log("session user id userSessionId", userSessionId);
         console.log("session user id seesion User", sessionUser);
         console.log("reviewId", reviewId); */

        const usersCollection = await users();
        //  updatedInfo2 = await usersCollection.updateOne({_id: ObjectId(userSessionId)}, { $pull: { reviewsWritten: { _id: ObjectId(reviewId)} }}); 
        updatedInfo2 = await usersCollection.updateOne({ _id: ObjectId(userSessionId) }, { $pull: { reviewsWritten: reviewId } });
        //console.log("review has been deleted successfully from user collection", updatedInfo2);

        return updatedInfo2.modifiedCount;
      }
      else {

        throw "review does not exists";
      }
    }
  }
},



  function isValidRating(rating) {
    if (rating.toString().includes('.')) {
      if (rating.toString().split('.')[1].length !== 1) {
        //console.log("inside if2",rating.toString().split('.')[1].length);
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }

  };


//module.exports = exportedMethods;
