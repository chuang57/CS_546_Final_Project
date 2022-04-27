const bcrypt = require("bcrypt");

const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const { ObjectId } = require("mongodb");


const isAlpha = (str) => /^[a-zA-Z]*$/.test(str);

const createUser = async (
  email,
  password,
  username,
  phonenumber,
  city,
  gender,
  age,
  usertype
) => {
  console.log("email",email);
  console.log("usertype..", usertype);
  const lowerUsername = username.toLowerCase();
  if (!lowerUsername || !password) {
    throw new Error("Username or password is empty");
  }
  if (typeof lowerUsername !== "string" || lowerUsername.length < 4) {
    throw new Error(
      "user name should be a valid string and should be at least 4 characters long."
    );
  }

  const userCollections = await users();
  if (
    await userCollections.findOne({
      email: email,
    })
  ) {
    throw new Error("There is already a user with that username");
  }

  if (typeof password !== "string" || password.length < 6) {
    throw new Error(
      "password should be a valid string and should be at least 4 characters long."
    );
  }

  const salt = await bcrypt.genSalt(10);

  await userCollections.insertOne({
    username: lowerUsername,
    password: await bcrypt.hash(password, salt),
    email,
    phonenumber,
    city,
    gender,
    age,
    usertype,
    reviewsWritten:[],
    savedApartments:[]

  });
  return { userInserted: true };
};

const checkUser = async (email, password, req) => {
  if (!email || !password) {
    throw new Error("email or password is empty");
  }
  if (typeof email !== "string" || email.length < 4) {
    throw new Error(
      "email should be a valid string and should be at least 4 characters long."
    );
  }

  const userCollections = await users();

  if (typeof password !== "string" || password.length < 6) {
    throw new Error(
      "password should be a valid string and should be at least 4 characters long."
    );
  }

  const findemail = await userCollections.findOne({
    email,
  });
  console.log(email, password, findemail);
  if (!findemail) {
    throw new Error("Either the email or password is invalid");
  }
  if (!(await bcrypt.compare(password, findemail.password))) {
    throw new Error("Either the email or password is invalid");
  }
  req.session.user = findemail;
  return { authenticated: true };
};

module.exports = { createUser, checkUser };
