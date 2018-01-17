'use strict';

const $ = require("jquery");
const d3 = require('d3');
const c3 = require('c3');


function c3_chart(dates, prices) {

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
					format: '%Y-%m-%d',
					count: 7,
					culling: 6
				},
				show: true
			},
			y: {
				tick: {
					format: d3.format("$,")
				},
				min: Math.min.apply(Math, prices.slice(1, prices.length)) - 10,
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