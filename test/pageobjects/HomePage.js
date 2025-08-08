class HomePage {
    // Navigation and Header Elements
    get logo() { return $('img[class="default-logo"]') || $('.logo') || $('img[alt*="CyberRank"]') }
    get navigationMenu() { return $('nav') || $('.navigation') || $('[role="navigation"]') }
    get loginButton() { return $('(//a[normalize-space()="Login"])[1]'); }
    get signupButton() { return $('(//a[normalize-space()="Register"])[1]') || $('[data-testid="signup-button"]') || $('a[href*="register"]') }    
    
    // Hero Section Elements
    get pageTitle() { return browser.getTitle(); }
    get heroSubtitle() { return $('section.hero p') || $('.hero-subtitle') || $('[data-testid="hero-subtitle"]') }
    get getStartedButton() { return $('a:contains("CyberRank Now")') || $('button:contains("Get Started")') || $('[data-testid="get-started"]'); }
    get whatwedoSection() { return $('//h1[normalize-space()="What we do"]'); }
    
    // Features Section
    get featuresSection() { return $('.features') || $('[data-testid="features"]') || $('#features') }
    get featureCards() { return $$('.feature-card') || $$('[data-testid="feature-card"]') || $$('.feature-item') }
    
    // About/Company Section
    get aboutSection() { return $('.about') || $('[data-testid="about"]') || $('#about') }
    get companyInfo() { return $('.company-info') || $('[data-testid="company-info"]') }
    
    // Footer Elements
    get footer() { return $('footer') || $('.footer') }
    get footerLinks() { return $$('footer a') || $$('.footer a') }
    get socialMediaLinks() { return $$('[data-testid="social-link"]') || $$('.social-links a') }
    
    // Contact/Support Elements
    get contactForm() { return $('.contact-form') || $('[data-testid="contact-form"]') || $('form[action*="contact"]') }
    get supportLink() { return $('a[href*="support"]') || $('a:contains("Support")') || $('[data-testid="support-link"]') }
    
    // Search Functionality
    get searchInput() { return $('input[type="search"]') || $('[data-testid="search-input"]') || $('.search-input') }
    get searchButton() { return $('button[type="submit"]') || $('[data-testid="search-button"]') || $('.search-button') }

    // Titles Validation
    get rangkingsHeading1() { return $('//h1[normalize-space()="CyberRank"]'); }
    get rangkingsHeading2() { return $('//h2[span[contains(text(), "AI-driven IISRI")]]'); }
    
    
    // Navigation Tabs
    get homeTab() { return $('//div[@id="navbarNav"]//a[@class="nav-link"][normalize-space()="Home"]'); }
    get whatWeDoTab() { return $('//div[@id="navbarNav"]//a[@class="nav-link"][normalize-space()="What we do"]'); }      
    get rankingsTab() { return $('//div[@id="navbarNav"]//a[@class="nav-link"][normalize-space()="Rankings"]'); }
      
    // Add more tabs as needed

    // Methods
    async open() {
        await browser.url('/');
        await this.waitForPageLoad();
    }

    async waitForPageLoad() {
        await this.logo.waitForDisplayed({ timeout: 10000 });
    }

    async clickLogin() {
        await this.loginButton.click();
        await browser.waitUntil(async () => {
            const url = await browser.getUrl();
            return url.includes('login');
        }, { timeout: 10000, timeoutMsg: 'Login page did not load within 5 seconds' });
    }

    async clickSignup() {
        await this.signupButton.click();
    }

    async clickGetStarted() {
        await this.getStartedButton.click();
    }

    async getHeroTitle() {
        return await this.heroTitle.getText();
    }

    async getHeroSubtitle() {
        return await this.heroSubtitle.getText();
    }

    async getFeatureCardsCount() {
        return await this.featureCards.length;
    }

    async searchForTerm(searchTerm) {
        await this.searchInput.setValue(searchTerm);
        await this.searchButton.click();
    }

    async isNavigationMenuDisplayed() {
        return await this.navigationMenu.isDisplayed();
    }

    async isFooterDisplayed() {
        return await this.footer.isDisplayed();
    }

    async getFooterLinksCount() {
        return await this.footerLinks.length;
    }

    async clickSupportLink() {
        await this.supportLink.click();
    }

    async isContactFormDisplayed() {
        return await this.contactForm.isDisplayed();
    }

    async clickHomeTab() { await this.homeTab.click(); }
    async clickWhatWeDoTab() { await this.whatWeDoTab.click(); }
    async clickRankingsTab() { await this.rankingsTab.click(); }
}

module.exports = new HomePage(); 