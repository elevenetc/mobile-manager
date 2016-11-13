/**
 * Created by eugene.levenetc on 01/09/16.
 */
const assert = require('assert');
const sinon = require('sinon');
const mockRes = require('./mock-response');

describe('Given foo requires the bar and path modules and bar.bar() returns "bar"', function () {
	describe('When I resolve', function () {

		let routes;

		before(function () {
			routes = require('./index-impl');
		});

		it('foo is required 2 times', function () {
			routes.ping({body: {}}, mockRes);
			assert.notEqual(routes, null);
		})

	});
});