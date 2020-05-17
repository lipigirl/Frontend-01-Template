const net = require("net");
const parser = require('./parser.js');

class Request {
    /**
     * method; url= host + port + path
     * body
     * headers
     */
    constructor(options) {
        this.method = options.method || "GET";
        this.host = options.host;
        this.port = options.port || 80;
        this.path = options.path || "/";
        this.body = options.body || {};
        this.headers = options.headers || {};
        if (!this.headers["Content-Type"]) {
            this.headers["Content-Type"] = "application/x-www-form-urlencoded";
        }

        if (this.headers["Content-Type"] === "application/json") {
            this.bodyText = JSON.stringify(this.body);
        }
        else if (this.headers["Content-Type"] === "application/x-www-form-urlencoded") {
            this.bodyText = Object.keys(this.body).map(key =>
                `${key}=${encodeURIComponent(this.body[key])}`).join('&');
        }

        this.headers["Content-Length"] = this.bodyText.length;
    }

    toString() {
        // POST / HTTP/1.1\r
        // Content-Type: application/x-www-form-urlencoded\r
        // Content-Length: 20\r
        // \r
        // name="hhj"
        return `${this.method} ${this.path} HTTP/1.1\r
${Object.keys(this.headers).map(key => `${key}: ${this.headers[key]}`).join('\r\n')}
\r
${this.bodyText}`
    }

    open(method, url) { }

    send(connection) {
        return new Promise((resolve, reject) => {
            if (connection) {
                connection.write(this.toString());
            }
            else {
                connection = net.createConnection({
                    host: this.host,
                    port: this.port,
                }, () => {// connect成功的回调
                    connection.write(this.toString());
                })
            }
            // data是一个流，body很大时，会分多个data发送，所以下面的写法并不准确
            connection.on('data', (data) => {
                const parser = new ResponseParser();
                parser.receive(data.toString());//request内容
                if (parser.isFinished) {
                    console.log('*********response start*********');
                    console.log(parser.response);
                    console.log('*********response end*********');
                }
                connection.end();
            });
            connection.on('error', err => {
                console.log(err);
                connection.end();
            });
            connection.on('end', () => {
                console.log('已从服务器断开');
            });
        });
    }
}

class Response {
}

class ResponseParser {
    constructor() {
        // ==处理status line==
        this.WAITING_STATUS_LINE = 0;
        // 处理HTTP/1.1 200 OK\r\n中的\r\n
        this.WAITING_STATUS_LINE_END = 1;

        // ==处理headers==
        this.WAITING_HEADERS_NAME = 2;
        // 处理name后冒号的空格
        this.WAITING_HEADERS_SPACE = 3;
        this.WAITING_HEADERS_VALUE = 4;
        this.WAITING_HEADERS_LINE_END = 5;

        // ==处理headers后连续两个空行==
        this.WAITING_HEADERS_BLOCK_END = 6;

        this.WAITING_BODY = 7;

        // 当前状态
        this.current = this.WAITING_STATUS_LINE;

        this.statusLine = "";
        this.headers = {};//headerName和headerValue键值对
        this.headerName = "";
        this.headerValue = "";
        this.bodyParser = null;//解析完head之后创建
    }

    get isFinished() {
        return this.bodyParser && this.bodyParser.isFinished;
    }

    get response() {
        this.statusLine.match(/^HTTP\/1\.1 ([1-5]\d{2}) (\w+)/);
        return {
            statusCode: RegExp.$1,
            statusTxet: RegExp.$2,
            headers: this.headers,
            body: this.bodyParser.content.join('')
        }
    }

    // 字符流处理
    receive(string) {
        for (let i = 0; i < string.length; i++) {
            this.receiveChar(string.charAt(i));
        }
    }

    // 中间状态，只接受一个字符
    receiveChar(char) {
        // 处理STATUS_LINE
        if (this.current === this.WAITING_STATUS_LINE) {
            // 接受STATUS_LINE的过程中
            if (char === '\r') {
                this.current = this.WAITING_STATUS_LINE_END;
            }
            else if (char === '\n') {
                this.current = this.WAITING_HEADERS_NAME;
            }
            else {
                this.statusLine += char;
            }
        }
        // 状态为status_line_end时，标识status line已结束，所以切换状态
        else if (this.current === this.WAITING_STATUS_LINE_END) {
            if (char === '\n') {
                this.current = this.WAITING_HEADERS_NAME;
            }
        }


        // 处理HEADERS_NAME 以冒号结束
        else if (this.current === this.WAITING_HEADERS_NAME) {
            if (char === ':') {//遇到冒号切换状态
                this.current = this.WAITING_HEADERS_SPACE;
            }
            else if (char === '\r') {
                this.current = this.WAITING_HEADERS_BLOCK_END;
                // WAITING_HEADERS_LINE_END => WAITING_HEADERS_NAME，所以当状态为WAITING_HEADERS_NAME且char为\r时,
                // 说明headers已经结束

                // 创建bodyParser
                if (this.headers['Transfer-Encoding'] == 'chunked') {
                    this.bodyParser = new ChunkedBodyParser();
                }
            }
            else {
                this.headerName += char;
            }
        }
        // 状态为WAITING_HEADERS_SPACE时，切换状态
        else if (this.current === this.WAITING_HEADERS_SPACE) {
            if (char === ' ') {//遇到空格切换状态
                this.current = this.WAITING_HEADERS_VALUE;
            }
        }
        // 处理HEADERS_VALUE的部分，遇到\r时结束
        else if (this.current === this.WAITING_HEADERS_VALUE) {
            if (char === '\r') {
                this.current = this.WAITING_HEADERS_LINE_END;
                // header存在多行
                this.headers[this.headerName] = this.headerValue;
                this.headerName = "";//清空name
                this.headerValue = "";//清空value
            }
            else {
                this.headerValue += char;
            }
        }
        // WAITING_HEADERS_LINE_END => WAITING_HEADERS_NAME
        else if (this.current === this.WAITING_HEADERS_LINE_END) {
            if (char === '\n') {
                this.current = this.WAITING_HEADERS_NAME;
            }
        }
        else if (this.current === this.WAITING_HEADERS_BLOCK_END) {
            if (char === '\n') {
                this.current = this.WAITING_BODY;
            }
        }
        else if (this.current === this.WAITING_BODY) {
            this.bodyParser.receiveChar(char);
        }
    }

}

class ChunkedBodyParser {
    constructor() {
        this.WAITING_LENGTH = 0;
        this.WAITING_LENGTH_LINE_END = 1;
        this.READING_TRUNK = 2;
        this.WAITING_NEW_LINE = 3;
        this.WAITING_NEW_LINE_END = 4;
        this.length = 0;
        this.content = [];
        this.isFinished = false;

        this.current = this.WAITING_LENGTH;
    }

    receiveChar(char) {
        if (this.current === this.WAITING_LENGTH) {
            if (char === '\r') {
                if (this.length === 0) {
                    this.isFinished = true;
                }
                this.current = this.WAITING_LENGTH_LINE_END;
            }
            else {
                // 找到长度
                this.length *= 16;
                this.length += parseInt(char, 16);
            }
        }
        else if (this.current === this.WAITING_LENGTH_LINE_END) {
            if (char === '\n') {
                this.current = this.READING_TRUNK;
            }
        }
        else if (this.current === this.READING_TRUNK) {
            this.content.push(char);
            this.length--;
            if (this.length === 0) {
                // 长度读完后 进入新状态
                this.current = this.WAITING_NEW_LINE;
            }
        }
        else if (this.current === this.WAITING_NEW_LINE) {
            if (char === '\r') {
                this.current = this.WAITING_NEW_LINE_END;
            }
        }
        else if (this.current === this.WAITING_NEW_LINE_END) {
            if (char === '\n') {
                this.current = this.WAITING_LENGTH;
            }
        }
    }
}

void async function () {
    let request = new Request({
        method: "POST",
        host: "127.0.0.1",
        port: "8088",
        path: "/",
        headers: {
            ["X-Foo2"]: "customed"
        },
        body: {
            name: "hhj"
        }
    })
    await request.send();
}();
