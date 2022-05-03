const apartment = require("../data/apartment");
const reviews = require("../data/reviews");
const mongoconnection = require('../config/mongoConnection');

const main = async () => {
    
  let apart = undefined;
  let albumsL = undefined;
 // let Beatles = undefined;
  //let getAll = undefined;
  //let Linkin = undefined;

  //state, city, photos, address, zipcode, rent, size, occupantCapacity
  //"NJ","Piscataway"," ","1100 Meadows Dr","08854","$2,475","1,064 sq ft","2"
    try {
     apart = await apartment.create( "NJ","Jersey city",["https://image.shutterstock.com/image-photo/modern-architecture-urban-residential-apartment-260nw-1865190721.jpg"],"Jersey","08854","$1400","1700 sq ft","2");
    console.log(`apartment has been created successfully!`);
//     console.log(apart);
    } catch (e) {
     console.log(e); 
} 

/* try {
    console.log("inside");
    albumsL = await albums.create("62223fd628d3b47d3a5551ba","happy","04/12/1950",["Crazy boy", "Welcome","sun shine", "Wish You Were Here"],3.9);
    //need to set rating validation
    //console.log("album band has been added!");
    console.log(albumsL);
    } catch (e) {
     console.log(e);
} */

/*  try {
    console.log("inside");
    //621d51a11b235230c887bda1
   // albumsL = await albums.get("622122817c35e6193cd7c90b");
   albumsL = await albums.get("622122817c35e6193cd7c90a");
    //create("621d2449870dbc1f887eda92","Here man","09/12/1978",["Crazy Diamond", "Welcome","shine", "Wish You Were Here","Shine On You Crazy Diamond, Pts. 6-9"],2);
    //console.log("All albums for the  provided band id ");
    console.log(albumsL);
    } catch (e) {
     console.log(e);
} */ 

/* try {
    albumsL = await albums.remove("622240f0fa3cf830e700d591");
    console.log(albumsL);
    } catch (e) {
     console.log(e);
} */




/* try {
    Beatles = await bands.create("The Beatles", ["Rock", "Pop", "Psychedelia"], "http://www.thebeatles.com", "Parlophone", ["John Lennon", "Paul McCartney", "George Harrison", "Ringo Starr"], 1960);
    console.log(`${Beatles.name} band has been added!`);
    //console.log(Beatles);
    } catch (e) {
     console.log(e);
}

console.log('Lets now get all bands from the DB');
try {
    getAll = await bands.getAll();
    console.log(getAll);
} catch (e) {
     console.log(e);
}  

console.log('Lets create 3rd band');
try {
    Linkin = await bands.create("Linkin Park", ["Alternative Rock", "Pop Rock", "Alternative Metal"], "http://www.linkinpark.com", "Warner", ["Chester Bennington", "Rob Bourdon", "Brad Delson", "Mike Shinoda", "Dave Farrell", "Joe Hahn"], 1996);
    console.log(`${Linkin.name} band has been added!`);
    console.log(Linkin);
    } catch (e) {
     console.log(e);
}

try {
    if(pinkFloyd){
    const rename = await bands.rename(pinkFloyd._id.toString(),"Mr Valentine");
    console.log(`"${pinkFloyd.name}" band has been updated with "${rename.name}" in DB!`);
    console.log(rename);}
    else{
      console.log("The Record which you are trying to update is not exist in DB");
    }
} catch (e) {
     console.log(e);
}

try {
    if(Beatles){
    const remove = await bands.remove(Beatles._id.toString());
    //console.log(`${remove.name} band has been removed from DB!`);
    console.log (remove);
   }
    else{
      console.log("Band is not exist in DB");
    }
} catch (e) {
     console.log(e);
} 

console.log('Lets now get all bands from the DB');
try {
    getAll = await bands.getAll();
    console.log(getAll);
} catch (e) {
     console.log(e);
} 


 */

/* const db = await mongoconnection.connectToDb();
  await mongoconnection.closeConnection(); */
  console.log('Done!');

};
main();

