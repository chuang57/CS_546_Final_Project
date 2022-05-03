const express = require("express");
const app = express();
const configRoutes = require("./routes");
//const session = require('express-session');
const exphbs = require("express-handlebars");
const static = express.static(__dirname + "/public");
const session = require("express-session");


app.use("/public", static);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const hbs = exphbs.create({
  defaultLayout: 'main',
  helpers: {
    img: function (inp) { 
      const x = Buffer.from(inp).toString('base64');
      console.log("this", x)
      return x
    }
}
 });


app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");





app.use(
  session({
    name: "AuthCookie",
    secret: "some secret string!",
    resave: false,
    saveUninitialized: true,
  })
);

//app.use(express.json());

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
