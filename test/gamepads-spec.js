var chai = require("chai"),
    Gamepads = require("./node-gamepads");

var assert = chai.assert;

describe('Gamepads', function () {
    
    describe('Support', function() {

        it('has chrome 22+ support', function () {
            var gamepads = Gamepads.create({ navigator: { webkitGetGamepads: function() { return null; } }});
            assert.isTrue(gamepads.hasSupport);
        });

        it('has no chrome 21 support', function () {
            var gamepads = Gamepads.create({ navigator: { webkitGamepads: [] }});
            assert.isFalse(gamepads.hasSupport);
        });

        it('has no other browsers supported', function () {
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
            assert.isTrue(preUpdateState.isConnected, 'blah');
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

    describe('Button Presses', function() {

        var pads = [
            {
                axes: [0,0,0,0],
                buttons: [0,0,0,0],
                id: 'a controller',
                timestamp: 9
            },
            {
                axes: [0,0,0,0],
                buttons: [0,0,0,0],
                id: 'a different controller',
                timestamp: 9
            }
        ];

        var window = { navigator: { webkitGetGamepads: function() { return pads; } } };

        var gamepads = Gamepads.create(window);

        it('can detect when it is a new button press', function() {
            pads[1].buttons[0] = 1;
            gamepads.update();

            var state = gamepads.getState(1);
            assert.isTrue(state.buttonNew(0), 'button 0 new press');

            gamepads.update();

            assert.isFalse(state.buttonNew(0), 'saved state button 0 not a new press');
            assert.isFalse(gamepads.getState(1).buttonNew(0), 'new state button 0 not a new press');
        });

        it('can detect the value of a button press', function() {
            pads[0].buttons[0] = 1;
            pads[0].buttons[1] = 0;
            pads[0].buttons[2] = 1;
            pads[1].buttons[0] = 0;
            pads[1].buttons[1] = 0;
            pads[1].buttons[2] = 1;

            gamepads.update();

            var state1 = gamepads.getState(0),
                state2 = gamepads.getState(1);
            assert.strictEqual(state1.buttonValue(0), 1, 'pad 0 button 0 correct value');
            assert.strictEqual(state1.buttonValue(1), 0, 'pad 0 button 1 correct value');
            assert.strictEqual(state1.buttonValue(2), 1, 'pad 0 button 2 correct value');
            assert.strictEqual(state2.buttonValue(0), 0, 'pad 1 button 0 correct value');
            assert.strictEqual(state2.buttonValue(1), 0, 'pad 1 button 1 correct value');
            assert.strictEqual(state2.buttonValue(2), 1, 'pad 1 button 2 correct value');
        });

        it('can detect a held button press', function() {
            pads[0].buttons[0] = 0;
            pads[0].buttons[1] = 0;
            pads[0].timestamp = 0;

            gamepads.update();

            var state = gamepads.getState(0);

            pads[0].buttons[0] = 1;
            pads[0].buttons[1] = 1;
            pads[0].timestamp = 100;

            gamepads.update();

            assert.isFalse(state.buttonHeld(0), 'button 0 not held');
            assert.isFalse(state.buttonHeld(1), 'button 1 not held');

            gamepads.update();

            pads[0].buttons[0] = 1;
            pads[0].buttons[1] = 1;
            pads[0].timestamp = 200;

            gamepads.update();

            assert.isTrue(state.buttonHeld(0, 100), 'button 0 held for 100 or more');
            assert.isTrue(state.buttonHeld(0), 'button 0 held');
            assert.isTrue(state.buttonHeld(1, 99), 'button 1 held for 99 or more');
            assert.isFalse(state.buttonHeld(1, 101), 'button 1 not held for more than 101')
            assert.isTrue(state.buttonHeld(1), 'button 1 held');

            pads[0].buttons[0] = 1;
            pads[0].buttons[1] = 0;
            pads[0].timestamp = 300;

            gamepads.update();

            assert.isTrue(state.buttonHeld(0, 150), 'button 0 held for more than 150');
            assert.isFalse(state.buttonHeld(1), 'button 0 not held');
        });

    });

    describe('Gamepad Sticks', function() {

        var pads = [
            {
                axes: [0,0,0,0],
                buttons: [0,0,0,0],
                id: 'a controller',
                timestamp: 9
            },
            {
                axes: [0,0,0,0],
                buttons: [0,0,0,0],
                id: 'a different controller',
                timestamp: 9
            }
        ];

        var window = { navigator: { webkitGetGamepads: function() { return pads; } } };

        var gamepads = Gamepads.create(window);

        it('can read the stick values', function() {

            gamepads.update();

            var state1 = gamepads.getState(0);
            var state2 = gamepads.getState(1);

            var stick1 = state1.stickValue(0);
            assert.strictEqual(stick1.x, 0, 'pad 1 stick 1 x value correct (first update)');
            assert.strictEqual(stick1.y, 0, 'pad 1 stick 1 y value correct (first update)');
            var stick2 = state1.stickValue(1);
            assert.strictEqual(stick2.x, 0, 'pad 1 stick 2 x value correct (first update)');
            assert.strictEqual(stick2.y, 0, 'pad 1 stick 2 y value correct (first update)');

            var stick3 = state2.stickValue(0);
            assert.strictEqual(stick3.x, 0, 'pad 2 stick 1 x value correct (first update)');
            assert.strictEqual(stick3.y, 0, 'pad 2 stick 1 y value correct (first update)');
            var stick4 = state2.stickValue(1);
            assert.strictEqual(stick4.x, 0, 'pad 2 stick 2 x value correct (first update)');
            assert.strictEqual(stick4.y, 0, 'pad 2 stick 2 y value correct (first update)');

            // Let's change some values
            pads[0].axes[0] = 0.1;
            pads[0].axes[1] = 0.2;
            pads[0].axes[2] = 0.3;
            pads[0].axes[3] = 0.4;

            pads[1].axes[0] = 0.5;
            pads[1].axes[1] = -0.6;
            pads[1].axes[2] = -0.7;
            pads[1].axes[3] = -0.8;

            gamepads.update();

            stick1 = state1.stickValue(0, false);
            assert.strictEqual(stick1.x, 0.1, 'pad 1 stick 1 x value correct (second update)');
            assert.strictEqual(stick1.y, 0.2, 'pad 1 stick 1 y value correct (second update)');
            assert.isUndefined(stick1.radial, 'pad 1 stick 1 radial is not defined');
            assert.isUndefined(stick1.angular, 'pad 1 stick 1 angular is not defined');
            
            stick2 = state1.stickValue(1, true);
            assert.strictEqual(stick2.x, 0.3, 'pad 1 stick 2 x value correct (second update)');
            assert.strictEqual(stick2.y, 0.4, 'pad 1 stick 2 y value correct (second update)');
            assert.strictEqual(stick2.radial, 0.5, 'pad 1 stick 2 radial value correct');
            assert.strictEqual(stick2.angular, 0.9272952180016123, 'pad 1 stick 2 angular value correct');

            stick3 = state2.stickValue(0);
            assert.strictEqual(stick3.x, 0.5, 'pad 2 stick 1 x value correct (second update)');
            assert.strictEqual(stick3.y, -0.6, 'pad 2 stick 1 y value correct (second update)');
            assert.isUndefined(stick3.radial, 'pad 2 stick 1 radial is not defined');
            assert.isUndefined(stick3.angular, 'pad 2 stick 1 angular is not defined');

            stick4 = state2.stickValue(1, true);
            assert.strictEqual(stick4.x, -0.7, 'pad 2 stick 2 x value correct (second update)');
            assert.strictEqual(stick4.y, -0.8, 'pad 2 stick 2 y value correct (second update)');
            assert.strictEqual(stick4.radial, 1.063014581273465, 'pad 2 stick 2 radial value correct');
            assert.strictEqual(stick4.angular, -2.289626326416521, 'pad 2 stick 2 angular value correct');

        });

    });

});