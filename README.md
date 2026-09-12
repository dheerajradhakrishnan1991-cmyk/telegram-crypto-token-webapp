# 💎 CryptoGamify - Telegram Web App

A fun and engaging Telegram Web App where users can play interactive games, earn crypto tokens, and create their own blockchain tokens! Similar to Gamee, but with crypto rewards and token creation features.

## 🎮 Features

### Games
- **👆 Tap Master** - Tap as fast as you can for 10 seconds! (50 tokens reward)
- **🧠 Memory Match** - Flip cards to find matching pairs! (100 tokens reward)
- **🐍 Snake Hunt** - Navigate and collect food! (150 tokens reward)
- **🦅 Flappy Wings** - Avoid obstacles and fly high! (200 tokens reward)

### Token Creation
- Create custom ERC-20 style tokens with:
  - Custom name and symbol
  - Configurable supply
  - Decimal places
  - Auto-generated contract addresses
- Costs 500 tokens to create
- Track all created tokens

### User System
- **Balance Tracking** - Track your earned tokens
- **Leveling System** - Level up every 5000 points
- **Leaderboard** - Compete with other players
- **Profile** - View your stats and achievements
- **Local Storage** - Persistent user data

### Telegram Integration
- Full Telegram Web App API integration
- User authentication via Telegram
- Share achievements with friends
- Referral system with bonus tokens
- Deep linking support
- Event tracking

## 📁 Project Structure

```
telegram-crypto-token-webapp/
├── index.html          # Main HTML structure
├── styles.css          # Styling and animations
├── app.js              # Core app logic
├── games.js            # Game implementations
├── telegram.js         # Telegram Web App integration
├── README.md           # This file
└── package.json        # Dependencies (optional)
```

## 🚀 Quick Start

### Option 1: Local Development
```bash
# Clone the repository
git clone https://github.com/dheerajradhakrishnan1991-cmyk/telegram-crypto-token-webapp.git
cd telegram-crypto-token-webapp

# Start a local server
python -m http.server 8000
# or
npx http-server

# Open in browser
# http://localhost:8000
```

### Option 2: Deploy to Telegram

1. **Host the files** on a public HTTPS server
2. **Create a Telegram Bot** via BotFather:
   ```
   /newbot
   ```
3. **Set Web App URL** in BotFather:
   ```
   /setmenubutton
   ```
4. **Point to your hosted URL** (must be HTTPS)

### Option 3: Quick Deployment

#### Using Vercel
```bash
npm install -g vercel
vercel
# Follow prompts to deploy
```

#### Using GitHub Pages
1. Push to GitHub
2. Enable GitHub Pages in Settings
3. Use the GitHub Pages URL in Telegram Bot settings

## 📱 How to Use

### Playing Games
1. Tap on any game card
2. Follow the on-screen instructions
3. Earn tokens based on your score
4. Close game to return to home

### Creating Tokens
1. Click "Create Token" button
2. Fill in token details:
   - Token Name (e.g., "MyToken")
   - Symbol (e.g., "MTK")
   - Total Supply
   - Decimal Places
3. Requires 500 tokens
4. Token created with auto-generated address
5. View your tokens in Tokens section

### Inviting Friends
1. Go to Profile
2. Share referral link
3. Friends get +500 bonus tokens
4. You get rewards for referrals

## 🎯 Game Details

### Tap Master
- **Mechanic**: Tap the button as fast as possible
- **Duration**: 10 seconds
- **Scoring**: 1 point per tap
- **Reward**: Taps × 2 tokens

### Memory Match
- **Mechanic**: Flip cards to find matching pairs
- **Pairs**: 6 total pairs
- **Scoring**: 1 match = 10 tokens
- **Reward**: Moves × 10 tokens

### Snake Hunt
- **Mechanic**: Navigate snake and eat food
- **Board**: 30×40 grid
- **Scoring**: 10 points per food
- **Reward**: Score × 5 tokens
- **Controls**: Arrow keys or WASD

### Flappy Wings
- **Mechanic**: Avoid pipes, fly as high as possible
- **Scoring**: 10 points per pipe
- **Reward**: Score × 3 tokens
- **Controls**: Click/Tap to flap

## 💾 Data Structure

### User Data
```javascript
{
  userId: number,
  firstName: string,
  balance: number,
  level: number,
  totalScore: number,
  tokens: Array,
  playCount: Object,
  lastPlayedGame: string
}
```

### Token Data
```javascript
{
  id: number,
  name: string,
  symbol: string,
  supply: number,
  decimals: number,
  createdAt: string,
  contractAddress: string
}
```

## 🔐 Security

- ✅ Uses Telegram Web App secure authentication
- ✅ Data verified with Telegram backend
- ✅ LocalStorage for client-side persistence
- ✅ HTTPS only for production
- ⚠️ Token creation is simulated (not real blockchain)

## 🔗 Telegram Bot Setup

### Create Bot with Inline Keyboard
```python
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler

async def start(update: Update, context):
    keyboard = [[
        InlineKeyboardButton("Play Now", web_app={
            "url": "https://your-domain.com"
        })
    ]]
    reply_markup = InlineKeyboardMarkup(keyboard)
    await update.message.reply_text(
        "Welcome to CryptoGamify! 🎮💎",
        reply_markup=reply_markup
    )

# Setup handlers
application = Application.builder().token("YOUR_TOKEN").build()
application.add_handler(CommandHandler("start", start))
application.run_polling()
```

## 📊 API Endpoints (Optional Backend)

```
POST /api/verify-data          # Verify Telegram initData
POST /api/events/track         # Track user events
POST /api/tokens/create        # Create token (backend validation)
POST /api/leaderboard/update   # Update leaderboard
GET  /api/leaderboard          # Get leaderboard
```

## 🎨 Customization

### Colors
Edit `styles.css` - CSS variables section:
```css
:root {
    --primary: #2196F3;      /* Blue */
    --secondary: #FF9800;    /* Orange */
    --accent: #4CAF50;       /* Green */
    --dark: #1f1f1f;         /* Dark bg */
}
```

### Games
- Edit game rewards in `games.js`
- Modify game mechanics in respective functions
- Add new games by following the pattern

### UI
- Modify layouts in `index.html`
- Adjust animations in `styles.css`
- Change colors and fonts

## 🧪 Testing

### Testing Locally
```bash
# Open Developer Console (F12)
# Check for errors
# Test game mechanics
# Verify storage persistence
```

### Testing in Telegram
1. Use BotFather to create test bot
2. Set Web App URL to local ngrok tunnel:
   ```bash
   ngrok http 8000
   ```
3. Update bot settings with ngrok URL
4. Test in Telegram app

## 📈 Future Enhancements

- [ ] Real blockchain integration (Web3)
- [ ] Multiplayer gaming modes
- [ ] NFT creation
- [ ] Tournament system
- [ ] Daily challenges
- [ ] Achievements/Badges
- [ ] In-app marketplace
- [ ] Social features (guilds)
- [ ] Mobile app version
- [ ] Backend persistence

## 🐛 Troubleshooting

### App not loading in Telegram
- Ensure HTTPS is used
- Check bot is properly configured
- Verify Web App URL is correct

### Games not working
- Clear browser cache
- Check console for errors (F12)
- Ensure JavaScript is enabled

### Data not saving
- Check LocalStorage is enabled
- Verify browser allows storage
- Check browser storage quota

### Telegram API not responding
- Verify initData is present
- Check Telegram connection
- Ensure app is opened from Telegram

## 📝 Browser Compatibility

| Browser | Support |
|---------|---------|
| Chrome  | ✅ Full |
| Firefox | ✅ Full |
| Safari  | ✅ Full |
| Telegram WebView | ✅ Full |
| Opera   | ✅ Full |

## 📄 License

MIT License - Feel free to use for personal and commercial projects

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📞 Support

For issues and questions:
- Open GitHub Issue
- Check existing issues
- Provide detailed reproduction steps

## 🎉 Credits

Created by: **Dheeraj Radhakrishnan**  
Inspired by: **Gamee** (Telegram game platform)  
Built with: **HTML5, CSS3, JavaScript, Telegram Web App API**

## 🚀 Getting Started with Telegram Bot

### Step 1: Create Bot
```
Message @BotFather on Telegram
/newbot
Follow prompts
Get your API token
```

### Step 2: Deploy App
- Choose hosting platform (Vercel, Netlify, GitHub Pages, etc.)
- Deploy the files
- Get your HTTPS URL

### Step 3: Set Web App
```
Message @BotFather
/setmenubutton
Select your bot
Set Web App URL to your deployment URL
```

### Step 4: Test
- Open bot in Telegram
- Click menu button
- Should load your web app

## 📊 Statistics Tracking

The app tracks:
- Games played
- Tokens earned
- Tokens created
- User level progression
- Session duration
- Daily activity

All data stored locally in browser using LocalStorage.

---

**Happy Gaming! 🎮💎**

For the latest updates and issues, visit: [GitHub Repository](https://github.com/dheerajradhakrishnan1991-cmyk/telegram-crypto-token-webapp)
