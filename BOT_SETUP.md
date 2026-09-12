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
Done! Congratulations on your new bot. You will find it at t.me/cryptogamifybot.

Use this token to access the HTTP API:
123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11

Keep your token secure and store it safely!
```

## Step 2: Deploy the Web App

### Option A: Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Option B: GitHub Pages

1. Push to GitHub
2. Settings → Pages
3. Deploy from main branch

### Option C: Netlify

1. Connect GitHub repo
2. Deploy

## Step 3: Configure Bot Web App

Message @BotFather:
```
/setmenubutton
- Select bot
- Web App
- https://your-domain.com
```

## Step 4: Set Bot Commands

```
/setcommands
/start - Play games and earn tokens
/tokens - View your tokens
/profile - View profile
/help - Get help
```

## Step 5: Bot Backend (Optional)

### Python Example

```python
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler, ContextTypes
import os

WEB_APP_URL = "https://your-domain.com"

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    keyboard = [[
        InlineKeyboardButton("🎮 Play Now", web_app={"url": WEB_APP_URL})
    ]]
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    await update.message.reply_text(
        "Welcome to CryptoGamify! 🎮💎",
        reply_markup=reply_markup
    )

def main():
    token = os.getenv("TELEGRAM_BOT_TOKEN")
    application = Application.builder().token(token).build()
    application.add_handler(CommandHandler("start", start))
    application.run_polling()

if __name__ == '__main__':
    main()
```

Install and run:
```bash
pip install python-telegram-bot
export TELEGRAM_BOT_TOKEN="YOUR_TOKEN"
python bot.py
```

## Step 6: Test Your Bot

1. Search for your bot on Telegram
2. Send `/start`
3. Click "Play Now" button
4. Test games and token creation

## Verification Checklist

- [ ] Bot created with BotFather
- [ ] API token saved securely
- [ ] Web App deployed (HTTPS)
- [ ] Bot menu button configured
- [ ] Bot commands set
- [ ] Web App URL accessible
- [ ] Games working
- [ ] Token creation working
- [ ] Data persisting

## Troubleshooting

**Bot not responding:** Check API token and bot is running
**Web App not loading:** Verify HTTPS and URL is correct
**Games not working:** Check browser console (F12)
**Telegram API errors:** Verify initData and token validity

## Security Notes

🔒 **Important:**
1. Never share API token
2. Use environment variables
3. Validate all inputs
4. Use HTTPS only
5. Implement rate limiting
6. Sanitize user input

## Environment Variables

```env
TELEGRAM_BOT_TOKEN=123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11
WEB_APP_URL=https://your-domain.com
NODE_ENV=production
```

## Resources

- [Telegram Bot API Docs](https://core.telegram.org/bots/api)
- [Telegram Web Apps](https://core.telegram.org/bots/webapps)
- [BotFather Commands](https://core.telegram.org/bots/features#botfather)

---

**Good luck! 🚀💎**