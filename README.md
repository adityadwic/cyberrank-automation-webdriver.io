# CyberRank Platform - Automated Testing

End-to-end automation tests for CyberRank platform (https://www.cyberrank.ai) using WebdriverIO and Page Object Model.

## 🚀 Quick Start

1. **Setup**
   ```bash
   git clone <repository-url>
   cd qa-cyberrank
   npm install
   cp env.example .env
   # Edit .env with your test credentials
   ```

2. **Run Tests**
   ```bash
   # Run all tests with reports
   npm run test:with-report
   
   # Or run tests separately
   npm run test:pre-login    # Homepage, navigation, login page
   npm run test:post-login   # Login, dashboard, user settings
   npm run test:all         # Both pre-login and post-login
   ```

3. **View Reports**
   ```bash
   npm run report:open
   ```

## � Test Coverage

- **Pre-Login**: Homepage validation, menu navigation, login page elements
- **Post-Login**: User authentication, dashboard access, profile settings, MFA/2FA, logout

## 📊 Test Reports

Generate comprehensive test reports in multiple formats:

```bash
# Generate all reports
npm run report:generate

# Generate specific report types
npm run report:allure    # Detailed interactive report
npm run report:summary   # Executive summary

# View reports
npm run report:open      # Get file paths to open
npm run report:serve     # Live Allure server
```

**Report Locations:**
- **Executive Summary**: `test-reports/test-summary.html` - Clean overview with pass/fail stats
- **Detailed Report**: `test-reports/allure-report/index.html` - Interactive report with screenshots

## 📁 Project Structure

```
qa-cyberrank/
├── test/
│   ├── pageobjects/         # Page Object Model classes
│   │   ├── HomePage.js
│   │   ├── LoginPage.js
│   │   ├── DashboardPage.js
│   │   └── ProfilePage.js
│   ├── specs/              # Test specifications
│   │   ├── pre-login.spec.js
│   │   └── post-login.spec.js
│   └── utils/
├── test-results/           # Raw test data & screenshots
├── test-reports/           # Generated HTML reports
│   ├── allure-report/      # Interactive detailed report
│   └── test-summary.html   # Executive summary
├── wdio.conf.js           # WebdriverIO configuration
├── package.json
└── .env                   # Test credentials (create from env.example)
```

## 🧪 Available Commands

```bash
# Test execution
npm run test:pre-login      # Pre-login tests only
npm run test:post-login     # Post-login tests only  
npm run test:all           # All tests
npm run test:with-report   # Tests + automatic reports
npm run test:headless      # Headless browser mode

# Report generation
npm run report:generate    # Generate all reports
npm run report:allure      # Allure report only
npm run report:summary     # Summary report only
npm run report:open        # Display report file paths
npm run report:serve       # Live Allure server

# Utilities
npm run clean             # Clear test results & reports
```

## � Troubleshooting

**Common Issues:**
- **Element not found**: Update selectors in page object files if UI changes
- **Login failed**: Verify credentials in `.env` file
- **Timeout errors**: Check network connection and adjust timeout in `wdio.conf.js`
- **Reports not opening**: Run `npm run report:generate` first, then use file paths from `npm run report:open`
- **Missing screenshots**: Screenshots only appear when tests fail

## 🔧 Technical Details

- **Framework**: WebdriverIO v8 with Mocha
- **Pattern**: Page Object Model for maintainable test code
- **Reports**: Allure (detailed) + Custom HTML (executive summary)
- **Browser**: Chrome (configurable in wdio.conf.js)
- **Requirements**: Node.js 16+, Chrome browser

---

*For additional support, check the troubleshooting section or review test logs in the terminal output.*