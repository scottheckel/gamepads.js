var chai = require("chai"),
    Gamepads = require("./node-gamepads");

var expect = chai.expect,
    fakeWindow = {
        navigator: {}
    };

describe('Gamepads Support', function () {

    it('has chrome 22+ support', function () {
        var gamepads = Gamepads.create({ navigator: { webkitGetGamepads: function() { return null; } }});
        expect(gamepads.hasSupport).to.equal(true);
    });

    it('no chrome 21 support', function () {
        var gamepads = Gamepads.create({ navigator: { webkitGamepads: [] }});
        expect(gamepads.hasSupport).to.equal(false);
    });

    it('no other browsers supported', function () {
        var gamepads = Gamepads.create({ navigator: { }});
        expect(gamepads.hasSupport).to.equal(false);
    });

});
