/**
 * Created by eugene.levenetc on 03/12/2016.
 */
const assert = require('assert');
const sinon = require('sinon');
const utils = require('../src/utils/utils');
const OrderedMap = require('../src/utils/ordered-map');

describe('Utils', function () {

    before(function () {

    });

    it('checkNull should throw NPE on empty filed', function () {
        assert.throws(function () {
            utils.checkNull({}, 'field');
        });
    });

    it('checkNull should throw NPE on null object', function () {
        assert.throws(function () {
            utils.checkNull(null, 'field');
        });
    });

    it('checkNull should not throw NPE', function () {
        assert.doesNotThrow(function () {
            utils.checkNull({field: 42}, 'field');
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
        const array = [{x: '0'}, {y: '1'}];
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

    it('Is string', function () {
        assert.equal(utils.isString(), false);
        assert.equal(utils.isString(null), false);
        assert.equal(utils.isString(undefined), false);
        assert.equal(utils.isString(1), false);
        assert.equal(utils.isString(1.0), false);
        assert.equal(utils.isString(true), false);
        assert.equal(utils.isString(false), false);
        assert.equal(utils.isString(''), true);
        assert.equal(utils.isString(""), true);
        assert.equal(utils.isString("A"), true);
    });

    it('Is string contains string', function () {
        assert.equal(utils.contains('xv:z', null), false);
        assert.equal(utils.contains('xv:z', undefined), false);
        assert.equal(utils.contains(null, undefined), false);
        assert.equal(utils.contains('xv:z', 'v:true'), false);
        assert.equal(utils.contains('xv:truez', 'v:true'), true);
    });

    it('OrderedMap: Iterate', function () {

        let orderedMap = new OrderedMap();
        let keysArray = [];
        let valuesArray = [];

        orderedMap.put('a', 0);
        orderedMap.put('b', 1);
        orderedMap.put('c', 2);

        orderedMap.iterate(function (key, value) {
            keysArray.push(key);
            valuesArray.push(value);
        });

        assert.deepEqual(keysArray, ['a', 'b', 'c']);
        assert.deepEqual(valuesArray, [0, 1, 2]);
    });

    it('OrderedMap: get', function () {
        let orderedMap = new OrderedMap();
        orderedMap.put('a', 0);
        orderedMap.put('b', 1);

        assert.equal(orderedMap.get('b'), 1);
        assert.equal(orderedMap.get('x'), null);
    });

    it('OrderedMap: indexOfValue', function () {
        let orderedMap = new OrderedMap();
        orderedMap.put('a', 0);
        orderedMap.put('b', 1);

        assert.equal(orderedMap.indexOfValue(0), 0);
        assert.equal(orderedMap.indexOfValue(10), -1);
    });

    it('OrderedMap: indexOfKey', function () {
        let orderedMap = new OrderedMap();
        orderedMap.put('a', 0);
        orderedMap.put('b', 1);

        assert.equal(orderedMap.indexOfKey('b'), 1);
        assert.equal(orderedMap.indexOfKey('x'), -1);
    });

    it('OrderedMap: remove', function () {
        let orderedMap = new OrderedMap();

        orderedMap.put('a', 0);
        orderedMap.put('b', 1);
        orderedMap.put('c', 2);

        orderedMap.remove('b');

        assert.equal(orderedMap.get('b'), null);
        assert.equal(orderedMap.indexOfKey('b'), -1);
        assert.equal(orderedMap.size(), 2);
    });

    it('OrderedMap: size', function () {
        let orderedMap = new OrderedMap();
        orderedMap.put('a', 0);
        orderedMap.put('b', 1);

        assert.equal(orderedMap.size(), 2);
    });

    it('Is prop defined', function () {

        assert.equal(utils.isPropDefined({a: 10}, 'a'), true);
        assert.equal(utils.isPropDefined({a: '10'}, 'a'), true);
        assert.equal(utils.isPropDefined({'a': 'b', 'z': 10, 'x': null}, 'a'), true);

        assert.equal(utils.isPropDefined({a: null}, 'a'), false);
        assert.equal(utils.isPropDefined({a: undefined}, 'a'), false);
        assert.equal(utils.isPropDefined({}, 'a'), false);
    });

    it('Is device valid', function () {
        assert.equal(utils.isDeviceValid({
            deviceId: 1,
            pushToken: 1,
            manufacturer: 1,
            model: 1,
            osVersion: 1,
            platform: 1,
            screenSize: 1
        }), true);
    });

});