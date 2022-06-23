#!/usr/bin/env bash
curl -sL https://deb.nodesource.com/setup_16.x -o nodesource_setup.sh
chmod 777 nodesource_setup.sh
sudo ./nodesource_setup.sh
sudo apt install nodejs
npm install
sudo npm i -g pm2