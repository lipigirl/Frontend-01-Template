const http = require("http");

const server = http.createServer((req, res) => {
    console.log('request server');
    console.log(req.headers);
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('X-Foo', 'bar');
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(`<html maaa=a>
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
    </html>`)
    // res.end(`<html maaa=a><head><title>cool</title></head><body><img src="a" /></body></html>`)
    // res.end(`<html />`)
})

server.listen(8088);