const mongoCollections = require("../config/mongoCollections");
const apartment = mongoCollections.apartment;
const { ObjectId } = require("mongodb");

module.exports = {
  async create(
    state,
    city,
    photosArr,
    address,
    zipcode,
    rent,
    size,
    occupantCapacity,
    useremail
  ) {
    let photosInvalidFlag = false;

    console.log(arguments.length);
    if (arguments.length !== 9)
      throw "Incorrect numbers of passed arguments, it should be 6";
    /* if (!name) throw 'You must provide a name to search for';
if (typeof name !== 'string') throw 'name must be a string';
if(containsSpecialChars(name)) throw 'Name cannot contain special characters';
if (name.trim().length === 0) throw 'Name cannot be an empty string or just spaces';
if(!isNaN(name)) throw `${name} is not a valid value for name.`;
    name = name.trim(); */
    if (!state) throw "You must provide state ";
    if (typeof state !== "string") throw "address must be a string";
    if (state.trim().length === 0)
      throw "state cannot be an empty string or just spaces";
    state = state.trim();

    if (!city) throw "You must provide city";
    if (typeof city !== "string") throw "city must be a string";
    if (city.trim().length === 0)
      throw "city cannot be an empty string or just spaces";
    city = city.trim();

    // if (!photos) throw 'You must provide photos of apartment';
    // if (!photos ||  !Array.isArray(photos)) throw 'You must provide an array of photos';
    // if (photos.length === 0) throw 'You must supply at least one photos';
    // for (i in photos) {
    //   if (typeof photos[i] !== 'string' || photos[i].trim().length === 0) {
    //     photosInvalidFlag = true;
    //     break;
    //   }
    //   photos[i] = photos[i].trim();
    // }
    // if (photosInvalidFlag)
    //       throw 'One or more photos is an empty';

    if (!address) throw "You must provide address of the apartment";
    if (typeof address !== "string") throw "address must be a string";
    if (address.trim().length === 0)
      throw "address cannot be an empty string or just spaces";
    address = address.trim();

    if (!zipcode) throw "You must provide zipcode of the apartment";
    //if (typeof zipcode !== 'number') throw 'zipcode must be in number';
    if (zipcode.trim().length === 0)
      throw "zipcode cannot be an empty string or just spaces";
    if (zipcode.trim().length < 5) throw "zipcode cannot be less than 5 digit";
    zipcode = zipcode.trim();

    if (!rent) throw "You must provide rent of the apartment";
    //if (typeof rent !== 'number') throw 'rent must be in number';
    if (rent.trim().length === 0)
      throw "rent cannot be an empty string or just spaces";
    rent = rent.trim();

    if (!size) throw "You must provide size of the apartment";
    //if (typeof size !== 'number') throw 'size must be in square feet';
    if (size.trim().length === 0)
      throw "size cannot be an empty string or just spaces";
    size = size.trim();

    if (!occupantCapacity)
      throw "You must provide occupantCapacity of the apartment";
    //if (typeof occupantCapacity !== 'number') throw 'occupantCapacity must be in number';
    if (occupantCapacity > 10 && occupantCapacity < 1)
      throw "occupantCapacity can not be grater than 10 and less than 1";
    if (occupantCapacity.trim().length === 0)
      throw "occupantCapacity cannot be an empty string or just spaces";
    occupantCapacity = occupantCapacity.trim();

    //state, city, photos, address, zipcode, rent, size, occupantCapacity
    let newApartment = {
      _id: ObjectId(),
      state: state,
      city: city,
      photos: photosArr,
      address: address,
      zipcode: zipcode,
      rent: rent,
      size: size,
      occupantCapacity: occupantCapacity,
      reviews: [],
      useremail,
    };

    //console.log(newBand);
    const apartmentCollection = await apartment();
    const insertInfo = await apartmentCollection.insertOne(newApartment);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
      throw "Could not add apartment";

    const newId = insertInfo.insertedId.toString();
    //const returnBand = await this.get(newId);
    //  return returnBand;
    return newId;
  },

  /* async getAll(){
  let element, arr = [];
  const bandsCollection = await bands();
    const bandsList = await bandsCollection.find({}).toArray();
    if (!bandsList) throw 'Could not get all bands';
    for(let i = 0;i<bandsList.length;i++){
        element = bandsList[i];
       element._id = element._id.toString();
       arr.push(element); 
      // bandsList[i]._id.toString();
    }
    return arr;
    // return bandsList;
}, */

  async getAllApartmentSelectedZipCode(
    zipcode,
    state,
    city,
    rent,
    size,
    occupantCapacity
  ) {
    if (!zipcode) throw "You must provide an id to search for";
    //if (typeof zipcode !== 'string') throw 'Id must be a string';
    if (zipcode.trim().length === 0)
      throw "zipcode cannot be an empty string or just spaces";
    zipcode = zipcode.trim();
    if (!zipcode) zipcode == null;
    console.log("here", state)
    // zipcode ? zipcode : null

    //if (!ObjectId.isValid(id)) throw 'ID is not a valid object ID';
    const apartmentCollection = await apartment();
    let apartmentData = await apartmentCollection
      .find({
        zipcode: zipcode,
      })
      .toArray();
    if (state) {
      for (apt of apartmentData) {
          apartmentData = apartmentData.filter(apt => apt.state === state)
          console.log("ooo", apartmentData)
      }
    }
    if (city) {
      for (apt of apartmentData) {
        apartmentData = apartmentData.filter(apt => apt.city === city)
      }
    }
    if (rent) {
      for (apt of apartmentData) {
        apartmentData = apartmentData.filter(apt => apt.rent === rent)
        }
    }
    if (size) {
      for (apt of apartmentData) {
        apartmentData = apartmentData.filter(apt => apt.size === size)
      }
    }
    if (occupantCapacity) {
      for (apt of apartmentData) {
        apartmentData = apartmentData.filter(apt => apt.occupantCapacity === occupantCapacity)
      }
    }


    console.log("the", apartmentData);

    //console.log("inside data", apartmentData,"apartment id",apartmentData[0].state,apartmentData[0]._id.toString());

    for (let i in apartmentData) {
      apartmentData[i]._id = apartmentData[i]._id.toString();
    }

    console.log("aaaaaaaaaaswerfd", apartmentData);
    if (apartmentData === null)
      throw "No apartment available for this zip code";
    //banggo._id = banggo._id.toString();
    return apartmentData;
  },

  async getAllApartment() {
    const apartmentCollection = await apartment();
    const apartmentData = await apartmentCollection.find({}).toArray();

    for (let i in apartmentData) {
      apartmentData[i]._id = apartmentData[i]._id.toString();
    }
    if (apartmentData === null) throw "No apartment available";
    //banggo._id = banggo._id.toString();
    return apartmentData;
  },

  async sortAllApartmentByPrice() {
    const apartmentCollection = await apartment();
    const apartmentData = await apartmentCollection
      .find({}, { _id: 0 })
      .sort({ rent: 1 })
      .toArray();

    for (let i in apartmentData) {
      apartmentData[i]._id = apartmentData[i]._id.toString();
    }
    if (apartmentData === null) throw "No apartment available";
    //banggo._id = banggo._id.toString();
    return apartmentData;
  },

  async getApartmentById(apartmentId) {
    if (!apartmentId) throw "You must provide an apartment id to search for";
    //if (typeof zipcode !== 'string') throw 'Id must be a string';
    if (apartmentId.trim().length === 0)
      throw "apartment cannot be an empty string or just spaces";
    apartmentId = apartmentId.trim();
    //if (!ObjectId.isValid(id)) throw 'ID is not a valid object ID';

    console.log("aprt id..", apartmentId, typeof apartmentId);

    apartmentId = ObjectId(apartmentId);

    console.log("aprt id object..", apartmentId, typeof apartmentId);
    const apartmentCollection = await apartment();
    const apartmentIdData = await apartmentCollection
      .find({
        _id: ObjectId(apartmentId),
      })
      .toArray();

    //console.log("inside data", apartmentData,"apartment id",apartmentData[0].state,apartmentData[0]._id.toString());

    console.log("asedf", apartmentIdData);
    // apartmentIdData = apartmentIdData.toString();
    // console.log("qwerty",apartmentIdData[0].reviews);
    if (apartmentIdData === null)
      throw "No apartment available for this search";
    //banggo._id = banggo._id.toString();
    return apartmentIdData;
  },

  /* async remove(id){
  //console.log(id, typeof id);
  if (!id) throw 'You must provide an id to search for';
    if (typeof id !== 'string') throw 'Id must be a string';
    if (id.trim().length === 0)
      throw 'id cannot be an empty string or just spaces';
    id = id.trim();
    if (!ObjectId.isValid(id)) throw 'invalid object ID';

    const bandsCollection = await bands();
    const returnBand = await this.get(id);
    //console.log(returnBand);
    const deletionInfo = await bandsCollection.deleteOne({
      _id: ObjectId(id)
    });

    if (deletionInfo.deletedCount === 0) {
      throw `Could not delete band with id of ${id}`;
    }
    
      //return `"${returnBand.name.toString()} band has been successfully deleted from DB!"`;    
      return deletionInfo.deletedCount; //var: 0,1,2
},
 */

  /* async update(id, name, genre, website, recordLabel, bandMembers, yearFormed){
 let genreInvalidFlag = false;
 let bandMembersInvalidFlag = false;
 if(arguments.length !== 7 ) throw "Number of arguments should be 7";
  if (!id) throw 'You must provide an id to search for';
  if (typeof id !== 'string') throw 'Id must be a string';
  if (id.trim().length === 0)
    throw 'Id cannot be an empty string or just spaces';
  id = id.trim();
  if (!ObjectId.isValid(id)) throw 'Id is an invalid object ID';

  if (!name) throw 'You must provide a name for your band';
  if (typeof name !== 'string') throw 'Name must be a string';

  //if(containsSpecialChars(name)) throw 'Name cannot contain special characters';
  if (name.trim().length === 0)
    throw 'Name cannot be an empty string or string with just spaces';  
  //if(!isNaN(name)) throw `${name} is not a valid value for name.` ;
  name = name.trim();

  if (!genre) throw 'You must provide genre to search for';
if (!genre ||  !Array.isArray(genre)) throw 'You must provide an array of genre';
if (genre.length === 0) throw 'You must supply at least one genre';
for (i in genre) {
  if (typeof genre[i] !== 'string' || genre[i].trim().length === 0) {
    genreInvalidFlag = true;
    break;
  }
  genre[i] = genre[i].trim();
}
if (genreInvalidFlag)
      throw 'One or more genre is not a string or is an empty string or genre value is number';

      if (!website) throw 'You must provide website to search for';
      if (typeof website !== 'string') throw 'name must be a string';
      
      //var res = website.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
      let webPattern = /^(http:\/\/){1}(www\.){1}.[-a-zA-Z]{4,}(\.com)$/;
      if(!webPattern.test(website)) throw 'You must provide correct website';
      
      
      if (!recordLabel) throw 'You must provide recordLabel to search for';
      if (typeof recordLabel !== 'string') throw 'recordLabel must be a string';
      if (recordLabel.trim().length === 0)
      throw 'Name cannot be an empty string or just spaces';
      recordLabel = recordLabel.trim();
      
      if (!bandMembers) throw 'You must provide bandMembers to search for';
      if (!Array.isArray(bandMembers)) throw 'You must provide an array of band Members';
      if (bandMembers.length === 0) throw 'You must supply at least one band Members';
      for (i in bandMembers) {
        if (typeof bandMembers[i] !== 'string' || bandMembers[i].trim().length === 0 ) {
         
          bandMembersInvalidFlag = true;
          break;
        }
        bandMembers[i] = bandMembers[i].trim();
      }
      if (bandMembersInvalidFlag)
            throw 'One or more band members is not a string or is an empty string or band member value is number';
      
      if (!yearFormed) throw 'You must provide yearsFormed to search for';
      if(typeof yearFormed !== 'number') throw 'You must provide years in numbers';
      yearValidation(yearFormed); 
    
  
  const bandsCollection = await bands();
  const returnBand = await this.get(id);
  // if(returnBand.name.trim() === name) throw 'Name is same as exisitng name. You must provide a different name!' 
  //since a put request will replace the data even if it's the same.
  let updateBand = {
    name: name,
    genre: genre,
    website: website,
    recordLabel: recordLabel,
    bandMembers: bandMembers,
    yearFormed: yearFormed
  };
 
  const updatedInfo = await bandsCollection.updateOne({
     _id: ObjectId(id)},
    {
      $set: updateBand
    }); 
  if (updatedInfo.modifiedCount === 0) {
    throw 'could not update band successfully';
  }
  
  const returnBand1 = await this.get(id);
  return returnBand1;
} */
};

// return true if it contains special characters
function containsSpecialChars(str) {
  const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  return specialChars.test(str);
}

function yearValidation(year) {
  let text = /^[0-9]+$/;
  if (isNaN(year)) throw "year is not a number";
  if (year !== 0) {
    if (year !== "" && !text.test(year)) {
      throw "Please Enter Numeric Values Only";
    }
    if (typeof year !== "number") throw "Year should be in numbers only";
    //console.log("year.length",year.toString().length);
    if (year.toString().length !== 4) throw "Year is not proper. Please check";
    if (year < 1900 || year > 2022)
      throw "Only years 1900-2022 are the valid values";
  } else {
    throw "Year can not be 0";
  }
}
//module.exports = exportedMethods;
