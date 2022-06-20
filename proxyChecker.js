const proxyCheck = require('proxy-check');
const needle = require('needle');
const cheerio = require('cheerio');
const fs = require('fs').promises;

(async () => {
    const proxySites = [
        'https://hidemy.name/ru/proxy-list/?start=1&end=10000#list',
        'https://geonode.com/free-proxy-list/',
        'https://www.freeproxylists.net/ru/',
        'https://free-proxy-list.net/',
        'http://free-proxy.cz/ru/',
        'https://www.proxynova.com/proxy-server-list/'
    ];
    
    const proxyList = new Set((await fs.readFile('proxy.txt', 'utf8')).split('\n'));
    
    setInterval(async () => {
        try {
            for (const url of proxySites) {
                const response = await needle('get', url);
                const $ = cheerio.load(response.body);
        
                $('tr').each(async (i, line) => {
                    const host = $(line).children().eq(0).text();
                    const port = $(line).children().eq(1).text();
                    const proxy = `${host}:${port}`;
        
                    try {
                        const proxyStatus = await proxyCheck({ host, port });
        
                        if (proxyStatus === true && !proxyList.has(proxy)) {
                            await fs.appendFile('proxy.txt', `${proxy}\n`)
                        }
                    } catch(err) {}
                });
            }
        } catch(err) {}
    }, 30000);
    
    setInterval(async () => {
        for (const proxy of proxyList) {
            try {
                const [ host, port ] = proxy.split(':');
    
                const result = await proxyCheck({ host, port });
        
                if (result !== true) proxyList.delete(proxy);
            } catch(err) {}
        }
    
        await fs.writeFile('proxy.txt', Array.from(proxyList).join('\n'));
    
    }, 60000)
})()

