#!/usr/bin/env node
const { docopt }      = require('docopt');
const fs              = require('fs').promises;
const spammer         = require('./spammer');
const { execFile }    = require('child_process');

const doc = `Usage:
    ./index.js -h  | --help
    ./index.js (-u | --url <url>) [ --proxy ] [ --timeout <timeout> ]
    ./index.js (-f | --file <filepath>) [ --proxy ] [ --timeout <timeout> ]
     

Options:
    -h --help          Show this screen
    -u --url           Url to use
    -f --file          Path to file with urls
    --timeout          Delay before requests
    --proxy            Enable attack through proxy
`;

async function parseFile(filepath){
    const data = (await fs.readFile(filepath, 'utf8')).split('\n');

    return data;
}


(async () => {
    const {
        '<timeout>'   : timeout,
        '<url>'       : url,
        '<filepath>'  : filepath,
        '--proxy'     : useProxy
    } = docopt(doc);
    
    let urls;

    if (filepath) urls = await parseFile(filepath);
    if (url) urls = [ url ];

    let parserProcess = void 0;

    if (useProxy) parserProcess = execFile('node', [ 'proxyParser.js' ]);

    process.on('SIGINT', () => {
        parserProcess.kill('SIGKILL');
        process.exit();
    });

    process.on('uncaughtException', () => {
        return;
    });

    spammer({ urls, useProxy, timeout });
})();