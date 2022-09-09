const proxyCheck = require('proxy-check');
const { PROXY_SITES } = require('./config');
const needle = require('needle');
const cheerio = require('cheerio');
const fs = require('fs').promises;

(async () => {
    setInterval(async () => {
        const proxyList = new Set((await fs.readFile('proxy.txt', 'utf8')).split('\n'));
        
        try {
            for (const url of PROXY_SITES) {
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
        const proxyList = new Set((await fs.readFile('proxy.txt', 'utf8')).split('\n'));
        
        for (const proxy of proxyList) {
            try {
                const [ host, port ] = proxy.split(':');
    
                const result = await proxyCheck({ host, port });
        
                if (result !== true) proxyList.delete(proxy);
            } catch(err) {}
        }
    
        await fs.writeFile('proxy.txt', Array.from(proxyList).join('\n'));
    
    }, 60000)
})();

