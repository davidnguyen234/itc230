const http = require("http"); 

  const callback = (req,res) => {

  const path = req.url.toLowerCase();
  switch(path) {
    case '/':
    const fs = require("fs");
    fs.readFile("/Users/davidnguyen/Desktop/itc230/itc230/public/home.html", (err, data) => {
      if (err) return console.error(err);
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.end(data.toString());
   });
      break;
    case '/about':
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('About page');
      break;
    default:
      res.writeHead(404, {'Content-Type': 'text/plain'});
      res.end('Not found');
      break;
    }
  }

  http.createServer(callback).listen(process.env.PORT || 3000);

