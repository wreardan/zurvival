module.exports = function(grunt) {
	grunt.initConfig({
		watch: {
			all: {
				files: ["voxel-client/www/**/*.js",
					"voxel-client/www/**/*.html"],
				options: {liveReload: true},
				tasks: ["browserify "]
			}
		},
		browserify: {
			
		}
	})

	grunt.loadNpmTasks("grunt-watch")
	grunt.loadNpmTasks("grunt-browserify")
	grunt.registerTask("default", ["watch", "browserify"])
}