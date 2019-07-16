
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