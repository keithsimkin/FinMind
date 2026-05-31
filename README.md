# FinMind - AI-Powered Personal Finance Advisor

A modern, intelligent personal finance management app with AI-powered advice, built with vanilla JavaScript and Firebase.

## ✨ Features

- 💰 **Income & Expense Tracking** - Record and categorize all your transactions
- 📊 **Visual Analytics** - Beautiful charts and insights into your spending habits
- 🎯 **Budget Management** - Set spending limits per category and track progress
- 🤖 **AI Financial Advisor** - Get personalized advice powered by NVIDIA Nemotron AI
- 🌍 **Multi-Currency Support** - 38+ currencies from around the world
- 🔐 **Secure Authentication** - Firebase Authentication for secure user accounts
- ☁️ **Cloud Sync** - Your data syncs across all devices automatically
- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/finmind.git
cd finmind
```

### 2. Set Up Firebase

Follow the detailed instructions in [FIREBASE_SETUP.md](FIREBASE_SETUP.md) to:
- Create a Firebase project
- Enable Authentication (Email/Password)
- Enable Realtime Database
- Configure your app credentials

### 3. Configure API Keys

1. **Firebase**: Update `firebase-config.js` with your Firebase credentials
2. **OpenRouter AI**: Update `config.js` with your OpenRouter API key
   - Get your key from [OpenRouter](https://openrouter.ai/keys)

### 4. Open the App

Simply open `FinMind.html` in your web browser. No build process required!

## 🔧 Configuration Files

### firebase-config.js
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT.firebaseio.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### config.js
```javascript
const CONFIG = {
  OPENROUTER_API_KEY: 'your-openrouter-api-key-here'
};
```

## 📊 Data Structure

Your data is organized in Firebase Realtime Database:

```
users/
  └── {userId}/
      ├── profile/
      │   ├── name
      │   ├── email
      │   ├── income
      │   └── incomeSource
      ├── transactions/
      │   └── [array of transaction objects]
      ├── budgets/
      │   └── {category: limit}
      └── currency/
          ├── code
          ├── symbol
          ├── name
          └── flag
```

## 🎨 Tech Stack

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Backend**: Firebase (Authentication + Realtime Database)
- **AI**: OpenRouter API with NVIDIA Nemotron model
- **Fonts**: DM Sans & DM Serif Display (Google Fonts)

## 🔒 Security

- User authentication via Firebase Auth
- Database security rules ensure users can only access their own data
- API keys should be kept private (use environment variables in production)
- Never commit `firebase-config.js` or `config.js` with real credentials to public repos

## 📱 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Opera

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

If you encounter any issues:
1. Check [FIREBASE_SETUP.md](FIREBASE_SETUP.md) for setup instructions
2. Verify your Firebase configuration
3. Check browser console for error messages
4. Open an issue on GitHub

## 🎯 Roadmap

- [ ] Export data to CSV/PDF
- [ ] Recurring transactions
- [ ] Bill reminders
- [ ] Investment tracking
- [ ] Multi-user households
- [ ] Mobile app (React Native)
- [ ] Dark mode improvements
- [ ] Data visualization enhancements

## 👨‍💻 Author

Built with ❤️ by [Your Name]

## 🙏 Acknowledgments

- Firebase for backend infrastructure
- OpenRouter for AI API access
- NVIDIA for the Nemotron AI model
- Google Fonts for typography
