'use strict';
const request = require('request-promise');

const key = process.env.API_KEY;
const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=MSFT&apikey=${ key }`;