(function () {
  function create(window) {

    if(window == null ) {
      window = {
        navigator: {

        }
      };
    }

    //GAMEPADSJS_SOURCE

    return window.Gamepads;
  }
  module.exports = create('undefined' === typeof window ? undefined : window, Math);
  module.exports.create = create;
}());