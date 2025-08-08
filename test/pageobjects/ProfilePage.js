class ProfilePage {
    // Profile and Settings
    get profileNavigation() { return $('//vaadin-menu-bar[@role="menubar"]') }
    get userSettings() { return $('//vaadin-menu-bar-item[normalize-space()="User Settings"]') }

    get generalSettingsTab() { return $('//vaadin-tab[normalize-space()="General"]') }
    get newPasswordInput() { return $('(//input[contains(@id, "input-vaadin-password-field")])[1]') }
    get confirmPasswordInput() { return $('(//input[contains(@id, "input-vaadin-password-field")])[2]') }

    // Security Settings
    get securitySettingsTab() { return $('//vaadin-tab[normalize-space()="Security"]') }
    get twoFactorAuthToggle() { return $('//label[contains(text(), "Enable MFA")]') }
    get mfaQRCode() { return $('//img[@alt="QR Code for MFA"]') }

    // Logout
    get logoutButton() { return $('//vaadin-menu-bar-item[normalize-space()="Sign Out"]') }



    // Methods
    async navigateToProfile() {
        await this.profileNavigation.click();
        await this.userSettings.click();
        await browser.waitUntil(async () => {
            const profileTitle = await browser.getTitle();
            return profileTitle === "User Settings"; // Wait for the title to become "User Settings"
        }, { timeout: 5000, timeoutMsg: 'Page title did not become "Profile" within 5 seconds' });
    }

    async navigateToGeneralSettings() {
        await this.generalSettingsTab.click();
    }

    async navigateToSecuritySettings() {
        await this.securitySettingsTab.click();
    }

    async validateGeneralSettingsTab() {
        // wait for the new password and confirm password inputs to be displayed
        await this.newPasswordInput.waitForDisplayed();
        await this.confirmPasswordInput.waitForDisplayed();
    }

    async validateSecuritySettingsTab() {
        // wait for the new password and confirm password inputs to be displayed
        await this.twoFactorAuthToggle.waitForDisplayed();
        await this.mfaQRCode.waitForDisplayed();
    }

    async logoutNavigation() {
        // Click button logout
        await this.profileNavigation.click();
        await this.logoutButton.click();
        await browser.waitUntil(async () => {
            const profileTitle = await browser.getTitle();
            return profileTitle === "Login"; // Wait for the title to become "User Settings"
        }, { timeout: 5000, timeoutMsg: 'Page title did not become "Profile" within 5 seconds' });
    }
}

module.exports = new ProfilePage(); 