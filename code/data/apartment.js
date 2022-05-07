const mongoCollections = require("../config/mongoCollections");
const apartment = mongoCollections.apartment;
const users = mongoCollections.users;
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
    contactInfo,
    userSessionId

  ) {

    //console.log(arguments.length);
    if (arguments.length !== 10)
      throw "Incorrect numbers of passed arguments, it should be 8";
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
    if (!isNaN(city)) throw `${city} is not a valid value for city.`;
    if (containsSpecialChars(city) === true) throw "city cannot contain special characters";


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
    if (isNaN(zipcode)) throw `${zipcode} is not a valid value for zipcode.`;
    if (isValidDetails(zipcode) === false) throw `${zipcode} is not a valid value for zipcode.`;
    if (containsSpecialChars(zipcode) === true) throw "zipcode cannot contain special characters";

    if (!rent) throw "You must provide rent of the apartment";
    //if (typeof rent !== 'number') throw 'rent must be in number';
    if (rent.trim().length === 0)
      throw "rent cannot be an empty string or just spaces";
    rent = rent.trim();
    if (isNaN(rent)) throw `${rent} is not a valid value for rent. it should be in numbers`;
    if (isValidDetails(rent) === false) throw `${rent} is not a valid value for rent.`;
    if (containsSpecialChars(rent) === true) throw "rent cannot contain special characters.";

    if (!size) throw "You must provide size of the apartment";
    //if (typeof size !== 'number') throw 'size must be in square feet';
    if (size.trim().length === 0)
      throw "size cannot be an empty string or just spaces";
    size = size.trim();
    if (isNaN(size)) throw `${size} is not a valid value for size.`;
    if (isValidDetails(size) === false) throw `${size} is not a valid value for size.`;
    if (containsSpecialChars(size) === true) throw "Entered size is Incorrect.";

    if (!occupantCapacity)
      throw "You must provide occupantCapacity of the apartment";
    //if (typeof occupantCapacity !== 'number') throw 'occupantCapacity must be in number';
    if (occupantCapacity > 10 && occupantCapacity < 1)
      throw "occupantCapacity can not be grater than 10 and less than 1";
    if (occupantCapacity.trim().length === 0)
      throw "occupantCapacity cannot be an empty string or just spaces";
    occupantCapacity = occupantCapacity.trim();
    if (isNaN(occupantCapacity)) throw `${occupantCapacity} is not a valid value for occupantCapacity.`;


    if (!contactInfo) throw "You must provide contactInfo";
    if (typeof contactInfo !== "string") throw "contactInfo must be a string";
    if (contactInfo.trim().length === 0)
      throw "contactInfo cannot be an empty string or just spaces";
    contactInfo = contactInfo.trim();
    if (contactInfo.trim().length !== 10) throw "contactInfo cannot be less than/greater than 10 digit";
    if (isNaN(contactInfo)) throw `${contactInfo} is not a valid value for contactInfo.`;
    if (isValidDetails(contactInfo) === false) throw `${contactInfo} is not a valid value for contactInfo.`;
    if (containsSpecialChars(contactInfo) === true) throw "Contact Information is Incorrect.";


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
      contactInfo: contactInfo,
      reviews: [],
    };

    let updatedInfo2, alreadyAvailableApartment;
    const apartmentCollection = await apartment();
    const apartmentData = await apartmentCollection.find({}).toArray();

    for (let i in apartmentData) {
      alreadyAvailableApartment = apartmentData[i].address;
      //console.log("alreadyAvailableApartment",alreadyAvailableApartment);
      if (alreadyAvailableApartment === address) {
        throw "apartment with this address is already available. please add new property with different address";
      }
    }



    const insertInfo = await apartmentCollection.insertOne(newApartment);

    //console.log("insertInfo", insertInfo);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) throw "Could not add apartment";
    //console.log("insertInfo insertInfo.acknowledged", insertInfo.acknowledged);
    if (insertInfo.acknowledged === true) {
      let userId = insertInfo.insertedId;
      const usersCollection = await users();
      updatedInfo2 = await usersCollection.updateOne({ _id: ObjectId(userSessionId) }, { $addToSet: { AddedProperty: userId.toString() } });
    }


    //console.log("updatedInfo2..xx", updatedInfo2);

    const newId = insertInfo.insertedId.toString();
    //const returnBand = await this.get(newId);
    //  return returnBand;

    return newId;
  },


  async getAllApartmentSelectedZipCode(
    zipcode,
    state,
    city,
    rentMin,
    rentMax,
    sizeMin,
    sizeMax,
    occupantCapacity
  ) {

    //if (typeof zipcode !== 'string') throw 'Id must be a string';

    zipcode = zipcode.trim();


    // zipcode ? zipcode : null

    //if (!ObjectId.isValid(id)) throw 'ID is not a valid object ID';
    const apartmentCollection = await apartment();
    let apartmentData = await apartmentCollection.find({}).toArray();

    if (zipcode) {
      for (apt of apartmentData) {
        apartmentData = apartmentData.filter((apt) => apt.zipcode === zipcode);
        //console.log("booo", apartmentData);
      }
    }
    //console.log("here", state);
    if (state) {
      for (apt of apartmentData) {
        apartmentData = apartmentData.filter((apt) => apt.state === state);
        //console.log("cooo", apartmentData);
      }
    }
    if (city) {
      if (!isNaN(city)) throw `${city} is not a valid value for city.`;
      if (containsSpecialChars(city) === true) throw "city cannot contain special characters";

      for (apt of apartmentData) {
        apartmentData = apartmentData.filter((apt) => apt.city.toLowerCase() === city.toLowerCase());
      }
    }
    //console.log("Min", rentMin)
    if (rentMin) {
      // console.log("yooo", apartmentData);
      for (apt of apartmentData) {
        apartmentData = apartmentData.filter((apt) => apt.rent >= rentMin);
        apartmentData = apartmentData.filter((apt) => apt.rent <= rentMax);

      }
    }
    if (sizeMin) {
      for (apt of apartmentData) {
        apartmentData = apartmentData.filter((apt) => apt.size >= sizeMin);
        //console.log("stooo", apartmentData);
        apartmentData = apartmentData.filter((apt) => apt.size <= sizeMax);
        //console.log("looo", apartmentData);
      }
    }
    if (occupantCapacity) {
      for (apt of apartmentData) {
        apartmentData = apartmentData.filter(
          (apt) => apt.occupantCapacity === occupantCapacity
        );
      }
    }

    //console.log("the", apartmentData);

    //console.log("inside data", apartmentData,"apartment id",apartmentData[0].state,apartmentData[0]._id.toString());

    for (let i in apartmentData) {
      apartmentData[i]._id = apartmentData[i]._id.toString();
    }

    //console.log("aaaaaaaaaaswerfd", apartmentData);
    if (apartmentData === null)
      throw "No apartment available for this zip code";
    return apartmentData;
  },


  async getApartmentAddress(
    address,
  ) {
    console.log("here", address)
    const apartmentCollection = await apartment();
    let apartmentData = await apartmentCollection.find({
      address: address
    }).toArray();

    //console.log("here", apartmentData)
    return apartmentData;
  },

  async getAllApartment() {
    const apartmentCollection = await apartment();
    const apartmentData = await apartmentCollection.find({}).toArray();

    for (let i in apartmentData) {
      apartmentData[i]._id = apartmentData[i]._id.toString();
    }
    if (apartmentData === null) throw "No apartment available";
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
    return apartmentData;
  },

  async getApartmentById(apartmentId) {
    if (!apartmentId) throw "You must provide an apartment id to search for";
    //if (typeof zipcode !== 'string') throw 'Id must be a string';
    if (apartmentId.trim().length === 0)
      throw "apartment cannot be an empty string or just spaces";
    apartmentId = apartmentId.trim();
    //if (!ObjectId.isValid(id)) throw 'ID is not a valid object ID';

    //console.log("aprt id..", apartmentId, typeof apartmentId);

    apartmentId = ObjectId(apartmentId);

    //console.log("aprt id object..", apartmentId, typeof apartmentId);
    const apartmentCollection = await apartment();
    const apartmentIdData = await apartmentCollection
      .find({
        _id: ObjectId(apartmentId),
      })
      .toArray();

    if (apartmentIdData === null)
      throw "No apartment available for this search";
    return apartmentIdData;
  },

 
  async update(
    apartmentId,
    state,
    city,
    photosArr,
    address,
    zipcode,
    rent,
    size,
    occupantCapacity,
    contactInfo,
    userSessionId) {

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
    if (!isNaN(city)) throw `${city} is not a valid value for city.`;
    if (containsSpecialChars(city) === true) throw "city cannot contain special characters";


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
    if (isNaN(zipcode)) throw `${zipcode} is not a valid value for zipcode.`;
    if (isValidDetails(zipcode) === false) throw `${zipcode} is not a valid value for zipcode.`;
    if (containsSpecialChars(zipcode) === true) throw "zipcode cannot contain special characters";

    if (!rent) throw "You must provide rent of the apartment";
    //if (typeof rent !== 'number') throw 'rent must be in number';
    if (rent.trim().length === 0)
      throw "rent cannot be an empty string or just spaces";
    rent = rent.trim();
    if (isNaN(rent)) throw `${rent} is not a valid value for rent. it should be in numbers`;
    if (isValidDetails(rent) === false) throw `${rent} is not a valid value for rent.`;
    if (containsSpecialChars(rent) === true) throw "rent cannot contain special characters.";

    if (!size) throw "You must provide size of the apartment";
    //if (typeof size !== 'number') throw 'size must be in square feet';
    if (size.trim().length === 0)
      throw "size cannot be an empty string or just spaces";
    size = size.trim();
    if (isNaN(size)) throw `${size} is not a valid value for size.`;
    if (isValidDetails(size) === false) throw `${size} is not a valid value for size.`;
    if (containsSpecialChars(size) === true) throw "Entered size is Incorrect.";

    if (!occupantCapacity)
      throw "You must provide occupantCapacity of the apartment";
    //if (typeof occupantCapacity !== 'number') throw 'occupantCapacity must be in number';
    if (occupantCapacity > 10 && occupantCapacity < 1)
      throw "occupantCapacity can not be grater than 10 and less than 1";
    if (occupantCapacity.trim().length === 0)
      throw "occupantCapacity cannot be an empty string or just spaces";
    occupantCapacity = occupantCapacity.trim();
    if (isNaN(occupantCapacity)) throw `${occupantCapacity} is not a valid value for occupantCapacity.`;


    if (!contactInfo) throw "You must provide contactInfo";
    if (typeof contactInfo !== "string") throw "contactInfo must be a string";
    if (contactInfo.trim().length === 0)
      throw "contactInfo cannot be an empty string or just spaces";
    contactInfo = contactInfo.trim();
    if (contactInfo.trim().length !== 10) throw "contactInfo cannot be less than/greater than 10 digit";
    if (isNaN(contactInfo)) throw `${contactInfo} is not a valid value for contactInfo.`;
    if (isValidDetails(contactInfo) === false) throw `${contactInfo} is not a valid value for contactInfo.`;
    if (containsSpecialChars(contactInfo) === true) throw "Contact Information is Incorrect.";


    let updateApartment = {
      // _id: ObjectId(apartmentId),
      state: state,
      city: city,
      photos: photosArr,
      address: address,
      zipcode: zipcode,
      rent: rent,
      size: size,
      occupantCapacity: occupantCapacity,
      contactInfo: contactInfo,
      reviews: [],
    };


    const apartmentCollection = await apartment();
    const returnApartment = await this.getApartmentById(apartmentId);

    const updatedInfo = await apartmentCollection.updateOne({
      _id: ObjectId(apartmentId)
    },
      {
        $set: updateApartment
      });
    if (updatedInfo.modifiedCount === 0) {
      throw 'could not update apartment successfully';
    }

    //console.log("updatedInfo...this apartment", updatedInfo);
    const returnApartment1 = await this.getApartmentById(apartmentId);
    //console.log("returnApartment1", returnApartment1);
    return returnApartment1;
  }
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

function isValidDetails(rating) {
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
