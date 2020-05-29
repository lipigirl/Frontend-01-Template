const http = require("http");

const server = http.createServer((req, res) => {
    console.log('request server');
    console.log(req.headers);
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('X-Foo', 'bar');
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    /*  res.end(`<html maaa=a>
     <head>
         <style>
         body div img{
             width:30px;
             background-color: #ff1111;
         }
             body div #myid{
                 width:100px;
                 background-color: #ff5000;
             }
         </style>
      </head>
      <body>
          <div>
              <img id="myid"/>
              <img />
          </div>
      </body>
     </html>`) */
    // res.end(`<html maaa=a><head><title>cool</title></head><body><img src="a" /></body></html>`)
    // res.end(`<html />`)
    res.end(`
    <html maaa=a >
    <head>
        <style>
        #container {
            width: 400px;
            height: 300px;
            display: flex;
            border: 2px rgb(42,163,243) solid;
            background-color: rgb(42,163,243)
        }

        #container #myid {
            width: 200px;
            height: 100px;
            background-color: rgb(255,255,255);
        }

        #container .c1 {
            width: 200px;
            flex: 1;
            background-color: rgb(29,105,29);
        }
        </style>
    </head>
    <body>
        <div id="container">
          <div id="myid"></div>
          <div class="c1"></div>
        </div>
    </body>
   </html>
    `)
})

server.listen(8088);