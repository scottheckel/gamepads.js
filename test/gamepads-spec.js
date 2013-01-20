var chai = require("chai"),
    Gamepads = require("./node-gamepads");

var assert = chai.assert;

describe('Gamepads', function () {
    describe('Support', function() {

        it('has chrome 22+ support', function () {
            var gamepads = Gamepads.create({ navigator: { webkitGetGamepads: function() { return null; } }});
            assert.isTrue(gamepads.hasSupport);
        });

        it('no chrome 21 support', function () {
            var gamepads = Gamepads.create({ navigator: { webkitGamepads: [] }});
            assert.isFalse(gamepads.hasSupport);
        });

        it('no other browsers supported', function () {
            var gamepads = Gamepads.create({ navigator: { }});
            assert.isFalse(gamepads.hasSupport);
        });

    });

    describe('Connected/Disconnected', function() {

        var pads = [
            {
                axes: [0,0,0,0],
                buttons: [0,0,0,0],
                id: 'temp',
                timestamp: 5
            }
        ];

        var window = { navigator: { webkitGetGamepads: function() { return pads; } } };


        var gamepads = Gamepads.create(window),
            isConnected,
            connectedData;

        gamepads.on('connected', function(data) {
            isConnected = true;
            connectedData = data;
        });

        gamepads.on('disconnected', function(data) {
            isConnected = false;
            connectedData = data;
        });

        it('can get connected and fire connected event', function() {

            assert.isUndefined(isConnected);
            assert.isUndefined(connectedData);

            var preUpdateState = gamepads.getState(0);
            assert.isFalse(preUpdateState.isConnected, 'not already connected');

            gamepads.update();

            assert.isTrue(isConnected, 'connected event fired');
            assert.equal(connectedData.id, 'temp', 'id set correctly');
            assert.equal(connectedData.gamepad, 0, 'correct gamepad specified');

            var postConnectedState = gamepads.getState(0);
            assert(postConnectedState, 'got the state');
            assert.isTrue(postConnectedState.isConnected, 'connected after update');
        });

        it('can get disconnected and fire disconnected event', function() {

            assert.isTrue(isConnected);

            var preUpdateState = gamepads.getState(0);
            assert.isTrue(preUpdateState.isConnected, 'is already connected');

            // Disconnect the gamepad
            pads[0] = undefined;

            gamepads.update();

            assert.isFalse(isConnected, 'disconnected event fired');
            assert.equal(connectedData.gamepad, 0, 'correct gamepad specified');

            var postConnectedState = gamepads.getState(0);
            assert.isFalse(postConnectedState.isConnected, 'disconnected after update');

        });

    });

});