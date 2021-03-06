var paramIndex = process.argv.indexOf('--cucumbertags');
var tags;
if (paramIndex !== -1) {
    tags = process.argv[paramIndex + 1].split(',');
    tags.push('~@Ignore');
}
else {
    tags = '~@Ignore';
}

exports.config = {
    baseUrl: 'http://localhost:8001',

    framework: 'custom',
    frameworkPath: require.resolve('protractor-cucumber-framework'),

    //seleniumServerJar: './node_modules/protractor/selenium/selenium-server-standalone-2.48.2.jar',
    chromeDriver: './node_modules/chromedriver/lib/chromedriver/chromedriver',
module.exports = function (grunt) {

    var libJs = [
        'angular/angular.js',
        'angular-animate/angular-animate.js',
        'angular-aria/angular-aria.js',
        'angular-datatables/dist/angular-datatables.js',
        'angular-sanitize/angular-sanitize.js',
        'angular-messages/angular-messages.js',
        'angular-resource/angular-resource.js',
        'angular-route/angular-route.js',
        'angular-sanitize/angular-sanitize.js',
        'angular-simple-logger/dist/angular-simple-logger.min.js',
        'angular-touch/angular-touch.js',
        'angular-google-maps/dist/angular-google-maps.js',
        'angular-material/angular-material.js',
        'c3/c3.min.js',
        'd3/d3.min.js',
        'moment/moment.js',
        'moment/locale/en-gb.js',
        'angular-moment/angular-moment.js',
        'datatables.net-responsive/js/dataTables.responsive.min.js',
        'file-saver/FileSaver.js'
    ];
    var libCss = [  //TODO: concat these the same way as the above files and remove individual references to them
        'angular-material/angular-material.min.css',
        'angular-material/layouts/angular-material.layouts.ie-fixes.css',
        'c3/c3.min.css'
    ];

    function prefixArray(prefix, array) { var result = []; array.forEach(function (string) { result.push(prefix + string); }); return result; }

    grunt.util.linefeed = '\n';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        target: '_site',
        tmp: 'tmp',

        style: {
            src: 'src/less/<%= pkg.name %>.less',
            dest: '<%= target %>/assets/css/<%= pkg.name %>.css'
        },

        clean: {
            target: '<%= target %>',
            logs: 'logs',
            tmp: '<%= tmp %>'
        },

        // LESS / CSS TASKS
        less: {
            options: {
                strictMath: true,
                sourceMap: true,
                outputSourceFiles: true,
                sourceMapURL: '<%= pkg.name %>.css.map',
                sourceMapFilename: '<%= target %>/assets/css/<%= pkg.name %>.css.map'
            },
            core: {
                src: '<%= style.src %>',
                dest: '<%= style.dest %>'
            }
        },

        autoprefixer: {
            options: {
                browsers: ['last 2 versions']
            },
            core: {
                options: {
                    map: true
                },
                src: '<%= style.dest %>'
            }
        },

        csslint: {
            options: {
                csslintrc: 'src/less/.csslintrc'
            },
            core: [
                '<%= style.dest %>'
            ]
        },

        csscomb: {
            options: {
                config: 'src/less/.csscomb.json'
            },
            assets: {
                expand: true,
                cwd: '<%= target %>/assets/css/',
                src: ['*.css', '!*.min.css'],
                dest: '<%= target %>/assets/css/'
            }
        },

        cssmin: {
            options: {
                compatibility: 'ie8',
                keepSpecialComments: '*',
                advanced: false
            },
            core: {
                src: '<%= style.dest %>',
                dest: '<%= style.dest %>'
            }
        },

        // JS TASKS
        jshint: {
            files: ['gruntfile.js', 'src/angular/**/*.js', 'test/**/*.spec.js'],
            options: {
                globals: {
                    jQuery: true,
                    console: true,
                    module: true,
                    document: true
                }
            }
        },

        concat: {
            app: {
                src: 'src/angular/**/*.js',
                dest: '<%= target %>/assets/js/<%= pkg.name %>.js'
            },
            angular: {
                src: prefixArray('bower_components/', libJs),
                dest: '<%= target %>/assets/js/lib/angular/angular.js'
            }
        },

        uglify: {
            options: {
                banner: '/*! <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                files: {
                    '<%= concat.app.dest %>': '<%= concat.app.src %>',
                    '<%= concat.angular.dest %>': '<%= concat.angular.src %>'
                }
            }
        },

        // TEST TASKS
        instrument: {
            files: '**/*.js',
            options: {
                cwd: 'src/angular',
                lazy: true,
                basePath: "_site/assets/instrumented"
            }
        },

        injector: {
            options: {
                relative: true,
                template: 'src/index.html'
            },
            coverage: {
                files: {
                    '_site/index.html': [
                        '_site/assets/css/**/*.css',
                        '_site/assets/js/lib/jquery.min.js',
                        '_site/assets/js/lib/jquery.dataTables.min.js',
                        '_site/assets/js/lib/lodash.min.js',
                        '_site/assets/js/lib/angular/angular.js',
                        '_site/assets/js/lib/moment/moment.js',
                        '_site/assets/js/lib/**/*.js',
                        '_site/assets/instrumented/**/*.js'
                    ]
                }
            },
            assets: {
                files: {
                    '_site/index.html': [
                        '_site/assets/css/**/*.css',
                        '_site/assets/js/lib/jquery.min*.js',
                        '_site/assets/js/lib/jquery.dataTables.min*.js',
                        '_site/assets/js/lib/lodash.min*.js',
                        '_site/assets/js/lib/angular/angular*.js',
                        '_site/assets/js/lib/moment/moment*.js',
                        '_site/assets/js/lib/**/*.js',
                        '_site/assets/modules/**/*.js',
                        '<%= target %>/assets/js/<%= pkg.name %>*.js'
                    ]
                }
            }
        },

        protractor_coverage: {
            options: {
                configFile: 'node_modules/protractor/referenceConf.js',
                keepAlive: false,
                noColor: false,
                noInject: true,
                coverageDir: 'logs/coverage',
                args: {
                    baseUrl: 'http://localhost:8091'
                }
            },
            e2e: {
                options: {
                    configFile: 'e2e.conf.js',
                    format: 'pretty'
                }
            }
        },

        makeReport: {
            src: 'logs/coverage/*.json',
            options: {
                type: 'lcov',
                dir: 'logs/coverage',
                print: 'text-summary'
            }
        },

        shell: {
            xvfb: {
                command: 'Xvfb :99 -ac -screen 0 1600x1200x24',
                options: {
                    async: true
                }
            }
        },

        env: {
            xvfb: {
                DISPLAY: ':99'
            }
        },

        // GENERAL TASKS
        copy: {
            assets: {
                files: [
                    {
                        expand: true,
                        filter: 'isFile',
                        cwd: 'src/assets',
                        src: ['**/*'],
                        dest: '<%= target %>/assets'
                    }
                ]
            },
            bowerAssets: {
                files: [
                    {
                        src: 'bower_components/jquery/dist/jquery.min.js',
                        dest: '<%= target %>/assets/js/lib/jquery.min.js'
                    },
                    {
                        src: 'bower_components/datatables.net/js/jquery.dataTables.min.js',
                        dest: '<%= target %>/assets/js/lib/jquery.dataTables.min.js'
                    },
                    {
                        src: 'bower_components/c3/c3.min.css',
                        dest: '<%= target %>/assets/css/c3.min.css'
                    },
                    {
                        src: 'bower_components/angular-material/angular-material.min.css',
                        dest: '<%= target %>/assets/css/angular-material.min.css'
                    },
                    {
                        src: 'bower_components/angular-material/layouts/angular-material.layouts.ie-fixes.css',
                        dest: '<%= target %>/assets/css/angular-material.layouts.ie-fixes.css'
                    },
                    {
                        src: 'bower_components/lodash/dist/lodash.min.js',
                        dest: '<%= target %>/assets/js/lib/lodash.min.js'
                    }
                ]
            },
            templates: {
                files: [
                    {
                        expand: true,
                        filter: 'isFile',
                        cwd: 'src/angular',
                        src: ['**/*.html'],
                        dest: '<%= target %>/assets/modules'
                    },
                    {
                        src: 'src/index.html',
                        dest: '<%= target %>/index.html'
                    }
                ]
            },
            libJs: {
                files: [
                    {
                        expand: true,
                        filter: 'isFile',
                        cwd: 'bower_components',
                        src: libJs,
                        dest: '<%= target %>/assets/js/lib'
                    }
                ]
            },
            coverage: {
                src: 'test/index.html',
                dest: '_site/index.html'
            },
            config: {
                files: [
                    {
                        src: 'config/development.json',
                        dest: '<%= target %>/assets/config.json'
                    }
                ]
            },
            play: {
                files: [
                    {
                        expand: true,
                        filter: 'isFile',
                        cwd: '_site',
                        src: ['**/*'],
                        dest: '../adminportal/public'
                    },
                    {
                        src: 'config/play.json',
                        dest: '../adminportal/public/assets/config.json'
                    }
                ]
            },
            prod: {
                files: [
                    {
                        expand: true,
                        filter: 'isFile',
                        cwd: '_site',
                        src: ['**/*'],
                        dest: '../adminportal/public'
                    },
                    {
                        src: 'config/production.json',
                        dest: '../adminportal/public/assets/config.json'
                    }
                ]
            }
        },

        symlink: {
            options: {
                overwrite: false
            },
            src: {
                src: 'src/angular',
                dest: '<%= target %>/assets/modules'
            }
        },

        // SERVER
        connect: {
            server: {
                options: {
                    port: 8091,
                    base: {
                        path: '<%= target %>',
                        options: {
                            index: 'index.html'
                        }
                    },
                    middleware: function (connect, options, middlewares) {
                        middlewares.unshift(function (req, res, next) {
                            if (req.url.match(/\/api\/|\/assets\//) === null) {
                                req.url = '/';
                            }
                            return next();
                        });

                        middlewares.unshift(require('grunt-connect-proxy/lib/utils').proxyRequest);

                        return middlewares;
                    },
                    livereload: false
                },
                proxies: [
                    {
                        context: '/api',
                        host: 'localhost',
                        port: 8001,
                        https: false,
                        xforward: false
                    }
                ]
            }
        },

        watch: {
            script: {
                files: ['src/angular/**/*.js'],
                tasks: ['concat', 'strip_code', 'copy:assets'],
                options: {
                    livereload: false
                }
            },
            css: {
                files: 'src/less/**/*.less',
                tasks: ['less', 'autoprefixer', 'csslint', 'csscomb', 'copy:assets'],
                options: {
                    livereload: false
                }
            },
            templates: {
                files: ['src/angular/**/*.html', 'src/index.html'],
                tasks: ['copy:templates', 'injector:assets'],
                options: {
                    livereload: false
                }
            },
            config: {
                files: 'config/*.json',
                tasks: ['copy:config'],
                options: {
                    livereload: false
                }
            },
            debug: {
                files: ['config/*.json', 'src/less/**/*.less'],
                tasks: ['copy:config', 'less', 'autoprefixer', 'csslint', 'csscomb', 'copy:assets'],
                options: {
                    livereload: false
                }
            }
        },

        karma: {
            options: {
                configFile: 'test/unit/karma.conf.js',
                proxies: {
                    '/assets/config.json': '/base/config/development.json'
                }
            },
            single: {
                files: [
                    {
                        src: [
                            'node_modules/phantomjs-polyfill-find/find-polyfill.js',
                            'bower_components/jquery/dist/jquery.min.js',
                            'bower_components/datatables.net/js/jquery.dataTables.min.js',
                            'bower_components/lodash/dist/lodash.min.js'
                        ]
                    },
                    { src: prefixArray('bower_components/', libJs) },
                    { src: 'bower_components/angular-mocks/angular-mocks.js' },
                    { src: 'node_modules/karma-read-json/karma-read-json.js' },
                    { src: 'config/development.json', watched: true, served: true, included: false },
                    { src: 'test/unit/fixtures/*.json', watched: true, served: true, included: false },
                    { src: 'src/angular/**/*.js' },
                    { src: 'src/angular/**/*.html' },
                    {
                        src: [
                            'test/unit/fixtures/*.js',
                            'test/unit/mocks/mocks.module.js',
                            'test/unit/mocks/**/*.js',
                            'test/unit/helpers/*.js',
                            'test/unit/specs/**/*.js'
                        ]
                    }
                ],
                preprocessors: {
                    'src/angular/**/*.html': ['ng-html2js'],
                    'src/angular/**/*.js': ['coverage']
                },
                reporters: [ 'progress', 'coverage'],
                coverageReporter: {
                    type : 'html',
                    dir : 'test/unit/coverage/'
                },
                singleRun: true
            },
            cont: {
                files: '<%= karma.single.files %>',
                preprocessors: { 'src/angular/**/*.html': ['ng-html2js'] },
                reporters: ['progress', 'beep', 'growl'],
                background: true
            }
        },
        strip_code: {
            options: {
                start_comment: "test-code",
                end_comment: "end-test-code",
                src: "dist/*.js"
            }
        },
        hash: {
            options: {
                mapping: '<%= tmp %>/assets.json',
                srcBasePath: '<%= target %>/',
                destBasePath: '<%= hashTarget %>/',
                hashLength: 8
            },
            angular: {
                src: '<%= target %>/assets/js/lib/angular/*.js', 
                dest: '<%= hashTarget %>/assets/js/lib/angular/' 
            },
            lib: {
                src: '<%= target %>/assets/js/lib/*.js', 
                dest: '<%= hashTarget %>/assets/js/lib/' 
            },
            app: {
                src: '<%= target %>/assets/js/<%= pkg.name %>.js', 
                dest: '<%= hashTarget %>/assets/js/' 
            },
            css: {
                src: '<%= target %>/assets/css/*.css', 
                dest: '<%= hashTarget %>/assets/css/' 
            }
        }
    });

    require('load-grunt-tasks')(grunt);

    grunt.registerTask('pre-build', ['clean']);
    grunt.registerTask('build-js-debug', ['copy:libJs', 'symlink']);
    grunt.registerTask('build-js', ['concat', 'strip_code']);
    grunt.registerTask('build-css', ['less', 'autoprefixer', 'csslint', 'csscomb']);
    grunt.registerTask('post-build', ['injector:assets']);

    grunt.registerTask('debug-dev', ['pre-build', 'copy:assets', 'copy:bowerAssets', 'copy:config', 'build-js-debug', 'build-css', 'post-build', 'configureProxies:server', 'connect', 'watch:debug']);
    grunt.registerTask('develop', ['pre-build', 'copy:assets', 'copy:bowerAssets', 'copy:config', 'build-js', 'copy:templates', 'build-css', 'post-build', 'configureProxies:server', 'connect']);

    grunt.registerTask('dist', ['pre-build', 'pre-hash-target', 'build-js', 'uglify', 'build-css', 'cssmin', 'copy:bowerAssets', 'hash', 'post-hash-target', 'copy:assets', 'copy:templates', 'post-build']);

    grunt.registerTask('play', ['dist', 'copy:play']);
    grunt.registerTask('prod', ['dist', 'copy:prod']);

    grunt.registerTask('test', ['develop', 'instrument', 'copy:coverage', 'injector:coverage', 'protractor_coverage', 'makeReport', 'clean:tmp']);
    grunt.registerTask('test-ci', ['shell:xvfb', 'env:xvfb', 'develop', 'instrument', 'copy:coverage', 'injector:coverage', 'protractor_coverage', 'makeReport', 'clean:tmp', 'shell:xvfb:kill']);
    grunt.registerTask('test-ci-shutdown', ['shell:xvfb:kill']);

    grunt.registerTask('debug', ['karma:cont', 'debug-dev', 'watch:debug']);

    grunt.registerTask('pre-hash-target', function () {
        grunt.config.data.hashTarget = grunt.config.data.target;
        grunt.config.data.target = '<%= tmp %>/_site';
    });

    grunt.registerTask('post-hash-target', function () {
        grunt.config.data.target = grunt.config.data.hashTarget;
        delete grunt.config.data.hashTarget;
    });

    grunt.registerTask('watch:default', function () {
        delete grunt.config.data.watch.debug;
        grunt.task.run('watch');
    });
    grunt.registerTask('run', ['develop', 'watch:default']);

    grunt.registerTask('default', ['run']);
};
