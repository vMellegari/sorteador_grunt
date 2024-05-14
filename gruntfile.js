module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        less: {
            development: { //para ambiente de desenvolvimento
                files: {
                    'dev/styles/main.css': 'src/styles/main.less'
                }
            },
            production: { //para ambiente de produção
                options: {
                    compress: true, //comprimir
                },
                files: {
                    'dist/styles/main.min.css': 'src/styles/main.less'
                }
            }
        },
        watch: { //executar ação automatica
            less: {
                files: ['src/styles/**/*.less'],
                tasks: ['less:development']
            },
            html: {
                files: ['src/index.html'],
                tasks: ['replace:dev']
            }
        },
        replace: { //replace do endereço do .css 
            dev: { // ambiente de desenvolvimento
                options: {
                    patterns: [
                        {
                            match: 'ENDERECO_DO_CSS', //@@ENDERECO_DO_CSS no html
                            replacement: './styles/main.css'
                        },
                        {
                            match: 'ENDERECO_DO_JS', //@@ENDERECO_DO_JS no html
                            replacement: '../src/scripts/main.js'
                        }
                    ]
                },
                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: ['src/index.html'],
                        dest: 'dev/'
                    }
                ]
            },
            dist: { //ambiente de produção
                options: {
                    patterns: [
                        {
                            match: 'ENDERECO_DO_CSS', //@@ENDERECO_DO_CSS no html
                            replacement: './styles/main.min.css'
                        },
                        {
                            match: 'ENDERECO_DO_JS', //@@ENDERECO_DO_JS no html
                            replacement: './scripts/main.min.js'
                        }
                    ]
                },
                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: ['prebuild/index.html'],
                        dest: 'dist/'
                    }
                ]
            }
        },
        htmlmin: { // comprimir html
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {
                    'prebuild/index.html' : 'src/index.html' // pasta para ser feita a compressao
                }
            }
        },
        clean: ['prebuild'], // excluir a pasta de compressao
        uglify: { //comprimir js
            target: {
                files: {
                    'dist/scripts/main.min.js': 'src/scripts/main.js'
                }
            }
        }
    })

    //plug-ins
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['watch']);
    grunt.registerTask('build', ['less:production', 'htmlmin:dist', 'replace:dist', 'clean', 'uglify']);
}