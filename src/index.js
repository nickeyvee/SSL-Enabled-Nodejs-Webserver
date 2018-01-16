'use strict';

const $ = require("jquery");
const io = require('socket.io-client');
const helper = require('./helpers.js');
const chart = require('./chart.js');

// make connection with websockets
const socket = io.connect("http://localhost:5000");
const historicalData = [];

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
      helper.mapData(historicalData, historicalData[0].symbol)
   )
});

// ==== REQUESTS ====

function addStock(symbol) {
   $.ajax({
      url: '/add',
      method: 'POST',
      data: {
         'symbol': symbol
      },
      success: function (data) {
         console.log("Data Added");

         // reset local state
         historicalData.splice(0, historicalData.length);

         // import updated state         
         data.map(stock => {
            historicalData.push(stock);
         })

         chart.resetChart();
         chart.plotStock(
            helper.mapData(historicalData, symbol)
         )
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

         const local = historicalData.map(d => d.symbol);

         console.log(local);
         console.log(historicalData);

         // reset local state
         historicalData.splice(0, historicalData.length);

         // import updated state
         data.map(stock => {
            historicalData.push(stock);
         })

         chart.resetChart();
         if (historicalData[0]) {
            chart.plotStock(
               helper.mapData(historicalData, historicalData[0].symbol)
            )
         }
      }
   });
}


function changeTimescale(symbol, range) {
   $.ajax({
      url: '/timescale',
      method: 'POST',
      data: {
         'symbol': symbol,
         'range': range
      },
      success: function (data) {
         console.log("Data Added");
         console.log(data);

         // reset local state
         historicalData.splice(0, historicalData.length);

         // import updated state         
         data.map(stock => {
            historicalData.push(stock);
         })

         chart.resetChart();
         chart.plotStock(
            helper.mapData(historicalData, symbol)
         )
      },
      error: function(err) {
         console.log(err.status);
         console.log(err.statusText);         
      }
   });
}


// ==== USER EVENT REGISTRATION ====

function addStockEvent(target) {
   $(target).click(el => {
      const symbol = $('#ticker_symbol').val();
      // append new HTML
      ticker_markup(symbol);

      addStock(symbol);
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
      chart.resetChart();
      chart.plotStock(
         helper.mapData(historicalData, symbol)
      );
   });
}

function changeTimescaleEvent() {
   $('.js-time-period').click(el => {
      const months = el.currentTarget.getAttribute('value');
      const symbol = el.currentTarget.getAttribute('data-symbol');

      console.log( months, symbol);

      changeTimescale(symbol, months);

      // socket.emit('timechange', {
      //    "timePeriod": months
      // })
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