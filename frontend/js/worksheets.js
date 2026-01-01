// Worksheets module
class WorksheetManager {
    constructor() {
        this.worksheetsContainer = document.getElementById('worksheetsContainer');
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.loadMoreBtn = document.getElementById('loadMoreBtn');
        this.currentSubject = 'all';
        this.currentPage = 1;
        this.isLoading = false;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        console.log('Worksheet Manager initialized');
    }
    
    setupEventListeners() {
        // Filter buttons
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentSubject = btn.dataset.subject;
                this.currentPage = 1;
                this.loadWorksheets();
            });
        });
        
        // Load more button
        if (this.loadMoreBtn) {
            this.loadMoreBtn.addEventListener('click', () => this.loadMoreWorksheets());
        }
    }
    
    async loadWorksheets() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        this.showLoading();
        
        try {
            // In a real app, you would fetch from your API
            // const response = await fetch(`/api/worksheets?subject=${this.currentSubject}&page=${this.currentPage}`);
            // const data = await response.json();
            
            // For demo, use sample data
            await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
            
            const worksheets = this.getSampleWorksheets();
            this.renderWorksheets(worksheets);
            
        } catch (error) {
            console.error('Error loading worksheets:', error);
            this.showError('Failed to load worksheets. Please try again.');
        } finally {
            this.isLoading = false;
        }
    }
    
    async loadMoreWorksheets() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        this.showLoadMoreLoading();
        
        try {
            // In a real app, you would fetch from your API
            // const response = await fetch(`/api/worksheets?subject=${this.currentSubject}&page=${this.currentPage + 1}`);
            // const data = await response.json();
            
            await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
            
            const moreWorksheets = this.getMoreSampleWorksheets();
            this.appendWorksheets(moreWorksheets);
            
            this.currentPage++;
            
            // Disable load more if no more worksheets
            if (moreWorksheets.length < 8) {
                this.disableLoadMore();
            }
            
        } catch (error) {
            console.error('Error loading more worksheets:', error);
            this.showLoadMoreError();
        } finally {
            this.isLoading = false;
        }
    }
    
    getSampleWorksheets() {
        const allWorksheets = [
            { id: 1, title: "Basic Fractions", subject: "math", level: "Beginner", stage: "Elementary", description: "Learn to identify and compare simple fractions.", tags: ["fractions", "math", "elementary"] },
            { id: 2, title: "Grammar Essentials", subject: "english", level: "Intermediate", stage: "Middle School", description: "Practice with nouns, verbs, and sentence structure.", tags: ["grammar", "english", "middle-school"] },
            { id: 3, title: "Solar System", subject: "science", level: "Beginner", stage: "Elementary", description: "Explore planets and celestial bodies in our solar system.", tags: ["science", "solar-system", "planets"] },
            { id: 4, title: "Algebra Basics", subject: "math", level: "Intermediate", stage: "Middle School", description: "Introduction to variables and simple equations.", tags: ["algebra", "math", "equations"] },
            { id: 5, title: "Creative Writing", subject: "english", level: "Advanced", stage: "High School", description: "Develop storytelling and descriptive writing skills.", tags: ["writing", "english", "creative"] },
            { id: 6, title: "Human Anatomy", subject: "science", level: "Intermediate", stage: "High School", description: "Learn about major organs and body systems.", tags: ["science", "anatomy", "biology"] },
            { id: 7, title: "Ancient Civilizations", subject: "history", level: "Intermediate", stage: "Middle School", description: "Explore early human societies and cultures.", tags: ["history", "ancient", "civilizations"] },
            { id: 8, title: "Geometry Shapes", subject: "math", level: "Beginner", stage: "Elementary", description: "Identify and classify 2D and 3D shapes.", tags: ["math", "geometry", "shapes"] }
        ];
        
        if (this.currentSubject === 'all') {
            return allWorksheets;
        }
        
        return allWorksheets.filter(ws => ws.subject === this.currentSubject);
    }
    
    getMoreSampleWorksheets() {
        // Return some additional worksheets for pagination demo
        return [
            { id: 9, title: "Photosynthesis", subject: "science", level: "Intermediate", stage: "Middle School", description: "Learn how plants convert sunlight into energy.", tags: ["science", "biology", "plants"] },
            { id: 10, title: "Poetry Analysis", subject: "english", level: "Advanced", stage: "High School", description: "Analyze different forms of poetry and literary devices.", tags: ["english", "poetry", "literature"] },
            { id: 11, title: "World War II", subject: "history", level: "Advanced", stage: "High School", description: "Study the causes and effects of World War II.", tags: ["history", "ww2", "war"] },
            { id: 12, title: "Probability", subject: "math", level: "Intermediate", stage: "Middle School", description: "Introduction to probability and statistics.", tags: ["math", "probability", "statistics"] }
        ].filter(ws => this.currentSubject === 'all' || ws.subject === this.currentSubject);
    }
    
    renderWorksheets(worksheets) {
        if (!this.worksheetsContainer) return;
        
        if (worksheets.length === 0) {
            this.worksheetsContainer.innerHTML = `
                <div class="no-worksheets">
                    <i class="fas fa-file-alt" style="font-size: 3rem; color: var(--gray); margin-bottom: 20px;"></i>
                    <h3>No worksheets found</h3>
                    <p>Try selecting a different subject or check back later for new worksheets.</p>
                </div>
            `;
            return;
        }
        
        this.worksheetsContainer.innerHTML = worksheets.map(worksheet => this.createWorksheetCard(worksheet)).join('');
        this.attachWorksheetEventListeners();
    }
    
    appendWorksheets(worksheets) {
        if (!this.worksheetsContainer || worksheets.length === 0) return;
        
        const newCards = worksheets.map(worksheet => this.createWorksheetCard(worksheet)).join('');
        this.worksheetsContainer.insertAdjacentHTML('beforeend', newCards);
        this.attachWorksheetEventListeners();
    }
    
    createWorksheetCard(worksheet) {
        const badgeClass = this.getBadgeClass(worksheet.subject);
        const subjectName = worksheet.subject.charAt(0).toUpperCase() + worksheet.subject.slice(1);
        
        return `
            <div class="worksheet-card" data-id="${worksheet.id}">
                <div class="worksheet-header">
                    <h3>${worksheet.title}</h3>
                </div>
                <div class="worksheet-body">
                    <span class="subject-badge ${badgeClass}">${subjectName}</span>
                    <div class="worksheet-meta">
                        <p><i class="fas fa-chart-line"></i> <strong>Level:</strong> ${worksheet.level}</p>
                        <p><i class="fas fa-graduation-cap"></i> <strong>Stage:</strong> ${worksheet.stage}</p>
                    </div>
                    <p class="worksheet-description">${worksheet.description}</p>
                    <div class="worksheet-tags">
                        ${worksheet.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    <div class="worksheet-actions">
                        <button class="btn btn-outline preview-btn" data-id="${worksheet.id}">
                            <i class="fas fa-eye"></i> Preview
                        </button>
                        <button class="btn btn-primary start-btn" data-id="${worksheet.id}">
                            <i class="fas fa-play"></i> Start
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    getBadgeClass(subject) {
        switch(subject) {
            case 'math': return 'math-badge';
            case 'english': return 'english-badge';
            case 'science': return 'science-badge';
            case 'history': return 'history-badge';
            default: return 'math-badge';
        }
    }
    
    attachWorksheetEventListeners() {
        // Preview buttons
        document.querySelectorAll('.preview-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const worksheetId = e.target.dataset.id || e.target.closest('.preview-btn').dataset.id;
                this.previewWorksheet(worksheetId);
            });
        });
        
        // Start buttons
        document.querySelectorAll('.start-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const worksheetId = e.target.dataset.id || e.target.closest('.start-btn').dataset.id;
                this.startWorksheet(worksheetId);
            });
        });
    }
    
    previewWorksheet(id) {
        alert(`Previewing worksheet #${id}. In the full application, this would show a preview of the worksheet.`);
    }
    
    startWorksheet(id) {
        const user = window.authManager?.getCurrentUser();
        
        if (!user) {
            alert('Please log in to start a worksheet.');
            window.authManager?.openModal('login');
            return;
        }
        
        alert(`Starting worksheet #${id}. In the full application, this would open the worksheet for completion.`);
        // window.location.href = `/worksheet.html?id=${id}`;
    }
    
    showLoading() {
        if (this.worksheetsContainer) {
            this.worksheetsContainer.innerHTML = `
                <div class="loading-spinner">
                    <div class="spinner"></div>
                    <p>Loading worksheets...</p>
                </div>
            `;
        }
    }
    
    showLoadMoreLoading() {
        if (this.loadMoreBtn) {
            const originalText = this.loadMoreBtn.innerHTML;
            this.loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            this.loadMoreBtn.disabled = true;
            
            // Restore after 1.5 seconds (or after API call completes)
            setTimeout(() => {
                this.loadMoreBtn.innerHTML = originalText;
                this.loadMoreBtn.disabled = false;
            }, 1500);
        }
    }
    
    showError(message) {
        if (this.worksheetsContainer) {
            this.worksheetsContainer.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: var(--danger); margin-bottom: 20px;"></i>
                    <h3>Error Loading Worksheets</h3>
                    <p>${message}</p>
                    <button class="btn btn-outline retry-btn" id="retryBtn">
                        <i class="fas fa-redo"></i> Try Again
                    </button>
                </div>
            `;
            
            // Add retry button listener
            document.getElementById('retryBtn')?.addEventListener('click', () => this.loadWorksheets());
        }
    }
    
    showLoadMoreError() {
        if (this.loadMoreBtn) {
            this.loadMoreBtn.innerHTML = '<i class="fas fa-exclamation-circle"></i> Error Loading';
            this.loadMoreBtn.disabled = true;
            
            setTimeout(() => {
                this.loadMoreBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Load More Worksheets';
                this.loadMoreBtn.disabled = false;
            }, 3000);
        }
    }
    
    disableLoadMore() {
        if (this.loadMoreBtn) {
            this.loadMoreBtn.innerHTML = '<i class="fas fa-check"></i> All Worksheets Loaded';
            this.loadMoreBtn.disabled = true;
        }
    }
}

// Initialize worksheet manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.worksheetManager = new WorksheetManager();
});