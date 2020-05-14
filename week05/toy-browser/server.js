const http = require("http");

const server = http.createServer((req, res) => {
    console.log('request server');
    console.log(req.headers);
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('X-Foo', 'bar');
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    // res.end('ok');
    res.end(`<html maaa=a >
    <head>
        <style>
    body div #myid{
        width:100px;
        background-color: #ff5000;
    }
    body div img{
        width:30px;
        background-color: #ff1111;
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
})

server.listen(8088);


/*
var xhr = new XMLHttpRequest;
xhr.open("get", "http://127.0.0.1:8088", true);//初始化一个请求。该方法只能在 JavaScript 代码中使用
xhr.send(null);//发送请求。如果请求是异步的（默认），那么该方法将在请求发送后立即返回。
xhr.status;//200（只读属性）
xhr.responseText;//ok（只读属性）
xhr.HEADERS_RECEIVED;//2
*/