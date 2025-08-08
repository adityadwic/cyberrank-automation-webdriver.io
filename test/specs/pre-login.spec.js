const HomePage = require('../pageobjects/HomePage');
const LoginPage = require('../pageobjects/LoginPage');

describe('CyberRank Platform - Pre-Login Tests (Improved)', () => {
    beforeEach(async () => {
        await HomePage.open();
    });

    it('01 - should validate the homepage title', async () => {
        const pageTitle = await browser.getTitle();
        expect(pageTitle).toBeTruthy();
        expect(pageTitle.length).toBeGreaterThan(0);
        // Optionally, check for expected keywords
        expect(pageTitle.toLowerCase()).toContain('cyber');
    });

    it('02 - should access and validate the Home tab', async () => {
        await HomePage.clickHomeTab();
        
        // Wait for page to load completely
        await browser.waitUntil(async () => {
            const currentUrl = await browser.getUrl();
            return currentUrl.includes('index.php');
        }, {
            timeout: 15000,
            timeoutMsg: 'Home page did not load within 15 seconds'
        });
        
        // Wait for page content to be fully loaded
        await browser.waitUntil(async () => {
            try {
                const pageTitle = await browser.getTitle();
                return pageTitle && pageTitle.trim().length > 0;
            } catch (error) {
                return false;
            }
        }, {
            timeout: 10000,
            timeoutMsg: 'Page title did not load within 10 seconds'
        });
        
        // Validate that we are on the homepage (e.g., hero section is visible)
        const pageTitle = await browser.getTitle();
        await expect(pageTitle).toBe('CyberRank - Vendor Risk Management System');
        const url = await browser.getUrl();
        expect(url).toMatch("https://www.cyberrank.ai/index.php");
    });

    it('03 - should access and validate the What We Do tab', async () => {
        await HomePage.clickWhatWeDoTab();
        
        // Wait for page to load completely and URL to change
        await browser.waitUntil(async () => {
            const currentUrl = await browser.getUrl();
            return currentUrl.includes('what-we-do');
        }, {
            timeout: 15000,
            timeoutMsg: 'What We Do page did not load within 15 seconds'
        });
        
        // Wait for the What We Do section element to be displayed and have content
        await browser.waitUntil(async () => {
            try {
                const isDisplayed = await HomePage.whatwedoSection.isDisplayed();
                if (!isDisplayed) return false;
                
                // Also check if the element has loaded content
                const text = await HomePage.whatwedoSection.getText();
                return text && text.trim().length > 0;
            } catch (error) {
                return false;
            }
        }, {
            timeout: 15000,
            timeoutMsg: 'What We Do section did not become visible with content within 15 seconds'
        });
        
        // Validate that the What We Do section is visible
        await expect(HomePage.whatwedoSection).toBeDisplayed();
        const url = await browser.getUrl();
        expect(url).toContain('what-we-do');
    });

    it('04 - should access and validate the Rankings tab', async () => {
        // Klik tab Rankings
        await HomePage.clickRankingsTab();
    
        // Validasi URL mengandung 'rankings'
        const url = await browser.getUrl();
        expect(url).toContain('rankings');
    
        // Wait for page to load completely and H1 element to be present with text
        await browser.waitUntil(async () => {
            try {
                const h1Element = await HomePage.rangkingsHeading1;
                const h1Text = await h1Element.getText();
                return h1Text.trim().length > 0;
            } catch (error) {
                return false;
            }
        }, {
            timeout: 15000,
            timeoutMsg: 'H1 element with text did not load within 15 seconds'
        });
    
        // Wait for H2 element to be present with text
        await browser.waitUntil(async () => {
            try {
                const h2Element = await HomePage.rangkingsHeading2;
                const h2Text = await h2Element.getText();
                return h2Text.trim().includes('AI-driven');
            } catch (error) {
                return false;
            }
        }, {
            timeout: 15000,
            timeoutMsg: 'H2 element with AI-driven text did not load within 15 seconds'
        });
    
        // Validasi H1 text: "CyberRank"
        const h1Text = await HomePage.rangkingsHeading1.getText();
        await expect(h1Text.trim()).toBe('CyberRank');
    
        // Validasi H2 text: "AI-driven IISRI® External Ratings"
        const h2Text = await HomePage.rangkingsHeading2.getText();
        await expect(h2Text.trim()).toBe('AI-driven IISRI® External Ratings');
    });
    

    it('05 - should access and validate the login page', async () => {
        await HomePage.clickLogin();
        
        // Wait for login page to load completely
        await browser.waitUntil(async () => {
            const currentUrl = await browser.getUrl();
            return currentUrl.includes('login');
        }, {
            timeout: 15000,
            timeoutMsg: 'Login page did not load within 15 seconds'
        });
        
        // Wait for login form elements to be displayed and fully loaded
        await browser.waitUntil(async () => {
            try {
                const emailVisible = await LoginPage.emailInput.isDisplayed();
                const passwordVisible = await LoginPage.passwordInput.isDisplayed();
                const submitVisible = await LoginPage.submitButton.isDisplayed();
                
                // Additional check to ensure elements are interactive
                const emailEnabled = await LoginPage.emailInput.isEnabled();
                const submitEnabled = await LoginPage.submitButton.isEnabled();
                
                return emailVisible && passwordVisible && submitVisible && emailEnabled && submitEnabled;
            } catch (error) {
                return false;
            }
        }, {
            timeout: 15000,
            timeoutMsg: 'Login form elements did not become fully available within 15 seconds'
        });
        
        // Validate login page elements
        await expect(LoginPage.emailInput).toBeDisplayed();
        await expect(LoginPage.passwordInput).toBeDisplayed();
        await expect(LoginPage.submitButton).toBeDisplayed();
        const url = await browser.getUrl();
        expect(url).toContain('login');
    });
}); 