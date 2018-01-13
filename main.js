// global.jQuery = require("jquery");

const $ = require("jquery");
const d3 = require('d3');
const io = require('socket.io-client');

// make connection with websockets

const socket = io.connect("http://localhost:5000");
const historicalData = [];

// get stock data into our app immediately
console.log('bundle.js works');

$.ajax({
   url: '/stocks',
   method: 'GET'
}).then(function (data) {
   console.log(data);

   // store in client.
   data.map(stock => {
      historicalData.push(stock);
   })

   plotStock(searchStock('TSLA'));
   // console.log(searchStock('TSLA'));
});

// ==== RESPOND TO USER INPUTS ====

function addStock() {
   const symbol = $('#ticker_symbol').val();
   console.log(symbol);

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

$('.remove-ticker').click(el => {
   removeStock(el.currentTarget.id);
})

function removeStock(symbol) {
   console.log(symbol);

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


function searchStock(symbol) {
   return historicalData.find(stock => stock.symbol === symbol);
}

function plotStock(stock) {

   const vis = d3.select("#visualisation"),
      WIDTH = 1150,
      HEIGHT = 300,
      MARGINS = {
         top: 20,
         right: 20,
         bottom: 20,
         left: 50
      };

   const date_arr = stock.data.map(stock => stock);
   const date_left = stock.data[stock.data.length - 1];
   const date_right = stock.data[0];

   const price_arr = stock.data.map(stock => stock.price);
   const price_right = Math.max.apply(Math, price_arr);
   const price_left = Math.min.apply(Math, price_arr);

   /**
    * This will be our timescale.
    What we are doing here is converting our ISO dates implicitly
    into numbers represented in milliseconds. This will allow us
    to actually plot plot our numbers on a graph.
    */

   const xScale = d3.time.scale()
      .range([MARGINS.left, WIDTH - MARGINS.right])
      .domain([new Date(date_left.ISO), new Date(date_right.ISO)]);

   console.log([new Date(date_left.ISO), new Date(date_right.ISO)])


   const yScale = d3.scale
      .linear()
      .range([HEIGHT - MARGINS.top, MARGINS.bottom])
      .domain([price_left, price_right]);

   console.log([price_left, price_right]);

   const xAxis = d3.svg.axis()
      .scale(xScale);

   const yAxis = d3.svg.axis()
      .scale(yScale)
      .orient("left");

   vis.append("svg:g")
      .attr("transform", "translate(0," + (HEIGHT - MARGINS.bottom) + ")")
      .call(xAxis);

   vis.append("svg:g")
      .call(yAxis);

   vis.append("svg:g")
      .attr("transform", "translate(" + (MARGINS.left) + ",0)")
      .call(yAxis);

   // ==== APPLYING A LINE ====

   var lineGen = d3.svg.line()
      .x(d => {
         return xScale(new Date(d.ISO))
      })
      .y(d => {
         return yScale(d.price)
      });

   vis.append('svg:path')
      .attr('d', lineGen(date_arr))
      .attr('stroke', 'green')
      .attr('stroke-width', 2)
      .attr('fill', 'none');
      console.log("shit's not broke?");
}



// ==== CHANGE GRAPH STATE ====

$('.select-ticker').click(el => {
   const symbol = el.currentTarget.id;

   d3.selectAll("path").remove();
   d3.selectAll("g").remove();
   plotStock(searchStock(symbol));

});