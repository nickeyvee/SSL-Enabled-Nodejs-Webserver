'use strict';
const request_promise = require('request-promise');
const key = process.env.API_KEY;

const localStockData = [];

const timePeriod = {
   'TIME_SERIES_DAILY': 'Time Series (Daily)',
   'TIME_SERIES_WEEKLY': 'Weekly Time Series',
   'TIME_SERIES_MONTHLY': 'Monthly Time Series'
}

function deleteLocalStockData() {
   localStockData.length = 0;
}

function getStocksBySymbol(symbols, timePeriod) {
   // input validation
   if (!key) {
      throw new Error('No API_KEY detected. Make sure you have included your API key.');
   } else if (symbols == undefined) {
      throw new Error('No parameters provided');
   } else if (!Array.isArray(symbols)) {
      throw new TypeError('only accepts an array type.');
   } else if (!timePeriod) {
      timePeriod = 'TIME_SERIES_DAILY'; // default
   }

   const urlPromises = symbols.map(symbol => {
      return request_promise('https://www.alphavantage.co/query?function=' + timePeriod + '&symbol=' + symbol + '&apikey=' + key)
         .then(data => {
            return JSON.parse(data);
         })
   });

   return Promise.all(urlPromises);
}


function storeStocksLocally(stockData) {
   // input validation
   if (stockData === undefined) {
      throw new Error('No paramters provided');
   }
   // save new stocks
   if (Array.isArray(stockData)) {
      for (let stock of stockData) {
         localStockData.push(stock);
      }
   } else {
      localStockData.push(stockData);
   }
}

/** 
 * Returns our stock data in way the will be consumable by
 our app, mainly D3.js
 */

function formatStockData(timePeriod) {

   if (!timePeriod) {
      timePeriod = 'Time Series (Daily)'; // default seletion if there is none
   }

   return localStockData.map(stock => {
      const stockInfoDaily = stock[timePeriod];
      const symbol = stock['Meta Data']['2. Symbol'];
      const result = [];

      for (var key in stockInfoDaily) {
         if (stockInfoDaily.hasOwnProperty(key)) {
            const date = new Date(key);

            result.push({
               'date': `${date.getMonth() + 1}/${date.getDate() + 1}/${date.getFullYear()}`,
               'price': stockInfoDaily[key]['4. close']
            });
         }
      }
      return {
         'symbol': symbol,
         'data': result
      };
   })
}


function getOneStockBySymbol(symbol, timePeriod) {

   if (symbol == undefined) {
      throw new Error('No parameters provided');
   } else if (!timePeriod) {
      timePeriod = 'TIME_SERIES_DAILY'; // default
   }

   return request_promise('https://www.alphavantage.co/query?function=' + timePeriod + '&symbol=' + symbol + '&apikey=' + key)
      .then(data => {
         return JSON.parse(data);
      })
}


module.exports = {
   getStocksBySymbol,
   storeStocksLocally,
   formatStockData,
   getOneStockBySymbol,
   localStockData
}