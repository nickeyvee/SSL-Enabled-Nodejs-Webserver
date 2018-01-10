'use strict';
const util = require('util');
const expect = require('chai').expect;

describe('stockinfo.js', function () {
   const stocks = require('../services/stockinfo.js');
   const key = process.env.API_KEY;

   it('should exist', function () {
      expect(stocks).to.exist;
   });

   it('must include an API key', function () {
      expect(key, 'Make sure you have provided a valid API key').to.not.be.undefined;
   });
})

/**
 * NOTE: If you do not have an API key, 
   most of the following tests are not valid.
   
   You need an API key to properly test your code.
 */

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
            expect(stocks.localStockData).to.not.be.empty;
            expect(stocks.localStockData[0]).to.be.an('object');
         })
   })
});

describe('formatStockData', function () {

   it('should return an array of objects', function () {
      const stockData = stocks.formatStockData()
      expect(stockData).to.be.an('array');
      expect(stockData[0]).to.be.an('object');
      expect(stockData[0].symbol).to.be.a('string');
      expect(stockData[0].data).to.be.an('array');
      expect(stockData[0].data[0]).to.be.an('object');
   })
})


describe('getOneStockBySymbol', function () {

   it('should return an object', function () {
      this.timeout(10000);

      return stocks.getOneStockBySymbol('AAPL')
         .then(data => {
            expect(data).to.be.an('object');
            expect(data['Time Series (Daily)']).to.be.an('object');
         });
   })
});