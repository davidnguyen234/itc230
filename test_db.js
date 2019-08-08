var Album = require("./models/album");

Album.countDocuments((err, result) => {
    console.log(result);
});


Album.find({}, (err, result) => {
    //output error if one occured
    if(err) {
        console.log(err);
    } else {
        console.log(result);
    }
});


// return all records that match a condition
/*
Album.find({'artist':'bon iver'}, (err, items) => {
    if (err) return next(err);
    console.log(items.length);
    // other code here
   });
*/

// insert or update a single record
/*
var newAlbum = {'title':'higher', 'artist':'kygo', 'releasedate': 2019 }
Album.update({'title':'higher'}, newAlbum, {upsert:true}, (err, result) => {
  if (err) return next(err);
  console.log(result);
  // other code here
}); 
*/