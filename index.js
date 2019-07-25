'use strict'
const albums = require("./lib/data");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + '/public')); // set location for static files
app.use(bodyParser.urlencoded({extended: true})); // parse form submissions

const handlebars = require("express-handlebars");
app.engine(".html", handlebars({extname: '.html', defaultLayout: false}));
app.set("view engine", ".html");

/* 

send static file as response
app.get('/', (req, res) => {
    res.type('text/html');
    res.sendFile(__dirname + '/public/home.html'); 
   });
*/

// send content of 'home' view
app.get('/', (req, res) => {
  res.render('home',{name: req.query.name});
});

// send plain text response
app.get('/about', (req, res) => {
  res.type('text/html');
  res.sendFile(__dirname + '/public/about.html');
});


app.post('/detail', (req,res) => {
  let result = albums.getItem(req.body.album);
  res.render('detail', {title: req.body.album, result: result})
});


app.get('/delete', (req,res) => {
  let result = albums.deleteItem(req.query.album); 
  res.render('delete', {deletedItem: req.query.album, result: result});
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