'use strict';
const util = require('util');
const expect = require('chai').expect;
const fs = require('fs');

describe('finance.js', function () {
	const yahoo = require('../services/finance.js');

	it('should exist', function () {
		expect(yahoo).to.exist;
	})
});

const yahoo = require('../services/finance.js');
const symbols = ['MSFT', 'AMZN', 'TSLA'];

describe('getStocksBySymbol', function () {
	it('should return something', function () {
		this.timeout(10000);
		return yahoo.getStocksBySymbol(symbols).then(data => {
			expect(data).to.exist;
			expect(data).to.be.an('object');
			expect(data.AMZN).to.be.an('array');
			expect(data.MSFT).to.be.an('array');
			expect(data.TSLA).to.be.an('array');
		})
	})
});

describe('getOneStockBySymbol', function () {

	it('should return something', function () {
		this.timeout(10000);
		return yahoo.getOneStockBySymbol('AMZN').then(data => {
			expect(data).to.exist;
			expect(data).to.be.an('array');
			expect(data[0]).to.be.an('object');
			expect(data[0].close).to.be.a('number');
		})
	})
});

describe('storeStocksLocally', function () {
	it('it should save stocks locally', function () {
		return yahoo.getStocksBySymbol(symbols).then(data => {
			yahoo.storeStocksLocally(data);
			expect(yahoo.localData).to.not.be.undefined;
			expect(yahoo.localData).to.have.lengthOf(3);
			expect(yahoo.localData[0]).to.be.an('array');
			expect(yahoo.localData[0][0]).to.be.an('object');
			expect(yahoo.localData[0][0].symbol).to.be.a('string');
			expect(yahoo.localData[0][0].close).to.be.a('number');
		})
	})
});


describe('removeStock', function () {
	it('should reflect changes', function () {
		expect(yahoo.localData).to.have.lengthOf(3);
		yahoo.removeStock('TSLA');
		expect(yahoo.localData).to.have.lengthOf(2);
	})
})

describe('checkNullValues', function () {

	let failingMock; // a JSON file with bad values.

	before(function (done) {
		fs.readFile('./tests/mocks/yahoo-raw-data-null.json', 'utf8', function (err, data) {
			if (err) throw err;
			failingMock = JSON.parse(data);
			done();
		})
	});

	it('Must check for and omit null values', function () {
		const filtered = yahoo.checkNullValues(failingMock);

		for (let company in filtered) {
			if (filtered.hasOwnProperty(company)) {
				for (let i = 0; i < filtered[company].length; i++) {
					for (let prop in filtered[company][i]) {
						expect(filtered[company][i][prop], JSON.stringify(filtered[company][i])).to.not.be.null;
					}
				}
			}
		}
	});
});