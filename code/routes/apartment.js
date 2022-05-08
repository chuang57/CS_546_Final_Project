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
  console.log("in get routes of apartment");
  res.render("city-choosing", {
    title: "Apartment Finder",
    username: req.session.user?.username,
    email: req.session.user?.email,
    isNotLogin: !req.session.user,
  });
  return;
  //res.status(200).json("hello apartment finder");
  /*  try {
    const getAllBands = await bandsData.getAll(req.params.id);
   for(let i = 0;i<getAllBands.length;i++){
    obj =  {"_id": getAllBands[i]._id,"name": getAllBands[i].name};
    arr.push(obj);
   }
    res.status(200).json(arr);
  
  } catch (e) {
    res.status(500).json({ error: e });
  } */
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

/* router.get("/:id/updateApartment", isLogin, async (req, res) => {
  console.log("in get routes of updateApartment", req.params.id, req.body);
  let x = await apartmentData.getApartmentById(req.params.id);

  console.log("x",x);
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
}); */


/* router.post("/:id/updateApartmentInfo",
  isLogin, 
  upload.array("photos"), 
  async (req, res) => {
  console.log("in post routes of updateApartment info", req.params.id, req.body);
  let state = req.body.state;
  let city = req.body.city;
  let address = req.body.address;
  let zipcode = req.body.zipcode;
  let rent = req.body.rent;
  let size = req.body.size;
  let occupantCapacity = req.body.occupantCapacity;
  try{
   // console.log("this", req.files);
   // const paths = req.files.map((file) => file.path);
   // const paths2 = paths.map((file) => "\\" + file);
  // let id = ObjectId(req.params.id);
   console.log("id........");
    let x = await apartmentData.update(
      req.params.id,
      //id,
      req.body.state,
      req.body.city,
     // paths2,
      req.body.address,
      req.body.zipcode,
      req.body.rent,
      req.body.size,
      req.body.occupantCapacity,
      req.body.contactInfo,
      //req.session.user.email,
      req.session.user._id

    );

    console.log("x...",x);
    const apartmentCollections = await apartment();
  const allAddedApartmentListing = (
    await apartmentCollections.find({}).toArray()
  ).filter((v) => {
    return req.session.user.AddedProperty.includes(v._id.toString());
  });


  console.log("allAddedApartmentListing..........",allAddedApartmentListing);
    res.status(200).render("checkAllAddedApartments", {
      success: "Your property has been successfully updated!",
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

}); */

router.post(
  "/newApartmentInfo",
  isLogin,
  upload.array("photos"),
  async (req, res) => {
  // let state = xss(req.body.state);
  // let city = xss(req.body.city);
  // let address = xss(req.body.address);
  // let zipcode = xss(req.body.zipcode);
  // let rent = xss(req.body.rent);
  // let size = xss(req.body.size);
  // let occupantCapacity = xss(req.body.occupantCapacity);
    try {
      let state = req.body.state
      let city = req.body.city
      let address = req.body.address
      let zipcode = req.body.zipcode
      console.log(zipcode)
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
              console.log(zipcode)
              console.log(typeof zipcode)
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
      console.log("apartment crate request sessino", req.session.user._id);
      console.log("this", req.files);
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
  console.log("apartmentInfo", apartmentInfo);
  /*  if(Object.keys(bandsInfo).length!==6){
    res.status(400).json({ error: 'You must provide the correct data to create the band'});
    return;
  }
  if(!bandsInfo){
      res.status(400).json({ error: 'You must provide data to create a band.'});
    return;
  }
  if (!bandsInfo.name) {
    res.status(400).json({ error: 'You must provide a name.' });
    return;
  }
  if (!bandsInfo.genre) {
    res.status(400).json({ error: 'You must provide a genre.' });
    return;
  }
  if (!bandsInfo.website) {
    res.status(400).json({ error: 'You must provide a website.' });
    return;
  }
  if (!bandsInfo.recordLabel) {
      res.status(400).json({ error: 'You must provide a record label.' });
      return;
    }
  if (!bandsInfo.bandMembers) {
      res.status(400).json({ error: 'You must provide band members.' });
      return;
    }
    if (bandsInfo.yearFormed!=0 && !bandsInfo.yearFormed) {
      res.status(400).json({ error: 'You must provide year formed.' });
      return;
    } 
    
    if (typeof bandsInfo.name!== 'string') {
      res.status(400).json({ error: 'name must be a string.' });
      return;
    } 
    if (bandsInfo.name.trim().length === 0) {
      res.status(400).json({ error: 'Name cannot be an empty string or just spaces.' });
      return;
    } 
  
    if (typeof bandsInfo.website!== 'string') {
      res.status(400).json({ error: 'website must be a string.' });
      return;
    } 

    let webPattern = /^(http:\/\/){1}(www\.){1}.[-a-zA-Z]{4,}(\.com)$/;
    if (!webPattern.test(bandsInfo.website)) {
      res.status(400).json({ error: 'You must provide correct website.' });
      return;
    } 

    if (typeof bandsInfo.recordLabel!== 'string') {
      res.status(400).json({ error: 'recordLabel must be a string.' });
      return;
    } 

    if (bandsInfo.recordLabel.trim().length === 0) {
      res.status(400).json({ error: 'recordLabel cannot be an empty string or just spaces.' });
      return;
    } bandsInfo.recordLabel = bandsInfo.recordLabel.trim();

    if (typeof bandsInfo.recordLabel!== 'string') {
      res.status(400).json({ error: 'recordLabel must be a string.' });
      return;
    } 

    if (!Array.isArray(bandsInfo.bandMembers)) {
      res.status(400).json({ error: 'You must provide an array of band Members.' });
      return;
    } 
    if (bandsInfo.bandMembers.length === 0) {
      res.status(400).json({ error: 'You must supply at least one band Members.' });
      return;
    } 
    
    for (i in bandsInfo.bandMembers) {
      if (typeof bandsInfo.bandMembers[i] !== 'string' || bandsInfo.bandMembers[i].trim().length === 0) {
        bandMembersInvalidFlag = true;
        break;
      }
      bandsInfo.bandMembers[i] = bandsInfo.bandMembers[i].trim();
    }
    
    if (bandMembersInvalidFlag){
      res.status(400).json({ error: 'One or more band members is not a string or is an empty string.' });
      return;
    } 

    if (!bandsInfo.genre ||  !Array.isArray(bandsInfo.genre)){
      res.status(400).json({ error: 'You must provide an array of genre.' });
      return;
    } 
    if (bandsInfo.genre.length === 0){
      res.status(400).json({ error: 'You must supply at least one genre.' });
      return;
    } 
   
for (i in bandsInfo.genre) {
  if (typeof bandsInfo.genre[i] !== 'string' || bandsInfo.genre[i].trim().length === 0) {
    genreInvalidFlag = true;
    break;
  }
  bandsInfo.genre[i] = bandsInfo.genre[i].trim();
}
if (genreInvalidFlag){
  res.status(400).json({ error: 'One or more genre is not a string or is an empty string.' });
  return;
} 

 if (typeof bandsInfo.yearFormed !== 'number') {
      res.status(400).json({ error: 'You must provide years in numbers.' });
      return;
    }  
    
    let text = /^[0-9]+$/;
    if (isNaN(bandsInfo.yearFormed)) {
      res.status(400).json({ error: 'year is not a number.' });
      return;
    } 
    if (bandsInfo.yearFormed !== 0) {
    if ((bandsInfo.yearFormed !== "") && (!text.test(bandsInfo.yearFormed))) {
      res.status(400).json({ error: 'Please Enter Numeric Values Only.' });
      return;
    } 
    if (typeof bandsInfo.yearFormed !== 'number') {
      res.status(400).json({ error: 'Year should be in numbers only.' });
      return;
    } 
   if (bandsInfo.yearFormed.toString().length !== 4) {
      res.status(400).json({ error: 'Year is not proper. Please check.' });
      return;
    } 
    if (bandsInfo.yearFormed<1900 || bandsInfo.yearFormed > 2022) {
      res.status(400).json({ error: 'Only years 1900-2022 are the valid values.' });
      return;
    } 
  }else{
    res.status(400).json({ error: 'Year can not be 0.' });
    return;
  }
 */
  // state, city, photos, address, zipcode, rent, size, occupantCapacity
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
    console.log("sorted", sortAllApartmentByPrice);
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
  console.log("state", apartmentState);
  // console.log("apartmentZipcode", apartmentZipcode);
  // if (!apartmentZipcode) {
  //   res.status(400).render("error", {
  //     error: "Please provide zipcode to search the apartment",
  //   });
  //   return;
  // }

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
    console.log("hi", allAvailableApartmentList);
    //res.status(200).json(allAvailableApartmentList);
    //console.log("allAvailableApartmentList......",allAvailableApartmentList);

    //for(let i in allAvailableApartmentList){
    console.log("check.........", allAvailableApartmentList[0].photos[0]);

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
    let apartment = await apartmentData.getApartmentAddress(apartmentAddress);
    console.log("yooooooooo")

    res.status(200).render("each-apartment-listing", {
      apartmentListing: apartment,
      reviews: apartment[0].reviews,
      username: req.session.user?.username,
      email: req.session.user?.email,
      isNotLogin: !req.session.user,
    });
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
  console.log("inside apartment id routes", apartmentId);

  /*     if (typeof req.params.id !== 'string') {
      res.status(400).json({ error: 'Id must be a string.' });
      return;} */
  /*   console.log(typeof showId,isNaN(showId));

   if (isNaN(showId)) {
      res.status(400).render('singleShow', { error_message: "Request failed with status code 400", title: "Error", showId: showId});
      return; 
  } 
*/

  try {
    let apartment = await apartmentData.getApartmentById(apartmentId);
    if (apartment) {
      // res.status(200).render('each-apartment-listing', { singalShow: show, title: show.name, summary: show.summary, image: images, rating: show.rating.average, network:network,language:show.language, genres:show.genres});
      // res.status(200).json(apartment);
      console.log("Buffers", apartment);
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

/* router
.route('/:id')
.get(async (req, res) => {
         req.params.id = req.params.id.trim();
        if (!req.params.id) {
          res.status(400).json({ error: 'You must Supply an ID to get band data' });
          return;
        }
        if (!ObjectId.isValid(req.params.id)) {
            res.status(400).json({ error: 'Provided band id is not a valid object ID.' });
            return;}
        if (typeof req.params.id !== 'string') {
            res.status(400).json({ error: 'Id must be a string.' });
            return;}
        if (req.params.id.trim().length === 0) {
            res.status(400).json({ error: 'band Id cannot be an empty string or just spaces.' });
            return;
        }
    try{
    let oneBandList = await bandsData.get(req.params.id);
    res.status(200).json(oneBandList);
  } catch (e) {
    res.status(404).json({ error:e});
  }
});
 */

/* router
.route('/:id')
.put( async (req, res) => {
  const bandsInfo = req.body;
  let bandMembersInvalidFlag = false;
  let genreInvalidFlag = false;  

  if (!req.params.id) {
    res.status(400).json({ error: 'You must Supply an ID to update the band' });
    return;
  } 
  if(Object.keys(bandsInfo).length!==6){
    res.status(400).json({ error: 'You must provide the correct data to update the band'});
    return;
  }
  if(!bandsInfo){
      res.status(400).json({ error: 'You must provide data to update a band'});
    return;
  }

  if (!bandsInfo.name) {
    res.status(400).json({ error: 'You must provide a name' });
    return;
  }
  if (!bandsInfo.genre) {
    res.status(400).json({ error: 'You must provide a genre' });
    return;
  }
  if (!bandsInfo.website) {
    res.status(400).json({ error: 'You must provide a website ' });
    return;
  }
  if (!bandsInfo.recordLabel) {
      res.status(400).json({ error: 'You must provide a record label ' });
      return;
    }

    if (!bandsInfo.bandMembers) {
      res.status(400).json({ error: 'You must provide band members ' });
      return;
    }
    if (!bandsInfo.yearFormed) {
      res.status(400).json({ error: 'You must provide year formed ' });
      return;
    }

if (bandsInfo.yearFormed!=0 && !bandsInfo.yearFormed) {
  res.status(400).json({ error: 'You must provide year formed.' });
  return;
} 

if (typeof bandsInfo.name!== 'string') {
  res.status(400).json({ error: 'name must be a string.' });
  return;
} 
if (bandsInfo.name.trim().length === 0) {
  res.status(400).json({ error: 'Name cannot be an empty string or just spaces.' });
  return;
} 

if (typeof bandsInfo.website!== 'string') {
  res.status(400).json({ error: 'website must be a string.' });
  return;
} 

let webPattern = /^(http:\/\/){1}(www\.){1}.[-a-zA-Z]{4,}(\.com)$/;
if (!webPattern.test(bandsInfo.website)) {
  res.status(400).json({ error: 'You must provide correct website.' });
  return;
} 

if (typeof bandsInfo.recordLabel!== 'string') {
  res.status(400).json({ error: 'recordLabel must be a string.' });
  return;
} 

if (bandsInfo.recordLabel.trim().length === 0) {
  res.status(400).json({ error: 'recordLabel cannot be an empty string or just spaces.' });
  return;
} bandsInfo.recordLabel = bandsInfo.recordLabel.trim();

if (typeof bandsInfo.recordLabel!== 'string') {
  res.status(400).json({ error: 'recordLabel must be a string.' });
  return;
} 

if (!Array.isArray(bandsInfo.bandMembers)) {
  res.status(400).json({ error: 'You must provide an array of band Members.' });
  return;
} 
if (bandsInfo.bandMembers.length === 0) {
  res.status(400).json({ error: 'You must supply at least one band Members.' });
  return;
} 

for (i in bandsInfo.bandMembers) {
  if (typeof bandsInfo.bandMembers[i] !== 'string' || bandsInfo.bandMembers[i].trim().length === 0) {
    bandMembersInvalidFlag = true;
    break;
  }
  bandsInfo.bandMembers[i] = bandsInfo.bandMembers[i].trim();
}

if (bandMembersInvalidFlag){
  res.status(400).json({ error: 'One or more band members is not a string or is an empty string.' });
  return;
} 

if (!bandsInfo.genre ||  !Array.isArray(bandsInfo.genre)){
  res.status(400).json({ error: 'You must provide an array of genre.' });
  return;
} 
if (bandsInfo.genre.length === 0){
  res.status(400).json({ error: 'You must supply at least one genre.' });
  return;
} 

for (i in bandsInfo.genre) {
if (typeof bandsInfo.genre[i] !== 'string' || bandsInfo.genre[i].trim().length === 0) {
genreInvalidFlag = true;
break;
}
bandsInfo.genre[i] = bandsInfo.genre[i].trim();
}
if (genreInvalidFlag){
res.status(400).json({ error: 'One or more genre is not a string or is an empty string.' });
return;
} 

if (typeof bandsInfo.yearFormed !== 'number') {
  res.status(400).json({ error: 'You must provide years in numbers.' });
  return;
}  

let text = /^[0-9]+$/;
if (isNaN(bandsInfo.yearFormed)) {
  res.status(400).json({ error: 'year is not a number.' });
  return;
} 
if (bandsInfo.yearFormed !== 0) {
if ((bandsInfo.yearFormed !== "") && (!text.test(bandsInfo.yearFormed))) {
  res.status(400).json({ error: 'Please Enter Numeric Values Only.' });
  return;
} 
if (typeof bandsInfo.yearFormed !== 'number') {
  res.status(400).json({ error: 'Year should be in numbers only.' });
  return;
} 
if (bandsInfo.yearFormed.toString().length !== 4) {
  res.status(400).json({ error: 'Year is not proper. Please check.' });
  return;
} 
if (bandsInfo.yearFormed<1900 || bandsInfo.yearFormed > 2022) {
  res.status(400).json({ error: 'Only years 1900-2022 are the valid values.' });
  return;
} 
}else{
res.status(400).json({ error: 'Year can not be 0.' });
return;
}
  try {
     // If no band exists with an _id of {id}, return a 404 and end the request. 
      const updatedBand = await bandsData.update(req.params.id,bandsInfo.name,bandsInfo.genre,bandsInfo.website,bandsInfo.recordLabel,bandsInfo.bandMembers,bandsInfo.yearFormed);
      res.status(200).json(updatedBand);
    } catch (e) {
      if(e === 'No band with that id'){
        res.status(404).json({ error: e });   
      }else res.status(400).json({ error: e });
      return;
    }
}); */

/* router
.route('/:id')
.delete( async (req, res) => {
  if (!req.params.id) {
    res.status(400).json({ error: 'You must Supply an ID to delete' });
    return;
  }

  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json({ error: 'Provided band id is not a valid object ID' });
    return;}


if (typeof req.params.id !== 'string') {
    res.status(400).json({ error: 'Id must be a string.' });
    return;}
if (req.params.id.trim().length === 0) {
    res.status(400).json({ error: 'band Id cannot be an empty string or just spaces.' });
    return;
}

  try {
    let deletedband = await bandsData.remove(req.params.id);
    //console.log(deletedband);
    if(deletedband ===1){
    res.status(200).json({"bandId" : req.params.id, "deleted": true });
  }
  } catch (e) {
    if(e === 'No band with that id'){
      res.status(404).json({ error: e });
      
    }else res.status(400).json({ error: e });
  }
}); */

module.exports = router;
