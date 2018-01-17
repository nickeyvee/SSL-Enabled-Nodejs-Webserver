'use strict';

const $ = require("jquery");
const io = require('socket.io-client');
const helper = require('./d3-helpers.js');
// const chart = require('./d3-chart.js');
const c3_chart = require('./c3-chart.js');
const c3_helpers = require('./c3-helpers.js')

// make connection with websockets
const socket = io.connect("http://localhost:5000");
const localData = [];

let timescale = 12;
let symbol_state = '';

/**
 * NOTE : DON'T WORRY ABOUT TESTING CODE FROM VENDORS.
 * 
 */

// get stock data into our app immediately..

$.ajax({
	url: '/stocks',
	method: 'GET'
}).then(function (data) {
	// store in client.
	data.map(stock => {
		localData.push(stock);
	})
	//  plots ONE stock on init.
	symbol_state = localData[0][0].symbol;

	const d = c3_helpers.mapData(localData, localData[0][0].symbol);

	c3_chart(d.dates, d.prices);

});

// ==== REQUESTS ====

function addStock(symbol, range) {
	console.log(range);
	$.ajax({
		url: '/add',
		method: 'POST',
		data: {
			'symbol': symbol,
			'range': range
		},
		success: function (data) {
			console.log("Data Added");

			// reset local state
			localData.splice(0, localData.length);

			// import updated state         
			data.map(stock => {
				localData.push(stock);
			})
			const d = c3_helpers.mapData(localData, symbol);

			c3_chart(d.dates, d.prices);
		}
	});
}

function removeStock(symbol) {
	$.ajax({
		type: "DELETE",
		url: '/remove',
		data: {
			'symbol': symbol
		},
		success: function (data) {
			console.log("Data Deleted");

			// reset local state
			localData.splice(0, localData.length);

			// import updated state
			data.map(stock => {
				localData.push(stock);
			})

			// chart.resetChart();
			if (localData[0]) {
				// chart.d3_chart(
				// 	helper.mapData(localData, localData[0][0].symbol)
				// )
				const d = c3_helpers.mapData(localData, localData[0][0].symbol);
				c3_chart(d.dates, d.prices);
			}
		}
	});
}


function changeTimescale(symbol, range) {
	console.log(range);
	$.ajax({
		url: '/timescale',
		method: 'POST',
		data: {
			'symbol': symbol,
			'range': range
		},
		success: function (data) {
			console.log("Data Added");
			console.log(data, symbol);

			// reset local state
			localData.splice(0, localData.length);

			// import updated state         
			data.map(stock => {
				localData.push(stock);
			})

			const d = c3_helpers.mapData(localData, symbol);

			c3_chart(d.dates, d.prices);
		},
		error: function (err) {
			console.log(err.status);
			console.log(err.statusText);
		}
	});
}


// ==== USER EVENT REGISTRATION ====

function addStockEvent(target) {
	$(target).click(el => {
		const symbol = $('#ticker_symbol').val().toUpperCase();
		// append new HTML
		const exists = localData.find(stock => stock[0].symbol === symbol);

		const re = /^[A-Z]+$/;

		if (!re.test(symbol)) {
			console.log('String is invalid');
			return;
		} else if (symbol.length > 4) {
			console.log('String is invalid');
			return;
		}

		if (exists) {
			console.log('already added');
			return;
		}

		ticker_markup(symbol);

		addStock(symbol, timescale);
	})
}


function deleteStockEvent(target) {
	$(target).click(el => {
		const symbol = el.currentTarget.id;

		$(`div#${symbol}`).parent().remove();
		$(`div#${symbol}`).remove();

		removeStock(symbol);
	});
}


function toggleStockChart(symbol) {
	$(symbol).click(el => {

		const symbol = el.currentTarget.id;

		symbol_state = symbol;

		const d = c3_helpers.mapData(localData, symbol);

		c3_chart(d.dates, d.prices);
	});
}

function changeTimescaleEvent() {
	$('.js-time-period').click(el => {
		const months = el.currentTarget.getAttribute('value');

		timescale = months;

		changeTimescale(symbol_state, months);

	})
}

// initialize our events
addStockEvent('.add-stock');

deleteStockEvent('.js-remove-ticker');

toggleStockChart('.js-toggle-ticker');

changeTimescaleEvent();


// ==== Vanilla.js stock ticker component ====

function ticker_markup(symbol) {
	$('.js-tickers').prepend(`
   <div class="col s12 m12 l4">
      <div class="card js-toggle-ticker align-left" id="${symbol}" style="min-height: 80px;">
         <div class="card-content">
            <span class="card-title pull-left">${symbol}</span>
            <a id="${symbol}" class="js-remove-ticker pull-right" style="cursor: pointer;">
               <i class="fa fa-times" aria-hidden="true">
            </i></a>
         </div>
      </div>
   </div>
   `);

	/**
	 * since our HTML is brand-new we must 
	 * re-add our event listeners.
	 */
	deleteStockEvent(`a#${symbol}`);
	toggleStockChart(`div#${symbol}`);
}