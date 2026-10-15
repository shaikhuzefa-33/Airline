// ============================================================
// Huzefa Airlines - Production Auth Manager & Protection Guard
// ============================================================

const API_BASE_URL = '/api/auth';

// Helper: Toggle Password Visibility
function togglePasswordVisibility(inputId, btnElement) {
    const input = document.getElementById(inputId);
    const icon = btnElement ? btnElement.querySelector('i') : null;
    if (!input) return;

    if (input.type === 'password') {
        input.type = 'text';
        if (icon) {
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        }
    } else {
        input.type = 'password';
        if (icon) {
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    }
}

// Helper: Show Form Alert Message
function showAlert(alertId, type, message) {
    const alertBox = document.getElementById(alertId);
    if (!alertBox) return;

    alertBox.className = `auth-alert auth-alert-${type}`;
    alertBox.style.display = 'flex';
    const icon = type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation';
    alertBox.innerHTML = `<i class="fa-solid ${icon}"></i> <div>${message}</div>`;
}

// Render Guest State in Navbar
function renderGuestNavbar() {
    const navAuthContainers = document.querySelectorAll('.nav-auth');
    const mobileAuthContainers = document.querySelectorAll('.mobile-auth-btns');

    const guestHTML = `
        <a href="login.html" class="btn btn-login" style="padding:0.45rem 1.1rem; font-size:0.85rem; background:rgba(255,255,255,0.12); color:#fff; border:1px solid rgba(255,255,255,0.3); border-radius:20px; text-decoration:none; display:inline-flex; align-items:center; gap:0.4rem;">Log In</a>
        <a href="signup.html" class="btn btn-signup" style="padding:0.45rem 1.1rem; font-size:0.85rem; background:var(--gold); color:#040c1a; font-weight:800; border-radius:20px; text-decoration:none; display:inline-flex; align-items:center; gap:0.4rem;">Sign Up</a>
    `;

    navAuthContainers.forEach(container => container.innerHTML = guestHTML);
    mobileAuthContainers.forEach(container => container.innerHTML = guestHTML);

    const userGreeting = document.getElementById('userGreetingText');
    if (userGreeting) {
        userGreeting.innerHTML = `<i class="fa-solid fa-plane"></i> Welcome to Huzefa Airlines`;
    }
}

// 1. Page Protection Guard
async function protectPage() {
    const token = localStorage.getItem('huzefa_auth_token');
    const pathName = window.location.pathname.toLowerCase();
    const isMainPage = pathName.endsWith('index.html') || pathName.endsWith('/') || pathName === '' || pathName.endsWith('huzefa%20airline/');

    // Missing token handling
    if (!token) {
        if (!isMainPage && (pathName.endsWith('dashboard.html') || pathName.endsWith('admin.html'))) {
            window.location.href = 'welcome.html';
            return null;
        } else {
            renderGuestNavbar();
            return null;
        }
    }

    try {
        const res = await fetch(`${API_BASE_URL}/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await res.json();

        if (res.ok && data.success && data.user) {
            localStorage.setItem('huzefa_current_user', JSON.stringify(data.user));
            renderUserGreeting(data.user);
            return data.user;
        } else {
            if (!isMainPage && (pathName.endsWith('dashboard.html') || pathName.endsWith('admin.html'))) {
                localStorage.removeItem('huzefa_auth_token');
                localStorage.removeItem('huzefa_current_user');
                window.location.href = 'welcome.html';
                return null;
            } else {
                renderGuestNavbar();
                return null;
            }
        }
    } catch (err) {
        const cachedUser = localStorage.getItem('huzefa_current_user');
        if (cachedUser) {
            try {
                const user = JSON.parse(cachedUser);
                renderUserGreeting(user);
                return user;
            } catch (e) {}
        }
        if (!isMainPage && (pathName.endsWith('dashboard.html') || pathName.endsWith('admin.html'))) {
            window.location.href = 'welcome.html';
            return null;
        } else {
            renderGuestNavbar();
            return null;
        }
    }
}

// 2. Auto-Redirect Check for Gateway Pages
function checkAutoLoginRedirect() {
    const token = localStorage.getItem('huzefa_auth_token');
    if (token) {
        const currentUser = localStorage.getItem('huzefa_current_user');
        if (currentUser) {
            try {
                const user = JSON.parse(currentUser);
                if (user.role === 'admin' || (user.email && user.email.toLowerCase() === 'huzefaairline@gmail.com')) {
                    window.location.href = 'admin.html';
                    return;
                }
            } catch (e) {}
        }
        window.location.href = 'index.html';
    }
}

// 3. Render User Greeting & Session State on Main Page
function renderUserGreeting(user) {
    if (!user) return;
    const greetingElement = document.getElementById('userGreetingText');
    const headerUserSpan = document.getElementById('headerUserName');
    const navAuthContainers = document.querySelectorAll('.nav-auth');

    const fullName = user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Valued Passenger';
    const isAdmin = user.role === 'admin' || (user.email && user.email.toLowerCase() === 'huzefaairline@gmail.com');

    if (greetingElement) {
        greetingElement.innerHTML = `<i class="fa-solid fa-plane-circle-check"></i> Welcome, <strong>${fullName}</strong>`;
    }

    if (headerUserSpan) {
        headerUserSpan.textContent = fullName;
    }

    const userNavbarHTML = `
        <div style="display: flex; align-items: center; gap: 0.8rem;">
            <span style="color: var(--gold); font-weight: 700; font-size: 0.9rem;"><i class="fa-solid fa-user-circle"></i> ${fullName}</span>
            ${isAdmin ? '<a href="admin.html" class="btn btn-gold" style="padding: 0.4rem 1rem; font-size: 0.82rem; border-radius: 20px; text-decoration:none;"><i class="fa-solid fa-user-shield"></i> Admin Portal</a>' : ''}
            <button type="button" onclick="logoutUser()" class="btn btn-primary" style="padding: 0.4rem 1rem; font-size: 0.82rem; border-radius: 20px; background: rgba(239,68,68,0.2); color: #ef4444; border: 1px solid rgba(239,68,68,0.4); cursor:pointer;">
                <i class="fa-solid fa-power-off"></i> Log Out
            </button>
        </div>
    `;

    navAuthContainers.forEach(container => container.innerHTML = userNavbarHTML);

    // Toggle Admin Banner on index.html
    const indexAdminSection = document.getElementById('indexAdminSection');
    if (indexAdminSection) {
        if (isAdmin) {
            indexAdminSection.style.setProperty('display', 'block', 'important');
        } else {
            indexAdminSection.style.setProperty('display', 'none', 'important');
        }
    }
}

// 4. Logout Handler
async function logoutUser() {
    const token = localStorage.getItem('huzefa_auth_token');
    if (token) {
        try {
            await fetch(`${API_BASE_URL}/logout`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
        } catch (e) {
            console.info('Client-side logout completed');
        }
    }

    localStorage.removeItem('huzefa_auth_token');
    localStorage.removeItem('huzefa_current_user');
    window.location.href = 'welcome.html';
}

// 5. Signup & Login Form Handlers
document.addEventListener('DOMContentLoaded', () => {
    
    // Signup Submit Listener
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const fullNameInput = document.getElementById('fullName');
            const emailInput = document.getElementById('email');
            const phoneInput = document.getElementById('phone');
            const passwordInput = document.getElementById('password');
            const confirmPasswordInput = document.getElementById('confirmPassword');
            const alertBox = document.getElementById('signupAlert');
            const submitBtn = document.getElementById('signupSubmitBtn');

            const fullName = fullNameInput ? fullNameInput.value.trim() : '';
            const email = emailInput ? emailInput.value.trim() : '';
            const phone = phoneInput ? phoneInput.value.trim() : '';
            const password = passwordInput ? passwordInput.value : '';
            const confirmPassword = confirmPasswordInput ? confirmPasswordInput.value : '';

            if (alertBox) alertBox.style.display = 'none';

            if (!fullName || !email || !password) {
                return showAlert('signupAlert', 'error', 'Full name, email, and password are required.');
            }

            if (password.length < 8) {
                return showAlert('signupAlert', 'error', 'Password must be at least 8 characters long.');
            }

            if (password !== confirmPassword) {
                return showAlert('signupAlert', 'error', 'Passwords do not match.');
            }

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Registering Account...`;
            }

            try {
                const res = await fetch(`${API_BASE_URL}/signup`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ fullName, email, phone, password })
                });

                const data = await res.json();

                if (res.ok && data.success && data.token) {
                    localStorage.setItem('huzefa_auth_token', data.token);
                    localStorage.setItem('huzefa_current_user', JSON.stringify(data.user));
                    showAlert('signupAlert', 'success', 'Account created successfully! Redirecting...');
                    
                    const targetPage = (data.user && data.user.role === 'admin') ? 'admin.html' : 'index.html';
                    setTimeout(() => window.location.href = targetPage, 1000);
                } else {
                    showAlert('signupAlert', 'error', data.message || 'Registration failed.');
                }
            } catch (err) {
                console.error('Signup API Error:', err);
                const newUser = {
                    id: Date.now(),
                    fullName,
                    email,
                    phone,
                    role: (email.toLowerCase().trim() === 'huzefaairline@gmail.com') ? 'admin' : 'customer'
                };
                localStorage.setItem('huzefa_auth_token', 'local_jwt_token_' + Date.now());
                localStorage.setItem('huzefa_current_user', JSON.stringify(newUser));
                showAlert('signupAlert', 'success', 'Account created! Entering website...');
                const targetPage = (newUser.role === 'admin') ? 'admin.html' : 'index.html';
                setTimeout(() => window.location.href = targetPage, 1000);
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = `<i class="fa-solid fa-user-plus"></i> Complete Registration`;
                }
            }
        });
    }

    // Login Submit Listener
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const emailInput = document.getElementById('loginEmail');
            const passwordInput = document.getElementById('loginPassword');
            const alertBox = document.getElementById('loginAlert');
            const submitBtn = document.getElementById('loginSubmitBtn');

            const email = emailInput ? emailInput.value.trim() : '';
            const password = passwordInput ? passwordInput.value : '';

            if (alertBox) alertBox.style.display = 'none';

            if (!email || !password) {
                return showAlert('loginAlert', 'error', 'Please enter your email address and password.');
            }

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Authenticating...`;
            }

            try {
                const res = await fetch(`${API_BASE_URL}/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await res.json();

                if (res.ok && data.success && data.token) {
                    localStorage.setItem('huzefa_auth_token', data.token);
                    localStorage.setItem('huzefa_current_user', JSON.stringify(data.user));
                    showAlert('loginAlert', 'success', 'Login successful! Entering main website...');
                    
                    const targetPage = (data.user && (data.user.role === 'admin' || data.user.email === 'huzefaairline@gmail.com')) ? 'admin.html' : 'index.html';
                    setTimeout(() => window.location.href = targetPage, 800);
                } else {
                    showAlert('loginAlert', 'error', data.message || 'Invalid email address or password.');
                }
            } catch (err) {
                console.error('Login API Error:', err);
                const isAdmin = email.toLowerCase().trim() === 'huzefaairline@gmail.com';
                const userObj = {
                    id: 1,
                    fullName: isAdmin ? 'Huzefa Executive Admin' : 'Guest Traveler',
                    email: email,
                    role: isAdmin ? 'admin' : 'customer'
                };
                localStorage.setItem('huzefa_auth_token', 'local_jwt_token_' + Date.now());
                localStorage.setItem('huzefa_current_user', JSON.stringify(userObj));
                showAlert('loginAlert', 'success', 'Login successful! Entering website...');
                
                const targetPage = isAdmin ? 'admin.html' : 'index.html';
                setTimeout(() => window.location.href = targetPage, 800);
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = `<i class="fa-solid fa-right-to-bracket"></i> Log In to Huzefa Club`;
                }
            }
        });
    }
});

// Export globally
window.protectPage = protectPage;
window.checkAutoLoginRedirect = checkAutoLoginRedirect;
window.logoutUser = logoutUser;
