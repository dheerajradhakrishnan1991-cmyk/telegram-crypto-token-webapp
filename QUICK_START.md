# 🚀 Quick Start Guide

Get CryptoGamify up and running in minutes!

## 5-Minute Setup

### 1. Clone & Install
```bash
git clone https://github.com/dheerajradhakrishnan1991-cmyk/telegram-crypto-token-webapp.git
cd telegram-crypto-token-webapp
npm install
```

### 2. Run Locally
```bash
npm start
# Opens at http://localhost:8000
```

### 3. Deploy (Choose One)

**Vercel (Easiest):**
```bash
npm install -g vercel
vercel
```

**GitHub Pages:**
1. Push to GitHub
2. Settings → Pages → Deploy from main
3. Use the generated URL

**Netlify:**
1. Connect GitHub repo
2. Auto-deploy on push

### 4. Create Telegram Bot
1. Message @BotFather on Telegram
2. Send `/newbot`
3. Follow prompts (choose name and username)
4. **Save your API token**

### 5. Connect to Bot
1. Message @BotFather
2. Send `/setmenubutton`
3. Select your bot
4. Enter your deployment URL
5. Done! 🎉

## File Structure

```
📁 telegram-crypto-token-webapp/
├── 📄 index.html           # Main UI
├── 🎨 styles.css           # Styling
├── ⚙️ app.js               # Core logic
├── 🎮 games.js             # Games
├── 📱 telegram.js          # Telegram integration
├── 📦 package.json         # Dependencies
├── 📖 README.md            # Full documentation
└── 🤖 BOT_SETUP.md         # Bot setup guide
```

## Features Overview

### 🎮 Games (4 Total)
- **Tap Master**: Tap fast for 10 seconds (50 tokens)
- **Memory Match**: Match card pairs (100 tokens)
- **Snake Hunt**: Navigate and collect (150 tokens)
- **Flappy Wings**: Avoid obstacles (200 tokens)

### 💎 Token Creation
- Create custom tokens with custom symbol
- Costs 500 tokens
- Auto-generated contract address
- View all your tokens

### 👤 User System
- Balance tracking
- Leveling system (5000 points per level)
- Leaderboard
- Profile view
- Local data persistence

## Development

### Local Testing
```bash
npm start
# Open http://localhost:8000
```

### Testing with Ngrok
```bash
# Terminal 1: Start server
npm start

# Terminal 2: Create tunnel
ngrok http 8000

# Copy ngrok URL to BotFather /setmenubutton
```

### Browser DevTools
- Press F12 to open Developer Tools
- Check Console for errors
- View LocalStorage: Application tab
- Test responsiveness

## Customization

### Change Colors
Edit `styles.css`:
```css
:root {
    --primary: #2196F3;    /* Your color */
    --accent: #4CAF50;
    --dark: #1f1f1f;
}
```

### Adjust Game Rewards
Edit `games.js`:
```javascript
// Find reward calculations and modify
const reward = Math.floor(gameState.score * 2);  // Tap game
```

### Add New Game
1. Add game card to `index.html`
2. Create game function in `games.js`
3. Add to switch statement in `loadGame()`
4. Test and deploy

## Deployment Checklist

- [ ] Files downloaded/cloned
- [ ] Runs locally without errors
- [ ] Deployed to hosting (Vercel/GitHub Pages/Netlify)
- [ ] Bot created with BotFather
- [ ] API token saved securely
- [ ] Web App URL configured in bot
- [ ] Tested in Telegram app
- [ ] Games working
- [ ] Token creation working
- [ ] Data persisting

## Common Issues

### "Cannot find module" error
```bash
npm install
```

### Port 8000 already in use
```bash
npm start -- --port 8001
```

### Bot not responding
- Check API token is correct
- Verify bot is running
- Try /start command again

### Web App not loading
- Ensure HTTPS (production)
- Check URL in BotFather settings
- Clear browser cache

### Games not working
- Open DevTools (F12)
- Check Console tab for errors
- Clear LocalStorage

## Hosting Comparison

| Platform | Cost | Setup | Features |
|----------|------|-------|----------|
| Vercel   | Free | 2 min | Auto-deploy, CDN |
| GitHub Pages | Free | 5 min | Simple, integrated |
| Netlify  | Free | 3 min | Auto-build, forms |
| Traditional | ~$5/mo | 10 min | Full control |

## Next Steps

1. **Test thoroughly** - Play all games
2. **Share with friends** - Get feedback
3. **Add features** - Check Future Enhancements in README
4. **Backend setup** - Optional for multiplayer
5. **NFT integration** - Real blockchain tokens

## Performance Tips

- Lazy load images (if added)
- Minify CSS/JS for production
- Use service workers for offline
- Compress assets
- Optimize animations

## Mobile Optimization

The app is fully mobile-responsive:
- Touch-friendly buttons
- Swipe controls for games
- Mobile-optimized UI
- Works on all devices

## Security Reminders

🔒 **Important:**
- Never commit `.env` files
- Use environment variables for tokens
- Always use HTTPS in production
- Validate user input
- Keep dependencies updated

## Resources

📚 **Documentation:**
- [Full README](README.md)
- [Bot Setup Guide](BOT_SETUP.md)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Telegram Web Apps](https://core.telegram.org/bots/webapps)

🎮 **Similar Projects:**
- [Gamee](https://t.me/gamee)
- [Hamster Kombat](https://t.me/hamster_kombat_bot)
- [Notcoin](https://t.me/notcoin_bot)

## Support & Help

**Having issues?**
1. Check troubleshooting in README
2. Review BOT_SETUP.md
3. Check browser console (F12)
4. Open GitHub issue with details

## Contributing

Improvements welcome!
1. Fork repository
2. Create feature branch
3. Make changes
4. Submit pull request

## License

MIT License - Free to use and modify

---

## Summary

✅ Clone repo
✅ Run locally
✅ Deploy online
✅ Create bot
✅ Connect to bot
✅ Start playing!

**Questions?** Check README.md or BOT_SETUP.md

**Ready to launch?** Let's go! 🚀💎
