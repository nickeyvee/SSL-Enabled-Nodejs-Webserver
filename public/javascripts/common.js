// make connection with websockets

const socket = io.connect("http://localhost:5000");
const historicalData = [];

// get stock data into our app immediately

$.ajax({
   url: '/stocks',
   method: 'GET'
}).then(function (data) {

   // store in client.
   data.map(stock => {
      historicalData.push(stock);
   })

   const oldest = historicalData[0].data.pop();
   const newest = historicalData[0].data[0];
   const pricesArr = historicalData[0].data.map(stock => stock.price);
   const highestPrice = Math.max.apply(Math, pricesArr);
   const lowestPrice = Math.min.apply(Math, pricesArr);

   console.log(highestPrice, lowestPrice);

   var vis = d3.select("#visualisation"),
      WIDTH = 1000,
      HEIGHT = 500,
      MARGINS = {
         top: 20,
         right: 20,
         bottom: 20,
         left: 50
      },
      xScale = d3.scale
         .linear()
         .range([MARGINS.left, WIDTH - MARGINS.right])
         .domain([2000, 2018]),
      yScale = d3.scale
         .linear()
         .range([HEIGHT - MARGINS.top, MARGINS.bottom])
         .domain([lowestPrice, highestPrice]),
      xAxis = d3.svg.axis()
         .scale(xScale);


   yAxis = d3.svg.axis()
      .scale(yScale)
      .orient("left");

   vis.append("svg:g")
      .attr("transform", "translate(0," + (HEIGHT - MARGINS.bottom) + ")")
      .call(xAxis);

   vis.append("svg:g")
      .call(yAxis);

   yAxis = d3.svg.axis()
      .scale(yScale)
      .orient("left");

   vis.append("svg:g")
      .attr("transform", "translate(" + (MARGINS.left) + ",0)")
      .call(yAxis);

// ==== APPLYING A LINE ====

   var lineGen = d3.svg.line()
      .x(function (d) {
         return xScale(d.year);
      })
      .y(function (d) {
         return yScale(d.sale);
      });

   vis.append('svg:path')
      .attr('d', lineGen(pricesArr))
      .attr('stroke', 'green')
      .attr('stroke-width', 2)
      .attr('fill', 'none');


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