

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
