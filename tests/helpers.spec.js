'use strict';
const fs = require('fs');
const util = require('util');
const expect = require('chai').expect;


describe('helpers.js', function () {
   const helper = require('../src/helpers.js');

   it('should exist', function () {
      expect(helper).to.exist;
   })
});

const helper = require('../src/helpers.js');

// JSON object for unit tests.
let mock;
 
describe('mockfile.json', function () {
 
    before(function (done) {
        fs.readFile('./tests/mocks/mockfile.json', 'utf8', function (err, data) {
            if (err) throw err;
            mock = JSON.parse(data);
            done();
        });
    })
 
    it('should exist', function () {
        expect(mock).to.exist;
    })
 
    it('should be an array of objects', function () {
        expect(mock).to.be.an('array');
        expect(mock[0]).to.be.an('array');
    })
})


describe('mapData', function() {
   it(`should return data that is consumable by D3's API`, function() {
      const stockData = helper.mapData(mock, 'TSLA');

      const date_left = new Date(stockData.date_left);
      const date_right = new Date(stockData.date_right);

      expect(stockData).to.be.an('object');
      expect(stockData.data_all).to.be.an('array');

      expect(date_left.getFullYear()).to.equal(2017);
      // expect(date_left.getMonth()).to.equal(9);   
      
      expect(date_right.getFullYear()).to.equal(2018);
      expect(date_right.getDate()).to.equal(12);
      expect(date_right.getMonth()).to.equal(0);
      
      expect(stockData.price_arr).to.be.an('array');
      expect(stockData.price_top).to.be.a('number');
      expect(stockData.price_bottom).to.be.a('number');                                        
  })
})
