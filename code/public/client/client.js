

const form = document.getElementById("address-form");
    form.addEventListener("submit", (e) => {
      try {
        const apartmentAddress = document.getElementById("address").value;
        if (!apartmentAddress){
            e.preventDefault();
            document.getElementById("error-address").innerHTML =
            "You must enter an address";
        }else if(apartmentAddress.trim().length === 0){
            e.preventDefault();
            document.getElementById("error-address").innerHTML =
            "You must enter an address that is not just spaces";
        }else if(typeof apartmentAddress != "string"){
            e.preventDefault();
            console.log("yoyo")
            document.getElementById("error-address").innerHTML =
            "Address must be a string"; 
        }
      } catch (e) {
        console.log(e);
      }
    });


    const formNew = document.getElementById("new-apartment");
    form.addEventListener("submit", (e) => {
      try {
        
        const state = document.getElementById("state").value;
        const city = document.getElementById("city").value;
        const photos = document.getElementById("photos").value;

        const address = document.getElementById("address").value;
        const zipcode = document.getElementById("zipcode").value;
        const rent = document.getElementById("rent").value;
        const size = document.getElementById("size").value;
        const occupantCapacity = document.getElementById("occupantCapacity").value;
        const contact = document.getElementById("contactInfo").value;
        const st = ["AK", "AL", "AR", "AS", "AZ", "CA", "CO", "CT", "DC", "DE", "FL", "GA", "GU", "HI", "IA", "ID", "IL", "IN", "KS", "KY", "LA", "MA", "MD", "ME", "MI", "MN", "MO", "MP", "MS", "MT", "NC", "ND", "NE", "NH", "NJ", "NM", "NV", "NY", "OH", "OK", "OR", "PA", "PR", "RI", "SC", "SD", "TN", "TX", "UM", "UT", "VA", "VI", "VT", "WA", "WI", "WV", "WY"]
        if (!state){
            e.preventDefault();
            document.getElementById("error").innerHTML =
            "You must enter a state";
        }else if(st.indexOf(state) < 0){
            e.preventDefault();
            document.getElementById("error").innerHTML =
            "Invalid state";
        }
        if (!city){
            e.preventDefault();
            document.getElementById("error").innerHTML =
            "You must enter a city";
        }else if(city.trim().length === 0){
            e.preventDefault();
            document.getElementById("error").innerHTML =
            "Invalid state";
        }else if(typeof city != "string"){
            e.preventDefault();
            console.log("yoyo")
            document.getElementById("error").innerHTML =
            "City must be a string"; 
        }
        
        if (!photos){
            e.preventDefault();
            document.getElementById("error").innerHTML =
            "You must enter photos!";
        }else if(photos.mimetype != "image/png" || photos.mimetype != "image/jpeg"){
            e.preventDefault();
            document.getElementById("error").innerHTML =
            "Invalid photo type!";
          }

        if (!address){
            e.preventDefault();
            document.getElementById("error").innerHTML =
            "You must enter a address";
        }else if(address.trim().length === 0){
            e.preventDefault();
            document.getElementById("error").innerHTML =
            "Invalid address";
        }else if(typeof address != "string"){
            e.preventDefault();
            console.log("yoyo")
            document.getElementById("error").innerHTML =
            "Address must be a string"; 
        }

        if (!zipcode){
            e.preventDefault();
            document.getElementById("error").innerHTML =
            "You must enter a zipcode";
        }else if(typeof zipcode != "number"){
            e.preventDefault();
            console.log("yoyo")
            document.getElementById("error").innerHTML =
            "Zipcode must be a number!!!!"; 
        }

        if (!rent){
            e.preventDefault();
            document.getElementById("error").innerHTML =
            "You must enter a rent";
        }else if(rent.trim().length === 0){
            e.preventDefault();
            document.getElementById("error").innerHTML =
            "Invalid rent";
        }else if(typeof rent != "number"){
            e.preventDefault();
            console.log("yoyo")
            document.getElementById("error").innerHTML =
            "Rent must be a string"; 
        }

        if (!size){
            e.preventDefault();
            document.getElementById("error").innerHTML =
            "You must enter a size";
        }else if(size.trim().length === 0){
            e.preventDefault();
            document.getElementById("error").innerHTML =
            "Invalid size";
        }else if(typeof size != "number"){
            e.preventDefault();
            console.log("yoyo")
            document.getElementById("error").innerHTML =
            "Size must be a string"; 
        }

        if (!occupantCapacity){
            e.preventDefault();
            document.getElementById("error").innerHTML =
            "You must enter a occupant capacity";
        }

        if (!contact){
            e.preventDefault();
            document.getElementById("error").innerHTML =
            "You must enter a contact";
        }else if(contact.trim().length === 0){
            e.preventDefault();
            document.getElementById("error").innerHTML =
            "Invalid contact";
        }else if(typeof contact != "string"){
            e.preventDefault();
            console.log("yoyo")
            document.getElementById("error").innerHTML =
            "contact must be a string"; 
        }
        
      } catch (e) {
        console.log(e);
      }
    });
