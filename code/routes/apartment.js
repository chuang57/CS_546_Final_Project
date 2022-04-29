const express = require("express");
const router = express.Router();
const data = require("../data");
const apartmentData = data.apartment;
const { ObjectId } = require("mongodb");
const mongoconnection = require("../config/mongoConnection");
const { isLogin } = require("../middleware/auth");

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

router.post("/newApartment", isLogin, async (req, res) => {
  try {
    res.render("new-apartment");
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.post("/newApartmentInfo", isLogin, async (req, res) => {
  let photosArr = [];
  let state = req.body.state;
  let city = req.body.city;

  // console.log("req.body.photos",req.body.photos);
  // console.log("req.body.photos length",req.body.photos);
  if (!Array.isArray(req.body.photos)) {
    photosArr.push(req.body.photos);
  } else photosArr = req.body.photos;
  console.log("photosArr", photosArr);
  // console.log("photosArr", photosArr);
  let address = req.body.address;
  let zipcode = req.body.zipcode;
  let rent = req.body.rent;
  let size = req.body.size;
  let occupantCapacity = req.body.occupantCapacity;
  try {
    /* var obj = {
        data: req.body.photos
    }; */
    let x = await apartmentData.create(
      state,
      city,
      photosArr,
      address,
      zipcode,
      rent,
      size,
      occupantCapacity
    );
  } catch (e) {
    res.status(500).json({ error: e });
  }
});
// ["https://image.shutterstock.com/image-photo/modern-architecture-urban-residential-apartment-260nw-1865190721.jpg"]
router.route("/", isLogin).post(async (req, res) => {
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
    //console.log("new band",newBand);
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
        allApartmentListing: allAvailableApartmentList,
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
    res.status(404).json({ error: e });
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
  console.log("apartmentZipcode", apartmentZipcode);
  if (!apartmentZipcode) {
    res.status(400).render("error", {
      error: "Please provide zipcode to search the apartment",
    });
    return;
  }

  try {
    let allAvailableApartmentList =
      await apartmentData.getAllApartmentSelectedZipCode(apartmentZipcode);
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
    res.status(404).render("apartment-listing",{error: `There is no show found for the given Zip code: ${apartmentZipcode}`});
  }
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

  //console.log("showId",showId);
  try {
    let apartment = await apartmentData.getApartmentById(apartmentId);
    // console.log(show);
    if (apartment) {
      // res.status(200).render('each-apartment-listing', { singalShow: show, title: show.name, summary: show.summary, image: images, rating: show.rating.average, network:network,language:show.language, genres:show.genres});
      // res.status(200).json(apartment);

      console.log("-------------", apartment.photos, apartment[0].photos);
      res.status(200).render(
        "each-apartment-listing",
        {
          eachApartmentListing: apartment,
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
      // console.log("1");
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
    // console.log("2");
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
