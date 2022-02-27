# Usage:
```
    node index.js -h | --help
    node index.js [-u | --url <url>] [-t | --threads <threads>]
    node index.js [-f | --file <filepath>] [-t | --threads <threads>]
```
     

# Options:
```
    -h --help          Show this screen
    -t --threads       Count of threads
    -u --url           Url to use
    -f --file          Path to file with urls
```

# Examples
### Run from npm
```
npm start -- -f urls.txt -t 2
```
### Run from node
```
node index.js -f urls.txt -t 2
```
### Run from docker
```
docker run --rm -it -v ${PWD}/urls.txt:/app/urls.txt tomahawk -f ./urls.txt
```