# Mobile Manager

[![Build Status](https://travis-ci.org/elevenetc/device-manager-back-end.svg?branch=master)](https://travis-ci.org/elevenetc/device-manager-back-end)
[![Code Climate](https://codeclimate.com/github/elevenetc/device-manager-back-end/badges/gpa.svg)](https://codeclimate.com/github/elevenetc/device-manager-back-end)
[![Test Coverage](https://codeclimate.com/github/elevenetc/device-manager-back-end/badges/coverage.svg)](https://codeclimate.com/github/elevenetc/device-manager-back-end/coverage)
[![Issue Count](https://codeclimate.com/github/elevenetc/device-manager-back-end/badges/issue_count.svg)](https://codeclimate.com/github/elevenetc/device-manager-back-end)
## Setup
1. setup `MySQL` and create database
2. `npm install mobile-manager`
3. create `app.js`
```
const MobileManager = require('mobile-manager');
new MobileManager({
    dbFile: 'database name',
    dbUser: 'database user name',
    dbPass: 'database password',
    port: 8089,
    pingTimeout: 1000 * 60,
    keys:{
        googleCloud: 'google cloud key',
        slack: 'slack key'
    },
    logLevel: 'trace'
}).start();
```
## Run
1. `node app.js`
## Add devices