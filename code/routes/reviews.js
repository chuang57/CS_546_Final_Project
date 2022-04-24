const express = require('express');
const router = express.Router();
const data = require('../data');
const albumsData = data.albums;
const {ObjectId} = require('mongodb');

router
.route('/:id')    //GET /albums/{bandId}
.get(async (req, res) => {
    req.params.id = req.params.id.trim();
    /* if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json({ error: 'Provided band id is not a valid object ID.' });
    return;}
    if (typeof req.params.id !== 'string') {
    res.status(400).json({ error: 'Id must be a string.' });
    return;}
    if (req.params.id.trim().length === 0) {
    res.status(400).json({ error: 'Id cannot be an empty string or just spaces.' });
    return;
    }
    try{
    let albumsList = await albumsData.getAll(req.params.id);
   // console.log(albumsList);
    if(albumsList.length === 0){
        res.status(404).json({ error: 'No album for the given band id' });
        return; 
    }
    res.status(200).json(albumsList);
    } catch (e) {
    res.status(404).json({ error:e});
    } */
});


/* router.post('/:id', async (req, res) => {
    const albumInfo = req.body;
    let tracksInvalidFlag = false; 
    req.params.id = req.params.id.trim();
    if (!req.params.id) {
        res.status(400).json({ error: 'You must Supply a band ID to create album' });
        return;
      }
    if(Object.keys(albumInfo).length!==4){
        res.status(400).json({ error: 'You must provide the correct album data to update the band. Only title, releaseDate, tracks, rating are acceptable in JSON body.'});
        return;
      }
    if (!ObjectId.isValid(req.params.id)){
        res.status(400).json({ error: 'Provided band id is not a valid object ID' });
        return;}

    if(!albumInfo){
        res.status(400).json({ error: 'You must provide data to create a album'});
      return;
    }
    if (!albumInfo.title) {
      res.status(400).json({ error: 'You must provide a title' });
      return;
    }
    
    if (!albumInfo.releaseDate) {
      res.status(400).json({ error: 'You must provide a release date' });
      return;
    }

    if (!albumInfo.tracks) {
      res.status(400).json({ error: 'You must provide tracks ' });
      return;
    }
    if (!albumInfo.rating) {
        res.status(400).json({ error: 'You must provide a rating ' });
        return;
      }
     
    if (typeof albumInfo.title !== 'string') {
        res.status(400).json({ error: 'Title must be a string'});
        return;
    }    
    if (albumInfo.title.trim().length === 0) {
        res.status(400).json({ error: 'title cannot be an empty string or just spaces'});
        return;
    }   
    
    if (!albumInfo.tracks ||  !Array.isArray(albumInfo.tracks)) {
        res.status(400).json({ error: 'You must provide an array of tracks'});
        return;
    } 
    
    if (albumInfo.tracks.length < 3) {
        res.status(400).json({ error: 'You must supply at least 3 tracks'});
        return;
    } 

    for (i in albumInfo.tracks) {
        if (typeof albumInfo.tracks[i] !== 'string' || albumInfo.tracks[i].trim().length === 0) {
          tracksInvalidFlag = true;
          break;
        }
        albumInfo.tracks[i] = albumInfo.tracks[i].trim();
      }
      if (tracksInvalidFlag) {
        res.status(400).json({ error: 'One or more tracks is not a string or is an empty string.'});
        return;
    } 
    if (!isValidDateString(albumInfo.releaseDate)) {
        res.status(400).json({ error: 'Release date is not valid OR Valid years are from 1900 to 2022'});
        return;
    } 
    if (typeof albumInfo.rating !== 'number') {
        res.status(400).json({ error: 'Provided rating value is in incorrect format.'});
        return;
    } 
    if (albumInfo.rating> 5 || albumInfo.rating<1) {
        res.status(400).json({ error: 'Given rating value should be a range from 1 to 5.'});
        return;
    } 
    if (isValidRating(albumInfo.rating)=== false) {
        res.status(400).json({ error: 'Only one decimal place value in rating is accepted.'});
        return;
    }  
   // console.log(albumInfo,req.params.id);
    //If the JSON is valid and the album can be created successful, you will return all the 
    //band data showing the albums  (as shown below) with a 200 status code.
   //while create() func in data/albums.js returing newly created album only. 
    try {
        const newAlbum = await albumsData.create(req.params.id, albumInfo.title,albumInfo.releaseDate,albumInfo.tracks,albumInfo.rating);
        res.status(200).json(newAlbum);
     } catch (e) {
        res.status(400).json({ error: e });
        
      }
  });
   */

/* router
.route('/album/:id')
.get( async (req, res) => {
   req.params.id = req.params.id.trim();
    if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json({ error: 'Provided album id is not a valid object ID.' });
    return;}
    if (typeof req.params.id !== 'string') {
    res.status(400).json({ error: 'Id must be a string.' });
    return;}
    if (req.params.id.trim().length === 0) {
    res.status(400).json({ error: 'Album Id cannot be an empty string or just spaces.' });
    return;
    }
    try {
      let SingleAlbum = await albumsData.get(req.params.id);
      res.status(200).json(SingleAlbum);
    } catch (e) {
        res.status(404).json({ error:e});
    }
  }); */

  /* router.delete('/:id', async (req, res) => {
    req.params.id = req.params.id.trim();
    if (!req.params.id) {
      res.status(400).json({ error: 'You must Supply an ID to delete' });
      return;
    }
    if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json({ error: 'Provided album id is not a valid object ID.' });
        return;}
        if (typeof req.params.id !== 'string') {
        res.status(400).json({ error: 'Id must be a string.' });
        return;}
        if (req.params.id.trim().length === 0) {
        res.status(400).json({ error: 'Album Id cannot be an empty string or just spaces.' });
        return;
    }

    try {
      let deletedAlbum = await albumsData.remove(req.params.id);
      if(deletedAlbum === undefined){
        res.status(404).json({error: 'Could not delete band with id'});
        //.json(deletedAlbum);   
      }
      res.status(200).json({"albumId" : req.params.id, "deleted": true });
    } catch (e) {
        if(e === 'album does not exists'){
            res.status(404).json({ error: e });
        }else res.status(400).json({ error: e });
    }
  });
 */
  function isValidDateString(dateString) {
    if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString))
         return false;
     let splitDate = dateString.split("/");
     let month = parseInt(splitDate[0],10);
     let day = parseInt(splitDate[1],10);
     let year = parseInt(splitDate[2],10);
     if (year < 1900 || year > 2022 || month == 0 || month > 12) {
         return false;
     }
     let monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
     if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)) {
         monthLength[1] = 29;
     }
     return day > 0 && day <= monthLength[month - 1];
   };
   
   function isValidRating(rating) {
   if (rating.toString().includes('.')) {
       if (rating.toString().split('.')[1].length !== 1){
          //console.log("inside if2",rating.toString().split('.')[1].length);
        return false;
       }else{
         return true;
       }
    }else{
      return true;
    }   
   };
   
   
module.exports = router;