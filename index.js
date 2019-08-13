'use strict'
const albums = require('./models/album');
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const query = require('querystring');

app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + '/public')); // set location for static files
app.use(bodyParser.urlencoded({extended: true })); // parse form submissions
app.use('/api', require('cors')());

const handlebars = require("express-handlebars");
app.engine(".html", handlebars({extname: '.html', defaultLayout: false }));
app.set("view engine", ".html");

/* 

send static file as response
app.get('/', (req, res) => {
    res.type('text/html');
    res.sendFile(__dirname + '/public/home.html'); 
   });
*/


app.get('/', (req, res) => {
  albums.find({}, (err, items, next) => {
      if (err) return next(err);
      res.render('home', { albums: JSON.stringify(items)});
  });
});

/*
app.get('/', (req, res) => {
  albums.find({}, { '_id': false }, (err, items) => {
      if (err) return next(err);
      res.render('home', { albums: items });
  });
});

*/


/*
app.get('/', (req,res) => {
  albums.getAll().then((albums) => {
      res.render('home', {albums: albums });    
  }).catch((err) =>{
      return next(err);
  });
});
*/

// send plain text response
app.get('/about', (req, res) => {
  res.type('text/html');
  res.sendFile(__dirname + '/public/about.html');
});

app.post('/detail', (req, res) => {
  albums.findOne({ 'title': req.body.title }, { '_id': false }, (err, item) => {
      if (err) return next(err);
      res.render('detail', { album: item });
  })
});

app.get('/detail', (req, res) => {
  albums.findOne({'title':req.query.title}, {'_id':false}, (err, item) => {
      if (err) return next(err);
      res.render('detail', { album: item });
  })
});


app.get('/delete', (req, res) => {
  albums.deleteOne({ 'title': req.query.title }, (err, item) => {
      if (err) return next(err);
      albums.countDocuments((err, result) => {
          res.render('delete', {
              title: req.query.title, count: result});
      })
   })
});


app.get('/add', (req, res, next) => {
  const newAlbum = parseURLtoJSON(req.url);
  albums.updateOne({title: req.query.title}, newAlbum, {upsert:true}, (err, result) => {
    if (err) return next(err);
    console.log(result);   
    albums.find({}, (err, items) => {
      if (err) return next(err);
      console.log(items.length);
      res.type('text/html');
      res.render('home', {layout:'main', title: req.query.title, result: result, found: result.nModified == 0, albums:items});
    });
  }); 
});

/*
app.post('/add', (req,res) => {
  let newAlbum = {'title':req.body.title, 'artist':req.body.artist, 'releasedate': req.body.releasedate};
  albums.update({'title':req.body.title}, newAlbum, {upsert: true}, (err, result) => {
      if (err) return next(err);
      console.log(result);
      res.render('add', {
          title: req.body.title,
          artist: req.body.artist,
          releasedate: req.body.releasedate
      });
  });
});
*/

//API Routes

//get a single item
app.get('/api/v1/album/:title', (req, res, next) => {
  albums.findOne({title:req.params.title}, {"_id":false}, (err, item) => {
      if (err) return next(err);
      res.json(item);
  })
});

//get all items
app.get('/api/v1/albums', (req, res, next) => {
  albums.find({},{"_id":false}, (err, items) => {
      if (err) return next(err);
      res.json(items);
  })
});

//delete an item
app.get('/api/v1/delete/:title', (req, res, next) => {
  albums.deleteOne({title:req.params.title}, (err, item) => {
      if (err) return next(err);
      res.json(item);
  })
});


//add & update an item
app.post('/api/v1/add/', (req,res, next) => {
  if (!req.body._id) {
      let album = new albums({title:req.body.title,artist:req.body.artist,releasedate:req.body.releasedate});
      album.save((err,newAlbum) => {
          if (err) return next(err);
          console.log(newAlbum)
          res.json({updated: 0, _id: newAlbum._id});
      });
  } else { 
      albums.updateOne({ _id: req.body._id}, {title:req.body.title, artist: req.body.artist, releasedate: req.body.releasedate }, (err, result) => {
          if (err) return next(err);
          res.json({updated: result.nModified, _id: req.body._id});
      });
  }
});


app.get('/api/v1/add/:title/:artist/:releasedate', (req,res, next) => {
  let title = req.params.title;
  albums.update({ title: title}, {title:title, artist: req.params.artist, releasedate: req.params.releasedate }, {upsert: true }, (err, result) => {
      if (err) return next(err);
      res.json({updated: result.nModified});
  });
});



// define 404 handler
app.use((req,res) => {
  res.type('text/plain');
  res.status(404);
  res.send('404 - Not found');
});

app.listen(app.get('port'), () => {
  console.log('Express started');
});


function parseURLtoJSON(path) {
  const itemURL = path.substr(path.indexOf('?')+1);
  const jsonObject = query.parse(itemURL);
  Object.setPrototypeOf(jsonObject, albums);

  return jsonObject;
}




/*

let albums = require("./lib/data.js");
let http = require("http"); 


http.createServer((req,res) => {
  const querystring = require('querystring');
  let url = req.url.toLowerCase().split("?");
  let fs = require("fs");
  let queryParams = querystring.parse(url[1]);
  let path = url[0].toLowerCase();
    
  switch(path) {
    case '/':
    fs.readFile("public/home.html", (err, data) => {
      if (err) return console.error(err);
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.end(data.toString());
   });
      break;
    case '/about':
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('About page');
      break;

      case '/detail':
      let foundAlbum = albums.getItem(queryParams.title); 
      let getMessage = (foundAlbum) ? JSON.stringify(foundAlbum) : "Not found";
      res.writeHead(200, { 'Content-Type': 'text/plain' } );
      res.end('Results for ' + queryParams.title + ":\n\n" + getMessage);
    break;

      case '/delete':
      if(url[1] ==! undefined){

        fs.readFile("public/error.html", (err, data) => {
            if (err) return console.error(err);
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(data.toString());
        });
      } else {
        let deleteParams = url[1].split("=");
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end(JSON.stringify(albums.getItem(deleteParams[1]))  + ' has been deleted');
      albums.deleteItem(deleteParams[1]);
      }
      console.log(albums.getAll())

      break;
    default:
      res.writeHead(404, {'Content-Type': 'text/plain'});
      res.end('Not found');
  }
  
}).listen(process.env.PORT || 3000);

*/