# Usage:
```
    ./index.js -h | --help
    ./index.js [-u | --url <url>] [-t | --threads <threads>]
    ./index.js [-f | --file <filepath>] [-t | --threads <threads>]
```
     

# Options:
```
    -h --help          Show this screen
    -t --threads       count of threads
    -u --url           url to use
    -f --file          path to file with urls
```

# Examples
```
npm start -- -f urls.txt -t 2
```
```
node index.js -f urls.txt -t 2
```
```
docker run --rm -it -v ${PWD}/urls.txt:/app/urls.txt tomahawk -f ./urls.txt
```