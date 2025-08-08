const path = require('path');

exports.config = {
    runner: 'local',
    specs: [
        './test/specs/**/*.js'
    ],
    exclude: [],
    maxInstances: 10,
    capabilities: [{
        maxInstances: 5,
        browserName: 'chrome',
        acceptInsecureCerts: true,
        'goog:chromeOptions': {
            args: [
                '--no-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--window-size=1920,1080'
            ]
        }
    }],
    logLevel: 'info',
    bail: 0,
    baseUrl: 'https://www.cyberrank.ai',
    waitforTimeout: 15000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,
    services: ['chromedriver'],
    framework: 'mocha',
    reporters: [
        'spec',
        ['allure', {
            outputDir: 'allure-results',
            disableWebdriverStepsReporting: true,
            disableWebdriverScreenshotsReporting: false,
        }],
        ['json', {
            outputDir: 'test-results',
            outputFileFormat: function(options) {
                const date = new Date().toISOString().slice(0,10);
                const timestamp = Date.now();
                return `results-${date}-${timestamp}.json`
            }
        }],
        ['junit', {
            outputDir: 'test-results',
            outputFileFormat: function(options) {
                return `junit-results-${new Date().toISOString().slice(0,10)}.xml`
            }
        }]
    ],
    mochaOpts: {
        ui: 'bdd',
        timeout: 60000,
        retries: 1
    },
    before: function (capabilities, specs) {
        require('dotenv').config();
    },
    afterTest: function(test, context, { error, result, duration, passed, retries }) {
        if (!passed) {
            // Take screenshot on failure
            const screenshot = browser.takeScreenshot();
            
            // Save screenshot with descriptive name
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const testName = test.title.replace(/[^a-zA-Z0-9]/g, '_');
            const screenshotPath = `./test-results/screenshots/${testName}_${timestamp}.png`;
            
            require('fs').mkdirSync('./test-results/screenshots', { recursive: true });
            
            // Handle async screenshot
            screenshot.then(screenshotData => {
                require('fs').writeFileSync(screenshotPath, screenshotData, 'base64');
                console.log(`📸 Screenshot saved: ${screenshotPath}`);
            }).catch(err => {
                console.log('Error saving screenshot:', err.message);
            });
        }
    },
    
    onComplete: function(exitCode, config, capabilities, results) {
        console.log('\n🎯 Test execution completed!');
        console.log('📊 Generate reports with: npm run report:generate');
    }
} 