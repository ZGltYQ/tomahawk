const needle = require('needle');
const cheerio = require('cheerio');

class ProxyScenarios {
    constructor() {
        this.scenarios = {
            'https://openproxy.space/list/http': this.openProxyScenario.bind(this),
            'https://hidemy.name/ru/proxy-list/?start=1&end=10000#list': this.defaultScenarioCase.bind(this),
            'https://geonode.com/free-proxy-list/': this.defaultScenarioCase.bind(this),
            'https://www.freeproxylists.net/ru/': this.defaultScenarioCase.bind(this),
            'https://www.freeproxylists.net/ru/?page=2': this.defaultScenarioCase.bind(this),
            'https://www.freeproxylists.net/ru/?page=3': this.defaultScenarioCase.bind(this),
            'https://free-proxy-list.net/': this.defaultScenarioCase.bind(this),
            'http://free-proxy.cz/ru/': this.defaultScenarioCase.bind(this),
            'https://www.proxyscan.io/': this.defaultScenarioCase.bind(this),
            'https://www.proxynova.com/proxy-server-list/': this.defaultScenarioCase.bind(this)
        } 
    };


    async #makeRequest({ target, proxy = false }) {
        const response = proxy ? await needle('get', target, { proxy: `http://${proxy}` }) : await needle('get', target);
        return cheerio.load(response.body);
    }

    async openProxyScenario({ target, proxy }) {
        const $ = await this.#makeRequest({ target, proxy });

        const ips = $.text().match(/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\:\d{1,6}/g);

        return ips;
    }

    async defaultScenarioCase({ target, proxy }) {
        const $ = await this.#makeRequest({ target, proxy });

        return await Promise.all($('tr').map(async (i, line) => {
            const host = $(line).children().eq(0).text();
            const port = $(line).children().eq(1).text();
            return `${host}:${port}`;
        }));
    }

    async runScenario(scenario, proxy) {
        return this.scenarios[scenario]({ target: scenario, proxy });
    }

}


module.exports = ProxyScenarios;