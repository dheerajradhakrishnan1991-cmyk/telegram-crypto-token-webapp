// Telegram Integration Module
const tg = window.Telegram.WebApp;

// Initialize Telegram Web App
function initTelegram() {
    // Expand the app to full screen
    tg.expand();
    
    // Set header color
    tg.setHeaderColor('#2196F3');
    
    // Set back button behavior
    tg.BackButton.show();
    tg.BackButton.onClick(() => {
        handleBackButton();
    });
    
    // Set main button
    setupMainButton();
    
    // Handle closing
    tg.onEvent('themeChanged', updateTheme);
    
    console.log('Telegram initialized:', {
        userId: tg.initDataUnsafe?.user?.id,
        userName: tg.initDataUnsafe?.user?.username,
        firstName: tg.initDataUnsafe?.user?.first_name
    });
}

// Setup main button
function setupMainButton() {
    tg.MainButton.setParams({
        text: 'Create Token',
        color: '#2196F3',
        textColor: '#ffffff'
    });
    
    tg.MainButton.onClick(() => {
        openTokenCreator();
    });
    
    tg.MainButton.show();
}

// Handle back button
function handleBackButton() {
    const gameContainer = document.getElementById('gameContainer');
    const modal = document.getElementById('tokenModal');
    
    if (gameContainer && gameContainer.style.display !== 'none') {
        closeGame();
        tg.BackButton.hide();
    } else if (modal && modal.style.display !== 'none') {
        closeTokenCreator();
        tg.BackButton.hide();
    }
}

// Update theme
function updateTheme() {
    const isDark = tg.colorScheme === 'dark';
    const bgColor = isDark ? '#1a1a2e' : '#f5f5f5';
    document.body.style.backgroundColor = bgColor;
}

// Share token creation
function shareTokenCreation(token) {
    const message = `🎉 I just created a crypto token!\n\n` +
                   `Token: ${token.name} (${token.symbol})\n` +
                   `Supply: ${token.supply}\n` +
                   `Address: ${token.contractAddress}\n\n` +
                   `Join me on CryptoGamify and create your own token! 🚀\n` +
                   `Play games, earn tokens, create your crypto! 💎`;
    
    if (tg.shareToStory) {
        tg.shareToStory(message);
    } else {
        tg.sendData(JSON.stringify({
            action: 'share_token',
            message: message,
            token: token
        }));
    }
}

// Send invitation link
function sendInviteLink() {
    const referralCode = generateReferralCode();
    const message = `Hey! Join me on CryptoGamify! 🎮💎\n\n` +
                   `Earn crypto tokens by playing fun games!\n` +
                   `Use my referral code: ${referralCode}\n` +
                   `Get +500 bonus tokens!\n\n` +
                   `https://t.me/YourBot?startgroup=true`;
    
    tg.sendData(JSON.stringify({
        action: 'send_invite',
        referralCode: referralCode,
        message: message
    }));
}

// Generate referral code
function generateReferralCode() {
    const userId = tg.initDataUnsafe?.user?.id || 0;
    return 'REF_' + userId + '_' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

// Request contact (for onboarding)
function requestContact() {
    tg.requestContact((result) => {
        if (result) {
            userData.phone = result;
            saveUserData();
            showNotification('✅ Contact saved!');
        }
    });
}

// Show game instructions
function showGameInstructions(gameName) {
    const instructions = {
        'tap': '👆 Tap the button as fast as you can for 10 seconds!\nEach tap = 1 point\nReward: 50 tokens',
        'memory': '🧠 Flip cards to find matching pairs!\nEach pair = 10 tokens\nReward: 100 tokens',
        'snake': '🐍 Navigate the snake and eat food!\nEach food = 10 points\nReward: 150 tokens',
        'flappy': '🦅 Avoid the pipes and fly as high as you can!\nEach pipe passed = 10 points\nReward: 200 tokens'
    };
    
    tg.showAlert(instructions[gameName] || 'Game instructions unavailable');
}

// Track user activity
function trackEvent(eventName, eventData = {}) {
    const event = {
        timestamp: new Date().toISOString(),
        userId: tg.initDataUnsafe?.user?.id,
        userName: tg.initDataUnsafe?.user?.username,
        eventName: eventName,
        data: eventData
    };
    
    // Send to backend
    sendToBackend('/api/events/track', event);
    
    console.log('Event tracked:', event);
}

// Send data to backend
function sendToBackend(endpoint, data) {
    const payload = {
        ...data,
        initData: tg.initData
    };
    
    fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(result => {
        console.log('Backend response:', result);
    })
    .catch(error => {
        console.error('Backend error:', error);
    });
}

// Verify data with backend
function verifyTelegramData() {
    const initData = tg.initData;
    
    if (!initData) {
        console.warn('No Telegram init data available');
        return false;
    }
    
    sendToBackend('/api/verify-data', {
        initData: initData
    });
    
    return true;
}

// Get user info
function getUserInfo() {
    return {
        id: tg.initDataUnsafe?.user?.id,
        firstName: tg.initDataUnsafe?.user?.first_name,
        lastName: tg.initDataUnsafe?.user?.last_name,
        username: tg.initDataUnsafe?.user?.username,
        languageCode: tg.initDataUnsafe?.user?.language_code,
        isPremium: tg.initDataUnsafe?.user?.is_premium,
        chatInstance: tg.initDataUnsafe?.chat_instance,
        chatType: tg.initDataUnsafe?.chat_type
    };
}

// Send game result to Telegram
function sendGameResult(gameName, score, reward) {
    const result = {
        game: gameName,
        score: score,
        reward: reward,
        timestamp: new Date().toISOString()
    };
    
    // Use native sharing if available
    if (tg.shareToStory) {
        const message = `🎮 Just scored ${score} points in ${gameName}! Earned ${reward} 💎 tokens on CryptoGamify!`;
        tg.shareToStory(message);
    }
    
    // Send data to bot
    if (tg.sendData) {
        tg.sendData(JSON.stringify({
            action: 'game_result',
            gameResult: result
        }));
    }
    
    trackEvent('game_completed', result);
}

// Request notification permission
function requestNotificationPermission() {
    if ('Notification' in window) {
        if (Notification.permission === 'granted') {
            console.log('Notification permission granted');
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    console.log('Notification permission granted');
                }
            });
        }
    }
}

// Send notification
function sendNotification(title, options = {}) {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, options);
    }
}

// Handle app closing
function handleAppClose() {
    // Save user data
    saveUserData();
    
    // Track session end
    trackEvent('app_closed', {
        balance: userData.balance,
        level: userData.level,
        tokensCreated: userData.tokens.length
    });
    
    // Close the web app
    tg.close();
}

// Setup close button
function setupCloseButton() {
    window.addEventListener('beforeunload', () => {
        handleAppClose();
    });
    
    // Also handle back navigation
    window.addEventListener('popstate', () => {
        handleAppClose();
    });
}

// Animate reward
function animateReward(amount) {
    const elements = document.querySelectorAll('[id="balance"]');
    elements.forEach(el => {
        el.style.animation = 'none';
        setTimeout(() => {
            el.style.animation = 'pulse 0.6s ease-in-out';
        }, 10);
    });
}

// Check if running in Telegram
function isRunningInTelegram() {
    return window.Telegram && window.Telegram.WebApp;
}

// Get platform info
function getPlatformInfo() {
    return {
        platform: tg.platform,
        version: tg.version,
        isExpanded: tg.isExpanded,
        viewportHeight: tg.viewportHeight,
        viewportStableHeight: tg.viewportStableHeight
    };
}

// Setup viewport listener
function setupViewportListener() {
    tg.onEvent('viewportChanged', (data) => {
        console.log('Viewport changed:', data);
        // Adjust UI based on viewport
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.style.maxHeight = (tg.viewportStableHeight - 200) + 'px';
        }
    });
}

// Deep linking
function handleDeepLink(link) {
    console.log('Deep link received:', link);
    
    const params = new URLSearchParams(link);
    const action = params.get('action');
    
    switch(action) {
        case 'play_game':
            const game = params.get('game');
            startGame(game);
            break;
        case 'create_token':
            openTokenCreator();
            break;
        case 'join_tournament':
            const tournamentId = params.get('tournament');
            joinTournament(tournamentId);
            break;
        default:
            console.log('Unknown action:', action);
    }
}

// Join tournament
function joinTournament(tournamentId) {
    showNotification(`🏆 Joined tournament ${tournamentId}!`);
    
    trackEvent('tournament_joined', {
        tournamentId: tournamentId
    });
}

// Request app rating
function requestRating() {
    tg.requestAppRating();
}

// Get clipboard text (if permission granted)
function getClipboardText() {
    if (navigator.clipboard) {
        navigator.clipboard.readText().then(text => {
            console.log('Clipboard text:', text);
            return text;
        }).catch(err => {
            console.error('Failed to read clipboard:', err);
        });
    }
}

// Initialize everything when Telegram is ready
if (isRunningInTelegram()) {
    tg.ready();
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initTelegram();
            setupViewportListener();
            setupCloseButton();
            verifyTelegramData();
            requestNotificationPermission();
        });
    } else {
        initTelegram();
        setupViewportListener();
        setupCloseButton();
        verifyTelegramData();
        requestNotificationPermission();
    }
}

// Export functions
window.telegramModule = {
    tg,
    initTelegram,
    shareTokenCreation,
    sendInviteLink,
    showGameInstructions,
    trackEvent,
    sendGameResult,
    getUserInfo,
    getPlatformInfo,
    isRunningInTelegram,
    handleDeepLink,
    joinTournament,
    requestRating,
    getClipboardText,
    sendNotification,
    animateReward
};
