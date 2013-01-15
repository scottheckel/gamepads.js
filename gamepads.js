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
      _callbacks = {},
      _gamepads = [,,,,],
      _prevGamepads = [,,,,],
      _hasSupport = !!navigator.webkitGetGamepads,
      trigger = function(eventKey, data) {
        var callbacks = _callbacks[eventKey];
        for(var index = 0; callbacks && index < callbacks.length; callbacks++) {
          callbacks[index].call(this, data);
        }
      },
      createState = function(id) {
        return {
          axes: [],
          buttons: [],
          id: id,
          timestamp: 0
        };
      };
  gamepads.fn = gamepads.prototype = {
    init: function() {
      return this;
    },
    getState: function(controllerIndex) {
      return {
        buttonHeld: function(key, delta) {
          return _gamepads[controllerIndex] && _gamepads[controllerIndex].buttons[key] && _gamepads[controllerIndex].buttons[key].value
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
        /*A: buttonValue(0),
        B: buttonValue(1),
        X: buttonValue(2),
        Y: buttonValue(3),
        LB: buttonValue(4),
        RB: buttonValue(5),
        LT: buttonValue(6),
        RT: buttonValue(7),
        Select: buttonValue(8),
        Start: buttonValue(9),
        LeftStick: buttonValue(10),
        RightStick: buttonValue(11),
        DPadUp: buttonValue(12),
        DPadDown: buttonValue(13),
        DPadLeft: buttonValue(14),
        DPadRight: buttonValue(15),
        Guide: buttonValue(16),*/
        LeftStickX: function() { return _gamepads[controllerIndex].axes[0]; },
        LeftStickY: function() { return _gamepads[controllerIndex].axes[1]; },
        RightStickX: function() { return _gamepads[controllerIndex].axes[2]; },
        RightStickY: function() { return _gamepads[controllerIndex].axes[3]; }
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
          if(_gamepads[index] !== undefined) {
            _prevGamepads[index] = _gamepads[index] = undefined;
            trigger('disconnected', {
              gamepad: index
            });
          }
        } else if(latest[index] !== undefined) {
          // New gamepad connected
          if(!_gamepads[index]) {
            _gamepads[index] = createState(latest[index].id);
            if(_prevGamepads[index] === undefined ) {
              trigger('connected', {
                gamepad: index,
                id: latest[index].id
              });
            }
            _prevGamepads[index] = createState(latest[index].id);
          }

          // Update the timestamp
          _gamepads[index].timestamp = latest[index].timestamp;

          for(var buttonIndex = 0; buttonIndex < latest[index].buttons.length; buttonIndex++) {

            // Determine the first time the button was held
            timestamp = undefined;
            if(latest[index].buttons[buttonIndex]) {
              if(_gamepads[index].buttons[buttonIndex].value) {
                timestamp = _gamepads[index].buttons[buttonIndex].timestamp;
              } else {
                timestamp = latest[index].timestamp;
              }
            }

            // Copy over the values to the current and previous states
            _prevGamepads[index].buttons[buttonIndex] = _gamepads[index].buttons[buttonIndex];
            _gamepads[index].buttons[buttonIndex] = {
              timestamp: timestamp,
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
    RELEASED: 0
  };
  gamepads.fn.init.prototype = gamepads.fn;
  return (window.Gamepads = gamepads());
})(window);
