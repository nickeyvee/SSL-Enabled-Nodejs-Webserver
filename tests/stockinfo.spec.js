'use strict';
const util = require('util');
const expect = require('chai').expect;

describe('stockinfo.js', function () {
   const stocks = require('../services/stockinfo.js');
   const key = process.env.API_KEY;

   it('should exist', function () {
      expect(stocks).to.exist;
   });

   // NOTE: If you do not have an API key, 
   // many of the following tests are not valid.
   //
   // You need an API key to properly test your code.

   it('must include an API key', function () {
      expect(key, 'Make sure you have provided a valid API key').to.not.be.undefined;
   });
})

const stocks = require('../services/stockinfo.js');
const symbols = ['MSFT', 'AMZN', 'TSLA'];

describe('getStocksBySymbol', function () {

   it('Should be valid', function () {
      this.timeout(10000);
      return stocks.getStocksBySymbol(symbols)
         .then(data => {
            expect(data, 'does not return a value').to.not.be.undefined;
            expect(data, 'should return an array').to.be.an('array');
         })
   })
});

describe('storeStocksLocally', function () {
   it('should store data locally', function () {
      this.timeout(10000);

      return stocks.getStocksBySymbol(symbols)
         .then(data => {
            stocks.storeStocksLocally(data);
            expect(stocks.localStockData[0]).to.be.an('object');
         })
   })
})