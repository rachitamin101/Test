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

    specs: [
        'test/features/*.feature'
    ],

    capabilities: {
        'browserName': 'chrome',
        'chromeOptions': {
            'args': ['window-size=1440,1080']
        }
    },

    cucumberOpts: {
        require: 'test/features/**/*.js',
        tags: tags,
        format: ['json:logs/report.json', 'pretty']
    },

    onPrepare: function () {
        var disableCssAnimate = function () {
            angular
                .module('disableCssAnimate', [])
                .run(function () {
                    var style = document.createElement('style');
                    style.type = 'text/css';
                    style.innerHTML = '* {' +
                        '-webkit-transition: none !important;' +
                        '-moz-transition: none !important;' +
                        '-o-transition: none !important;' +
                        '-ms-transition: none !important;' +
                        'transition: none !important;' +
                        '}';
                    document.getElementsByTagName('head')[0].appendChild(style);
                });
        };

        browser.addMockModule('disableCssAnimate', disableCssAnimate);
    },

    onComplete: function () {
        var report = require('cucumber-html-report');

        report.create({
            source: 'logs/report.json',         // source json 
            dest: 'logs/reports',               // target directory (will create if not exists) 
            name: 'report.html',                // report file name (will be index.html if not exists) 
            //template: 'mytemplate.html',      // your custom mustache template (uses default if not specified) 
            title: 'Cucumber Report',           // Title for default template. (default is Cucumber Report)
            maxScreenshots: 10                  // Max number of screenshots to save (default is 1000)
            //component: 'My Component',        // Subtitle for default template. (default is empty) 
        })
        .then(console.log)
        .catch(console.error);
    }
};
