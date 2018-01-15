'use strict';

const $ = require("jquery");
const io = require('socket.io-client');
const helper = require('./helpers.js');
const chart = require('./stockchart.js');

'use strict';

// make connection with websockets
const socket = io.connect("http://localhost:5000");
const historicalData = [];

//console.log('bundle.js works');

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

function addStock() {
   const symbol = $('#ticker_symbol').val();
   $.ajax({
      url: '/add',
      method: 'POST',
      data: {
         'symbol': symbol
      },
      success: function (data) {
         console.log("Data Added");
         console.log(data);

         addTickerBox(symbol);

         historicalData.length = 0;

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
         console.log(data);

         // THIS IS CAUSING PROBLEMS

         $(`#${symbol}`).parent().remove();
         $(`#${symbol}`).remove();

         historicalData.splice(0, historicalData.length);

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

// ==== USER EVENT REGISTRATION ====

function addStockEvent() {
   $('.add-stock').click(el => {
      console.log('added stock');
      addStock();
   })
}


function deleteStockEvent(target) {
   $(target).click(el => {
      removeStock(el.currentTarget.id);
   });
}

// initialize..
addStockEvent();
deleteStockEvent('.remove-ticker');


// ==== CHANGE GRAPH STATE ====

function toggleStockChart(symbol) {
   $(symbol).click(el => {
      const symbol = el.currentTarget.id;
      chart.resetChart();
      chart.plotStock(
         helper.mapData(historicalData, symbol)
      );
   });
}

//init..
toggleStockChart('.select-ticker');

function addTickerBox(symbol) {
   $('#tickerbox').before(
      `
   <div class="col s12 m12 l4">
      <div class="card select-ticker align-left" id="${symbol}" style="min-height: 80px;">
         <div class="card-content">
            <span class="card-title pull-left">${symbol}</span>
            <a id="${symbol}" class="remove-ticker pull-right" style="cursor: pointer;">
               <i class="fa fa-times" aria-hidden="true">
            </i></a>
         </div>
      </div>
   </div>
   `);

   deleteStockEvent(`a#${symbol}`);
   toggleStockChart(`.select-ticker#${symbol}`);
   // must re-add event
}