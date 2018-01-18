'use strict';

// ==== YAHOO FINANCE API SERVICE ====

const yahooFinance = require('yahoo-finance');
const localStockData = [];

function deleteLocalStockData() {
	localStockData.length = 0;
}

// ==== GET ONE STOCK FROM YAHOO ====

function getStocksBySymbol(symbols, range, period) {
	const today = new Date();
	const today_formatted = today.toISOString().substring(0, 10);

	if (!Array.isArray(symbols)) {
		throw new TypeError('only accepts an array type.');
	}

	if (!period) period = 'd';   // period default

	if (!range) {
		today.setMonth(today.getMonth() - 12);
	} else {
		today.setMonth(today.getMonth() - range);
	}

	if (range == 60) period = 'm';

	const date_range = today.toISOString().substring(0, 10);

	return yahooFinance.historical({
		symbols: symbols,
		from: date_range,
		to: today_formatted,
		period: period,  // period: 'd'  // 'd' (daily), 'w' (weekly), 'm' (monthly), 'v' (dividends only)
	}).then(data => {
		/**
		 * NULL VALUES ERROR :
		 * The last item for each company contains null values
		 * which breaks my application. It only happens when retrieving
		 * stock information over a 60-month time period. May be a bug
		 * with yahoo finance api.
		 */
		if (range == 60) {
			for (let company in data) {
				if (data.hasOwnProperty(company)) {
					data[company].pop();
				}
			}
			// console.log(data);
			return data;
		} else {
			return data;
		}
	})
}

// ==== GET MULTIPLE STOCKS FROM YAHOO ====

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

	if (range == 60) period = 'w';

	const date_range = today.toISOString().substring(0, 10);

	return yahooFinance.historical({
		symbol: symbol,
		from: date_range,
		to: today_formatted,
		period: period,  // period: 'd'  // 'd' (daily), 'w' (weekly), 'm' (monthly), 'v' (dividends only)
	}).then(data => {

		/**
		 * FOR EXPLANATION ON RANGE CHECKING CONDITION,
		 * SEE "NULL VALUES ERROR" ABOVE (SEARCH DOC WITH CTRL-F).
		 */
		if (range == 60) {
			for (let company in data) {
				if (data.hasOwnProperty(company)) {
					data[company].pop();
				}
			}
			return data;
		} else {
			return data;
		}
	})
}

function storeStocksLocally(data) {
	// input validation
	if (data === undefined) {
		throw new Error('No paramters provided');
	}
	// save new stocks
	if (Array.isArray(data)) {
		localStockData.push(data);
	}
	else if (typeof data == 'object') {
		for (let company in data) {
			if (data.hasOwnProperty(company)) {
				localStockData.push(data[company]);
			}
		}
		return localStockData;
	}
}

// ==== REMOVE SAVED STOCK ====

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
	return localStockData.map(stock => {
		return {
			'symbol': stock[0].symbol
		}
	})
}

function removeAll() {
	localStockData.splice(0, localStockData.length);
}

module.exports = {
	getStocksBySymbol,
	getOneStockBySymbol,
	storeStocksLocally,
	getSavedStockNames,
	localStockData,
	removeStock,
	removeAll
}