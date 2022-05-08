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
const { getApartmentById } = require("../data/apartment");

router.get("/", isLogin, async (req, res) => {
  let arr = [],
    obj = {};
  //console.log("in get routes of apartment");
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
    //console.log(e);
    res.status(500).json({ error: e });
  }
});

router.get("/:id/updateApartment", isLogin, async (req, res) => {
  //console.log("in get routes of updateApartment", req.params.id, req.body);
  let x = await apartmentData.getApartmentById(req.params.id);

  //console.log("x",x);
  let state = x[0].state;
  let city = x[0].city;
  let address = x[0].address;
  let zipcode = x[0].zipcode;
  let rent = x[0].rent;
  let size= x[0].size;
  let occupantCapacity = x[0].occupantCapacity;
  let contactInfo = x[0].contactInfo;

  res.render("update-apartment", {
    apartmentId: req.params.id,
    username: req.session.user?.username,
    email: req.session.user?.email,
    isNotLogin: !req.session.user,
    state:state,
    city:city,
    address:address,
    zipcode:zipcode,
    rent:rent,
    size:size,
    occupantCapacity:occupantCapacity,
    contactInfo:contactInfo
  });
  return;
});



router.post("/:id/updateApartmentInfo", isLogin, upload.array("photos"), async (req, res) => {
  //console.log("in post routes of updateApartment info", req.params.id, req.body);
  let state = xss(req.body.state);
  let city = xss(req.body.city);
  let address = xss(req.body.address);
  let zipcode = xss(req.body.zipcode);
  let rent = xss(req.body.rent);
  let size = xss(req.body.size);
  let occupantCapacity = xss(req.body.occupantCapacity);
  try{
   // console.log("this", req.files);
    const paths = req.files.map((file) => file.path);
    const paths2 = paths.map((file) => "\\" + file);
    let x = await apartmentData.update(
      req.params.id,
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

    //console.log("x...",x);
    const apartmentCollections = await apartment();
  const allAddedApartmentListing = (
    await apartmentCollections.find({}).toArray()
  ).filter((v) => {
    return req.session.user.AddedProperty.includes(v._id.toString());
  });


  //console.log("allAddedApartmentListing..........",allAddedApartmentListing);
    res.status(200).render("checkAllAddedApartments", {
      success: "Your property has been successfully added!",
      allAddedApartmentListing: allAddedApartmentListing,
      username: req.session.user?.username,
      email: req.session.user?.email,
      isNotLogin: !req.session.user,
    });
  }
  catch(e)
  {
    res.status(400).redirect(`/:id/updateApartment?error=${e}`);
  }

});

router.post(
  "/newApartmentInfo",
  isLogin,
  upload.array("photos"),
  async (req, res) => {
    console.log("do")
    let city = req.body.city;
    let address = req.body.address;
    let zipcode = req.body.zipcode;
    let rent = req.body.rent;
    let size = req.body.size;
    let occupantCapacity = req.body.occupantCapacity;
    try {

      const paths = req.files?.map((file) => file.path);
      const paths2 = paths?.map((file) => "\\" + file) || '';
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
      res.status(400).send(e);
    }
  }
);

router.route("/").post(async (req, res) => {
  const apartmentInfo = req.body.zipcode;
  let bandMembersInvalidFlag = false;
  let genreInvalidFlag = false;
 // console.log("apartmentInfo", apartmentInfo);

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
    //console.log(e);
    res.status(500).json({ error: e });
  }
});

router.get("/apartment/sortbyrent", isLogin, async (req, res) => {
  try {
    let sortAllApartmentByPrice = await apartmentData.sortAllApartmentByPrice();
    //console.log("sorted", sortAllApartmentByPrice);
    res.status(200).render(
      "all-apartment-listing",
      { allApartmentListing: sortAllApartmentByPrice }
      ////   city: allAvailableApartmentList[i].city,
      // address:allAvailableApartmentList[i].address,
      // rent:allAvailableApartmentList[i].rent,
      //size:allAvailableApartmentList[i].size,
      //occupantCapacity:allAvailableApartmentList[i].occupantCapacity }
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
  if (apartmentSize === "1 -$1000") {
    rentMin = 1;
    rentMax = 1000;
  } else if (apartmentSize === "1000 - 2000") {
    rentMin = 1000;
    rentMax = 2000;
  } else if (apartmentSize === "2000 - 3000") {
    rentMin = 2000;
    rentMax = 3000;
  } else if (apartmentSize === "3000 - 4000") {
    rentMin = 3000;
    rentMax = 4000;
  } else if (apartmentSize === "4000 - 5000") {
    rentMin = 4000;
    rentMax = 5000;
  } else if (apartmentSize === "5000 - 6000") {
    rentMin = 5000;
    rentMax = 6000;
  } else if (apartmentSize === "6000 - 7000") {
    rentMin = 6000;
    rentMax = 7000;
  } else if (apartmentSize === "7000 - 8000") {
    rentMin = 7000;
    rentMax = 8000;
  } else if (apartmentSize === "8000 - 9000") {
    rentMin = 8000;
    rentMax = 9000;
  } else if (apartmentSize === "9000 - 10000") {
    rentMin = 9000;
    rentMax = 10000;
  }
  const apartmentOccupantCapacity = req.body.occupantCapacity;
  //console.log("state", apartmentState);
  // console.log("apartmentZipcode", apartmentZipcode);
  // if (!apartmentZipcode) {
  //   res.status(400).render("error", {
  //     error: "Please provide zipcode to search the apartment",
  //   });
  //   return;
  // }

  if (!isNaN(apartmentCity)){
    res.status(404).render("apartment-listing", {
      error: `${apartmentCity} is not a valid value for city.`,
      
    });
    return;
  }  

  if (containsSpecialChars(apartmentCity) === true){
    res.status(404).render("apartment-listing", {
      error: `${apartmentCity} is not a valid value for city.`,
      
    });
    return;
  }
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
    //console.log("hi", allAvailableApartmentList);
   
    
  
   // if (containsSpecialChars(apartmentCity) === true) throw "city cannot contain special characters";
    //res.status(200).json(allAvailableApartmentList);
    //console.log("allAvailableApartmentList......",allAvailableApartmentList);

    //for(let i in allAvailableApartmentList){
   // console.log("check.........", allAvailableApartmentList[0].photos[0]);

    res.status(200).render(
      "apartment-listing",
      {
        apartmentListing: allAvailableApartmentList,
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
    //console.log(e);
    res
      .status(404)
      .render("apartment-listing", {
        error: `There is no apartment found for the given filters ${apartmentZipcode}`,
      });
  }
});

router.post("/apartmentAddress", isLogin, async (req, res) => {
  const apartmentAddress = req.body.address;
  //console.log("yo", apartmentAddress)

  try {
    let apartment = await apartmentData.getApartmentAddress(
      apartmentAddress
    );
    //res.status(200).json(allAvailableApartmentList);
    //console.log("allAvailableApartmentList......",allAvailableApartmentList);

    //for(let i in allAvailableApartmentList){

    res.status(200).render(
      "each-apartment-listing",
      {
        apartmentListing: apartment,
        reviews: apartment[0].reviews,
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
    //console.log(e);
    res
      .status(404)
     // console.log(e)
  }
});

router.delete("/apartment/:id", isLogin, async (req, res) => {
  let apartmentId = req.params.id;
  apartmentId = apartmentId.trim();
  //console.log("inside apartment id routes", apartmentId);
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
  //console.log("inside apartment id routes", apartmentId);
  try {
    let apartment = await apartmentData.getApartmentById(apartmentId);
    if (apartment) {
      // res.status(200).render('each-apartment-listing', { singalShow: show, title: show.name, summary: show.summary, image: images, rating: show.rating.average, network:network,language:show.language, genres:show.genres});
      // res.status(200).json(apartment);
      //console.log("Buffers", apartment);
      // pht = apartment.photos;
      // console.log("Buffer", pht[0]);

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

        ////   city: allAvailableApartmentList[i].city,
        // address:allAvailableApartmentList[i].address,
        // rent:allAvailableApartmentList[i].rent,
        //size:allAvailableApartmentList[i].size,
        //occupantCapacity:allAvailableApartmentList[i].occupantCapacity }
      );
    } else {

      //console.log(e);
      //res.status(404).render('singleShow', { error_message: `There is no show found for the given ID: ${showId}`, title: "Error", showId: showId});
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
    //res.status(500).json({ error: e });
    //res.status(404).render('singleShow', { error_message: `There is no show found for the given ID: ${showId}`, title: "Error", showId: showId});
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


function containsSpecialChars(str) {
  const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  return specialChars.test(str);
}
module.exports = router;
