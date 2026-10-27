# 🎬 Quviyo — Video Discovery Platform

Quviyo is a YouTube-inspired video discovery website built using HTML, CSS, and JavaScript. It provides a familiar video browsing experience with search, Shorts, channel information, and a personalized-style video feed.

## ✨ Features

- 🏠 **Home:** Browse a dynamic feed of suggested videos.
- 🔍 **Search:** Search for YouTube videos.
- ♾️ **Infinite Scrolling:** Load more videos while scrolling.
- 🎞️ **Shorts:** Browse short-form video content.
- ▶️ **Watch Page:** Watch selected videos with related recommendations.
- 👤 **Channel Pages:** Explore channel information and uploads.
- 📚 **Library:** Access watch history, playlists, liked videos, and saved content.
- 👍 **Interactive Controls:** Like, subscribe, and save videos.
- 🌙 **Themes:** Light and dark modes.
- 📱 **Responsive Design:** Supports desktop and mobile screens.
- 🔄 **Dynamic Feed:** Refresh the page to discover different videos.

## 🛠️ Technologies Used

- HTML5
- CSS3
- JavaScript
- YouTube Data API v3
- GitHub Pages

## 🚀 Live Demo

**Website:** https://nithishedward.github.io/Quviyo/

> The live demo will be available once GitHub Pages deployment is successful.

## 💻 Run Locally

1. Clone this repository:

   ```bash
   git clone https://github.com/nithishedward/Quviyo.git
   ```

2. Open the project folder:

   ```bash
   cd Quviyo
   ```

3. Open `index.html` in your browser, or use the VS Code **Live Server** extension.

4. Configure your YouTube Data API key in `config.js` if required by the application.

## 🔑 YouTube API Setup

Quviyo uses the YouTube Data API v3 for video discovery and metadata.

1. Open the [Google Cloud Console](https://console.cloud.google.com/).
2. Enable **YouTube Data API v3**.
3. Create an API key under **APIs & Services → Credentials**.
4. Restrict the key to YouTube Data API v3.
5. Configure HTTP referrer restrictions for your website domain.

**Security note:** Browser-based API keys are visible to visitors. Never put passwords or private server credentials in frontend files. Monitor your API quota and usage.

## 📂 Project Structure

```text
Quviyo/
├── index.html
├── style.css
├── script.js
├── config.js
└── README.md
```

## 🌐 Deployment

Quviyo can be hosted free using GitHub Pages:

1. Open the repository's **Settings**.
2. Select **Pages**.
3. Choose **Deploy from a branch**.
4. Select `main` and `/(root)`.
5. Click **Save**.

## ⚠️ Disclaimer

Quviyo is an independent video discovery project inspired by common video-sharing interfaces. It is not affiliated with or endorsed by YouTube or Google. YouTube content and services remain subject to their respective terms and policies.

## 👨‍💻 Author

**Nithish Edward**

GitHub: [@nithishedward](https://github.com/nithishedward)

---

⭐ If you find Quviyo interesting, consider starring the repository!
