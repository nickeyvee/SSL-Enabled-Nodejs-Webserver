'use strict';
const request_promise = require('request-promise');
const key = process.env.API_KEY;

const localStockData = [];

function deleteLocalStockData() {
   localStockData.length = 0;
   // console.log(localStockData);
}

function getStocksBySymbol(symbols) {
   // input validation
   if (!key) {
      throw new Error('No API_KEY detected. Make sure you have included your API key.');
   } else if(symbols == undefined ) {
      throw new Error('No parameters provided');
   } else if (!Array.isArray(symbols)) {
      throw new TypeError('only accepts an array type.');
   }

   const urlPromises = symbols.map(symbol => {
      return request_promise('https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=' + symbol + '&apikey=' + key)
         .then(data => {
            return JSON.parse(data);
         })
   });

   return Promise.all(urlPromises);
}


function storeStocksLocally(stockData) {
   // validation
   if (!Array.isArray(stockData)) {
      throw new TypeError('only accepts an array type.');
   }
   // clear our local storage
   deleteLocalStockData();
   // save new stocks
   for( let stock of stockData ) {
      localStockData.push(stock);
   }
}


module.exports = {
   getStocksBySymbol,
   storeStocksLocally,
   localStockData
}