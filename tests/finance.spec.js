'use strict';
const util = require('util');
const expect = require('chai').expect;


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
		this.timeout(3500);
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
		this.timeout(3500);
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
			expect(yahoo.localStockData).to.not.be.undefined;
			expect(yahoo.localStockData).to.have.lengthOf(3);
			expect(yahoo.localStockData[0]).to.be.an('array');
			expect(yahoo.localStockData[0][0]).to.be.an('object');
			expect(yahoo.localStockData[0][0].symbol).to.be.a('string');
			expect(yahoo.localStockData[0][0].close).to.be.a('number');
		})
	})
});


describe('removeStock', function () {
	it('should reflect changes', function () {
		expect(yahoo.localStockData).to.have.lengthOf(3);
		yahoo.removeStock('TSLA');
		expect(yahoo.localStockData).to.have.lengthOf(2);
	})
})