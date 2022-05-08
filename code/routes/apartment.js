const express = require("express");
const router = express.Router();
const data = require("../data");
const apartmentData = data.apartment;
const { ObjectId, CURSOR_FLAGS } = require("mongodb");
const mongoconnection = require("../config/mongoConnection");
const mongoCollections = require("../config/mongoCollections");
const { isLogin } = require("../middleware/auth");
const apartment = mongoCollections.apartment;
const users = mongoCollections.users;
//const { getApartmentById } = require("../data/apartment");

const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/photos/");
  },

  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage: storage });

const fs = require("fs");

router.get("/", isLogin, async (req, res) => {
  let arr = [],
    obj = {};

  res.render("city-choosing", {
    title: "Apartment Finder",
    username: req.session.user?.username,
    email: req.session.user?.email,
    isNotLogin: !req.session.user,
  });
  return;
});

//400 erros in user inputs
//404 db errors
//500 error in my code

router.get("/newApartment", isLogin, async (req, res) => {
  const error = req.query.error;
  try {
    //res.render("new-apartment");
    res.status(200).render("new-apartment", {
      //success: "Your property has been successfully added",
      username: req.session.user?.username,
      email: req.session.user?.email,
      isNotLogin: !req.session.user,
      error,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: e });
  }
});



router.post(
  "/newApartmentInfo",
  isLogin,
  upload.array("photos"),
  async (req, res) => {

    try {
      let state = req.body.state
      let city = req.body.city
      let address = req.body.address
      let zipcode = req.body.zipcode

      let rent = req.body.rent
      let photos = req.files
      let size = req.body.size
      let occupantCapacity = req.body.occupantCapacity
      let contact = req.body.occupantCapacity
      const st = ["AK", "AL", "AR", "AS", "AZ", "CA", "CO", "CT", "DC", "DE", "FL", "GA", "GU", "HI", "IA", "ID", "IL", "IN", "KS", "KY", "LA", "MA", "MD", "ME", "MI", "MN", "MO", "MP", "MS", "MT", "NC", "ND", "NE", "NH", "NJ", "NM", "NV", "NY", "OH", "OK", "OR", "PA", "PR", "RI", "SC", "SD", "TN", "TX", "UM", "UT", "VA", "VI", "VT", "WA", "WI", "WV", "WY"]
            if (!state){
                throw "You must enter a state";
            }else if(st.indexOf(state) < 0){
              throw "Invalid state"
            }
            if (!city){
              throw "You must enter a city"
            }else if(city.trim().length === 0){
              throw "Invalid state"
            }else if(typeof city != "string"){
              throw "City must be a string"
            }
    
    
            if (!address){
              throw "You must enter a address"
            }else if(address.trim().length === 0){
              throw "Invalid address"
            }else if(typeof address != "string"){
              throw "Address must be a string"
            }
    
            if (!zipcode){
              throw "You must enter a zipcode"
            }else if(typeof zipcode != "string"){

              throw "Zipcode must be a number!"
            }
    
            if (!rent){
              throw "You must enter a rent"
            }else if(rent.trim().length === 0){
              throw "Invalid rent"
            }else if(typeof rent != "string"){
              throw "Rent must be a string"
            }
    
            if (!size){
              throw "You must enter a size"
            }else if(size.trim().length === 0){
              throw  "Invalid size"
            }else if(typeof size != "string"){  
              throw "Size must be a string"
            }
    
            if (!occupantCapacity){
              throw "You must enter a occupant capacity"
            }
    
            if (!contact){
              throw "You must enter a contact"
            }else if(contact.trim().length === 0){
              throw "Invalid contact"
            }else if(typeof contact != "string"){
              throw "contact must be a string"
            }
    
            if(!photos){
              throw "You must enter photos!"
            }

      const paths = req.files.map((file) => file.path);
      const paths2 = paths.map((file) => "\\" + file);
      let x = await apartmentData.create(
        req.body.state,
        req.body.city,
        paths2,
        req.body.address,
        req.body.zipcode,
        req.body.rent,
        req.body.size,
        req.body.occupantCapacity,

        req.body.contactInfo,
        //req.session.user.email,
        req.session.user._id
      );
      res.status(200).render("city-choosing", {
        success: "Your property has been successfully added!",
        username: req.session.user?.username,
        email: req.session.user?.email,
        isNotLogin: !req.session.user,
      });
    } catch (e) {
      console.log(e);
      res.status(400).redirect(`/newApartment?error=${e}`);
    }
  }
);

router.route("/").post(async (req, res) => {
  const apartmentInfo = req.body.zipcode;
  let bandMembersInvalidFlag = false;
  let genreInvalidFlag = false;


  try {
    const newApartment = await apartmentData.create(
      apartmentInfo.state,
      apartmentInfo.city,
      apartmentInfo.photos,
      apartmentInfo.address,
      apartmentInfo.zipcode,
      apartmentInfo.rent,
      apartmentInfo.size,
      apartmentInfo.occupantCapacity
    );
    res.status(200).json(newApartment);
  } catch (e) {
    res.status(400).json({ error: e });
    return;
  }
});

router.get("/apartment", isLogin, async (req, res) => {
  try {
    let allAvailableApartmentList = await apartmentData.getAllApartment();

    res.status(200).render(
      "all-apartment-listing",
      {
        allApartmentListing: allAvailableApartmentList.map((e) => {
          return {
            ...e,
            isBookmarked: req.session.user.savedApartments.includes(e._id),
          };
        }),
        username: req.session.user?.username,
        email: req.session.user?.email,
        isNotLogin: !req.session.user,
      }
      ////   city: allAvailableApartmentList[i].city,
      // address:allAvailableApartmentList[i].address,
      // rent:allAvailableApartmentList[i].rent,
      //size:allAvailableApartmentList[i].size,
      //occupantCapacity:allAvailableApartmentList[i].occupantCapacity }
    );
    // }
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: e });
  }
});

router.get("/apartment/sortbyrent", isLogin, async (req, res) => {
  try {
    let sortAllApartmentByPrice = await apartmentData.sortAllApartmentByPrice();

    res.status(200).render(
      "all-apartment-listing",
      { allApartmentListing: sortAllApartmentByPrice }

    );
    // }
  } catch (e) {
    res.status(404).json({ error: e });
  }
});

router.post("/apartment", isLogin, async (req, res) => {
  const apartmentZipcode = req.body.zipcode;
  const apartmentState = req.body.state;
  const apartmentCity = req.body.city;
  const apartmentRent = req.body.rent;
  let rentMin = undefined;
  let rentMax = undefined;
  if (apartmentRent === "$1 - $1000") {
    rentMin = 1;
    rentMax = 1000;
  } else if (apartmentRent === "$1000 - $2000") {
    rentMin = 1000;
    rentMax = 2000;
  } else if (apartmentRent === "$2000 - $3000") {
    rentMin = 2000;
    rentMax = 3000;
  } else if (apartmentRent === "$3000 - $4000") {
    rentMin = 3000;
    rentMax = 4000;
  } else if (apartmentRent === "$4000 - $5000") {
    rentMin = 4000;
    rentMax = 5000;
  } else if (apartmentRent === "$5000 - $6000") {
    rentMin = 5000;
    rentMax = 6000;
  } else if (apartmentRent === "$6000 - $7000") {
    rentMin = 6000;
    rentMax = 7000;
  } else if (apartmentRent === "$7000 - $8000") {
    rentMin = 7000;
    rentMax = 8000;
  } else if (apartmentRent === "$8000 - $9000") {
    rentMin = 8000;
    rentMax = 9000;
  } else if (apartmentRent === "$9000 - $10000") {
    rentMin = 9000;
    rentMax = 10000;
  }
  const apartmentSize = req.body.size;
  let sizeMin = undefined;
  let sizeMax = undefined;
  if (apartmentSize === "1 - 1000") {
    sizeMin = 1;
    sizeMax = 1000;
  } else if (apartmentSize === "1000 - 2000") {
    sizeMin = 1000;
    sizeMax = 2000;
  } else if (apartmentSize === "2000 - 3000") {
    sizeMin = 2000;
    sizeMax = 3000;
  } else if (apartmentSize === "3000 - 4000") {
    sizeMin = 3000;
    sizeMax = 4000;
  } else if (apartmentSize === "4000 - 5000") {
    sizeMin = 4000;
    sizeMax = 5000;
  } else if (apartmentSize === "5000 - 6000") {
    sizeMin = 5000;
    sizeMax = 6000;
  } else if (apartmentSize === "6000 - 7000") {
    sizeMin = 6000;
    sizeMax = 7000;
  } else if (apartmentSize === "7000 - 8000") {
    sizeMin = 7000;
    sizeMax = 8000;
  } else if (apartmentSize === "8000 - 9000") {
    sizeMin = 8000;
    sizeMax = 9000;
  } else if (apartmentSize === "9000 - 10000") {
    sizeMin = 9000;
    sizeMax = 10000;
  }
  const apartmentOccupantCapacity = req.body.occupantCapacity;


  try {
    let allAvailableApartmentList =
      await apartmentData.getAllApartmentSelectedZipCode(
        apartmentZipcode,
        apartmentState,
        apartmentCity,
        rentMin,
        rentMax,
        sizeMin,
        sizeMax,
        apartmentOccupantCapacity
      );


    res.status(200).render(
      "apartment-listing",
      {
        apartmentListing: allAvailableApartmentList,
        username: req.session.user?.username,
        email: req.session.user?.email,
        isNotLogin: !req.session.user,
      }

    );
    // }
  } catch (e) {
    console.log(e);
    res.status(404).render("apartment-listing", {
      error: `There is no apartment found for the given filters: ${apartmentZipcode}`,
    });
  }
});

router.post("/apartmentAddress", isLogin, async (req, res) => {
  const apartmentAddress = req.body.address;
  if (!apartmentAddress) {
    res.status(404).render("city-choosing", {
      title: "Apartment Finder",
      username: req.session.user?.username,
      email: req.session.user?.email,
      isNotLogin: !req.session.user,
      errorAddress: `You must enter an address`,
    });
    return
  }else if(apartmentAddress.trim().length === 0){
    res.status(404).render("city-choosing", {
      title: "Apartment Finder",
      username: req.session.user?.username,
      email: req.session.user?.email,
      isNotLogin: !req.session.user,
      errorAddress: `You must enter an address that is not just spaces`,
    });
    return
  }else if(typeof apartmentAddress != "string"){
    res.status(404).render("city-choosing", {
      title: "Apartment Finder",
      username: req.session.user?.username,
      email: req.session.user?.email,
      isNotLogin: !req.session.user,
      errorAddress: `Address must be a string.`,
    });
    return
  }

  try {
    const apartment = await apartmentData.getApartmentAddress(apartmentAddress);

    if (apartment.length === 0){

        res.status(404).render("city-choosing", {
          title: "Apartment Finder",
          username: req.session.user?.username,
          email: req.session.user?.email,
          isNotLogin: !req.session.user,
          errorAddress: `No apartment with this address exists.`,
      });
    }else{

      res.status(200).render("each-apartment-listing", {
        apartmentListing: apartment,
        reviews: apartment[0].reviews,
        username: req.session.user?.username,
        email: req.session.user?.email,
        isNotLogin: !req.session.user,
      });
    }
    
  } catch (e) {
    console.log(e);
    res.status(404);
    console.log(e);
  }
});

router.delete("/apartment/:id", isLogin, async (req, res) => {
  let apartmentId = req.params.id;
  apartmentId = apartmentId.trim();
  console.log("inside apartment id routes", apartmentId);
  const apartmentCollections = await apartment();
  await apartmentCollections.deleteOne({ _id: ObjectId(apartmentId) });
  const userCollections = await users();
  await userCollections.updateOne(
    { _id: ObjectId(req.session.user._id) },
    {
      $set: {
        savedApartments: req.session.user.savedApartments.filter((v) => {
          return v !== apartmentId;
        }),
      },
    }
  );
  res.send("success");
});

router.get("/apartment/:id", isLogin, async (req, res) => {
  let apartmentId = req.params.id;
  apartmentId = apartmentId.trim();

  try {
    let apartment = await apartmentData.getApartmentById(apartmentId);
    if (apartment) {


      const isDelete =
        req.session.user.usertype === "admin" ||
        req.session.user.email === apartment[0].useremail;
      res.status(200).render(
        "each-apartment-listing",
        {
          isDelete,
          apartmentListing: apartment,
          reviews: apartment[0].reviews,
          username: req.session.user?.username,
          email: req.session.user?.email,
          isNotLogin: !req.session.user,
        }

      );
    } else {
  
      res.status(404).render("each-apartment-listing", {
        error_message: "Request failed with status code 404",
        title: "Error",
        apartmentId: apartmentId,
        username: req.session.user?.username,
        email: req.session.user?.email,
        isNotLogin: !req.session.user,
      });
      return;
    }
  } catch (e) {
   
    res.status(404).render("each-apartment-listing", {
      error_message: "Request failed with status code 404",
      title: "Error",
      apartmentId: apartmentId,
      username: req.session.user?.username,
      email: req.session.user?.email,
      isNotLogin: !req.session.user,
    });
    return;
  }
});

module.exports = router;
