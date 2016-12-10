/**
 * Created by eugene.levenetc on 03/12/2016.
 */
const assert = require('assert');
const sinon = require('sinon');
const view = require('../src/view/view');

describe('View utils', function () {

    before(function () {

    });

    it('undefined view type throws error', function () {
        assert.throws(function () {
            view.renderDevices([], 'x-type');
        });
    });

    it('json view type', function () {
        const devices = [{hasBluetoothLowEnergy: false}, {hasBluetoothLowEnergy: true}];
        assert.deepEqual(view.renderDevices('json', devices), devices);
    });

    it('with null filter should return same devices', function () {
        const devices = [{hasBluetoothLowEnergy: false}, {hasBluetoothLowEnergy: true}];
        const filtered = view.filterDevices(devices, null);
        assert.deepEqual(devices, filtered);
    });

    it('with undefined filter should return same devices', function () {
        const devices = [{hasBluetoothLowEnergy: false}, {hasBluetoothLowEnergy: true}];
        const filtered = view.filterDevices(devices);
        assert.deepEqual(devices, filtered);
    });

    it('all devices should be filtered out', function () {
        const devices = [{hasBluetoothLowEnergy: false}, {hasBluetoothLowEnergy: false}];
        const filtered = view.filterDevices(devices, 'ble:true');
        assert.deepEqual([], filtered);
    });

    it('all devices should not be filtered out', function () {
        const devices = [{hasBluetoothLowEnergy: false}, {hasBluetoothLowEnergy: false}];
        const filtered = view.filterDevices(devices, 'ble:false');
        assert.deepEqual(devices, filtered);
    });

    it('filter out by os', function () {
        assert.deepEqual(view.filterDevices([{osVersion: '6.0'}, {osVersion: '6.1'}], 'os:6.*'), [{osVersion: '6.0'}, {osVersion: '6.1'}]);
        assert.deepEqual(view.filterDevices([{osVersion: '6.0'}, {osVersion: '6.1'}], 'os:6.*.0'), [{osVersion: '6.0'}, {osVersion: '6.1'}]);
        assert.deepEqual(view.filterDevices([{osVersion: '6.0'}, {osVersion: '6.1'}], 'os:*.*'), [{osVersion: '6.0'}, {osVersion: '6.1'}]);
        assert.deepEqual(view.filterDevices([{osVersion: '6.0'}, {osVersion: '6.1'}], 'os:*.1'), [{osVersion: '6.1'}]);
        assert.deepEqual(view.filterDevices([{osVersion: '6.0'}, {osVersion: '6.1'}], 'os:6.1'), [{osVersion: '6.1'}]);
        assert.deepEqual(view.filterDevices([{osVersion: '6.0'}, {osVersion: '6.1'}], 'os:7.*'), []);
    });

    it('filter with space', function () {
        assert.deepEqual(view.filterDevices([{osVersion: '6.0'}, {osVersion: '7.1'}], 'os: 7.*'), [{osVersion: '7.1'}]);
    });

    it('Filter by wifi', function () {
        assert.deepEqual(view.filterDevices([{wifiSSID: 'hello'}, {wifiSSID: 'bye'}], 'wifi:hello'), [{wifiSSID: 'hello'}]);
    });

    it('Filter by platform', function () {
        assert.deepEqual(view.filterDevices([{platform: 'android'}, {platform: 'ios'}], 'platform:android'), [{platform: 'android'}]);
    });

    it('Filter by model', function () {
        assert.deepEqual(view.filterDevices([{model: 'x'}, {model: 'y'}], 'model:x'), [{model: 'x'}]);
    });

    it('Filter by manufacturer', function () {
        assert.deepEqual(view.filterDevices([{manufacturer: 'Samsung'}, {manufacturer: 'sony'}], 'manufacturer:samsung'), [{manufacturer: 'Samsung'}]);
    });

    it('Filter by battery level', function () {
        assert.deepEqual(view.filterDevices([{batteryLevel: '50'}, {batteryLevel: '99'}], 'battery:>10'), [{batteryLevel: '50'}, {batteryLevel: '99'}]);
        assert.deepEqual(view.filterDevices([{batteryLevel: '50'}, {batteryLevel: '99'}], 'battery:>90'), [{batteryLevel: '99'}]);
        assert.deepEqual(view.filterDevices([{batteryLevel: '50'}, {batteryLevel: '99'}], 'battery:<10'), []);
    });

    it('Fix numeric filter', function () {
        assert.equal(view.fixNumericFilter('>1'), '>1');
        assert.equal(view.fixNumericFilter('>1.4'), '>1.4');
        assert.equal(view.fixNumericFilter('>10'), '>10');
        assert.equal(view.fixNumericFilter(), '');
        assert.equal(view.fixNumericFilter(''), '');
        assert.equal(view.fixNumericFilter('10'), '=10');
        assert.equal(view.fixNumericFilter('10.5'), '=10.5');
    });

    it('Is numeric filter match', function () {
        assert.equal(view.isNumericFilterMatch(10, '>9'), true);
        assert.equal(view.isNumericFilterMatch(11, '>10'), true);
        assert.equal(view.isNumericFilterMatch(10, '=10'), true);
        assert.equal(view.isNumericFilterMatch(10.1, '=10.1'), true);
    });

    it('Filter by set of values', function () {
        assert.deepEqual(
            view.filterDevices(
                [
                    {manufacturer: 'Samsung', model: 'node4', wifiSSID: 'hello', osVersion: '6.7'},
                    {manufacturer: 'Sony', model: 'xxx', wifiSSID: 'hello', osVersion: '6.7'},
                    {manufacturer: 'Samsung', model: 'node4', wifiSSID: 'hello', osVersion: '5.7'},
                ],
                'manufacturer:samsung,os:6.*'
            ),
            [{manufacturer: 'Samsung', model: 'node4', wifiSSID: 'hello', osVersion: '6.7'}]
        );
    });

    it('test invalid os filters', function () {
        assert.equal(view.isValidOsFilter('6.b.0'), false);
        assert.equal(view.isValidOsFilter('6.*.x'), false);
        assert.equal(view.isValidOsFilter('v.*.*'), false);

        assert.equal(view.isValidOsFilter('660'), false);
        assert.equal(view.isValidOsFilter('6c*'), false);
        assert.equal(view.isValidOsFilter('f'), false);

        assert.equal(view.isValidOsFilter(''), false);
        assert.equal(view.isValidOsFilter('f.f.f'), false);
    });

    it('test valid os filters', function () {
        assert.equal(view.isValidOsFilter('*.0.0'), true);
        assert.equal(view.isValidOsFilter('6.0.0'), true);
        assert.equal(view.isValidOsFilter('6.*.0'), true);
        assert.equal(view.isValidOsFilter('*.*.*'), true);

        assert.equal(view.isValidOsFilter('6.0'), true);
        assert.equal(view.isValidOsFilter('6.*'), true);
        assert.equal(view.isValidOsFilter('*.*'), true);

        assert.equal(view.isValidOsFilter('6'), true);
        assert.equal(view.isValidOsFilter('*'), true);
    });

    it('all 6.* devices should filtered', function () {

        assert.equal(view.isOsMatch('6', '6'), true);
        assert.equal(view.isOsMatch('6', '*'), true);
        assert.equal(view.isOsMatch('6', '6.*'), true);

        assert.equal(view.isOsMatch('6.0', '*'), true);
        assert.equal(view.isOsMatch('6.0', '6'), true);
        assert.equal(view.isOsMatch('6.0', '6.'), true);

        assert.equal(view.isOsMatch('6.0.3', '*'), true);
        assert.equal(view.isOsMatch('6.0.3', '6'), true);
        assert.equal(view.isOsMatch('6.0.3', '6.*'), true);
        assert.equal(view.isOsMatch('6.0.3', '6.*.*'), true);
        assert.equal(view.isOsMatch('6.0.3', '6.*.3'), true);
        assert.equal(view.isOsMatch('6.0.3', '6.0.3'), true);
    });

    it('fix db os version', function () {
        assert.equal(view.fixDbVersion('6'), '6.0.0');
        assert.equal(view.fixDbVersion('6.1'), '6.1.0');
        assert.equal(view.fixDbVersion('6.1.2'), '6.1.2');
    });


});