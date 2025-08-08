class LoginPage {
    // Form Elements
    get emailInput() { return $('//input[@id="input-vaadin-text-field-11"]'); }
    get passwordInput() { return $('//input[@id="input-vaadin-password-field-12"]'); }    
    get loginForm() { return $('form') || $('.login-form') || $('[data-testid="login-form"]') }
    get submitButton() { return $('//vaadin-button[@id="submit-button"]') };    
    // Alternative Login Options
    get googleLoginButton() { return $('[data-testid="google-login"]') || $('button:contains("Google")') || $('.google-login') }
    get githubLoginButton() { return $('[data-testid="github-login"]') || $('button:contains("GitHub")') || $('.github-login') }
    
    // Links and Navigation
    get forgotPasswordLink() { return $('a[href*="forgot"]') || $('a:contains("Forgot Password")') || $('[data-testid="forgot-password"]') }
    get signupLink() { return $('a[href*="signup"]') || $('a:contains("Sign Up")') || $('[data-testid="signup-link"]') }
    get backToHomeLink() { return $('a[href="/"]') || $('a:contains("Back to Home")') || $('[data-testid="back-home"]') }
    
    // Error Messages
    get errorMessage() { return $('.error-message') || $('[data-testid="error-message"]') || $('.alert-error') }
    get validationErrors() { return $$('.validation-error') || $$('[data-testid="validation-error"]') }
    
    // Page Title and Header
    get pageTitle() { return $('h1') || $('.page-title') || $('[data-testid="login-title"]') }
    get pageSubtitle() { return $('.page-subtitle') || $('[data-testid="login-subtitle"]') }

    // Methods
    async open() {
        await browser.url('/login');
        await this.waitForPageLoad();
    }

    async waitForPageLoad() {
        await this.emailInput.waitForDisplayed({ timeout: 10000 });
    }

    async login(email, password) {
        console.log("Mencari elemen input email...");
        
        // Enhanced waiting strategy with page reload fallback
        let retryCount = 0;
        const maxRetries = 3;
        
        while (retryCount < maxRetries) {
            try {
                // Wait for login form to be ready
                await this.emailInput.waitForExist({ timeout: 10000 });
                await this.emailInput.waitForDisplayed({ timeout: 5000 });
                console.log("Elemen email ditemukan.");
                break;
            } catch (error) {
                console.log(`Attempt ${retryCount + 1}: Email input not found. Retrying...`);
                retryCount++;
                
                if (retryCount < maxRetries) {
                    // Refresh the page and try again
                    await browser.refresh();
                    await browser.pause(2000);
                } else {
                    throw new Error(`Login form not available after ${maxRetries} attempts: ${error.message}`);
                }
            }
        }
    
        await this.emailInput.setValue(email);
    
        console.log("Mencari elemen input password...");
        await this.passwordInput.waitForExist({ timeout: 5000 }); 
        await this.passwordInput.waitForDisplayed({ timeout: 3000 });
        console.log("Elemen password ditemukan.");
    
        await this.passwordInput.setValue(password);
        await this.submitButton.click();
    }
    

    async getPageTitle() {
        return await this.pageTitle.getText();
    }

    async getErrorMessage() {
        return await this.errorMessage.getText();
    }

    async isErrorDisplayed() {
        return await this.errorMessage.isDisplayed();
    }

    async clickForgotPassword() {
        await this.forgotPasswordLink.click();
    }

    async clickSignupLink() {
        await this.signupLink.click();
    }

    async clickGoogleLogin() {
        await this.googleLoginButton.click();
    }

    async clickGithubLogin() {
        await this.githubLoginButton.click();
    }

    async isFormDisplayed() {
        return await this.loginForm.isDisplayed();
    }

    async clearForm() {
        await this.emailInput.clearValue();
        await this.passwordInput.clearValue();
    }

    async getValidationErrorsCount() {
        return await this.validationErrors.length;
    }
}

module.exports = new LoginPage(); 