class DashboardPage {
    // Header and Navigation
    get userMenu() { return $('//span[normalize-space()="aditya.dwic75@gmail.com"]') }
    get userAvatar() { return $('.user-avatar') || $('[data-testid="user-avatar"]') || $('img[alt*="profile"]') }
    get sidebarNavigation() { return $('//vaadin-side-nav[@role="navigation"]') }
    
    // Dashboard Content
    get dashboardTitle() { return $('h1') || $('.dashboard-title') || $('[data-testid="dashboard-title"]') }
    get welcomeMessage() { return $('.welcome-message') || $('[data-testid="welcome-message"]') }
    get statsCards() { return $$('.stat-card') || $$('[data-testid="stat-card"]') || $$('.metric-card') }
    get vendorRiskHeatMap() { return $('(//div[@class="rating-bg chart-header"])[1]') }
    get vendorsComplianceStatus() { return $('//div[@class="rating-bg chart-header"])[2]') }
    get vrmComplianceStatus() { return $('//span[normalize-space()="Your VRM Compliance Status"]') }
    get btnLayoutDashboard() { return $('//div[@class="button-layout-dashboard"]') }
    get ratingGrid() { return $('//div[@class="rating-grid"]') }
    
    // Main Features/Sections
    get cyberRankingSection() { return $('.cyber-ranking') || $('[data-testid="cyber-ranking"]') || $('#cyber-ranking') }
    get assessmentSection() { return $('.assessment') || $('[data-testid="assessment"]') || $('#assessment') }
    get reportsSection() { return $('.reports') || $('[data-testid="reports"]') || $('#reports') }
    
    // Navigation Menu Items
    get dashboardNavigation() { return $('//vaadin-side-nav-item[normalize-space()="Dashboard"]') }
    get myVendorsNavigation() { return $('//vaadin-side-nav-item[contains(text(), "My Vendors")]') }
    get directoryNavigation() { return $('//vaadin-side-nav-item[contains(text(), "Directory")]') }
    
    // Quick Actions
    get newAssessmentButton() { return $('[data-testid="new-assessment"]') || $('button:contains("New Assessment")') || $('.new-assessment-btn') }
    get viewReportsButton() { return $('[data-testid="view-reports"]') || $('button:contains("View Reports")') || $('.view-reports-btn') }
    get startRankingButton() { return $('[data-testid="start-ranking"]') || $('button:contains("Start Ranking")') || $('.start-ranking-btn') }
    
    // Recent Activity
    get recentActivitySection() { return $('.recent-activity') || $('[data-testid="recent-activity"]') }
    get activityItems() { return $$('.activity-item') || $$('[data-testid="activity-item"]') }
    
    // Notifications
    get notificationBell() { return $('.notification-bell') || $('[data-testid="notification-bell"]') || $('.notifications') }
    get notificationCount() { return $('.notification-count') || $('[data-testid="notification-count"]') }
    get notificationDropdown() { return $('.notification-dropdown') || $('[data-testid="notification-dropdown"]') }

    // Methods
    async waitForPageLoad() {
        await this.dashboardTitle.waitForDisplayed({ timeout: 15000 });
    }

    async getDashboardTitle() {
        return await this.dashboardTitle.getText();
    }

    async getWelcomeMessage() {
        return await this.welcomeMessage.getText();
    }

    async getStatsCardsCount() {
        return await this.statsCards.length;
    }

    async clickUserMenu() {
        await this.profileNavigation.click();
    }

    async logout() {
        await this.clickUserMenu();
        await this.logoutButton.click();
    }

    async navigateToAssessments() {
        await this.assessmentsLink.click();
    }

    async navigateToDashboard() {
        // Click the Dashboard navigation link
        await this.dashboardNavigation.click();

        // Wait until the page title becomes "Dashboard"
        await browser.waitUntil(async () => {
            const dashboardTitle = await browser.getTitle();
            return dashboardTitle === "Dashboard"; // Wait for the title to become "Dashboard"
        }, { timeout: 5000, timeoutMsg: 'Page title did not become "Dashboard" within 5 seconds' });
    }

    async validateDashboardNavigation() {
        // Wait for the dashboard navigation link to be displayed
        await this.dashboardNavigation.waitForDisplayed();

        // Wait until the page title becomes "Dashboard"
        await browser.waitUntil(async () => {
            const dashboardTitle = await browser.getTitle();
            return dashboardTitle === "Dashboard";
        }, { timeout: 5000, timeoutMsg: 'Page title did not become "Dashboard" within 5 seconds' });

        // Verify that the URL contains "dashboard"
        const dashboardUrl = await browser.getUrl();
        expect(dashboardUrl).toContain("dashboard");

        // Verify that the dashboard navigation link is still visible
        await expect(this.dashboardNavigation).toBeDisplayed();
    }


    async navigateToMyVendors() {
        await this.myVendorsNavigation.click(); // Klik elemen
        await browser.waitUntil(async () => {
            return await this.myVendorsNavigation.isDisplayed(); // Verifikasi bahwa elemen sudah ditampilkan setelah klik
        }, { timeout: 5000, timeoutMsg: 'My Vendors navigation was not displayed within 5 seconds' });
    }


    async validateMyVendorsNavigation() {
        await this.myVendorsNavigation.waitForDisplayed();

        // Tunggu sampai halaman sepenuhnya dimuat dengan judul yang benar
        await browser.waitUntil(async () => {
            const title = await browser.getTitle();
            return title === "My Vendors";
        }, { timeout: 5000, timeoutMsg: 'Page title did not become "My Vendors" within 5 seconds' });

        // Verifikasi URL dan elemen
        const myVendorsUrl = await browser.getUrl();
        expect(myVendorsUrl).toContain("myvendors");
        await expect(this.myVendorsNavigation).toBeDisplayed();
    }


    async navigateToDirectory() {
        // Click the Directory navigation link
        await this.directoryNavigation.click();

        // Wait until the page title becomes "Directory"
        await browser.waitUntil(async () => {
            const directoryTitle = await browser.getTitle();
            return directoryTitle === "Directory"; // Wait for the title to become "Directory"
        }, { timeout: 5000, timeoutMsg: 'Page title did not become "Directory" within 5 seconds' });
    }

    async validateDirectoryNavigation() {
        await this.directoryNavigation.waitForDisplayed();

        // Verify that the page title is "Directory"
        const directoryTitle = await browser.getTitle();
        expect(directoryTitle).toBe("Directory");

        // Verify that the URL includes "directory"
        const directoryUrl = await browser.getUrl();
        expect(directoryUrl).toContain("directory");

        // Verify that the main navigation link for "Directory" is visible
        await expect(this.directoryNavigation).toBeDisplayed();

    }

    async navigateToReports() {
        await this.reportsLink.click();
    }

    async navigateToSettings() {
        await this.settingsLink.click();
    }

    async clickNewAssessment() {
        await this.newAssessmentButton.click();
    }

    async clickViewReports() {
        await this.viewReportsButton.click();
    }

    async clickStartRanking() {
        await this.startRankingButton.click();
    }

    async getRecentActivityCount() {
        return await this.activityItems.length;
    }

    async clickNotificationBell() {
        await this.notificationBell.click();
    }

    async getNotificationCount() {
        return await this.notificationCount.getText();
    }

    async isSidebarDisplayed() {
        return await this.sidebar.isDisplayed();
    }

    async isUserMenuDisplayed() {
        return await this.userMenu.isDisplayed();
    }

    async getCurrentUrl() {
        return await browser.getUrl();
    }
}

module.exports = new DashboardPage(); 