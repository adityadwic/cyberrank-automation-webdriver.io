const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class TestReportGenerator {
    constructor() {
        this.testResultsDir = 'test-results';
        this.reportsDir = 'test-reports';
        this.allureResultsDir = 'allure-results';
    }

    combineTestResults() {
        const testResultFiles = fs.readdirSync(this.testResultsDir)
            .filter(file => file.endsWith('.json') && file.startsWith('results-'));
        
        console.log(`📊 Combining results from ${testResultFiles.length} test files...`);
        
        let combinedResults = {
            suites: [],
            state: { passed: 0, failed: 0, skipped: 0 }
        };

        testResultFiles.forEach(jsonFile => {
            const filePath = path.join(this.testResultsDir, jsonFile);
            try {
                const results = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                
                if (results.suites) {
                    // Process suites to merge nested empty parent suites with their child suites
                    const processedSuites = this.processNestedSuites(results.suites);
                    combinedResults.suites.push(...processedSuites);
                }
                
                // Combine state counts
                if (results.state) {
                    combinedResults.state.passed += results.state.passed || 0;
                    combinedResults.state.failed += results.state.failed || 0;
                    combinedResults.state.skipped += results.state.skipped || 0;
                }
            } catch (error) {
                console.log(`⚠️  Warning: Could not parse ${jsonFile}: ${error.message}`);
            }
        });

        console.log(`✅ Combined ${combinedResults.suites.length} test suites`);
        console.log(`📈 Total: ${combinedResults.state.passed} passed, ${combinedResults.state.failed} failed, ${combinedResults.state.skipped} skipped`);
        
        return combinedResults;
    }

    processNestedSuites(suites) {
        const processedSuites = [];
        
        for (let i = 0; i < suites.length; i++) {
            const suite = suites[i];
            
            // Check if this is a parent suite with no tests but followed by child suites with tests
            if (suite.tests && suite.tests.length === 0 && i + 1 < suites.length) {
                const nextSuite = suites[i + 1];
                if (nextSuite.tests && nextSuite.tests.length > 0) {
                    // Merge the parent suite name with child suite, use child's tests
                    const mergedSuite = {
                        ...nextSuite,
                        name: `${suite.name} - ${nextSuite.name}`,
                        tests: nextSuite.tests
                    };
                    processedSuites.push(mergedSuite);
                    i++; // Skip the next suite since we merged it
                    continue;
                }
            }
            
            // Only add suites that have tests
            if (suite.tests && suite.tests.length > 0) {
                processedSuites.push(suite);
            }
        }
        
        return processedSuites;
    }

    ensureDirectoryExists(dir) {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    }

    generateAllureReport() {
        console.log('🔄 Generating Allure HTML Report...');
        try {
            execSync(`npx allure generate ${this.allureResultsDir} --clean -o ${this.reportsDir}/allure-report`, { stdio: 'inherit' });
            console.log('✅ Allure HTML Report generated successfully!');
            console.log(`📁 Report location: ${path.resolve(this.reportsDir)}/allure-report/index.html`);
        } catch (error) {
            console.error('❌ Failed to generate Allure report:', error.message);
        }
    }

    generateHTMLSummary() {
        console.log('🔄 Generating HTML Summary Report...');
        
        const jsonFiles = fs.readdirSync(this.testResultsDir)
            .filter(file => file.endsWith('.json'))
            .map(file => path.join(this.testResultsDir, file));

        if (jsonFiles.length === 0) {
            console.log('⚠️  No JSON test results found');
            return;
        }

        // Combine all test results from JSON files
        const combinedResults = this.combineTestResults(jsonFiles);

        const html = this.createHTMLReport(combinedResults);
        const reportPath = path.join(this.reportsDir, 'test-summary.html');
        
        this.ensureDirectoryExists(this.reportsDir);
        fs.writeFileSync(reportPath, html);
        
        console.log('✅ HTML Summary Report generated successfully!');
        console.log(`📁 Report location: ${path.resolve(reportPath)}`);
    }

    createHTMLReport(results) {
        const state = results.state || {};
        const totalTests = (state.passed || 0) + (state.failed || 0) + (state.skipped || 0);
        const passRate = totalTests > 0 ? ((state.passed / totalTests) * 100).toFixed(1) : '0.0';
        
        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CyberRank Test Report</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            padding: 30px;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #e1e5e9;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #2c3e50;
            margin: 0;
            font-size: 2.5em;
        }
        .header p {
            color: #7f8c8d;
            margin: 10px 0 0 0;
            font-size: 1.1em;
        }
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .stat-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
        }
        .stat-card.passed {
            background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
        }
        .stat-card.failed {
            background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
        }
        .stat-card.pending {
            background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
        }
        .stat-card h3 {
            margin: 0;
            font-size: 2.5em;
            font-weight: bold;
        }
        .stat-card p {
            margin: 5px 0 0 0;
            opacity: 0.9;
        }
        .pass-rate {
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            color: white;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
            margin-bottom: 30px;
        }
        .pass-rate h2 {
            margin: 0;
            font-size: 2em;
        }
        .suites {
            margin-top: 30px;
        }
        .suite {
            background: #f8f9fa;
            border-left: 4px solid #007bff;
            margin-bottom: 20px;
            border-radius: 4px;
            overflow: hidden;
        }
        .suite-header {
            background: #007bff;
            color: white;
            padding: 15px 20px;
            font-weight: bold;
            font-size: 1.1em;
        }
        .suite-content {
            padding: 20px;
        }
        .test-item {
            display: flex;
            align-items: center;
            padding: 10px 0;
            border-bottom: 1px solid #e1e5e9;
        }
        .test-item:last-child {
            border-bottom: none;
        }
        .test-status {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            margin-right: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            color: white;
            font-size: 12px;
        }
        .test-status.passed {
            background-color: #4CAF50;
        }
        .test-status.failed {
            background-color: #f44336;
        }
        .test-status.pending {
            background-color: #ff9800;
        }
        .test-title {
            flex-grow: 1;
            font-weight: 500;
        }
        .test-duration {
            color: #6c757d;
            font-size: 0.9em;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e1e5e9;
            color: #6c757d;
        }
        .error-details {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 4px;
            padding: 10px;
            margin-top: 10px;
            font-family: 'Courier New', monospace;
            font-size: 0.9em;
            color: #856404;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 CyberRank Test Report</h1>
            <p>Automated Test Results - ${new Date().toLocaleString()}</p>
        </div>

        <div class="pass-rate">
            <h2>Overall Pass Rate: ${passRate}%</h2>
        </div>

                <div class="stats-grid">
            <div class="stat-card">
                <h3>${totalTests}</h3>
                <p>Total Tests</p>
            </div>
            <div class="stat-card passed">
                <h3>${state.passed || 0}</h3>
                <p>Passed</p>
            </div>
            <div class="stat-card failed">
                <h3>${state.failed || 0}</h3>
                <p>Failed</p>
            </div>
            <div class="stat-card pending">
                <h3>${state.skipped || 0}</h3>
                <p>Skipped</p>
            </div>
        </div>

        <div class="suites">
            ${results.suites.map(suite => this.createSuiteHTML(suite)).join('')}

        <div class="footer">
            <p>Generated by CyberRank Test Automation Framework</p>
            <p>WebdriverIO + Page Object Model</p>
        </div>
    </div>
</body>
</html>`;
    }

    createSuiteHTML(suite) {
        return `
            <div class="suite">
                <div class="suite-header">
                    📋 ${suite.name}
                </div>
                <div class="suite-content">
                    ${suite.tests.map(test => `
                        <div class="test-item">
                            <div class="test-status ${test.state}">
                                ${test.state === 'passed' ? '✓' : test.state === 'failed' ? '✗' : '○'}
                            </div>
                            <div class="test-title">${test.name}</div>
                            <div class="test-duration">${test.duration || 0}ms</div>
                        </div>
                        ${test.error ? `<div class="error-details">${test.error.message || 'No error details'}</div>` : ''}
                    `).join('')}
                </div>
            </div>
        `;
    }

    openReports() {
        const allureReportPath = path.join(this.reportsDir, 'allure-report', 'index.html');
        const summaryReportPath = path.join(this.reportsDir, 'test-summary.html');

        console.log('\n📊 Generated Reports:');
        
        if (fs.existsSync(allureReportPath)) {
            console.log(`🔗 Allure Report: file://${path.resolve(allureReportPath)}`);
        }
        
        if (fs.existsSync(summaryReportPath)) {
            console.log(`🔗 Summary Report: file://${path.resolve(summaryReportPath)}`);
        }

        console.log('\n💡 To open reports automatically:');
        console.log('   npm run report:open');
    }

    generateAll() {
        console.log('🎯 Starting Test Report Generation...\n');
        
        this.ensureDirectoryExists(this.testResultsDir);
        this.ensureDirectoryExists(this.reportsDir);
        
        this.generateAllureReport();
        this.generateHTMLSummary();
        this.openReports();
        
        console.log('\n✨ Report generation completed!');
    }
}

// CLI usage
const action = process.argv[2] || 'all';
const generator = new TestReportGenerator();

switch (action) {
    case 'allure':
        generator.generateAllureReport();
        break;
    case 'summary':
        generator.generateHTMLSummary();
        break;
    case 'open':
        generator.openReports();
        break;
    case 'all':
    default:
        generator.generateAll();
        break;
}
