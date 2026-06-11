// ============================================
// CONFIGURATION
// ============================================
const API_BASE = '/api/v1';
const API_KEY = 'key1'; // Default API key - change if needed

// ============================================
// STATE MANAGEMENT
// ============================================
let currentShortCode = null;
let currentLongUrl = null;

// ============================================
// ELEMENT SELECTORS
// ============================================
const elements = {
    // Form
    shortenForm: document.getElementById('shortenForm'),
    longUrlInput: document.getElementById('longUrl'),
    customAliasInput: document.getElementById('customAlias'),
    expiresAtInput: document.getElementById('expiresAt'),
    urlError: document.getElementById('urlError'),
    errorAlert: document.getElementById('errorAlert'),
    
    // Buttons
    submitBtn: document.querySelector('.btn-primary'),
    btnText: document.querySelector('.btn-text'),
    btnLoader: document.querySelector('.btn-loader'),
    copyShorCodeBtn: document.getElementById('copyShorCodeBtn'),
    copyUrlBtn: document.getElementById('copyUrlBtn'),
    viewStatsBtn: document.getElementById('viewStatsBtn'),
    resetBtn: document.getElementById('resetBtn'),
    refreshStatsBtn: document.getElementById('refreshStatsBtn'),
    closeStatsBtn: document.getElementById('closeStatsBtn'),
    closeStatsBtn2: document.getElementById('closeStatsBtn2'),
    
    // Result section
    resultSection: document.getElementById('resultSection'),
    resultShortCode: document.getElementById('resultShortCode'),
    resultShortUrl: document.getElementById('resultShortUrl'),
    resultOriginalUrl: document.getElementById('resultOriginalUrl'),
    resultCreatedAt: document.getElementById('resultCreatedAt'),
    successAlert: document.getElementById('successAlert'),
    
    // Stats section
    statsSection: document.getElementById('statsSection'),
    statsShortCode: document.getElementById('statsShortCode'),
    statsClicks: document.getElementById('statsClicks'),
    statsCreatedAt: document.getElementById('statsCreatedAt'),
    statsExpiresAt: document.getElementById('statsExpiresAt'),
    statsRefreshed: document.getElementById('statsRefreshed'),
};

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    setMinDateTime();
});

function initializeEventListeners() {
    elements.shortenForm.addEventListener('submit', handleShortenForm);
    elements.copyShorCodeBtn.addEventListener('click', () => copyToClipboard(elements.resultShortCode.value, 'Short Code'));
    elements.copyUrlBtn.addEventListener('click', () => copyToClipboard(elements.resultShortUrl.value, 'Short URL'));
    elements.viewStatsBtn.addEventListener('click', fetchAndShowStats);
    elements.resetBtn.addEventListener('click', resetForm);
    elements.refreshStatsBtn.addEventListener('click', fetchAndShowStats);
    elements.closeStatsBtn.addEventListener('click', closeStats);
    elements.closeStatsBtn2.addEventListener('click', closeStats);
}

// ============================================
// FORM HANDLING
// ============================================
async function handleShortenForm(e) {
    e.preventDefault();
    
    // Validation
    const longUrl = elements.longUrlInput.value.trim();
    if (!longUrl) {
        showError('Please enter a URL');
        return;
    }
    
    // Validate URL format
    if (!isValidUrl(longUrl)) {
        showError('Please enter a valid URL (must start with http:// or https://)');
        return;
    }
    
    const customAlias = elements.customAliasInput.value.trim() || null;
    const expiresAt = elements.expiresAtInput.value || null;
    
    // Show loading state
    setLoadingState(true);
    hideErrorAlert();
    
    try {
        const response = await fetch(`${API_BASE}/shorten`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`,
            },
            body: JSON.stringify({
                longUrl,
                customAlias: customAlias || undefined,
                expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined,
            }),
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to shorten URL');
        }
        
        const data = await response.json();
        displayResult(data, longUrl);
        hideForm();
        
    } catch (error) {
        console.error('Error:', error);
        showError(error.message || 'An error occurred. Please try again.');
    } finally {
        setLoadingState(false);
    }
}

function isValidUrl(url) {
    try {
        const urlObj = new URL(url);
        return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
        return false;
    }
}

// ============================================
// RESULT DISPLAY
// ============================================
function displayResult(data, longUrl) {
    currentShortCode = data.shortCode;
    currentLongUrl = longUrl;
    
    const shortUrl = data.shortUrl || `${window.location.origin}/${data.shortCode}`;
    const createdAt = formatDate(data.createdAt);
    
    elements.resultShortCode.value = data.shortCode;
    elements.resultShortUrl.value = shortUrl;
    elements.resultOriginalUrl.value = longUrl;
    elements.resultCreatedAt.textContent = createdAt;
    
    // Show result section
    elements.resultSection.classList.add('show');
    elements.successAlert.style.display = 'block';
    
    // Scroll to result
    setTimeout(() => {
        elements.resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
    
    // Auto-copy to clipboard (optional)
    copyToClipboard(shortUrl, 'Short URL', false);
}

// ============================================
// STATISTICS
// ============================================
async function fetchAndShowStats() {
    if (!currentShortCode) {
        showError('No short code available');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/stats/${currentShortCode}`, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
            },
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch statistics');
        }
        
        const data = await response.json();
        displayStats(data);
        
    } catch (error) {
        console.error('Error:', error);
        showError('Failed to fetch statistics: ' + error.message);
    }
}

function displayStats(data) {
    elements.statsShortCode.textContent = data.shortCode;
    elements.statsClicks.textContent = data.totalClicks;
    elements.statsCreatedAt.textContent = formatDate(data.createdAt);
    elements.statsExpiresAt.textContent = data.expiresAt ? formatDate(data.expiresAt) : 'Never';
    elements.statsRefreshed.textContent = formatDate(data.fetchedAt);
    
    // Hide result section
    elements.resultSection.classList.remove('show');
    
    // Show stats section
    elements.statsSection.classList.add('show');
    
    // Scroll to stats
    setTimeout(() => {
        elements.statsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
}

function closeStats() {
    elements.statsSection.classList.remove('show');
    elements.resultSection.classList.add('show');
    elements.resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ============================================
// FORM MANAGEMENT
// ============================================
function resetForm() {
    elements.shortenForm.reset();
    elements.resultSection.classList.remove('show');
    elements.statsSection.classList.remove('show');
    elements.successAlert.style.display = 'none';
    hideErrorAlert();
    currentShortCode = null;
    currentLongUrl = null;
    elements.longUrlInput.focus();
}

function hideForm() {
    // Form stays visible on desktop, but user can scroll or reset
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function showError(message) {
    elements.urlError.textContent = message;
    elements.urlError.classList.add('show');
    setTimeout(() => {
        elements.urlError.classList.remove('show');
    }, 5000);
}

function showErrorAlert(message) {
    elements.errorAlert.textContent = message;
    elements.errorAlert.classList.remove('hidden');
    setTimeout(() => {
        elements.errorAlert.classList.add('hidden');
    }, 5000);
}

function hideErrorAlert() {
    elements.errorAlert.classList.add('hidden');
}

function setLoadingState(isLoading) {
    elements.submitBtn.disabled = isLoading;
    if (isLoading) {
        elements.btnText.classList.add('hidden');
        elements.btnLoader.classList.remove('hidden');
    } else {
        elements.btnText.classList.remove('hidden');
        elements.btnLoader.classList.add('hidden');
    }
}

function copyToClipboard(text, label, showNotification = true) {
    if (!text) return;
    
    navigator.clipboard.writeText(text)
        .then(() => {
            if (showNotification) {
                showNotification && showSuccess(`${label} copied to clipboard!`);
            }
        })
        .catch(() => {
            // Fallback for older browsers
            const input = document.createElement('input');
            input.value = text;
            document.body.appendChild(input);
            input.select();
            document.execCommand('copy');
            document.body.removeChild(input);
            showNotification && showSuccess(`${label} copied to clipboard!`);
        });
}

function showSuccess(message) {
    // Create temporary toast notification
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-weight: 600;
        z-index: 1001;
        animation: slideInLeft 0.3s ease;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideInLeft 0.3s ease reverse';
        setTimeout(() => document.body.removeChild(toast), 300);
    }, 2000);
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    
    try {
        const date = new Date(dateString);
        return date.toLocaleString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZoneName: 'short',
        });
    } catch {
        return dateString;
    }
}

function setMinDateTime() {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    const minDateTime = now.toISOString().slice(0, 16);
    elements.expiresAtInput.min = minDateTime;
}

// ============================================
// MODAL FUNCTIONS
// ============================================
function showAPI() {
    document.getElementById('apiModal').classList.remove('hidden');
}

function showAbout() {
    document.getElementById('aboutModal').classList.remove('hidden');
}

// ============================================
// CONTACT FUNCTION
// ============================================
function contactSupport() {
    window.location.href = 'mailto:obodaisteve@gmail.com?subject=LinkSnip%20Support';
}

// ============================================
// KEYBOARD SHORTCUTS
// ============================================
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + L: Focus on URL input
    if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
        e.preventDefault();
        elements.longUrlInput.focus();
    }
    
    // Escape: Close stats
    if (e.key === 'Escape' && elements.statsSection.classList.contains('show')) {
        closeStats();
    }
});

// ============================================
// TOAST NOTIFICATIONS
// ============================================
function showToast(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6',
    };
    
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${colors[type] || colors.info};
        color: white;
        padding: 14px 20px;
        border-radius: 8px;
        font-weight: 600;
        z-index: 1001;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        animation: slideInLeft 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s ease';
        setTimeout(() => document.body.removeChild(toast), 300);
    }, duration);
}

console.log('🔗 LinkSnip Frontend Loaded');
console.log('📝 API Base:', API_BASE);
console.log('🔑 Using API Key:', API_KEY);
