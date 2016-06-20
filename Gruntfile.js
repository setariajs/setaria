module.exports = function(grunt) {
    "use strict";
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: ['<%= pkg.destDir %>'],
        copy: {
            build: {
                files: [
                    {
                        expand: true,
                        src: ['custom/**'],
                        dest: '<%= pkg.destDir %>/',
                        filter: 'isFile',
                        cwd: '<%= pkg.sourceDir %>'
                    }
                ]
            }
        },
        concat: {
            options: {
                // 定义一个用于插入合并输出文件之间的字符
                separator: ''
            },
            dist: {
                // 将要被合并的文件
                src: ['<%= pkg.sourceDir %>/*.js'],
                // 合并后的JS文件的存放位置
                dest: '<%= pkg.destDir %>/<%= pkg.name %>.js'
            }
        },
        uglify: {
            options: {
                // 此处定义的banner注释将插入到输出文件的顶部
                banner: '/*! Setaria.js <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                files: {
                    '<%= pkg.destDir %>/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.registerTask('default', ['clean', 'copy', 'concat', 'uglify']);
};
