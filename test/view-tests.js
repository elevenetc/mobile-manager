/**
 * Created by eugene.levenetc on 03/12/2016.
 */
const assert = require('assert');
const sinon = require('sinon');
const utils = require('../src/utils/utils');
const viewSlack = require('../src/view/view-slack');

describe('View utils', function () {

    before(function () {

    });

    it('undefined view type throws error', function () {
        assert.throws(function () {
            utils.renderDevices([], 'x-type');
        });
    });

    it('json view type', function () {
        const devices = [{hasBluetoothLowEnergy: false}, {hasBluetoothLowEnergy: true}];
        assert.deepEqual(viewSlack.renderDevices('json', devices), devices);
    });

    it('with null filter should return same devices', function () {
        const devices = [{hasBluetoothLowEnergy: false}, {hasBluetoothLowEnergy: true}];
        const filtered = utils.filterDevices(devices, null);
        assert.deepEqual(devices, filtered);
    });

    it('with undefined filter should return same devices', function () {
        const devices = [{hasBluetoothLowEnergy: false}, {hasBluetoothLowEnergy: true}];
        const filtered = utils.filterDevices(devices);
        assert.deepEqual(devices, filtered);
    });

    it('all devices should be filtered out', function () {
        const devices = [{hasBluetoothLowEnergy: false}, {hasBluetoothLowEnergy: false}];
        const filtered = utils.filterDevices(devices, 'ble:true');
        assert.deepEqual([], filtered);
    });

    it('all devices should not be filtered out', function () {
        const devices = [{hasBluetoothLowEnergy: false}, {hasBluetoothLowEnergy: false}];
        const filtered = utils.filterDevices(devices, 'ble:false');
        assert.deepEqual(devices, filtered);
    });

    it('filter out by os', function () {
        assert.deepEqual(utils.filterDevices([{osVersion: '6.0'}, {osVersion: '6.1'}], 'os:6.*'), [{osVersion: '6.0'}, {osVersion: '6.1'}]);
        assert.deepEqual(utils.filterDevices([{osVersion: '6.0'}, {osVersion: '6.1'}], 'os:6.*.0'), [{osVersion: '6.0'}, {osVersion: '6.1'}]);
        assert.deepEqual(utils.filterDevices([{osVersion: '6.0'}, {osVersion: '6.1'}], 'os:*.*'), [{osVersion: '6.0'}, {osVersion: '6.1'}]);
        assert.deepEqual(utils.filterDevices([{osVersion: '6.0'}, {osVersion: '6.1'}], 'os:*.1'), [{osVersion: '6.1'}]);
        assert.deepEqual(utils.filterDevices([{osVersion: '6.0'}, {osVersion: '6.1'}], 'os:6.1'), [{osVersion: '6.1'}]);
        assert.deepEqual(utils.filterDevices([{osVersion: '6.0'}, {osVersion: '6.1'}], 'os:7.*'), []);
        assert.deepEqual(utils.filterDevices([{osVersion: '6.0'}, {osVersion: '6.1'}], 'os:10'), []);
    });

    it('filter with space', function () {
        assert.deepEqual(utils.filterDevices([{osVersion: '6.0'}, {osVersion: '7.1'}], 'os: 7.*'), [{osVersion: '7.1'}]);
        assert.deepEqual(utils.filterDevices([{model: 'Nexus 4'}], 'model:nexus 4'), [{model: 'Nexus 4'}]);
    });

    it('Filter by wifi', function () {
        assert.deepEqual(utils.filterDevices([{wifiSSID: 'hello'}, {wifiSSID: 'bye'}], 'wifi:hello'), [{wifiSSID: 'hello'}]);
    });

    it('Filter by platform', function () {
        assert.deepEqual(utils.filterDevices([{platform: 'android'}, {platform: 'ios'}], 'platform:android'), [{platform: 'android'}]);
    });

    it('Filter by model', function () {
        assert.deepEqual(utils.filterDevices([{model: 'x'}, {model: 'y'}], 'model:x'), [{model: 'x'}]);
    });

    it('Filter not exact model', function () {
        assert.deepEqual(utils.filterDevices([{model: 'Nexus 4'}], 'model:nexus'), [{model: 'Nexus 4'}]);
    });

    it('Filter by manufacturer', function () {
        assert.deepEqual(utils.filterDevices([{manufacturer: 'Samsung'}, {manufacturer: 'sony'}], 'manufacturer:samsung'), [{manufacturer: 'Samsung'}]);
    });

    it('Filter by battery level', function () {
        assert.deepEqual(utils.filterDevices([{batteryLevel: '50'}, {batteryLevel: '99'}], 'battery:>10'), [{batteryLevel: '50'}, {batteryLevel: '99'}]);
        assert.deepEqual(utils.filterDevices([{batteryLevel: '50'}, {batteryLevel: '99'}], 'battery:>90'), [{batteryLevel: '99'}]);
        assert.deepEqual(utils.filterDevices([{batteryLevel: '50'}, {batteryLevel: '99'}], 'battery:<10'), []);
    });

    it('Fix numeric filter', function () {
        assert.equal(utils.fixNumericFilter('>1'), '>1');
        assert.equal(utils.fixNumericFilter('>1.4'), '>1.4');
        assert.equal(utils.fixNumericFilter('>10'), '>10');
        assert.equal(utils.fixNumericFilter('10'), '=10');
        assert.equal(utils.fixNumericFilter('10.5'), '=10.5');

        assert.equal(utils.fixNumericFilter('<'), '');
        assert.equal(utils.fixNumericFilter('>'), '');
        assert.equal(utils.fixNumericFilter('-'), '');
        assert.equal(utils.fixNumericFilter(), '');
        assert.equal(utils.fixNumericFilter('b'), '');
    });

    it('Is numeric filter match', function () {
        assert.equal(utils.isNumericFilterMatch(10, '>11'), false);
        assert.equal(utils.isNumericFilterMatch(10, '>9'), true);
        assert.equal(utils.isNumericFilterMatch(11, '>10'), true);
        assert.equal(utils.isNumericFilterMatch(10, '=10'), true);
        assert.equal(utils.isNumericFilterMatch(10.1, '=10.1'), true);
    });

    it('Filter by set of values', function () {
        assert.deepEqual(
            utils.filterDevices(
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
        assert.equal(utils.isValidOsFilter('6.b.0'), false);
        assert.equal(utils.isValidOsFilter('6.*.x'), false);
        assert.equal(utils.isValidOsFilter('v.*.*'), false);

        assert.equal(utils.isValidOsFilter('660'), true);
        assert.equal(utils.isValidOsFilter('6c*'), false);
        assert.equal(utils.isValidOsFilter('f'), false);

        assert.equal(utils.isValidOsFilter(''), false);
        assert.equal(utils.isValidOsFilter('f.f.f'), false);
    });

    it('test valid os filters', function () {
        assert.equal(utils.isValidOsFilter('*.0.0'), true);
        assert.equal(utils.isValidOsFilter('6.0.0'), true);
        assert.equal(utils.isValidOsFilter('6.*.0'), true);
        assert.equal(utils.isValidOsFilter('*.*.*'), true);

        assert.equal(utils.isValidOsFilter('6.0'), true);
        assert.equal(utils.isValidOsFilter('6.*'), true);
        assert.equal(utils.isValidOsFilter('*.*'), true);

        assert.equal(utils.isValidOsFilter('10'), true);
        assert.equal(utils.isValidOsFilter('6'), true);
        assert.equal(utils.isValidOsFilter('*'), true);
    });

    it('all 6.* devices should filtered', function () {

        assert.equal(utils.isOsMatch('6', '6'), true);
        assert.equal(utils.isOsMatch('6', '*'), true);
        assert.equal(utils.isOsMatch('6', '6.*'), true);

        assert.equal(utils.isOsMatch('6.0', '*'), true);
        assert.equal(utils.isOsMatch('6.0', '6'), true);
        assert.equal(utils.isOsMatch('6.0', '6.'), true);

        assert.equal(utils.isOsMatch('6.0.3', '*'), true);
        assert.equal(utils.isOsMatch('6.0.3', '6'), true);
        assert.equal(utils.isOsMatch('6.0.3', '6.*'), true);
        assert.equal(utils.isOsMatch('6.0.3', '6.*.*'), true);
        assert.equal(utils.isOsMatch('6.0.3', '6.*.3'), true);
        assert.equal(utils.isOsMatch('6.0.3', '6.0.3'), true);
    });

    it('fix db os version', function () {
        assert.equal(utils.fixDbVersion('6'), '6.0.0');
        assert.equal(utils.fixDbVersion('6.1'), '6.1.0');
        assert.equal(utils.fixDbVersion('6.1.2'), '6.1.2');
    });

    it('Slack view', function () {
        viewSlack.renderDevices('slack', []);
        viewSlack.renderDevices('slack', [{

        }]);
    });

});