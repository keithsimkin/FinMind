# FinMind - AI Finance Advisor

A personal finance tracking app with AI-powered advice using NVIDIA Nemotron AI via OpenRouter.

## Setup Instructions

### 1. Get an API Key
1. Go to [OpenRouter](https://openrouter.ai/)
2. Sign up or log in
3. Navigate to the "Keys" section
4. Create a new API key
5. Copy the key (starts with `sk-or-v1-`)

### 2. Configure the API Key
1. Open `config.js` in the project folder
2. Replace `YOUR_OPENROUTER_API_KEY_HERE` with your actual API key:
   ```javascript
   const CONFIG = {
     OPENROUTER_API_KEY: 'sk-or-v1-your-actual-key-here'
   };
   ```
3. Save the file

### 3. Run the App
Simply open `FinMind.html` in your web browser!

## Features
- 💰 Track income and expenses
- 📊 Visual spending analytics by category
- 🎯 Set budget goals
- 💱 Multi-currency support (40+ currencies)
- 🤖 AI financial advisor with personalized advice
- 📱 Clean, modern UI with dark theme

## Security Notes
- **Never commit `config.js` to GitHub** (it's already in `.gitignore`)
- The API key is visible in browser dev tools - this is a limitation of client-side apps
- For production apps, use a backend server to hide API keys

## AI Features
The AI advisor:
- Keeps responses short (max 3 sentences)
- Only discusses finance topics
- Uses your actual financial data for personalized advice
- Rejects off-topic questions automatically

## Tech Stack
- Pure HTML, CSS, JavaScript (no frameworks)
- LocalStorage for data persistence
- OpenRouter API for AI chat
- NVIDIA Nemotron AI model

## License
MIT License - Feel free to use and modify!
