const request =         require('request');
const randomUseragent = require('random-useragent');
const {
     parentPort, workerData
  } =                   require('worker_threads');
const { urls } = workerData;


function sendRequestWithoutProxy(url) {
    request({
        url,
        method: 'GET',
        headers: {
            'User-Agent': randomUseragent.getRandom()
        }
    }, (err, res) => {
        if (err) parentPort.postMessage({url, success: 'unsuccessfully'});
        if (res?.statusCode && res?.statusCode < 400) parentPort.postMessage({url, success: 'successfully'});
    });
}

setInterval(() => {
    urls.forEach(url => {
        request({
            url,
            method: 'GET',
            headers: {
                'User-Agent': randomUseragent.getRandom()
            }
        }, (err, res) => {
            if (err) sendRequestWithoutProxy(url);
            if (res?.statusCode && res?.statusCode < 400) parentPort.postMessage({url, success: 'successfully'});
        })
    });
});