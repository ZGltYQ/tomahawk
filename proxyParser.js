const proxyCheck = require('proxy-check');
const { PROXY_SITES } = require('./config');
const ProxyScenarios  = require('./proxyScenarios');
const fs = require('fs').promises;

const scenarioRunner = new ProxyScenarios();

async function startParsing() {
    const proxyList = new Set((await fs.readFile('proxy.txt', 'utf8')).split('\n'));
    const randomProxy = proxyList[Math.floor(Math.random() * (proxyList?.length - 1))];

    try {
        for (const scenario of PROXY_SITES) {
            const proxies = await scenarioRunner.runScenario(scenario, randomProxy);

            for (const ip of proxies) {
                try {
                    const [ host, port ] = ip.split(':');

                    const status = await proxyCheck({ host, port });

                    if (status === true && !proxyList.has(ip)) {
                        await fs.appendFile('proxy.txt', `${ip}\n`)
                    }
                } catch(err) {}
            }
        }
    } catch(err) {}
}

(async () => {
    await startParsing();

    setInterval(async () => {
        await startParsing();
    }, 120000);
    
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

