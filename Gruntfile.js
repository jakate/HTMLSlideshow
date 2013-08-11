/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',


    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      dist: {
        src: [
          'src/assets/js/slideshow.js',
          'src/assets/js/slideshow.main.js',
          'src/assets/js/slideshow.progress.js',
          'src/assets/js/slideshow.slide.js',
          'src/assets/js/slideshow.slidecontroller.js'
        ],
        dest: 'src/assets/js/slideshow.concat.js'
      }
    },


    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: 'src/assets/js/slideshow.concat.js',
        dest: 'build/assets/js/slideshow.min.js'
      },
      project: {
        src: 'src/assets/js/project.js',
        dest: 'build/assets/js/project.min.js'
      }
    },


    sass: {
      dist: {
        files: {
          'src/assets/css/slideshow.scss': 'src/assets/scss/slideshow.scss'
        }
      }
    },


    cssmin: {
      options: {
        banner: '<%= banner %>'
      },
      combine: {
        files: {
          'build/assets/css/slideshow.min.css': ['src/assets/css/slideshow.scss']
        }
      }
    },


    watch: {
      scripts: {
        files: [
          'src/assets/js/*.js'
        ],
        tasks: ['concat', 'uglify']
      },
      styles: {
        files: [
          'src/assets/scss/*.scss'
        ],
        tasks: ['sass', 'cssmin']
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task.
  grunt.registerTask('default', ['sass', 'cssmin', 'concat', 'uglify', 'watch']);

};
