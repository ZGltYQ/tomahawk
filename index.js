#!/usr/bin/env node
const { docopt } =      require('docopt');
const fs =              require('fs').promises;
const { Worker } =      require('worker_threads');


const state = {};

const doc = `Usage:
    ./index.js -h  | --help
    ./index.js (-u | --url <url>) [-t | --threads <threads>] [ --tor ]
    ./index.js (-f | --file <filepath>) [-t | --threads <threads>] [ --tor ]
     

Options:
    -h --help          Show this screen
    -t --threads       Count of threads
    --tor              Enable tor proxy
    -u --url           Url to use
    -f --file          Path to file with urls
`;


function setState({url, success}){
    if (state[url]?.[success]) state[url][success] += 1;
    else {
        state[url] = {
            ...state[url],
            [success]: 1
        }
    }
    console.clear()
    console.log(JSON.parse(JSON.stringify(state)));
}

async function parseFile(filepath){
    const data = (await fs.readFile(filepath, 'utf8')).split('\n');

    return data;
}

function startBombarding({urls, threads, tor}){
    try {
        if (!threads) new Worker(`${__dirname}/bomber.js`, { workerData: { urls, tor } }).on('message', setState);

        for (let i = 0; i < threads; i++) {
            new Worker(`${__dirname}/bomber.js`, {
                workerData: { urls, tor }
            }).on('message', setState);
        }

    } catch(err) {
        console.log(err);
    }
}


(async () => {
    const {
        '<threads>'   : threads,
        '<url>'       : url,
        '--tor'       : tor,
        '<filepath>'  : filepath
    } = docopt(doc);
    
    let urls;

    if (filepath) urls = await parseFile(filepath);
    if (url) urls = [ url ];

    startBombarding({ urls, threads, tor })
})();