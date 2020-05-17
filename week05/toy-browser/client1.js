const net = require("net");


// 创建一个端口为 port 和主机为 host的 TCP 连接 
net.connect({
    port: 8088,
    host: "127.0.0.1",
    onread: {
        buffer: Buffer.alloc(4 * 1024),
        callback: function (nread, buf) {
            console.log(buf.toString('utf8', 0, nread))
        }
    }
});