module.exports = function(grunt) {
	var fs = require('fs');

	grunt.registerTask('build', 'build gamepads.js module', function() {
		var done = this.async();

		function buildGamepads() {
			var wrapper = fs.readFileSync('./src/wrapper.js', 'utf8'),
				gamepadsJs = fs.readFileSync('./src/gamepads.js', 'utf8');
      		wrapper = wrapper.replace('//GAMEPADSJS_SOURCE', gamepadsJs);
      		fs.writeFileSync('./test/node-gamepads.js', wrapper);
      		done();
		}

		buildGamepads();
	});

	// Default task.
	grunt.registerTask('default', 'build');
};