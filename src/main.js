'use strict';

const $ = require("jquery");
const io = require('socket.io-client');
const helper = require('./helpers.js');
const chart = require('./stockchart.js');

'use strict';

// make connection with websockets
const socket = io.connect("http://localhost:5000");
const historicalData = [];

console.log('bundle.js works');

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
      historicalData.push(stock);
   })
   // plots ONE stock on init.
   chart.plotStock(
      helper.mapStockData(
         helper.searchByTickerName(historicalData, 'TSLA')
      )
   )
});

// ==== REQUESTS ====

function addStock() {
   const symbol = $('#ticker_symbol').val();
   $.ajax({
      url: '/add',
      method: 'POST',
      data: {
         'symbol': symbol
      },
      success: function (msg) {
         console.log("Data Deleted: " + msg);
         window.location.reload(true);
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
      success: function (msg) {
         console.log("Data Deleted: " + msg);
         window.location.reload(true);
      }
   });
}

// ==== USER EVENT REGISTRATION ====

$('.add-stock').click(el => {
   addStock();
})

$('.remove-ticker').click(el => {
   removeStock(el.currentTarget.id);
})


// ==== CHANGE GRAPH STATE ====

$('.select-ticker').click(el => {
   const symbol = el.currentTarget.id;
   chart.resetChart();
   chart.plotStock(
      helper.mapStockData(
         helper.searchByTickerName(historicalData, symbol)
      )
   );
});