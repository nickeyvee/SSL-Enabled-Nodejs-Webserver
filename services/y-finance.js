'use strict';

// ==== YAHOO FINANCE API SERVICE ====

const yahooFinance = require('yahoo-finance');
const localStockData = [];

function deleteLocalStockData() {
   localStockData.length = 0;
}

function getStocksBySymbol(symbols, range, period) {
   const today = new Date();
   const today_formatted = today.toISOString().substring(0, 10);

   if (!Array.isArray(symbols)) {
      throw new TypeError('only accepts an array type.');
   }

   if (!period) period = 'd';   // period default

   if (!range) {
      today.setMonth(today.getMonth() - 3);
   } else {
      today.setMonth(today.getMonth() - range);
   }

   const date_range = today.toISOString().substring(0, 10);

   return yahooFinance.historical({
      symbols: symbols,
      from: date_range,
      to: today_formatted,
      period: period,  // period: 'd'  // 'd' (daily), 'w' (weekly), 'm' (monthly), 'v' (dividends only)
   }).then(data => {
      return data;
   })
}

function getOneStockBySymbol(symbol, range, period) {
   const today = new Date();
   const today_formatted = today.toISOString().substring(0, 10);

   if (typeof symbol !== 'string') {
      throw new TypeError('only accepts a string.');
   }

   if (!period) period = 'd';   // period default

   if (!range) {
      today.setMonth(today.getMonth() - 3);
   } else {
      today.setMonth(today.getMonth() - range);
   }

   const date_range = today.toISOString().substring(0, 10);

   return yahooFinance.historical({
      symbol: symbol,
      from: date_range,
      to: today_formatted,
      period: period,  // period: 'd'  // 'd' (daily), 'w' (weekly), 'm' (monthly), 'v' (dividends only)
   }).then(data => {
      return data;
   })
}

function storeStocksLocally(stockData) {
   // input validation
   if (stockData === undefined) {
      throw new Error('No paramters provided');
   }
   // save new stocks
   if (Array.isArray(stockData)) {
      localStockData.push({
         'symbol': stockData[0].symbol,
         'data': stockData
      })
   } else if (typeof stockData == 'object') {
      for (let company in stockData) {
         if (stockData.hasOwnProperty(company)) {
            localStockData.push({
               'symbol': company,
               'data': stockData[company]
            });
         }
      }
   }
}

function mapStocksByDateAndPrice(stockData) {

   if (!Array.isArray(stockData)) {
      throw new TypeError('only accepts an array type.');
   }
   const result = [];
   
   for (let stock of localStockData) {
      const data = stock.data
         .map(data => {
            const date = new Date(data.date);
            return {
               'ISO': data.date,
               'date': `${date.getMonth() + 1}/${date.getDate() + 1}/${date.getFullYear()}`,
               'price': data.close
            }
         })
      result.push({
         'symbol': stock.symbol,
         'data': data
      })
   }
   return result;
}

function removeStock(symbol) {
   let index;
   for (let i = 0; i < localStockData.length; i++) {
      if (localStockData[i].symbol === symbol) {
         index = i;
      }
   }
   if (index !== -1) {
      localStockData.splice(index, 1);
   }
}

function getSavedStockNames() {
   return localStockData;
}

module.exports = {
   getStocksBySymbol,
   getOneStockBySymbol,
   storeStocksLocally,
   getSavedStockNames,
   mapStocksByDateAndPrice,
   localStockData,
   removeStock
}