/*!
 * Gamepads.js v0.1
 * http://github.com/scottheckel/gamepads.js
 *
 * Copyright 2013 Scott Heckel, http://www.scottheckel.com
 * Released under the MIT license
 *
 * Date: 1/13/2013
 */


(function(window, undefined) {
  var navigator = window.navigator,
      gamepads = function() {
        return new gamepads.fn.init();
      },
      trigger = function(eventKey, data) {
        var callbacks = _callbacks[eventKey];
        for(var index = 0; callbacks && index < callbacks.length; callbacks++) {
          callbacks[index].call(this, data);
        }
      },
      createState = function() {
        return {
          axes: [],
          buttons: [],
          id: '',
          isConnected: false,
          timestamp: 0
        };
      },
      connectStates = function(state, prevState, id, totalButtons, totalAxes) {
        state.id = prevState.id = id;
        state.isConnected = prevState.isConnected = true;
        state.buttons = [];
        prevState.buttons = [];
        state.axes = [];
        prevState.axes = [];

        var index;
        for(index = 0; index < totalButtons; index++) {
          state.buttons[index] = {
            timestamp: undefined,
            value: 0
          };
        }
        for(index = 0; index < totalAxes; index++) {
          state.axes[index] = 0;
        }
      },
      _callbacks = {},
      _gamepads = [createState(),createState(),createState(),createState()],
      _prevGamepads = [createState(),createState(),createState(),createState()],
      _hasSupport = !!navigator.webkitGetGamepads;
  gamepads.fn = gamepads.prototype = {
    init: function() {
      return this;
    },
    getState: function(controllerIndex) {
      return {
        buttonHeld: function(key, delta) {
          if(_gamepads[controllerIndex].buttons[key].value > 0 && _prevGamepads[controllerIndex].buttons[key].value > 0)
          {
            return delta ? (_gamepads[controllerIndex].timestamp - _gamepads[controllerIndex].buttons[key].timestamp) >= delta : true;
          }
          return false;
        },
        buttonNew: function(key) {
          return _gamepads[controllerIndex] && _gamepads[controllerIndex].buttons[key] && _gamepads[controllerIndex].buttons[key].value == 1 && _prevGamepads[controllerIndex].buttons[key].value == 0;
        },
        buttonReleased: function(key) {
          return _gamepads[controllerIndex] && _gamepads[controllerIndex].buttons[key] && _gamepads[controllerIndex].buttons[key].value == 0 && _prevGamepads[controllerIndex].buttons[key].value == 1;
        },
        buttonValue: function(key) {
          return _gamepads[controllerIndex] && _gamepads[controllerIndex].buttons[key] && _gamepads[controllerIndex].buttons[key].value;
        },
        LeftStickX: function() { return _gamepads[controllerIndex].axes[0]; },
        LeftStickY: function() { return _gamepads[controllerIndex].axes[1]; },
        RightStickX: function() { return _gamepads[controllerIndex].axes[2]; },
        RightStickY: function() { return _gamepads[controllerIndex].axes[3]; },
        isConnected: _gamepads[controllerIndex].isConnected
      };
    },
    on: function(eventKey, callback) {
      if(!_callbacks[eventKey]) { _callbacks[eventKey] = []; }
      _callbacks[eventKey].push(callback);
      return this;
    },
    off: function(eventKey, callback) {
      if(!callback) {
        // Remove all
        _callbacks[eventKey] = [];
      } else {
        // TODO: SH - need to remove callback
      }
      return this;
    },
    update: function() {  // This mehtod needs to be cleaned up, it's LONNNNGGGG
      // Get the latest gamepads
      var latest = navigator.webkitGetGamepads(),
          timestamp;

      // Look for any connected/disconnected
      for(var index = 0; index < latest.length; index++) {
        if(latest[index] === undefined) {
          if(_gamepads[index].isConnected) {
            _prevGamepads[index].isConnected = _gamepads[index].isConnected = false;
            trigger('disconnected', {
              gamepad: index
            });
          }
        } else {
          // New gamepad connected
          if(!_gamepads[index].isConnected) {
            connectStates(_gamepads[index], _prevGamepads[index], latest[index].id, latest[index].buttons.length, latest[index].axes.length);
            trigger('connected', {
              gamepad: index,
              id: latest[index].id
            });
          }

          // Update the timestamp
          _prevGamepads[index].timestamp = _gamepads[index].timestamp;
          _gamepads[index].timestamp = latest[index].timestamp;

          for(var buttonIndex = 0; buttonIndex < latest[index].buttons.length; buttonIndex++) {
            // Copy over the values to the current and previous states
            _prevGamepads[index].buttons[buttonIndex] = _gamepads[index].buttons[buttonIndex];
            _gamepads[index].buttons[buttonIndex] = {
              timestamp: latest[index].buttons[buttonIndex] == 0 ? 0 : (_prevGamepads[index].buttons[buttonIndex].value > 0  ? _prevGamepads[index].buttons[buttonIndex].timestamp : latest[index].timestamp),
              value: latest[index].buttons[buttonIndex]
            };
          }
          for(var axesIndex = 0; axesIndex < latest[index].axes.length; axesIndex++) {
            _prevGamepads[index].axes[axesIndex] = _gamepads[index].axes[axesIndex];
            _gamepads[index].axes[axesIndex] = latest[index].axes[axesIndex];
          }
        }
      }
      return this;
    },
    hasSupport: _hasSupport,
    PRESSED: 1,
    RELEASED: 0,
    Xbox360: {
      A: 0,
      B: 1,
      X: 2,
      Y: 3,
      LB: 4,
      RB: 5,
      LT: 6,
      RT: 7,
      Select: 8,
      Start: 9,
      LeftStick: 10,
      RightStick: 11,
      DPadUp: 12,
      DPadDown: 13,
      DPadLeft: 14,
      DPadRight: 15,
      Guide: 16
    }
  };
  gamepads.fn.init.prototype = gamepads.fn;
  return (window.Gamepads = gamepads());
})(window);
