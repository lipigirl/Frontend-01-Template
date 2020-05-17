const net = require("net");


// 创建一个到端口 port 和 主机 host的 TCP 连接。 host 默认为 'localhost'。

const client = net.createConnection({ port: 8088, }, () => {
    // 'connect' listener.
    console.log('connected to server!');
    client.write('POST / HTTP/1.1\r\n');
    client.write('Host: 127.0.0.1\r\n');
    client.write('Content-Type: application/x-www-form-urlencoded\r\n');//冒号后面空一格
    client.write('Content-Length: 20\r\n');
    client.write('\r\n');//请求头和内容间要\r\n
    client.write('field1=aaa&code=x%3D1\r\n');;
});
client.on('data', (data) => {
    console.log(data.toString());
    client.end();
});
client.on('end', () => {
    console.log('disconnected from server');
});
client.on('error', err => {
    console.log(err);
    client.end();
});
