// Dashboard module
class DashboardManager {
    constructor() {
        this.teacherDashboardContent = document.getElementById('teacherDashboardContent');
        this.studentDashboardContent = document.getElementById('studentDashboardContent');
        this.dashboardTabs = document.querySelectorAll('.dashboard-tab');
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadDashboardData();
        console.log('Dashboard Manager initialized');
    }
    
    setupEventListeners() {
        // Dashboard tabs
        this.dashboardTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                this.switchDashboardTab(tab.dataset.tab);
            });
        });
        
        // Dashboard action buttons (will be attached after content loads)
        this.attachDashboardActions();
    }
    
    switchDashboardTab(tabId) {
        // Update active tab
        this.dashboardTabs.forEach(t => t.classList.remove('active'));
        document.querySelector(`.dashboard-tab[data-tab="${tabId}"]`)?.classList.add('active');
        
        // Update active content
        document.querySelectorAll('.dashboard-content').forEach(content => {
            content.classList.remove('active');
            if (content.id === `${tabId}-dashboard`) {
                content.classList.add('active');
            }
        });
    }
    
    async loadDashboardData() {
        const user = this.getCurrentUser();
        
        if (!user) {
            // Show login prompt
            this.showLoginPrompt();
            return;
        }
        
        if (user.role === 'teacher') {
            await this.loadTeacherDashboard();
        } else if (user.role === 'student') {
            await this.loadStudentDashboard();
        } else if (user.role === 'parent') {
            await this.loadParentDashboard();
        }
    }
    
    getCurrentUser() {
        // Check if auth manager exists
        if (window.authManager) {
            return window.authManager.getCurrentUser();
        }
        
        // Fallback to localStorage
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }
    
    showLoginPrompt() {
        // For demo purposes, show generic dashboard
        this.loadDemoDashboards();
    }
    
    async loadTeacherDashboard() {
        try {
            // In a real app, you would fetch from your API
            // const response = await fetch('/api/dashboard/teacher');
            // const data = await response.json();
            
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 800));
            
            const dashboardData = {
                pendingReviews: 12,
                averageScore: 84,
                recentSubmissions: [
                    { id: 1, student: 'John Doe', worksheet: 'Math - Fractions', date: 'Today', status: 'pending' },
                    { id: 2, student: 'Jane Smith', worksheet: 'English - Essay', date: 'Yesterday', status: 'graded' },
                    { id: 3, student: 'Bob Johnson', worksheet: 'Science - Solar System', date: '2 days ago', status: 'pending' }
                ],
                classPerformance: [
                    { subject: 'Math', average: 88 },
                    { subject: 'English', average: 82 },
                    { subject: 'Science', average: 85 }
                ]
            };
            
            this.renderTeacherDashboard(dashboardData);
            
        } catch (error) {
            console.error('Error loading teacher dashboard:', error);
            this.renderTeacherDashboardError();
        }
    }
    
    async loadStudentDashboard() {
        try {
            // In a real app, you would fetch from your API
            // const response = await fetch('/api/dashboard/student');
            // const data = await response.json();
            
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 800));
            
            const dashboardData = {
                assignedWorksheets: 3,
                completedWorksheets: 24,
                averageScore: 88,
                recentFeedback: [
                    { worksheet: 'Math - Fractions', feedback: 'Great improvement on fractions!', teacher: 'Ms. Johnson', date: '2 days ago' },
                    { worksheet: 'English - Essay', feedback: 'Check your essay structure for better flow.', teacher: 'Mr. Davis', date: '5 days ago' },
                    { worksheet: 'Science - Cells', feedback: 'Excellent understanding of cell structure.', teacher: 'Dr. Wilson', date: '1 week ago' }
                ],
                upcomingDeadlines: [
                    { worksheet: 'History - Ancient Egypt', due: 'Tomorrow' },
                    { worksheet: 'Math - Algebra', due: 'In 3 days' },
                    { worksheet: 'English - Book Report', due: 'Next week' }
                ]
            };
            
            this.renderStudentDashboard(dashboardData);
            
        } catch (error) {
            console.error('Error loading student dashboard:', error);
            this.renderStudentDashboardError();
        }
    }
    
    async loadParentDashboard() {
        // Similar to student dashboard but with multiple students
        console.log('Loading parent dashboard...');
    }
    
    loadDemoDashboards() {
        // Load demo data for visitors
        const teacherDemoData = {
            pendingReviews: 8,
            averageScore: 79,
            recentSubmissions: [
                { student: 'Demo Student 1', worksheet: 'Demo Worksheet', date: 'Today', status: 'pending' },
                { student: 'Demo Student 2', worksheet: 'Sample Assignment', date: 'Yesterday', status: 'graded' }
            ]
        };
        
        const studentDemoData = {
            assignedWorksheets: 2,
            completedWorksheets: 15,
            averageScore: 85,
            recentFeedback: [
                { worksheet: 'Sample Math', feedback: 'Good work!', teacher: 'Demo Teacher', date: 'Recently' }
            ]
        };
        
        this.renderTeacherDashboard(teacherDemoData);
        this.renderStudentDashboard(studentDemoData);
    }
    
    renderTeacherDashboard(data) {
        if (!this.teacherDashboardContent) return;
        
        this.teacherDashboardContent.innerHTML = `
            <div class="dashboard-card">
                <h4><i class="fas fa-inbox"></i> Pending Reviews</h4>
                <p class="stat-number">${data.pendingReviews}</p>
                <p>worksheets awaiting feedback</p>
                <button class="btn btn-primary review-now-btn" style="margin-top: 15px;">
                    <i class="fas fa-check-circle"></i> Review Now
                </button>
            </div>
            <div class="dashboard-card">
                <h4><i class="fas fa-chart-bar"></i> Class Performance</h4>
                <p class="stat-number">${data.averageScore}%</p>
                <p>average score this month</p>
                <div class="performance-bar" style="background-color: white; height: 10px; border-radius: 5px; margin-top: 15px;">
                    <div class="performance-fill" style="width: ${data.averageScore}%; background-color: var(--success); height: 100%; border-radius: 5px; transition: width 1s;"></div>
                </div>
                <button class="btn btn-outline view-details-btn" style="margin-top: 15px;">
                    <i class="fas fa-chart-line"></i> View Details
                </button>
            </div>
            <div class="dashboard-card">
                <h4><i class="fas fa-clock"></i> Recent Submissions</h4>
                <ul class="submission-list">
                    ${data.recentSubmissions.map(sub => `
                        <li class="submission-item">
                            <div class="submission-info">
                                <strong>${sub.worksheet}</strong>
                                <span class="submission-student">${sub.student}</span>
                            </div>
                            <div class="submission-meta">
                                <span class="submission-date">${sub.date}</span>
                                <span class="submission-status status-${sub.status}">${sub.status}</span>
                            </div>
                        </li>
                    `).join('')}
                </ul>
                <button class="btn btn-outline view-all-btn" style="margin-top: 15px; width: 100%;">
                    <i class="fas fa-list"></i> View All Submissions
                </button>
            </div>
        `;
        
        this.attachDashboardActions();
    }
    
    renderStudentDashboard(data) {
        if (!this.studentDashboardContent) return;
        
        this.studentDashboardContent.innerHTML = `
            <div class="dashboard-card">
                <h4><i class="fas fa-tasks"></i> Assigned Worksheets</h4>
                <p class="stat-number">${data.assignedWorksheets}</p>
                <p>to complete this week</p>
                <button class="btn btn-primary view-worksheets-btn" style="margin-top: 15px;">
                    <i class="fas fa-list"></i> View All
                </button>
            </div>
            <div class="dashboard-card">
                <h4><i class="fas fa-star"></i> Your Progress</h4>
                <p class="stat-number">${data.completedWorksheets}</p>
                <p>worksheets completed</p>
                <p class="stat-number">${data.averageScore}%</p>
                <p>average score</p>
                <button class="btn btn-outline progress-details-btn" style="margin-top: 15px;">
                    <i class="fas fa-chart-line"></i> View Progress
                </button>
            </div>
            <div class="dashboard-card">
                <h4><i class="fas fa-comment-dots"></i> Recent Feedback</h4>
                <div class="feedback-list">
                    ${data.recentFeedback.map(fb => `
                        <div class="feedback-item">
                            <div class="feedback-worksheet">${fb.worksheet}</div>
                            <div class="feedback-text">"${fb.feedback}"</div>
                            <div class="feedback-meta">
                                <span class="feedback-teacher">- ${fb.teacher}</span>
                                <span class="feedback-date">${fb.date}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <button class="btn btn-outline view-feedback-btn" style="margin-top: 15px; width: 100%;">
                    <i class="fas fa-comments"></i> View All Feedback
                </button>
            </div>
        `;
        
        this.attachDashboardActions();
    }
    
    renderTeacherDashboardError() {
        if (!this.teacherDashboardContent) return;
        
        this.teacherDashboardContent.innerHTML = `
            <div class="dashboard-card error-card">
                <h4><i class="fas fa-exclamation-triangle"></i> Error Loading Dashboard</h4>
                <p>Unable to load teacher dashboard data.</p>
                <button class="btn btn-outline retry-btn" id="retryTeacherDashboard">
                    <i class="fas fa-redo"></i> Retry
                </button>
            </div>
        `;
        
        document.getElementById('retryTeacherDashboard')?.addEventListener('click', () => {
            this.loadTeacherDashboard();
        });
    }
    
    renderStudentDashboardError() {
        if (!this.studentDashboardContent) return;
        
        this.studentDashboardContent.innerHTML = `
            <div class="dashboard-card error-card">
                <h4><i class="fas fa-exclamation-triangle"></i> Error Loading Dashboard</h4>
                <p>Unable to load student dashboard data.</p>
                <button class="btn btn-outline retry-btn" id="retryStudentDashboard">
                    <i class="fas fa-redo"></i> Retry
                </button>
            </div>
        `;
        
        document.getElementById('retryStudentDashboard')?.addEventListener('click', () => {
            this.loadStudentDashboard();
        });
    }
    
    attachDashboardActions() {
        // Teacher dashboard actions
        document.querySelector('.review-now-btn')?.addEventListener('click', () => {
            this.handleReviewNow();
        });
        
        document.querySelector('.view-details-btn')?.addEventListener('click', () => {
            this.handleViewDetails();
        });
        
        document.querySelector('.view-all-btn')?.addEventListener('click', () => {
            this.handleViewAllSubmissions();
        });
        
        // Student dashboard actions
        document.querySelector('.view-worksheets-btn')?.addEventListener('click', () => {
            this.handleViewWorksheets();
        });
        
        document.querySelector('.progress-details-btn')?.addEventListener('click', () => {
            this.handleProgressDetails();
        });
        
        document.querySelector('.view-feedback-btn')?.addEventListener('click', () => {
            this.handleViewFeedback();
        });
    }
    
    handleReviewNow() {
        alert('In the full application, this would take you to the review page.');
    }
    
    handleViewDetails() {
        alert('In the full application, this would show detailed performance analytics.');
    }
    
    handleViewAllSubmissions() {
        alert('In the full application, this would show all student submissions.');
    }
    
    handleViewWorksheets() {
        alert('In the full application, this would show all assigned worksheets.');
        // Scroll to worksheets section
        document.getElementById('worksheets')?.scrollIntoView({ behavior: 'smooth' });
    }
    
    handleProgressDetails() {
        alert('In the full application, this would show detailed progress analytics.');
    }
    
    handleViewFeedback() {
        alert('In the full application, this would show all teacher feedback.');
    }
}

// Initialize dashboard manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dashboardManager = new DashboardManager();
});