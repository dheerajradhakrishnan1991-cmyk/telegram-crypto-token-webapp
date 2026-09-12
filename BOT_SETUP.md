# 🤖 Telegram Bot Setup Guide

A complete guide to set up your CryptoGamify Telegram Bot and Web App.

## Prerequisites

- Telegram account
- Domain with HTTPS (for production)
- Basic knowledge of Telegram Bot API
- Python 3.8+ (for bot backend, optional)
- Node.js (for deployment, optional)

## Step 1: Create Bot with BotFather

### Option A: Using Telegram App

1. Open Telegram and search for **@BotFather**
2. Start the chat and send `/newbot`
3. Follow the prompts:
   - Choose a name for your bot (e.g., "CryptoGamify Bot")
   - Choose a username (must end with "bot", e.g., "cryptogamifybot")
4. **Save your API Token** - Keep this secret!

Example response:
```
Done! Congratulations on your new bot. You will find it at t.me/cryptogamifybot. You can now add a description, about section and profile picture for your bot, see /help for a list of commands. By the way, when you've finished creating your cool bot, ping our Bot Support if you want a better username for the bot. Just make sure the bot is fully operational before we do any changes.

Use this token to access the HTTP API:
123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11

Keep your token secure and store it safely, it can be used by anyone to control your bot.
```

## Step 2: Deploy the Web App

Choose your deployment platform:

### Option A: Vercel (Recommended - Easiest)

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   cd telegram-crypto-token-webapp
   vercel
   ```

3. Follow the prompts and get your deployment URL (e.g., `https://cryptogamify.vercel.app`)

### Option B: GitHub Pages

1. Push your repo to GitHub
2. Go to Settings → Pages
3. Select "Deploy from a branch"
4. Choose main branch
5. Get your URL (e.g., `https://username.github.io/telegram-crypto-token-webapp`)

### Option C: Netlify

1. Connect your GitHub repo
2. Set build command: (leave empty)
3. Set publish directory: `/`
4. Deploy
5. Get your URL

### Option D: Traditional Hosting

1. Upload files via FTP to your hosting
2. Ensure HTTPS is enabled
3. Get your URL (e.g., `https://yourdomain.com/cryptogamify`)

## Step 3: Configure Bot Web App

### Send Commands to BotFather

1. Message @BotFather
2. Send `/setmenubutton`
3. Select your bot
4. Send your Web App URL
5. Confirm

Alternative: Send each command individually:

```
/setmenubutton
- Select bot
- Web App
- https://your-domain.com
```

### Full Configuration Commands

```
/setcommands
/start - Play games and earn tokens
/tokens - View your created tokens
/profile - View your profile
/leaderboard - View top players
/help - Get help

/setdescription
CryptoGamify - Play games, earn tokens, create crypto! 🎮💎

/setshortdescription
Play games and earn crypto tokens!

/setabouttext
Join CryptoGamify and start earning! Play fun games, collect tokens, and create your own cryptocurrency. Similar to Gamee but with crypto rewards.
```

## Step 4: Optional - Create Menu Button

Send to @BotFather:
```
/setmenubutton
```

Select your bot and set:
- Text: "🎮 Play Game" or "Open App"
- Web App URL: Your deployment URL

## Step 5: Optional - Set Bot Commands

```python
# Python example
from telegram import BotCommand
from telegram.ext import Application

commands = [
    BotCommand("start", "Start playing"),
    BotCommand("play", "Play games"),
    BotCommand("tokens", "View your tokens"),
    BotCommand("profile", "View profile"),
    BotCommand("help", "Get help"),
]

application = Application.builder().token("YOUR_TOKEN").build()
application.bot.set_my_commands(commands)
```

## Step 6: Backend Setup (Optional but Recommended)

### Simple Python Bot Backend

Create `bot.py`:

```python
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler, ContextTypes
import os

# Your Web App URL
WEB_APP_URL = "https://your-domain.com"

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Send message with Web App button"""
    keyboard = [[
        InlineKeyboardButton("🎮 Play Now", web_app={"url": WEB_APP_URL})
    ]]
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    await update.message.reply_text(
        "Welcome to CryptoGamify! 🎮💎\n\n"
        "Play exciting games and earn crypto tokens!\n"
        "Create your own tokens and compete with friends.\n\n"
        "Tap the button below to start playing!",
        reply_markup=reply_markup
    )

async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Send help message"""
    help_text = """
    CryptoGamify Help 🎮

    Available Commands:
    /start - Open the game
    /help - Show this help message
    /stats - View your statistics

    How to Play:
    1. Tap 'Play Now' to open the app
    2. Select a game
    3. Earn tokens based on your score
    4. Use 500 tokens to create your own crypto token
    5. Share your achievements with friends!

    Games Available:
    👆 Tap Master - Tap as fast as you can
    🧠 Memory Match - Find matching pairs
    🐍 Snake Hunt - Navigate and collect food
    🦅 Flappy Wings - Avoid obstacles

    Questions? Contact @CryptoGamify
    """
    await update.message.reply_text(help_text)

def main():
    """Start the bot"""
    # Get token from environment
    token = os.getenv("TELEGRAM_BOT_TOKEN")
    if not token:
        raise ValueError("TELEGRAM_BOT_TOKEN not set in environment")
    
    # Create application
    application = Application.builder().token(token).build()
    
    # Add handlers
    application.add_handler(CommandHandler("start", start))
    application.add_handler(CommandHandler("help", help_command))
    
    # Start bot
    application.run_polling()

if __name__ == '__main__':
    main()
```

Install dependencies:
```bash
pip install python-telegram-bot
```

Run:
```bash
export TELEGRAM_BOT_TOKEN="YOUR_TOKEN_HERE"
python bot.py
```

### Node.js Bot Example

Create `bot.js`:

```javascript
const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TELEGRAM_BOT_TOKEN;
const webAppUrl = process.env.WEB_APP_URL || 'https://your-domain.com';

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    
    const keyboard = {
        inline_keyboard: [[
            {
                text: '🎮 Play Now',
                web_app: { url: webAppUrl }
            }
        ]]
    };
    
    bot.sendMessage(chatId,
        'Welcome to CryptoGamify! 🎮💎\n\n' +
        'Play exciting games and earn crypto tokens!\n' +
        'Create your own tokens and compete with friends.\n\n' +
        'Tap the button below to start playing!',
        { reply_markup: keyboard }
    );
});

bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId,
        'CryptoGamify Help 🎮\n\n' +
        'Available Commands:\n' +
        '/start - Open the game\n' +
        '/help - Show this help\n\n' +
        'Games: Tap Master, Memory Match, Snake Hunt, Flappy Wings'
    );
});

console.log('Bot is running...');
```

Install dependencies:
```bash
npm install node-telegram-bot-api
```

Run:
```bash
export TELEGRAM_BOT_TOKEN="YOUR_TOKEN_HERE"
node bot.js
```

## Step 7: Deploy Backend (Optional)

### Using Heroku

1. Install Heroku CLI
2. Create `Procfile`:
   ```
   web: python bot.py
   ```
3. Deploy:
   ```bash
   heroku login
   heroku create your-app-name
   heroku config:set TELEGRAM_BOT_TOKEN="YOUR_TOKEN"
   heroku config:set WEB_APP_URL="https://your-domain.com"
   git push heroku main
   ```

### Using Railway

1. Connect GitHub repo to Railway
2. Set environment variables:
   - `TELEGRAM_BOT_TOKEN`
   - `WEB_APP_URL`
3. Deploy

## Testing Your Bot

### Test in Telegram

1. Search for your bot on Telegram (e.g., @cryptogamifybot)
2. Send `/start`
3. Should see "Play Now" button
4. Click button to open Web App
5. Test games and token creation

### Test Locally with Ngrok

```bash
# Start local server
npm start
# In another terminal
ngrok http 8000

# Get your ngrok URL (e.g., https://abc123.ngrok.io)
# Update BotFather with this URL
```

## Verification Checklist

- [ ] Bot created with BotFather
- [ ] API token saved securely
- [ ] Web App deployed with HTTPS
- [ ] Bot menu button configured
- [ ] Bot commands set
- [ ] Bot description added
- [ ] Web App URL is accessible
- [ ] Games working in Web App
- [ ] Token creation working
- [ ] Data persisting in localStorage
- [ ] Telegram integration working

## Troubleshooting

### Bot not responding
- Check API token is correct
- Verify bot is running
- Check internet connection
- Restart bot

### Web App not loading
- Verify HTTPS is enabled
- Check URL is correct in bot settings
- Clear browser cache
- Test in incognito mode

### Games not working
- Check browser console for errors (F12)
- Verify JavaScript is enabled
- Test in different browser
- Clear localStorage

### Telegram API errors
- Verify initData is present
- Check token is valid
- Ensure app opened from Telegram
- Check Telegram connection

## Security Notes

🔒 **Important Security Tips:**

1. **Never share your API token** - It gives full control of your bot
2. **Use environment variables** - Don't hardcode tokens
3. **Validate all inputs** - Verify Telegram initData
4. **Use HTTPS only** - Web App must be over HTTPS
5. **Rate limiting** - Implement rate limiting on backend
6. **Sanitize data** - Clean user input before processing

## Environment Variables

Create `.env` file (don't commit!):

```env
TELEGRAM_BOT_TOKEN=123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11
WEB_APP_URL=https://your-domain.com
NODE_ENV=production
PORT=8000
```

## Additional Resources

- [Telegram Bot API Docs](https://core.telegram.org/bots/api)
- [Telegram Web Apps Documentation](https://core.telegram.org/bots/webapps)
- [BotFather Commands](https://core.telegram.org/bots/features#botfather)
- [Telegram Bot Best Practices](https://core.telegram.org/bots#bot-features)

## Support

For issues:
1. Check Telegram Bot API documentation
2. Review troubleshooting section
3. Open GitHub issue
4. Contact Telegram support

---

**Good luck with your CryptoGamify bot! 🚀💎**
