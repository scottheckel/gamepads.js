gamepads.js
===========

**Version 0.2**

A very early in develoment library seeking to remove the frustration from using gamepads in JavaScript. This is not a shim, but seeks to make it easier to work gamepads in general. After being disappointed in the support of what is currently out there and the differences between browsers of how they support this early in-development API. Currently only supports Chrome 22 and newer. Firefox support is planned in a future release.

Documentation
-------------

###Gamepads Object

####getState(gamepadIndex) : returns GamepadState
Get the state of a specific gamepad. Gamepads are indexed by the time that they get connected, so gamepadIndex=0 will be the first gamepad connected.  There are a total of four gamepads that may be connected.

####hasSupport : boolean
Boolean value that indicates whether Gamepads.js supports the current browser.

####on(eventKey, callback) : returns Gamepads
Subscribe a callback to a particular event.  Callback may optionally take in data provided to it by Gamepads.js as its first callback parameter.  Current supported events are *connected* and *disconnected*.

####off(eventKey) : returns Gamepads
Unsubscribe all callbacks for a particular event.  Supported events can be found in the documentation for on().

####update() : returns Gamepads
Updates the current gamepad states.  This should be called regularly either with requestAnimationFrame or a setInterval/setTimeout. Once this method is called all GamepadStates will be refreshed with the latest data.

###GamepadsState object
Key and stick values are zero based integers.

####buttonHeld(key[, delta]) : return boolean
Determine if a button has was held for a length of time. If no delta is provided, the method will check to see if the button has been held since the previous update. If a delta is provided, the method will check to see if the button has been held for the provided amount of milliseconds.

####buttonNew(key) : return boolean
Determine if the key was freshly pressed in this update cycle.

####buttonValue(key) : return boolean
Retrieve the current value of the button being pressed.  Values are in the range of [0..1], with 1 indicating a full press and 0 indicating the button is currently released.  Some buttons like the trigger buttons on an Xbox 360 support values between 0 and 1 to indicate how the button is currently pressed.

####isConnected : boolean
Indicates whether the controller is currently connected.

####stickValue(stick[, usePolar]) : return {x,y[,radial,angular]}
Retrieve the current stick cartessian coordinates or if usePolar is specified polar coordinates will also be provided.

Roadmap
-------

**v0.3** - 2/2013 - Firefox support.

**v0.9** - TBA - Optimizations for speed, memory and filesize.

**Future Work Not Slotted**

- Button Combos
- Button pressed/release eventing
- Axes dead zones
- Handle edge cases and make sure input is valid
- Extra suport on a per controller type basis (buttons, etc)

Release History
---------------
**v0.2** - 1/21/2013 - Initial button held implementation. API tweaks. Add documentation and examples.

**v0.1** - 1/13/2013 - Initial version with Chrome 22+ support.

Browser Support
---------------
- **Chrome** - v22 and up
- **Firefox** - not supported in gamepads.js
- **Internet Explorer** - browser doesn't support gamepads
- **Opera** - browser doesn't support gamepads
- **Safari** - browser doesn't support gamepads
