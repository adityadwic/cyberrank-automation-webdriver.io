#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function logStep(step) {
    log(`\n${colors.cyan}=== ${step} ===${colors.reset}`);
}

function checkEnvironment() {
    logStep('Checking Environment');
    
    // Check if .env file exists
    if (!fs.existsSync('.env')) {
        log('⚠️  .env file not found. Please copy env.example to .env and configure your test credentials.', 'yellow');
        log('   cp env.example .env', 'blue');
        return false;
    }
    
    // Check if node_modules exists
    if (!fs.existsSync('node_modules')) {
        log('⚠️  node_modules not found. Installing dependencies...', 'yellow');
        try {
            execSync('npm install', { stdio: 'inherit' });
        } catch (error) {
            log('❌ Failed to install dependencies', 'red');
            return false;
        }
    }
    
    // Create screenshots directory if it doesn't exist
    if (!fs.existsSync('screenshots')) {
        fs.mkdirSync('screenshots');
        log('📁 Created screenshots directory', 'green');
    }
    
    return true;
}

function runTests(testType = 'all', options = {}) {
    const { headless = false, parallel = false, spec = null } = options;
    
    let command = 'npx wdio run wdio.conf.js';
    
    if (spec) {
        command += ` --spec ${spec}`;
    }
    
    if (headless) {
        command += ' --headless';
    }
    
    if (parallel) {
        command += ' --parallel 2';
    }
    
    logStep(`Running ${testType} Tests`);
    log(`Command: ${command}`, 'blue');
    
    try {
        execSync(command, { stdio: 'inherit' });
        log('✅ Tests completed successfully!', 'green');
        return true;
    } catch (error) {
        log('❌ Tests failed!', 'red');
        return false;
    }
}

function generateReport() {
    logStep('Generating Test Report');
    
    try {
        execSync('npx allure generate allure-results --clean', { stdio: 'inherit' });
        log('✅ Report generated successfully!', 'green');
        
        // Ask if user wants to open the report
        log('\n📊 Report generated. Run "npm run report" to view it in browser.', 'cyan');
    } catch (error) {
        log('❌ Failed to generate report', 'red');
    }
}

function showHelp() {
    log('\n🚀 CyberRank Test Runner', 'bright');
    log('=======================\n');
    
    log('Usage:', 'bright');
    log('  node scripts/run-tests.js [command] [options]\n');
    
    log('Commands:', 'bright');
    log('  all              Run all tests (default)');
    log('  pre-login        Run only pre-login tests');
    log('  post-login       Run only post-login tests');
    log('  help             Show this help message\n');
    
    log('Options:', 'bright');
    log('  --headless       Run tests in headless mode');
    log('  --parallel       Run tests in parallel');
    log('  --report         Generate report after tests\n');
    
    log('Examples:', 'bright');
    log('  node scripts/run-tests.js');
    log('  node scripts/run-tests.js pre-login --headless');
    log('  node scripts/run-tests.js post-login --parallel --report');
    log('  node scripts/run-tests.js help\n');
}

function main() {
    const args = process.argv.slice(2);
    const command = args[0] || 'all';
    
    if (command === 'help') {
        showHelp();
        return;
    }
    
    log('🔍 CyberRank Platform - End-to-End Test Suite', 'bright');
    log('==============================================\n');
    
    // Check environment
    if (!checkEnvironment()) {
        process.exit(1);
    }
    
    // Parse options
    const options = {
        headless: args.includes('--headless'),
        parallel: args.includes('--parallel'),
        report: args.includes('--report')
    };
    
    // Determine test spec based on command
    let spec = null;
    switch (command) {
        case 'pre-login':
            spec = 'test/specs/pre-login.spec.js';
            break;
        case 'post-login':
            spec = 'test/specs/post-login.spec.js';
            break;
        case 'all':
            // Run all tests (no spec filter)
            break;
        default:
            log(`❌ Unknown command: ${command}`, 'red');
            showHelp();
            process.exit(1);
    }
    
    // Run tests
    const success = runTests(command, { ...options, spec });
    
    // Generate report if requested
    if (options.report && success) {
        generateReport();
    }
    
    // Exit with appropriate code
    process.exit(success ? 0 : 1);
}

// Run the main function
if (require.main === module) {
    main();
}

module.exports = {
    checkEnvironment,
    runTests,
    generateReport
}; 