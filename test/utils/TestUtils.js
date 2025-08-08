class TestUtils {
    /**
     * Wait for element to be displayed with custom timeout
     * @param {WebdriverIO.Element} element - Element to wait for
     * @param {number} timeout - Timeout in milliseconds
     * @returns {Promise<boolean>}
     */
    static async waitForElement(element, timeout = 10000) {
        try {
            await element.waitForDisplayed({ timeout });
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Wait for element to be clickable
     * @param {WebdriverIO.Element} element - Element to wait for
     * @param {number} timeout - Timeout in milliseconds
     * @returns {Promise<boolean>}
     */
    static async waitForClickable(element, timeout = 10000) {
        try {
            await element.waitForClickable({ timeout });
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Take screenshot with timestamp
     * @param {string} name - Screenshot name
     */
    static async takeScreenshot(name) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `${name}_${timestamp}.png`;
        await browser.saveScreenshot(`./screenshots/${filename}`);
        console.log(`Screenshot saved: ${filename}`);
    }

    /**
     * Generate random string for test data
     * @param {number} length - Length of random string
     * @returns {string}
     */
    static generateRandomString(length = 8) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    /**
     * Generate random email for testing
     * @returns {string}
     */
    static generateRandomEmail() {
        const randomString = this.generateRandomString(8);
        return `test.${randomString}@example.com`;
    }

    /**
     * Scroll to element
     * @param {WebdriverIO.Element} element - Element to scroll to
     */
    static async scrollToElement(element) {
        await element.scrollIntoView();
        await browser.pause(500); // Small pause for smooth scrolling
    }

    /**
     * Check if element exists without throwing error
     * @param {WebdriverIO.Element} element - Element to check
     * @returns {Promise<boolean>}
     */
    static async elementExists(element) {
        try {
            return await element.isExisting();
        } catch (error) {
            return false;
        }
    }

    /**
     * Check if element is displayed without throwing error
     * @param {WebdriverIO.Element} element - Element to check
     * @returns {Promise<boolean>}
     */
    static async elementDisplayed(element) {
        try {
            return await element.isDisplayed();
        } catch (error) {
            return false;
        }
    }

    /**
     * Wait for page to load completely
     * @param {number} timeout - Timeout in milliseconds
     */
    static async waitForPageLoad(timeout = 10000) {
        await browser.waitUntil(
            () => browser.execute(() => document.readyState === 'complete'),
            {
                timeout,
                timeoutMsg: 'Page did not load completely'
            }
        );
    }

    /**
     * Clear browser cookies and local storage
     */
    static async clearBrowserData() {
        await browser.deleteAllCookies();
        await browser.execute(() => {
            localStorage.clear();
            sessionStorage.clear();
        });
    }

    /**
     * Get current timestamp
     * @returns {string}
     */
    static getTimestamp() {
        return new Date().toISOString();
    }

    /**
     * Log test step with timestamp
     * @param {string} step - Test step description
     */
    static logStep(step) {
        const timestamp = this.getTimestamp();
        console.log(`[${timestamp}] STEP: ${step}`);
    }

    /**
     * Retry function with exponential backoff
     * @param {Function} fn - Function to retry
     * @param {number} maxRetries - Maximum number of retries
     * @param {number} baseDelay - Base delay in milliseconds
     * @returns {Promise<any>}
     */
    static async retry(fn, maxRetries = 3, baseDelay = 1000) {
        for (let i = 0; i < maxRetries; i++) {
            try {
                return await fn();
            } catch (error) {
                if (i === maxRetries - 1) {
                    throw error;
                }
                const delay = baseDelay * Math.pow(2, i);
                await browser.pause(delay);
            }
        }
    }

    /**
     * Check if URL contains specific path
     * @param {string} path - Path to check
     * @returns {Promise<boolean>}
     */
    static async urlContains(path) {
        const currentUrl = await browser.getUrl();
        return currentUrl.includes(path);
    }

    /**
     * Wait for URL to change
     * @param {string} expectedUrl - Expected URL pattern
     * @param {number} timeout - Timeout in milliseconds
     * @returns {Promise<boolean>}
     */
    static async waitForUrlChange(expectedUrl, timeout = 10000) {
        return await browser.waitUntil(
            async () => {
                const currentUrl = await browser.getUrl();
                return currentUrl.includes(expectedUrl);
            },
            {
                timeout,
                timeoutMsg: `URL did not change to contain: ${expectedUrl}`
            }
        );
    }

    /**
     * Get element text safely
     * @param {WebdriverIO.Element} element - Element to get text from
     * @returns {Promise<string>}
     */
    static async getElementText(element) {
        try {
            return await element.getText();
        } catch (error) {
            return '';
        }
    }

    /**
     * Get element attribute safely
     * @param {WebdriverIO.Element} element - Element to get attribute from
     * @param {string} attribute - Attribute name
     * @returns {Promise<string>}
     */
    static async getElementAttribute(element, attribute) {
        try {
            return await element.getAttribute(attribute);
        } catch (error) {
            return '';
        }
    }
}

module.exports = TestUtils; 