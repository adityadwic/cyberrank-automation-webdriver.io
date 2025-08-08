const HomePage = require('../pageobjects/HomePage');
const LoginPage = require('../pageobjects/LoginPage');
const DashboardPage = require('../pageobjects/DashboardPage');
const ProfilePage = require('../pageobjects/ProfilePage');

describe('CyberRank Platform - Post-Login Tests', () => {
    before(async () => {
        // Setup test credentials from environment variables
        this.testEmail = process.env.TEST_USER_EMAIL || 'aditya.dwic75@gmail.com';
        this.testPassword = process.env.TEST_USER_PASSWORD || 'Vaditya_12345';
    });
    //     // Navigate to homepage and login before each test
    //     await HomePage.open();
    //     await HomePage.clickLogin();
    //     await LoginPage.login(this.testEmail, this.testPassword);
    //     await DashboardPage.waitForPageLoad();
    // });

    // afterEach(async () => {
    //     // Logout after each test to ensure clean state
    //     try {
    //         await DashboardPage.logout();
    //     } catch (error) {
    //         // If logout fails, refresh the page to clear session
    //         await browser.refresh();
    //     }
    // });

    // describe('Dashboard Overview and Navigation', () => {
    //     it('login success', async () => {
    //         // Navigate to homepage and login before each test
    //         await HomePage.open();
    //         await HomePage.clickLogin();
    //         await LoginPage.login(this.testEmail, this.testPassword);
    //         await DashboardPage.waitForPageLoad();
    //         await expect(DashboardPage.dashboardTitle).toBeDisplayed();
    //     });

    //     // it('should display dashboard with user-specific content', async () => {
    //     //     // Verify dashboard title is displayed
    //     //     await expect(DashboardPage.dashboardTitle).toBeDisplayed();
            
    //     //     // Verify user menu is accessible
    //     //     await expect(DashboardPage.userMenu).toBeDisplayed();

    //     //     // Verify welcome message is button layout dashboard is displayed
    //     //     await expect(DashboardPage.btnLayoutDashboard).toBeDisplayed()  
            
    //     //     // Verify VRM compliance status is displayed
    //     //     await expect(DashboardPage.vrmComplianceStatus).toBeDisplayed()

    //     //     // Verify vendor Rating Grid is displayed
    //     //     await expect(DashboardPage.ratingGrid).toBeDisplayed()
    //     // });

    //     it('Should verify the sidebar navigation with all main sections for title, URL, and link text', async () => {
    //         // Verify sidebar is displayed
    //         await expect(DashboardPage.sidebarNavigation).toBeDisplayed();
            
    //         // Verify "Dashboard" sidebar navigation link
    //         await DashboardPage.navigateToDashboard();
    //         await DashboardPage.validateDashboardNavigation();

    //         // Verify that the page title contains "My Vendors"
    //         await DashboardPage.navigateToMyVendors();
    //         await DashboardPage.validateMyVendorsNavigation();

    //         // Verify that the page title contains "Directory"
    //         await DashboardPage.navigateToDirectory();
    //         await DashboardPage.validateDirectoryNavigation();
    //     });
    // });

    describe('User Management and Profile', () => {
        it('01 - login success', async () => {
            // Navigate to homepage and login before each test
            await HomePage.open();
            await HomePage.clickLogin();
            await LoginPage.login(this.testEmail, this.testPassword);
            await DashboardPage.waitForPageLoad();
            await expect(DashboardPage.dashboardTitle).toBeDisplayed();
        });

        it('02 - should allow user to access user settings', async () => {
            // Navigate to User Settings
            await ProfilePage.navigateToProfile();
            
            // Verify we're on profile page
            const currentUrl = await DashboardPage.getCurrentUrl();
            expect(currentUrl).toContain('usersettings');

            // Verify that the page title is 'User Settings'
            const pageTitle = await browser.getTitle();
            expect(pageTitle).toBe('User Settings');
            
            // Verify profile page has General and Security tabs
            await expect(ProfilePage.generalSettingsTab).toBeDisplayed();
            await expect(ProfilePage.securitySettingsTab).toBeDisplayed();
        });

        it('03 - Should allow user to view General and Security Info', async () => {
            // Navigate to user settings
            await ProfilePage.navigateToProfile();

            // Verify General Settings tab details is displayed
            await expect(ProfilePage.generalSettingsTab).toBeDisplayed();
            await ProfilePage.validateGeneralSettingsTab();

            // Verifiy Security Settings tab is displayed
            await ProfilePage.navigateToSecuritySettings();
            await expect(ProfilePage.securitySettingsTab).toBeDisplayed();
            await ProfilePage.validateSecuritySettingsTab();
        });

        it('04 - should allow user to logout successfully', async () => {
            // Perform logout
            console.log("Prepare for logout");
            await ProfilePage.logoutNavigation();
            
            // Verify we're redirected to login page or homepage
            const currentUrl = await browser.getUrl();
            await expect(currentUrl).toContain("login");
            
            // Verify login form is displayed (if redirected to login)
            if (currentUrl.includes('login')) {
                await expect(LoginPage.emailInput).toBeDisplayed();
            }
        });
    });
    //     it('should allow user to navigate to assessments section', async () => {
    //         // Navigate to assessments
    //         await DashboardPage.navigateToAssessments();
            
    //         // Verify we're on assessments page
    //         const currentUrl = await DashboardPage.getCurrentUrl();
    //         expect(currentUrl).toContain('assessments');
            
    //         // Verify assessments page content
    //         const assessmentsContent = await $('.assessments-content, [data-testid="assessments-content"]');
    //         await expect(assessmentsContent).toBeDisplayed();
    //     });

    //     it('should allow user to create new assessment', async () => {
    //         // Click new assessment button
    //         await DashboardPage.clickNewAssessment();
            
    //         // Verify we're on new assessment page or modal
    //         const currentUrl = await DashboardPage.getCurrentUrl();
    //         expect(currentUrl).toMatch(/(assessment|create|new)/);
            
    //         // Verify assessment creation form or wizard is displayed
    //         const assessmentForm = await $('.assessment-form, [data-testid="assessment-form"], .wizard');
    //         await expect(assessmentForm).toBeDisplayed();
    //     });

    //     it('should display existing assessments if any', async () => {
    //         // Navigate to assessments
    //         await DashboardPage.navigateToAssessments();
            
    //         // Look for existing assessments list
    //         const assessmentsList = await $('.assessments-list, [data-testid="assessments-list"], .assessment-grid');
            
    //         if (await assessmentsList.isDisplayed()) {
    //             // Verify assessments are displayed
    //             const assessmentItems = await $$('.assessment-item, [data-testid="assessment-item"]');
    //             expect(assessmentItems.length).toBeGreaterThanOrEqual(0);
    //         }
    //     });
    // });

    // describe('Core Platform Features - Reports', () => {
    //     it('should allow user to navigate to reports section', async () => {
    //         // Navigate to reports
    //         await DashboardPage.navigateToReports();
            
    //         // Verify we're on reports page
    //         const currentUrl = await DashboardPage.getCurrentUrl();
    //         expect(currentUrl).toContain('reports');
            
    //         // Verify reports page content
    //         const reportsContent = await $('.reports-content, [data-testid="reports-content"]');
    //         await expect(reportsContent).toBeDisplayed();
    //     });

    //     it('should allow user to view reports', async () => {
    //         // Click view reports button
    //         await DashboardPage.clickViewReports();
            
    //         // Verify we're on reports page
    //         const currentUrl = await DashboardPage.getCurrentUrl();
    //         expect(currentUrl).toContain('reports');
            
    //         // Verify reports are displayed
    //         const reportsList = await $('.reports-list, [data-testid="reports-list"], .report-grid');
    //         await expect(reportsList).toBeDisplayed();
    //     });

    //     it('should display report generation options', async () => {
    //         // Navigate to reports
    //         await DashboardPage.navigateToReports();
            
    //         // Look for report generation controls
    //         const generateReportBtn = await $('[data-testid="generate-report"], .generate-report-btn, button:contains("Generate")');
            
    //         if (await generateReportBtn.isDisplayed()) {
    //             await expect(generateReportBtn).toBeDisplayed();
    //         }
    //     });
    // });

    // describe('Core Platform Features - Cyber Ranking', () => {
    //     it('should allow user to start cyber ranking process', async () => {
    //         // Click start ranking button
    //         await DashboardPage.clickStartRanking();
            
    //         // Verify we're on ranking page or wizard
    //         const currentUrl = await DashboardPage.getCurrentUrl();
    //         expect(currentUrl).toMatch(/(ranking|assessment|evaluate)/);
            
    //         // Verify ranking interface is displayed
    //         const rankingInterface = await $('.ranking-interface, [data-testid="ranking-interface"], .assessment-wizard');
    //         await expect(rankingInterface).toBeDisplayed();
    //     });

    //     it('should display cyber ranking section on dashboard', async () => {
    //         // Verify cyber ranking section is present
    //         await expect(DashboardPage.cyberRankingSection).toBeDisplayed();
            
    //         // Verify ranking-related content
    //         const rankingContent = await $('.ranking-content, [data-testid="ranking-content"]');
    //         await expect(rankingContent).toBeDisplayed();
    //     });
    // });

    // describe('Notifications and Activity', () => {
    //     it('should display notification bell with count', async () => {
    //         // Verify notification bell is displayed
    //         await expect(DashboardPage.notificationBell).toBeDisplayed();
            
    //         // Check if notification count is displayed
    //         const notificationCount = await DashboardPage.getNotificationCount();
    //         expect(notificationCount).toBeDefined();
    //     });

    //     it('should allow user to view notifications', async () => {
    //         // Click notification bell
    //         await DashboardPage.clickNotificationBell();
            
    //         // Verify notification dropdown is displayed
    //         await expect(DashboardPage.notificationDropdown).toBeDisplayed();
    //     });

    //     it('should display recent activity section', async () => {
    //         // Verify recent activity section is displayed
    //         await expect(DashboardPage.recentActivitySection).toBeDisplayed();
            
    //         // Verify activity items are present
    //         const activityCount = await DashboardPage.getRecentActivityCount();
    //         expect(activityCount).toBeGreaterThanOrEqual(0);
    //     });
    // });

    // describe('Quick Actions and Workflow', () => {
    //     it('should provide quick action buttons for common tasks', async () => {
    //         // Verify quick action buttons are displayed
    //         await expect(DashboardPage.newAssessmentButton).toBeDisplayed();
    //         await expect(DashboardPage.viewReportsButton).toBeDisplayed();
    //         await expect(DashboardPage.startRankingButton).toBeDisplayed();
    //     });

    //     it('should allow quick navigation between main sections', async () => {
    //         // Test navigation to assessments
    //         await DashboardPage.navigateToAssessments();
    //         let currentUrl = await DashboardPage.getCurrentUrl();
    //         expect(currentUrl).toContain('assessments');
            
    //         // Test navigation to reports
    //         await DashboardPage.navigateToReports();
    //         currentUrl = await DashboardPage.getCurrentUrl();
    //         expect(currentUrl).toContain('reports');
            
    //         // Test navigation back to dashboard
    //         await DashboardPage.dashboardLink.click();
    //         currentUrl = await DashboardPage.getCurrentUrl();
    //         expect(currentUrl).toContain('dashboard');
    //     });
    // });
}); 