// Authentication module
class AuthManager {
    constructor() {
        this.authModal = document.getElementById('authModal');
        this.loginBtn = document.getElementById('loginBtn');
        this.signupBtn = document.getElementById('signupBtn');
        this.heroSignupBtn = document.getElementById('heroSignupBtn');
        this.heroLoginBtn = document.getElementById('heroLoginBtn');
        this.closeModal = document.getElementById('closeModal');
        this.loginTypeBtns = document.querySelectorAll('.login-type-btn');
        this.roleOptions = document.querySelectorAll('.role-option');
        this.authForm = document.getElementById('authForm');
        this.signupFields = document.getElementById('signupFields');
        this.submitBtnText = document.getElementById('submitBtnText');
        this.modalTitle = document.getElementById('modalTitle');
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        console.log('Auth Manager initialized');
    }
    
    setupEventListeners() {
        // Modal open buttons
        if (this.loginBtn) {
            this.loginBtn.addEventListener('click', () => this.openModal('login'));
        }
        
        if (this.signupBtn) {
            this.signupBtn.addEventListener('click', () => this.openModal('signup'));
        }
        
        if (this.heroSignupBtn) {
            this.heroSignupBtn.addEventListener('click', () => this.openModal('signup'));
        }
        
        if (this.heroLoginBtn) {
            this.heroLoginBtn.addEventListener('click', () => {
                // For demo purposes
                alert('In the full application, this would play a demo video.');
            });
        }
        
        // Close modal
        if (this.closeModal) {
            this.closeModal.addEventListener('click', () => this.closeAuthModal());
        }
        
        // Click outside modal to close
        if (this.authModal) {
            this.authModal.addEventListener('click', (e) => {
                if (e.target === this.authModal) this.closeAuthModal();
            });
        }
        
        // Login type switching
        this.loginTypeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.loginTypeBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.updateForm(btn.dataset.type);
            });
        });
        
        // Role switching
        this.roleOptions.forEach(option => {
            option.addEventListener('click', () => {
                this.roleOptions.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
            });
        });
        
        // Form submission
        if (this.authForm) {
            this.authForm.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }
    
    openModal(type = 'login') {
        if (this.authModal) {
            this.authModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Set modal type
            const loginTypeSelector = document.getElementById('loginTypeSelector');
            if (loginTypeSelector) {
                const loginTypeBtn = loginTypeSelector.querySelector(`[data-type="${type}"]`);
                loginTypeSelector.querySelectorAll('.login-type-btn').forEach(btn => btn.classList.remove('active'));
                if (loginTypeBtn) {
                    loginTypeBtn.classList.add('active');
                }
            }
            
            this.updateForm(type);
        }
    }
    
    closeAuthModal() {
        if (this.authModal) {
            this.authModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }
    
    updateForm(type) {
        if (type === 'signup') {
            if (this.signupFields) this.signupFields.style.display = 'block';
            if (this.submitBtnText) this.submitBtnText.textContent = 'Create Account';
            if (this.modalTitle) this.modalTitle.textContent = 'Join WorksheetWeb Today';
        } else {
            if (this.signupFields) this.signupFields.style.display = 'none';
            if (this.submitBtnText) this.submitBtnText.textContent = 'Log In';
            if (this.modalTitle) this.modalTitle.textContent = 'Welcome Back to WorksheetWeb';
        }
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        const isSignup = document.querySelector('.login-type-btn[data-type="signup"]')?.classList.contains('active');
        const role = document.querySelector('.role-option.active')?.dataset.role || 'student';
        const email = document.getElementById('email')?.value;
        const password = document.getElementById('password')?.value;
        const fullName = document.getElementById('fullName')?.value;
        const gradeLevel = document.getElementById('gradeLevel')?.value;
        
        // Basic validation
        if (!email || !password) {
            alert('Please fill in all required fields');
            return;
        }
        
        if (isSignup && !fullName) {
            alert('Please enter your full name');
            return;
        }
        
        try {
            if (isSignup) {
                await this.registerUser({ email, password, name: fullName, role, grade_level: gradeLevel });
            } else {
                await this.loginUser({ email, password });
            }
        } catch (error) {
            console.error('Auth error:', error);
            alert(error.message || 'Authentication failed');
        }
    }
    
    async registerUser(userData) {
        // For demo, simulate API call
        console.log('Registering user:', userData);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In a real app, you would call your backend API
        // const response = await fetch('/api/auth/register', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(userData)
        // });
        
        // For demo, simulate success
        const mockUser = {
            id: Date.now(),
            email: userData.email,
            name: userData.name,
            role: userData.role,
            grade_level: userData.grade_level,
            token: 'mock-jwt-token-' + Date.now()
        };
        
        // Store user data
        localStorage.setItem('user', JSON.stringify(mockUser));
        localStorage.setItem('token', mockUser.token);
        
        alert(`Account created successfully! Welcome to WorksheetWeb, ${userData.role}.`);
        this.closeAuthModal();
        
        // Reload page to update UI
        window.location.reload();
    }
    
    async loginUser(credentials) {
        // For demo, simulate API call
        console.log('Logging in user:', credentials);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In a real app, you would call your backend API
        // const response = await fetch('/api/auth/login', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(credentials)
        // });
        
        // For demo, simulate success
        const mockUser = {
            id: 123,
            email: credentials.email,
            name: 'Demo User',
            role: 'student',
            grade_level: '5',
            token: 'mock-jwt-token-' + Date.now()
        };
        
        // Store user data
        localStorage.setItem('user', JSON.stringify(mockUser));
        localStorage.setItem('token', mockUser.token);
        
        alert(`Login successful! Welcome back, ${mockUser.name}.`);
        this.closeAuthModal();
        
        // Reload page to update UI
        window.location.reload();
    }
    
    logout() {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.reload();
    }
    
    isAuthenticated() {
        return !!localStorage.getItem('token');
    }
    
    getCurrentUser() {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }
}

// Initialize auth manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.authManager = new AuthManager();
});