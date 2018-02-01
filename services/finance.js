'use strict';

// ==== YAHOO FINANCE API SERVICE ====

const yahooFinance = require('yahoo-finance');
const localData = [];

function deletelocalData() {
	localData.length = 0;
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
		return checkNullValues(data);
	})
}

// ==== GET MULTIPLE STOCKS FROM YAHOO ====

function getOneStockBySymbol(symbol, range, period) {
	const today = new Date();
	const today_formatted = today.toISOString().substring(0, 10);

	if (typeof symbol !== 'string') {
		throw new TypeError('only accepts a string.');
	}

	if (!period) period = 'd';  // period default

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
		 * I HAVE ELABORATED ON THIS ISSUE.
		 * SEE "NULL VALUES ERROR" BELLOW (SEARCH DOC WITH CTRL-F).
		 */
		 return checkNullValues(data);
	})
}

/**
 * Makes data available in local memory.
 */
function storeStocksLocally(data) {
	// input validation
	if (data === undefined) {
		throw new Error('No paramters provided');
	}
	// save new stocks
	if (Array.isArray(data)) {
		localData.push(data);
	}
	else if (typeof data == 'object') {
		for (let company in data) {
			if (data.hasOwnProperty(company)) {
				localData.push(data[company]);
			}
		}
		return localData;
	}
}

// ==== REMOVE SAVED STOCK ====

function removeStock(symbol) {
	let index;
	for (let i = 0; i < localData.length; i++) {

		if (localData[i][0].symbol === symbol) {
			console.log('\n');
			console.log('FOUND SYMBOL');
			index = i;
		}
	}
	if (index !== -1) {
		localData.splice(index, 1);
	}
	console.log('\n');
	console.log("argument : ", symbol);
	console.log("found at index : ", index);
	console.log(localData.map(d => d[0].symbol));
	console.log('\n');
}


function getSavedStockNames() {
	return localData.map(stock => {
		return {
			'symbol': stock[0].symbol
		}
	})
}

function removeAll() {
	localData.splice(0, localData.length);
}


function checkNullValues(data) {
	/**
 * NULL VALUES ERROR :
 * On occasion Yahoo's API provides null values. 
 * When unchecked the data breaks my application.
 * May be a bug with yahoo finance api.
 * 
 * This function removes the items at each 
 * location and returns the new (mutated) array
 * with only valid information.
 */
	for (let company in data) {
		// console.log(data[company]);
		if (data.hasOwnProperty(company)) {
			for (let i = data[company].length - 1; i >= 0; i-- ) {
				if (data[company][i].close === null) {
					// console.log(true);
					data[company].splice(i, 1);
				} else
				if (data[company][i].date === null) {
					// console.log(true);		
					data[company].splice(i, 1);
				}
			}
		}
	}
	return data;
}


module.exports = {
	getStocksBySymbol,
	getOneStockBySymbol,
	storeStocksLocally,
	getSavedStockNames,
	checkNullValues,
	localData,
	removeStock,
	removeAll
}