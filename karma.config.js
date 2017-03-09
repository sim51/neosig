var wConfig = require('./webpack.config');

process.env.UNIT_TEST = true;

module.exports = function (config) {
    config.set({
        frameworks: [ 'mocha' ], //use the mocha test framework
        browsers: [ 'PhantomJS' ],
        files: [
          { pattern: 'test/**/*\.js' }
        ],
        preprocessors: {
          'src/**/*\.js': [ 'webpack', 'sourcemap'],
          'test/**/*\.js': [ 'webpack', 'sourcemap']
        },
        webpack: wConfig,
        webpackServer: {
            noInfo: true //please don't spam the console when running in karma!
        },
        reporters: ['mocha', 'progress', 'coverage'],
        coverageReporter: {
            dir: 'reports/coverage',
            reporters: [
                { type: 'html', subdir: '.' },
                { type: 'cobertura', subdir: '.', file: 'cobertura.txt' }
            ]
        }
    });
};
