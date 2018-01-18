'use strict';

const $ = require("jquery");
const d3 = require('d3');
const c3 = require('c3');


function c3_chart(dates, prices, range) {

	const months = [
		'Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
	];
	// console.log('\n');
	// console.log('c3_chart() [function]');
	// console.log('Dates : ');
	// console.log(dates);
	// console.log('Prices : ');
	// console.log(prices);

	let y_count = 7,
		date_format = '%Y-%m-%d';

	if (range == 60) {
		y_count = 6;
		date_format = '%Y';
	} else if (range == 1) {
		date_format = '%m %d';
	}

	var chart = c3.generate({
		data: {
			x: 'x',
			columns: [dates, prices],
			types: {
				[prices[0]]: 'area',
			}
		},
		axis: {
			x: {
				type: 'timeseries',
				tick: {
					format: date_format,
					count: y_count,
					culling: 6
				},
				show: true
			},
			y: {
				tick: {
					format: d3.format("$,")
				},
				min: Math.min.apply(Math, prices.slice(1, prices.length)),
			}
		},
		point: {
			show: false
		}
	});

	// apply css :
	$(`#chart .c3-line-${prices[0]}`).css({ "stroke-width": "2px" });
}

module.exports = c3_chart;