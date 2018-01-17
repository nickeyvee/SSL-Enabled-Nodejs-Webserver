'use strict';

/**
 * We need to do two things here:
 * 
 * 1) return the stock we are looking for
 * 2) process it's data and return it
 * 
 * findStock() will search the stock data that we need.
 * We can then pass that data to be procced by mapped() which 
 * will return our the data in a consumable 
 * format for the D3.js API.
 * 
 */

function findStock(data, symbol) {
	return data.find(stock => stock[0].symbol === symbol);
}

function mapped(data, symbol) {

	const date_vs_time = data.map(d => {
		return {
			"price": d.close,
			"date": d.date
		}
	});

	const date_ISO = data.map(d => d.date),
		date_left = date_ISO[date_ISO.length - 1],
		date_right = date_ISO[0],

		price_arr = data.map(stock => stock.close),
		price_top = Math.max.apply(Math, price_arr),
		price_bottom = Math.min.apply(Math, price_arr);

	return {
		"symbol": symbol,
		"date_vs_time": date_vs_time,
		"date_left": date_left,
		"date_right": date_right,
		"price_arr": price_arr,
		"price_top": price_top,
		"price_bottom": price_bottom
	}
}

function findThenMap(data, symbol) {
	return mapped(findStock(data, symbol), symbol);
}

module.exports = {
	"mapData": findThenMap
}