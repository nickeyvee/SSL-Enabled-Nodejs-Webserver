'use strict';

function findStock(data, symbol) {
	return data.find(stock => stock[0].symbol === symbol);
}


function dates(data) {
	const dates = data.map(d => new Date(d.date));
	dates.unshift('x');
	return dates;
}

function prices(data, symbol) {
	const prices = data.map(d => d.close.toFixed(2));
	prices.unshift(symbol);
	return prices;
}

function data(data, symbol) {
	return {
		"dates": dates(findStock(data, symbol)),
		"prices": prices(findStock(data, symbol), symbol)
	}
}

module.exports = {
	"mapData": data
}