// Initialize Telegram Web App
const tg = window.Telegram.WebApp;

// User Data
let userData = {
    userId: tg.initDataUnsafe?.user?.id || Math.random(),
    firstName: tg.initDataUnsafe?.user?.first_name || 'Player',
    balance: 1000,
    level: 1,
    totalScore: 0,
    tokens: [],
    lastPlayedGame: null,
    playCount: {}
};

// Local Storage
const STORAGE_KEY = 'cryptogamify_user_data';

// Initialize App
function initApp() {
    // Expand app to full height
    tg.expand();
    
    // Set header color
    tg.setHeaderColor('#2196F3');
    
    // Load user data
    loadUserData();
    
    // Update UI
    updateBalance();
    updateLevel();
    
    // Setup form listeners
    setupTokenForm();
    
    // Setup navigation
    setupNavigation();
    
    console.log('App initialized');
}

// Load user data from localStorage
function loadUserData() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        userData = JSON.parse(stored);
    }
}

// Save user data to localStorage
function saveUserData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
}

// Update balance display
function updateBalance() {
    document.getElementById('balance').textContent = userData.balance.toLocaleString();
    document.getElementById('user-score').textContent = userData.totalScore.toLocaleString();
}

// Update level display
function updateLevel() {
    document.getElementById('level').textContent = userData.level;
}

// Add tokens to balance
function addTokens(amount, gameName = null) {
    userData.balance += amount;
    userData.totalScore += amount;
    
    if (gameName) {
        userData.playCount[gameName] = (userData.playCount[gameName] || 0) + 1;
        
        // Level up every 5000 points
        const newLevel = Math.floor(userData.totalScore / 5000) + 1;
        if (newLevel > userData.level) {
            userData.level = newLevel;
            showNotification(`🎉 Level Up! You're now Level ${userData.level}`);
        }
    }
    
    updateBalance();
    updateLevel();
    saveUserData();
    
    // Show floating animation
    showFloatingText(`+${amount}`, 'token');
}

// Show floating text animation
function showFloatingText(text, type = 'token') {
    const el = document.createElement('div');
    el.textContent = text;
    el.style.cssText = `
        position: fixed;
        font-size: 24px;
        font-weight: 700;
        color: #4CAF50;
        pointer-events: none;
        z-index: 9999;
        left: 50%;
        top: 50%;
        transform: translateX(-50%);
    `;
    
    if (type === 'token') {
        el.style.color = '#4CAF50';
    }
    
    document.body.appendChild(el);
    
    // Animate
    let pos = 0;
    const interval = setInterval(() => {
        pos += 2;
        el.style.transform = `translateX(-50%) translateY(-${pos}px)`;
        el.style.opacity = 1 - (pos / 100);
        
        if (pos > 100) {
            clearInterval(interval);
            document.body.removeChild(el);
        }
    }, 10);
}

// Show notification
function showNotification(message, duration = 3000) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        font-weight: 600;
        z-index: 9999;
        box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
        animation: slideUp 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideDown 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, duration);
}

// Start game
function startGame(gameName) {
    const gameContainer = document.getElementById('gameContainer');
    const gameTitle = document.getElementById('gameTitle');
    const gameContent = document.getElementById('gameContent');
    
    gameTitle.textContent = getGameTitle(gameName);
    gameContainer.style.display = 'flex';
    userData.lastPlayedGame = gameName;
    
    // Load game
    if (typeof loadGame === 'function') {
        loadGame(gameName, gameContent);
    }
    
    saveUserData();
}

// Close game
function closeGame() {
    const gameContainer = document.getElementById('gameContainer');
    gameContainer.style.display = 'none';
    document.getElementById('gameContent').innerHTML = '';
}

// Get game title
function getGameTitle(gameName) {
    const titles = {
        'tap': '👆 Tap Master',
        'memory': '🧠 Memory Match',
        'snake': '🐍 Snake Hunt',
        'flappy': '🦅 Flappy Wings'
    };
    return titles[gameName] || 'Game';
}

// Setup token creation form
function setupTokenForm() {
    const form = document.getElementById('tokenForm');
    if (form) {
        form.addEventListener('submit', handleTokenCreation);
        
        // Live preview
        document.getElementById('tokenName').addEventListener('input', (e) => {
            document.getElementById('previewName').textContent = e.target.value || 'Your Token Name';
        });
        
        document.getElementById('tokenSymbol').addEventListener('input', (e) => {
            document.getElementById('previewSymbol').textContent = (e.target.value || 'SYMBOL').toUpperCase();
        });
        
        document.getElementById('tokenSupply').addEventListener('input', (e) => {
            const supply = e.target.value ? parseInt(e.target.value).toLocaleString() : '0';
            document.getElementById('previewSupply').textContent = `Total Supply: ${supply}`;
        });
    }
}

// Handle token creation
function handleTokenCreation(e) {
    e.preventDefault();
    
    const tokenName = document.getElementById('tokenName').value;
    const tokenSymbol = document.getElementById('tokenSymbol').value;
    const tokenSupply = document.getElementById('tokenSupply').value;
    const tokenDecimals = document.getElementById('tokenDecimals').value;
    
    // Check balance
    if (userData.balance < 500) {
        showNotification('❌ Insufficient tokens! Need 500 tokens.');
        return;
    }
    
    // Create token
    const newToken = {
        id: Date.now(),
        name: tokenName,
        symbol: tokenSymbol,
        supply: parseInt(tokenSupply),
        decimals: parseInt(tokenDecimals),
        createdAt: new Date().toISOString(),
        contractAddress: generateContractAddress()
    };
    
    userData.balance -= 500;
    userData.tokens.push(newToken);
    updateBalance();
    saveUserData();
    
    // Show success
    showNotification(`🎉 Token "${tokenName}" created successfully!`);
    closeTokenCreator();
    
    // Log token creation
    console.log('Token created:', newToken);
    
    // Send to Telegram (optional)
    if (typeof tg.sendData === 'function') {
        tg.sendData(JSON.stringify({
            action: 'token_created',
            token: newToken
        }));
    }
}

// Generate contract address
function generateContractAddress() {
    return '0x' + Array.from({length: 40}, () => 
        Math.floor(Math.random() * 16).toString(16)
    ).join('');
}

// Open token creator modal
function openTokenCreator() {
    document.getElementById('tokenModal').style.display = 'flex';
}

// Close token creator modal
function closeTokenCreator() {
    document.getElementById('tokenModal').style.display = 'none';
    document.getElementById('tokenForm').reset();
    document.getElementById('previewName').textContent = 'Your Token Name';
    document.getElementById('previewSymbol').textContent = 'SYMBOL';
    document.getElementById('previewSupply').textContent = 'Total Supply: 0';
}

// Navigation
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function navigateTo(page) {
    console.log('Navigate to:', page);
    
    switch(page) {
        case 'home':
            console.log('Home page');
            break;
        case 'tokens':
            console.log('Tokens page');
            showTokensPage();
            break;
        case 'rewards':
            console.log('Rewards page');
            showRewardsPage();
            break;
        case 'profile':
            console.log('Profile page');
            showProfilePage();
            break;
    }
}

// Show tokens page
function showTokensPage() {
    if (userData.tokens.length === 0) {
        showNotification('No tokens created yet. Create your first token!');
        return;
    }
    
    let message = '🎫 Your Tokens:\n\n';
    userData.tokens.forEach((token, index) => {
        message += `${index + 1}. ${token.name} (${token.symbol})\n`;
        message += `   Supply: ${token.supply}\n`;
        message += `   Contract: ${token.contractAddress.substring(0, 10)}...\n\n`;
    });
    
    tg.showAlert(message);
}

// Show rewards page
function showRewardsPage() {
    const message = `🎁 Rewards & Bonuses\n\nDaily Login: +50 tokens\nFirst Win: +100 tokens\nLevel Up: +250 tokens\nToken Creation: -500 tokens\n\nCurrent Streak: Keep playing daily for bonus!`;
    tg.showAlert(message);
}

// Show profile page
function showProfilePage() {
    const message = `👤 Profile\n\nName: ${userData.firstName}\nLevel: ${userData.level}\nBalance: ${userData.balance}\nTotal Score: ${userData.totalScore}\nTokens Created: ${userData.tokens.length}\nGames Played: ${Object.values(userData.playCount).reduce((a, b) => a + b, 0)}`;
    tg.showAlert(message);
}

// Modal close on outside click
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('tokenModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeTokenCreator();
            }
        });
    }
});

// Handle Telegram back button
tg.onEvent('backButtonClicked', () => {
    const gameContainer = document.getElementById('gameContainer');
    const modal = document.getElementById('tokenModal');
    
    if (gameContainer && gameContainer.style.display !== 'none') {
        closeGame();
    } else if (modal && modal.style.display !== 'none') {
        closeTokenCreator();
    }
});

// Initialize when ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

// Export functions for global use
window.startGame = startGame;
window.closeGame = closeGame;
window.openTokenCreator = openTokenCreator;
window.closeTokenCreator = closeTokenCreator;
window.navigateTo = navigateTo;
window.addTokens = addTokens;
window.showNotification = showNotification;
