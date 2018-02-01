'use strict';

const $ = require("jquery");
const io = require('socket.io-client');
const c3_chart = require('./c3-chart.js');
const c3_helpers = require('./c3-helpers.js')

const url = "http://localhost:5000";

// make connection with websockets
const socket = io.connect(location.href);
const localData = [];

let timescale = 12;
let symbol_current = '';

/**
 * NOTE : DON'T WORRY ABOUT TESTING CODE FROM VENDORS.
 * 
 */

// get stock data into our app immediately..

$.ajax({
	url: '/data/stocks',
	method: 'GET'
}).then(function (data) {
	// store in client.
	// console.log('store in client');
	// console.log(data);
	data.map(stock => {
		localData.push(stock);
	})
	//  plots ONE stock on init.
	symbol_current = localData[0][0].symbol;

	const d = c3_helpers.mapData(localData, localData[0][0].symbol);

	c3_chart.draw(d.dates, d.prices);

	// update UI

	// update UI
	$('.js-toggle-ticker .card-title').removeClass('highlight');
	$(`#${symbol_current} .card-title`).addClass('highlight');

	// CHECK
	// console.log('INIT');
	// console.log('CURRENT : ', symbol_current);
	// console.log(localData.map(d => d[0].symbol));

});

// ==== REQUESTS ====

function addStock(symbol, range) {
	// console.log(range);
	$.ajax({
		url: '/data/add',
		method: 'POST',
		data: {
			'symbol': symbol,
			'range': range
		},
		success: function (data) {
			// console.log("Data Added");

			// reset local state
			localData.splice(0, localData.length);

			// import updated state         
			data.map(stock => {
				localData.push(stock);
			})

			symbol_current = symbol;

			const d = c3_helpers.mapData(localData, symbol);

			c3_chart.draw(d.dates, d.prices, range);

			socket.emit('add', {
				'data': data,
				'symbol': symbol,
				'range': range
			})

			// CHECK
			// console.log('CURRENT : ', symbol_current);
			// console.log(localData.map(d => d[0].symbol));
		},
		error: function (err) {
			throw new Error(err);
		}
	});
}

// ==== DELETE A STOCK ====

function deleteStock(symbol) {
	$.ajax({
		type: "DELETE",
		url: '/data/remove',
		data: {
			'symbol': symbol
		},
		success: function (data) {
			// console.log("DELETE REQUEST COMPLETE");

			// reset local state
			localData.splice(0, localData.length);

			// import updated state
			data.map(stock => {
				localData.push(stock);
			})

			if (localData[0]) {
				// reset state
				symbol_current = localData[0][0].symbol;

				const d = c3_helpers.mapData(localData, localData[0][0].symbol);

				c3_chart.draw(d.dates, d.prices, timescale);
			} else {
				c3_chart.erase();
				// reset state
				symbol_current = '';
			}

			// CHECK
			// console.log('CURRENT : ', symbol_current);
			// console.log(localData.map(d => d[0].symbol));

			// trigger event on ALL other clients
			socket.emit('delete', {
				'data': data,
				'symbol': symbol
			});
		},
		error: function (err) {
			throw new Error(err);
		}
	});
}


function changeTimescale(symbol, range) {
	// console.log(range);
	$.ajax({
		url: '/data/timescale',
		method: 'POST',
		data: {
			'symbol': symbol,
			'range': range
		},
		success: function (data) {
			// console.log("Data Added");
			// console.log(data, symbol);
			toggleLoader();

			// reset local state
			localData.splice(0, localData.length);

			// import updated state         
			data.map(stock => {
				localData.push(stock);
			})

			const d = c3_helpers.mapData(localData, symbol);

			c3_chart.draw(d.dates, d.prices, range);

			// trigger event on ALL other clients
			socket.emit('timescale', {
				'data': data,
				'symbol': symbol,
				'range': range
			});
		},
		error: function (err) {
			throw new Error(err);
		}
	});
}


// ==== USER EVENT REGISTRATION ====

function addStockEvent(callback) {
	const symbol = $('#ticker_symbol').val().toUpperCase();
	// append new HTML
	const exists = localData.find(stock => stock[0].symbol === symbol);
	const re = /^[A-Z]+$/;

	if (!re.test(symbol)) {
		// console.log('String is invalid');
		return;
	} else if (symbol.length > 4) {
		// console.log('String is invalid');
		return;
	}

	if (exists) {
		$('.topbar').remove();
		topBar("Already added");
		return;
	}
	ticker_markup(symbol);

	// console.log('\n');
	// console.log('Timescale', timescale);

	if (callback) {
		callback(symbol, timescale);
	}
}


function deleteStockEvent(el, callback) {
	const symbol = el.currentTarget.id;
	$(`div#${symbol}`).parent().remove();
	$(`div#${symbol}`).remove();

	if (callback) {
		callback(symbol);
	}
}


function toggleStockChart(el, callback) {
	const symbol = el.currentTarget.id;
	const d = c3_helpers.mapData(localData, symbol);
	symbol_current = symbol;

	// update UI
	$('.js-toggle-ticker .card-title').removeClass('highlight');
	$(`#${symbol} .card-title`).addClass('highlight');

	if (symbol) {
		callback(d.dates, d.prices, timescale);
	}

	// trigger event on ALL other clients
	socket.emit('toggle', {
		'symbol': symbol
	});
}


function changeTimescaleEvent(el, callback) {
	const months = el.currentTarget.getAttribute('value');

	// element styling
	$('.js-time-period').removeClass('active');
	$(el.target).addClass('active');

	toggleLoader();
	timescale = months;

	if (callback) {
		callback(symbol_current, months);
	}
}


// ==== INTITIALIZE EVENTS ON PAGE LOAD ====

$('.add-stock').click(() => {
	addStockEvent(addStock);
});

$('.js-remove-ticker').click(el => {
	deleteStockEvent(el, deleteStock);
});

$('.js-toggle-ticker').click(el => {
	toggleStockChart(el, c3_chart.draw);
})

$('.js-time-period').click(el => {
	changeTimescaleEvent(el, changeTimescale);
})


// ==== SOCKET.IO EVENTS ====

socket.on('add', event => {
	// console.log("ADD EVENT RECIEVED");

	// update UI
	ticker_markup(event.symbol);

	// reset local state
	localData.splice(0, localData.length);

	// import updated state         
	event.data.map(stock => {
		localData.push(stock);
	})

	symbol_current = event.symbol;

	const d = c3_helpers.mapData(localData, event.symbol);

	c3_chart.draw(d.dates, d.prices, event.range);

	// CHECK
	// console.log('CURRENT : ', symbol_current);
	// console.log(localData.map(d => d[0].symbol));
})


socket.on('timescale', event => {
	// console.log("TIMESCALE EVENT RECIEVED");

	// change UI
	$('.js-time-period').removeClass('active');

	if (event.range < 12) {
		$(`#${event.range}-month`).addClass('active');
	} else {
		$(`#${event.range / 12}-year`).addClass('active');
	}
	// reset local state
	localData.splice(0, localData.length);

	// import updated state         
	event.data.map(stock => {
		localData.push(stock);
	})

	const d = c3_helpers.mapData(localData, event.symbol);

	c3_chart.draw(d.dates, d.prices, event.range);

	// CHECK
	// console.log('CURRENT : ', symbol_current);
	// console.log(localData.map(d => d[0].symbol));
});


socket.on('delete', event => {
	// console.log("DELETE EVENT RECIEVED");

	// update UI
	$(`div#${event.symbol}`).parent().remove();
	$(`div#${event.symbol}`).remove();

	// reset local state
	localData.splice(0, localData.length);

	// import updated state
	event.data.map(stock => {
		localData.push(stock);
	})

	if (localData[0]) {
		// reset state
		symbol_current = localData[0][0].symbol;

		const d = c3_helpers.mapData(localData, localData[0][0].symbol);
		c3_chart.draw(d.dates, d.prices);
	} else {
		// reset state
		c3_chart.erase();
		symbol_current = '';
	}

	// CHECK
	// console.log('CURRENT : ', symbol_current);
	// console.log(localData.map(d => d[0].symbol));
})


// toggle
socket.on('toggle', event => {
	const d = c3_helpers.mapData(localData, event.symbol);
	symbol_current = event.symbol;

	$('.js-toggle-ticker .card-title').removeClass('highlight');
	$(`#${event.symbol} .card-title`).addClass('highlight');

	if (event.symbol) {
		c3_chart.draw(d.dates, d.prices, timescale);
	}
})


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
	$(`a#${symbol}`).click(el => {
		deleteStockEvent(el, deleteStock);
	});

	$(`div#${symbol}`).click(el => {
		toggleStockChart(el, c3_chart.draw);
	})
}


function toggleLoader() {
	// $('.loader svg.lds-rolling').toggleClass('hidden');
	$('#chart svg').toggleClass('loading');
}


function topBar(message) {
	$("<div />", { class: 'topbar', text: message }).hide().prependTo("body")
		.slideDown('fast').delay(7500).slideUp(function () { $(this).remove(); });
}

function animate(symbol) {

}


module.exports = {
	addStock,
	deleteStock,
	changeTimescale,
	toggleStockChart
}