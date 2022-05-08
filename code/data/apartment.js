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

    if (!address) throw "You must provide address of the apartment";
    if (typeof address !== "string") throw "address must be a string";
    if (address.trim().length === 0)
      throw "address cannot be an empty string or just spaces";
    address = address.trim();

    if (!zipcode) throw "You must provide zipcode of the apartment";
    if (zipcode.trim().length === 0)
      throw "zipcode cannot be an empty string or just spaces";
    if (zipcode.trim().length < 5) throw "zipcode cannot be less than 5 digit";
    zipcode = zipcode.trim();

    if (!rent) throw "You must provide rent of the apartment";
    if (rent.trim().length === 0)
      throw "rent cannot be an empty string or just spaces";
    rent = rent.trim();

    if (!size) throw "You must provide size of the apartment";
    if (size.trim().length === 0)
      throw "size cannot be an empty string or just spaces";
    size = size.trim();

    if (!occupantCapacity)
      throw "You must provide occupantCapacity of the apartment";
    if (occupantCapacity > 10 && occupantCapacity < 1)
      throw "occupantCapacity can not be grater than 10 and less than 1";
    if (occupantCapacity.trim().length === 0)
      throw "occupantCapacity cannot be an empty string or just spaces";
    occupantCapacity = occupantCapacity.trim();
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

    let updatedInfo2;
    const apartmentCollection = await apartment();
    const insertInfo = await apartmentCollection.insertOne(newApartment);

    if (!insertInfo.acknowledged || !insertInfo.insertedId)
      throw "Could not add apartment";

    if (insertInfo.acknowledged === true) {
      let userId = insertInfo.insertedId;
      const usersCollection = await users();

      updatedInfo2 = await usersCollection.updateOne(
        { _id: ObjectId(userSessionId) },
        { $addToSet: { AddedProperty: userId.toString() } }
      );
    }

    const newId = insertInfo.insertedId.toString();

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
    zipcode = zipcode.trim();

    const apartmentCollection = await apartment();
    let apartmentData = await apartmentCollection.find({}).toArray();

    if (zipcode) {
      for (apt of apartmentData) {
        apartmentData = apartmentData.filter((apt) => apt.zipcode === zipcode);
      }
    }

    if (state != "Choose...") {
      for (apt of apartmentData) {
        apartmentData = apartmentData.filter((apt) => apt.state === state);
      }
    }
    if (city) {
      for (apt of apartmentData) {
        apartmentData = apartmentData.filter((apt) => apt.city.toLowerCase() === city.toLowerCase());
      }
    }

    if (rentMin) {
      for (apt of apartmentData) {
        apartmentData = apartmentData.filter((apt) => apt.rent >= rentMin);

        apartmentData = apartmentData.filter((apt) => apt.rent <= rentMax);
      }
    }
    if (sizeMin) {
      for (apt of apartmentData) {
        apartmentData = apartmentData.filter((apt) => apt.size >= sizeMin);
        apartmentData = apartmentData.filter((apt) => apt.size <= sizeMax);
      }
    }
    if (occupantCapacity != "Choose...") {
      for (apt of apartmentData) {
        apartmentData = apartmentData.filter(
          (apt) => apt.occupantCapacity === occupantCapacity
        );
      }
    }

    for (let i in apartmentData) {
      apartmentData[i]._id = apartmentData[i]._id.toString();
    }

    if (apartmentData === null)
      throw "No apartment available for this zip code";
    return apartmentData;
  },

  async getApartmentAddress(address) {
    if (!address){
      throw "No address"
    }else if (typeof address !== "string"){
      throw "No address"
    }else if (address.trim().length === 0){
      throw "No address"
    }
    const apartmentCollection = await apartment();
    let apartmentData = await apartmentCollection
      .find({
        address: address,
      })
      .toArray();

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

    if (apartmentId.trim().length === 0)
      throw "apartment cannot be an empty string or just spaces";
    apartmentId = apartmentId.trim();

    apartmentId = ObjectId(apartmentId);

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
  
};

function containsSpecialChars(str) {
  const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  return specialChars.test(str);
}

