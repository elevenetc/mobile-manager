/**
 * Created by eugene.levenetc on 03/12/2016.
 */
const assert = require('assert');
const sinon = require('sinon');
const utils = require('../src/utils/utils');

describe('Utils', function () {

    before(function () {

    });

    it('checkNull should throw NPE', function () {
        assert.throws(function(){
            utils.checkNull({}, 'field');
        });
    });

    it('checkNull should not throw NPE', function () {
        assert.doesNotThrow(function(){
            utils.checkNull({field:42}, 'field');
        });
    });

    it('First letter should be capital', function () {
        assert.equal(utils.capitalize('hello'), 'Hello');
    });

    it('Object should be defined', function () {
        assert.equal(utils.isDefined({}), true);
        assert.equal(utils.isDefined(''), true);
    });

    it('Object should not be defined', function () {
        assert.equal(utils.isDefined(null), false);
        assert.equal(utils.isDefined(undefined), false);
    });

    it('Clone array', function () {
        const array = [{x:'0'}, {y:'1'}];
        assert.deepEqual(utils.cloneArray(array), array);
    });

    it('Is number', function () {
       assert.equal(utils.isNumber(10), true);
       assert.equal(utils.isNumber(1), true);
       assert.equal(utils.isNumber(0), true);
       assert.equal(utils.isNumber(-1), true);
       assert.equal(utils.isNumber(50000), true);
       assert.equal(utils.isNumber('b'), false);
       assert.equal(utils.isNumber(), false);
    });
});