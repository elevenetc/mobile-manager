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
        assert.throws(function(){
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

        assert.equal(view.isMatch('6', '6'), true);
        assert.equal(view.isMatch('6', '*'), true);
        assert.equal(view.isMatch('6', '6.*'), true);

        assert.equal(view.isMatch('6.0', '*'), true);
        assert.equal(view.isMatch('6.0', '6'), true);
        assert.equal(view.isMatch('6.0', '6.'), true);

        assert.equal(view.isMatch('6.0.3', '*'), true);
        assert.equal(view.isMatch('6.0.3', '6'), true);
        assert.equal(view.isMatch('6.0.3', '6.*'), true);
        assert.equal(view.isMatch('6.0.3', '6.*.*'), true);
        assert.equal(view.isMatch('6.0.3', '6.*.3'), true);
        assert.equal(view.isMatch('6.0.3', '6.0.3'), true);
    });

    it('fix db version', function () {
        assert.equal(view.fixDbVersion('6'), '6.0.0');
        assert.equal(view.fixDbVersion('6.1'), '6.1.0');
        assert.equal(view.fixDbVersion('6.1.2'), '6.1.2');
    });
});