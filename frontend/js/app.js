// Main application initialization
class WorksheetWebApp {
    constructor() {
        this.currentUser = null;
        this.isLoggedIn = false;
        this.currentPage = 1;
        this.worksheetsPerPage = 8;
        this.API_BASE_URL = window.location.hostname === 'localhost' 
            ? 'http://localhost:3001/api' 
            : 'https://worksheetweb-backend.onrender.com/api'; // Change this to your deployed backend URL
        this.init();
    }

    async init() {
        // Check if user is logged in
        this.checkAuthStatus();
        
        // Initialize modules
        this.initNavigation();
        this.initSmoothScrolling();
        this.initEventListeners();
        
        // Load initial data
        await this.loadFeatures();
        await this.loadDashboards();
        await this.loadWorksheets();
        
        console.log('WorksheetWeb App initialized');
    }

    checkAuthStatus() {
        const token = localStorage.getItem('token');
        if (token) {
            this.isLoggedIn = true;
            this.currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            this.updateUIForAuth();
        }
    }

    updateUIForAuth() {
        if (this.isLoggedIn && this.currentUser) {
            const loginBtn = document.getElementById('loginBtn');
            const signupBtn = document.getElementById('signupBtn');
            const heroSignupBtn = document.getElementById('heroSignupBtn');
            
            if (loginBtn) loginBtn.textContent = `Welcome, ${this.currentUser.name || this.currentUser.role}`;
            if (signupBtn) signupBtn.textContent = 'Dashboard';
            if (heroSignupBtn) heroSignupBtn.textContent = 'Go to Dashboard';
            
            // Update event listeners for authenticated state
            this.updateAuthEventListeners();
        }
    }

    updateAuthEventListeners() {
        const loginBtn = document.getElementById('loginBtn');
        const signupBtn = document.getElementById('signupBtn');
        const heroSignupBtn = document.getElementById('heroSignupBtn');
        
        if (loginBtn) {
            loginBtn.onclick = () => {
                this.showDashboard();
            };
        }
        
        if (signupBtn) {
            signupBtn.onclick = () => {
                this.showDashboard();
            };
        }
        
        if (heroSignupBtn) {
            heroSignupBtn.onclick = () => {
                this.showDashboard();
            };
        }
    }

    showDashboard() {
        alert(`Redirecting to ${this.currentUser.role} dashboard...`);
        // In production: window.location.href = '/dashboard.html';
    }

    initNavigation() {
        // Navigation links are handled by smooth scrolling
    }

    initSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    initEventListeners() {
        // Tutorial button
        const tutorialBtn = document.getElementById('tutorialBtn');
        if (tutorialBtn) {
            tutorialBtn.addEventListener('click', () => {
                alert('In the full application, this would open a tutorial video or walkthrough.');
            });
        }

        // Social media icons
        document.querySelectorAll('.social-icon').forEach(icon => {
            icon.addEventListener('click', (e) => {
                const platform = e.target.dataset.platform;
                alert(`This would link to our ${platform} page.`);
            });
        });

        // Privacy and Terms links
        const privacyLink = document.getElementById('privacyLink');
        const termsLink = document.getElementById('termsLink');
        const modalPrivacyLink = document.getElementById('modalPrivacyLink');
        const modalTermsLink = document.getElementById('modalTermsLink');
        
        [privacyLink, modalPrivacyLink].forEach(link => {
            if (link) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    alert('Privacy Policy would be displayed here.');
                });
            }
        });
        
        [termsLink, modalTermsLink].forEach(link => {
            if (link) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    alert('Terms of Service would be displayed here.');
                });
            }
        });

        // Demo button
        const heroLoginBtn = document.getElementById('heroLoginBtn');
        if (heroLoginBtn) {
            heroLoginBtn.addEventListener('click', () => {
                alert('Demo video would play here. In the full application, you would see a walkthrough of the platform.');
            });
        }

        // Dashboard tabs
        const dashboardTabs = document.querySelectorAll('.dashboard-tab');
        dashboardTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabId = tab.dataset.tab;
                
                dashboardTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                document.querySelectorAll('.dashboard-content').forEach(content => {
                    content.classList.remove('active');
                    if (content.id === `${tabId}-dashboard`) {
                        content.classList.add('active');
                    }
                });
            });
        });

        // Load more button
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                this.loadMoreWorksheets();
            });
        }

        // Worksheet filtering
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentPage = 1;
                this.loadWorksheets(btn.dataset.subject);
            });
        });
    }

    async loadFeatures() {
        const features = [
            {
                icon: 'fas fa-lock',
                title: 'Secure Logins',
                description: 'Separate, secure login portals for students and teachers with role-based access controls.'
            },
            {
                icon: 'fas fa-layer-group',
                title: 'Organized Worksheets',
                description: 'Worksheets categorized by educational stage, subject, and difficulty level.'
            },
            {
                icon: 'fas fa-upload',
                title: 'Easy Submission',
                description: 'Students can submit completed worksheets with just a few clicks from any device.'
            },
            {
                icon: 'fas fa-chart-line',
                title: 'Progress Tracking',
                description: 'Both students and teachers can track progress and monitor improvement over time.'
            },
            {
                icon: 'fas fa-comments',
                title: 'Teacher Feedback',
                description: 'Teachers can provide comments, corrections, and encouragement directly on submitted work.'
            },
            {
                icon: 'fas fa-mobile-alt',
                title: 'Fully Responsive',
                description: 'Works seamlessly on smartphones, tablets, and laptops for learning anywhere.'
            }
        ];

        const container = document.getElementById('featuresContainer');
        if (!container) return;

        container.innerHTML = features.map(feature => `
            <div class="feature-card">
                <div class="feature-icon">
                    <i class="${feature.icon}"></i>
                </div>
                <h3>${feature.title}</h3>
                <p>${feature.description}</p>
            </div>
        `).join('');
    }

    async loadDashboards() {
        // Teacher dashboard content
        const teacherDashboard = document.getElementById('teacherDashboardContent');
        if (teacherDashboard) {
            teacherDashboard.innerHTML = `
                <div class="dashboard-card">
                    <h4><i class="fas fa-inbox"></i> Pending Reviews</h4>
                    <p id="pendingCount">Loading...</p>
                    <button class="btn btn-primary" style="margin-top: 15px;" id="reviewBtn">Review Now</button>
                </div>
                <div class="dashboard-card">
                    <h4><i class="fas fa-chart-bar"></i> Class Performance</h4>
                    <p id="classAverage">Loading average...</p>
                    <div style="background-color: white; height: 10px; border-radius: 5px; margin-top: 15px;">
                        <div id="performanceBar" style="width: 0%; background-color: var(--success); height: 100%; border-radius: 5px; transition: width 1s;"></div>
                    </div>
                </div>
                <div class="dashboard-card">
                    <h4><i class="fas fa-clock"></i> Recent Submissions</h4>
                    <ul id="recentSubmissions" style="padding-left: 20px;">
                        <li>Loading...</li>
                    </ul>
                </div>
            `;
            
            // Simulate loading data
            setTimeout(() => {
                document.getElementById('pendingCount').textContent = '12 worksheets awaiting your feedback';
                document.getElementById('classAverage').textContent = 'Average score: 84% this month';
                document.getElementById('performanceBar').style.width = '84%';
                document.getElementById('recentSubmissions').innerHTML = `
                    <li>Math - Fractions (Today)</li>
                    <li>English - Essay (Yesterday)</li>
                    <li>Science - Solar System (2 days ago)</li>
                `;
            }, 1000);
        }

        // Student dashboard content
        const studentDashboard = document.getElementById('studentDashboardContent');
        if (studentDashboard) {
            studentDashboard.innerHTML = `
                <div class="dashboard-card">
                    <h4><i class="fas fa-tasks"></i> Assigned Worksheets</h4>
                    <p id="assignedCount">Loading...</p>
                    <button class="btn btn-primary" style="margin-top: 15px;" id="viewWorksheetsBtn">View All</button>
                </div>
                <div class="dashboard-card">
                    <h4><i class="fas fa-star"></i> Your Progress</h4>
                    <p id="completedCount">Loading...</p>
                    <p id="studentAverage">Loading...</p>
                </div>
                <div class="dashboard-card">
                    <h4><i class="fas fa-comment-dots"></i> Recent Feedback</h4>
                    <div id="recentFeedback">
                        <p>Loading feedback...</p>
                    </div>
                </div>
            `;
            
            // Simulate loading data
            setTimeout(() => {
                document.getElementById('assignedCount').textContent = '3 worksheets to complete this week';
                document.getElementById('completedCount').textContent = 'Completed: 24 worksheets';
                document.getElementById('studentAverage').textContent = 'Average score: 88%';
                document.getElementById('recentFeedback').innerHTML = `
                    <p>"Great improvement on fractions!" - Ms. Johnson</p>
                    <p>"Check your essay structure" - Mr. Davis</p>
                `;
            }, 1000);
        }
    }

    async loadWorksheets(subject = 'all') {
        try {
            const container = document.getElementById('worksheetsContainer');
            if (!container) return;
            
            // Show loading
            container.innerHTML = '<div class="spinner"></div>';
            
            // Try to fetch from API
            try {
                const response = await fetch(`${this.API_BASE_URL}/worksheets?limit=${this.worksheetsPerPage}&page=${this.currentPage}&subject=${subject !== 'all' ? subject : ''}`);
                const data = await response.json();
                
                if (data.worksheets && data.worksheets.length > 0) {
                    this.renderWorksheets(data.worksheets);
                } else {
                    // Fallback to sample data if API fails
                    this.renderSampleWorksheets(subject);
                }
            } catch (error) {
                console.log('Using sample worksheets data');
                this.renderSampleWorksheets(subject);
            }
        } catch (error) {
            console.error('Error loading worksheets:', error);
            this.renderSampleWorksheets(subject);
        }
    }

    renderWorksheets(worksheets) {
        const container = document.getElementById('worksheetsContainer');
        if (!container) return;

        if (worksheets.length === 0) {
            container.innerHTML = '<p class="no-worksheets">No worksheets found. Try a different filter.</p>';
            return;
        }

        container.innerHTML = worksheets.map(worksheet => {
            let badgeClass = '';
            switch(worksheet.subject) {
                case 'math': badgeClass = 'math-badge'; break;
                case 'english': badgeClass = 'english-badge'; break;
                case 'science': badgeClass = 'science-badge'; break;
                case 'history': badgeClass = 'history-badge'; break;
                default: badgeClass = 'math-badge';
            }
            
            return `
                <div class="worksheet-card" data-id="${worksheet.id}">
                    <div class="worksheet-header">
                        <h3>${worksheet.title}</h3>
                        <p>${worksheet.author_name ? `By ${worksheet.author_name}` : ''}</p>
                    </div>
                    <div class="worksheet-body">
                        <span class="subject-badge ${badgeClass}">${worksheet.subject.charAt(0).toUpperCase() + worksheet.subject.slice(1)}</span>
                        <p><strong>Level:</strong> ${worksheet.level}</p>
                        <p><strong>Stage:</strong> ${worksheet.stage}</p>
                        <p>${worksheet.description || 'No description available'}</p>
                        <button class="btn btn-outline view-worksheet-btn" style="margin-top: 15px; width: 100%;" data-id="${worksheet.id}">
                            <i class="fas fa-eye"></i> Preview Worksheet
                        </button>
                    </div>
                </div>
            `;
        }).join('');
        
        // Add event listeners to view buttons
        document.querySelectorAll('.view-worksheet-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const worksheetId = e.target.dataset.id || e.target.closest('.view-worksheet-btn').dataset.id;
                this.viewWorksheet(worksheetId);
            });
        });
    }

    renderSampleWorksheets(subject) {
        const sampleWorksheets = [
            { id: 1, title: "Basic Fractions", subject: "math", level: "Beginner", stage: "Elementary", description: "Learn to identify and compare simple fractions." },
            { id: 2, title: "Grammar Essentials", subject: "english", level: "Intermediate", stage: "Middle School", description: "Practice with nouns, verbs, and sentence structure." },
            { id: 3, title: "Solar System", subject: "science", level: "Beginner", stage: "Elementary", description: "Explore planets and celestial bodies in our solar system." },
            { id: 4, title: "Algebra Basics", subject: "math", level: "Intermediate", stage: "Middle School", description: "Introduction to variables and simple equations." },
            { id: 5, title: "Creative Writing", subject: "english", level: "Advanced", stage: "High School", description: "Develop storytelling and descriptive writing skills." },
            { id: 6, title: "Human Anatomy", subject: "science", level: "Intermediate", stage: "High School", description: "Learn about major organs and body systems." },
            { id: 7, title: "Ancient Civilizations", subject: "history", level: "Intermediate", stage: "Middle School", description: "Explore early human societies and cultures." },
            { id: 8, title: "Geometry Shapes", subject: "math", level: "Beginner", stage: "Elementary", description: "Identify and classify 2D and 3D shapes." }
        ];
        
        const filteredWorksheets = subject === 'all' 
            ? sampleWorksheets 
            : sampleWorksheets.filter(ws => ws.subject === subject);
        
        this.renderWorksheets(filteredWorksheets);
    }

    async loadMoreWorksheets() {
        this.currentPage++;
        const activeFilter = document.querySelector('.filter-btn.active');
        const subject = activeFilter ? activeFilter.dataset.subject : 'all';
        
        try {
            const response = await fetch(`${this.API_BASE_URL}/worksheets?limit=${this.worksheetsPerPage}&page=${this.currentPage}&subject=${subject !== 'all' ? subject : ''}`);
            const data = await response.json();
            
            if (data.worksheets && data.worksheets.length > 0) {
                const container = document.getElementById('worksheetsContainer');
                const newWorksheets = data.worksheets.map(worksheet => {
                    let badgeClass = '';
                    switch(worksheet.subject) {
                        case 'math': badgeClass = 'math-badge'; break;
                        case 'english': badgeClass = 'english-badge'; break;
                        case 'science': badgeClass = 'science-badge'; break;
                        case 'history': badgeClass = 'history-badge'; break;
                        default: badgeClass = 'math-badge';
                    }
                    
                    return `
                        <div class="worksheet-card" data-id="${worksheet.id}">
                            <div class="worksheet-header">
                                <h3>${worksheet.title}</h3>
                                <p>${worksheet.author_name ? `By ${worksheet.author_name}` : ''}</p>
                            </div>
                            <div class="worksheet-body">
                                <span class="subject-badge ${badgeClass}">${worksheet.subject.charAt(0).toUpperCase() + worksheet.subject.slice(1)}</span>
                                <p><strong>Level:</strong> ${worksheet.level}</p>
                                <p><strong>Stage:</strong> ${worksheet.stage}</p>
                                <p>${worksheet.description || 'No description available'}</p>
                                <button class="btn btn-outline view-worksheet-btn" style="margin-top: 15px; width: 100%;" data-id="${worksheet.id}">
                                    <i class="fas fa-eye"></i> Preview Worksheet
                                </button>
                            </div>
                        </div>
                    `;
                }).join('');
                
                container.insertAdjacentHTML('beforeend', newWorksheets);
                
                // Update button text if no more worksheets
                if (data.worksheets.length < this.worksheetsPerPage) {
                    document.getElementById('loadMoreBtn').textContent = 'No More Worksheets';
                    document.getElementById('loadMoreBtn').disabled = true;
                }
            } else {
                document.getElementById('loadMoreBtn').textContent = 'No More Worksheets';
                document.getElementById('loadMoreBtn').disabled = true;
            }
        } catch (error) {
            console.error('Error loading more worksheets:', error);
            document.getElementById('loadMoreBtn').textContent = 'Error Loading';
        }
    }

    viewWorksheet(id) {
        alert(`Opening worksheet ${id}. In the full application, this would show the worksheet content.`);
        // In production: window.location.href = `/worksheet.html?id=${id}`;
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new WorksheetWebApp();
});
