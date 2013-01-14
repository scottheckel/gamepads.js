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
          id: id
        };
      };
  gamepads.fn = gamepads.prototype = {
    init: function() {
      return this;
    },
    getState: function(controllerIndex) {
      return {
        A: _gamepads[controllerIndex].buttons[0],
        B: _gamepads[controllerIndex].buttons[1],
        X: _gamepads[controllerIndex].buttons[2],
        Y: _gamepads[controllerIndex].buttons[3],
        LB: _gamepads[controllerIndex].buttons[4],
        RB: _gamepads[controllerIndex].buttons[5],
        LT: _gamepads[controllerIndex].buttons[6],
        RT: _gamepads[controllerIndex].buttons[7],
        Select: _gamepads[controllerIndex].buttons[8],
        Start: _gamepads[controllerIndex].buttons[9],
        LeftStick: _gamepads[controllerIndex].buttons[10],
        RightStick: _gamepads[controllerIndex].buttons[11],
        DPadUp: _gamepads[controllerIndex].buttons[12],
        DPadDown: _gamepads[controllerIndex].buttons[13],
        DPadLeft: _gamepads[controllerIndex].buttons[14],
        DPadRight: _gamepads[controllerIndex].buttons[15],
        Guide: _gamepads[controllerIndex].buttons[16],
        LeftStickX: _gamepads[controllerIndex].axes[0],
        LeftStickY: _gamepads[controllerIndex].axes[1],
        RightStickX: _gamepads[controllerIndex].axes[2],
        RightStickY: _gamepads[controllerIndex].axes[3],
        newPress: function(key) {
          return _gamepads[controllerIndex].buttons[key] == 1 && _prevGamepads[controllerIndex].buttons[key] == 0;
        },
        released: function(key) {
          return _gamepads[controllerIndex].buttons[key] == 0 && _prevGamepads[controllerIndex].buttons[key] == 1;
        }
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
    update: function() {
      // Get the latest gamepads
      var latest = navigator.webkitGetGamepads();

      // Look for any connected/disconnected
      for(var index = 0; index < latest.length; index++) {
        // _prevGamepads[index] = _gamepads[index];
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
            _prevGamepads[index] = createState(latest[index].id);
            if(_prevGamepads[index] === undefined ) {
              trigger('connected', {
                gamepad: index
              });
            }
          }

          // Copy over the values to the current and previous states
          for(var buttonIndex = 0; buttonIndex < latest[index].buttons.length; buttonIndex++) {
            _prevGamepads[index].buttons[buttonIndex] = _gamepads[index].buttons[buttonIndex];
            _gamepads[index].buttons[buttonIndex] = latest[index].buttons[buttonIndex];
          }
          for(var axesIndex = 0; axesIndex < latest[index].axes.length; axesIndex++) {
            _prevGamepads[index].axes[axesIndex] = _gamepads[index].axes[axesIndex];
            _gamepads[index].axes[axesIndex] = latest[index].axes[axesIndex];
          }
        }
      }
    },
    hasSupport: _hasSupport,
    PRESSED: 1,
    RELEASED: 0
  };
  gamepads.fn.init.prototype = gamepads.fn;
  return (window.Gamepads = gamepads());
})(window);
