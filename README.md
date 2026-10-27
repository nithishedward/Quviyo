# ▶️ Quviyo — A YouTube-Inspired Video Discovery Platform

<p align="center">
  <strong>Discover videos. Explore channels. Experience content differently.</strong>
</p>

<p align="center">
  A personal project exploring video discovery, familiar browsing experiences, and full-stack web development through a YouTube-inspired platform.
</p>

<p align="center">
  <a href="https://quviyo.vercel.app/"><strong>🌐 Live Demo</strong></a> ·
  <a href="https://github.com/nithishedward/Quviyo"><strong>💻 Source Code</strong></a>
</p>

---

## 🚀 About Quviyo

**Quviyo** is a video discovery platform inspired by the familiar user experience of YouTube. The project explores how video browsing, search, channel discovery, and content presentation can be recreated within an independently developed web application.

One of the most interesting parts of this journey has been **reverse engineering the user experience** — studying familiar interface patterns and interactions, then translating those observations into my own implementation.

Beyond the frontend, I'm also working on backend API integration, credential security, and deployment workflows to make the application more robust.

> **The goal:** Learn by building, understand how complex web experiences fit together, and turn ideas into working software.

## ✨ Key Features

- 🎬 **Video Discovery** — Explore video content through a familiar browsing interface.
- 🔎 **Video Search** — Search for videos using YouTube Data API integration.
- 📺 **Channel Exploration** — Retrieve and display channel-related information.
- ▶️ **Video Playback** — Explore the video viewing experience within the application.
- 📱 **Modern Interface** — Build toward a clean, intuitive, user-friendly browsing experience.
- 🔌 **API Integration** — Connect frontend features to YouTube Data API endpoints.
- 🔐 **Server-Side API Proxy** — Route search, video, and channel requests through `/api/youtube/[resource]`.
- 🛡️ **Credential Protection** — Read the YouTube API key from a server-side environment variable instead of exposing it in frontend configuration.

*Note: Features and API availability may vary while development and testing continue.*

## 🧠 The Engineering Behind the Project

Building Quviyo is about more than recreating a familiar interface. It's an opportunity to understand the engineering decisions behind modern web applications.

### 🔍 Reverse Engineering the User Experience

I studied YouTube's user-facing design patterns and browsing workflows to understand how users navigate between videos, search results, and channels.

The focus is on learning from observable interactions and implementing an independent experience—not copying YouTube's private backend or proprietary source code.

### ⚙️ Server-Side API Proxy

Previously, API requests and frontend configuration needed a more secure separation. I implemented a backend proxy so supported YouTube requests can pass through server-side endpoints.

```text
User Interface
      │
      ▼
Quviyo Frontend
      │
      ▼
/api/youtube/[resource]
      │
      ▼
Server-Side API Handler
      │
      ├── YOUTUBE_API_KEY
      │
      ▼
YouTube Data API v3
      │
      ▼
API Response → Quviyo UI
```

### 🔐 Security Improvement

The YouTube API key is now read from the `YOUTUBE_API_KEY` environment variable on the server side. The exposed key was removed from the frontend configuration.

This reduces the risk of exposing credentials through client-side code. The key must still be configured securely, and API usage should be monitored and restricted appropriately.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| JavaScript | Application functionality |
| YouTube Data API v3 | Video search, video data, and channel information |
| Server-side API routes | Backend request handling and API key protection |
| Vercel | Hosting and deployment workflow |
| Git & GitHub | Version control and source management |

## 📦 Getting Started

### Prerequisites

- Node.js and npm
- Git
- A Google Cloud project with YouTube Data API v3 enabled
- A valid YouTube Data API key
- Vercel CLI or an appropriate local development setup for the project's API routes

### 1. Clone the repository

```bash
git clone https://github.com/nithishedward/Quviyo.git
cd Quviyo
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root if your local setup supports it.

```env
YOUTUBE_API_KEY=your_youtube_data_api_key
```

Replace the placeholder with your actual API key.

**Important:** Never commit `.env.local`, publish your API key, or expose the key through frontend JavaScript. Confirm that the project's `.gitignore` excludes local environment files.

### 4. Run the application

For a standard Vite frontend, the development command is commonly:

```bash
npm run dev
```

If the project uses Vercel serverless API routes, use the appropriate Vercel development workflow so the frontend and `/api/youtube/[resource]` endpoints are both available. Check `package.json` for the commands configured in this repository.

### 5. Configure Vercel

In your Vercel project:

1. Open **Settings → Environment Variables**.
2. Add `YOUTUBE_API_KEY` with your valid API key.
3. Select the intended deployment environment.
4. Redeploy the relevant preview after saving the variable.
5. Test the API endpoints before promoting the changes to production.

Never publish a deployment until the core functionality and API configuration have been tested.

## 🧪 Development Status

Quviyo is an actively developing project.

- [x] Implement server-side proxy routing for YouTube search, video, and channel requests.
- [x] Move API key handling to a server-side environment variable.
- [x] Remove the exposed key from frontend configuration.
- [x] Commit the initial backend change to a dedicated Git branch.
- [x] Run JavaScript syntax and diff checks.
- [ ] Complete preview deployment verification.
- [ ] Test search, video playback, channel pages, homepage feed, and Shorts functionality.
- [ ] Review and release the changes to production after successful testing.

The backend implementation has been committed, but the updated deployment and end-to-end functionality still require verification.

## 🎯 What I'm Learning

Through Quviyo, I'm gaining practical experience with:

- Reverse engineering observable user experiences
- Frontend and backend integration
- REST API requests and response handling
- API credential management
- Debugging and code review
- Git branching and version control
- Preview deployments and production release workflows

These are the kinds of practical engineering challenges that make building real applications such a valuable learning experience.

## 🔮 Future Improvements

Planned areas for exploration include:

- Improving video search and discovery
- Refining the homepage feed
- Enhancing channel pages and navigation
- Improving responsive design and accessibility
- Strengthening error handling and loading states
- Adding more robust testing and deployment checks
- Exploring additional personalization features

## 🤝 Feedback & Contributions

Suggestions, feedback, and ideas are welcome!

If you're interested in web development, API integration, reverse engineering user experiences, or building independent applications, feel free to explore the repository and share your thoughts.

## 👨‍💻 Developer

**Nithish Edward E**

B.Tech Artificial Intelligence & Machine Learning student | Developer | AI & Software Engineering Enthusiast

- 🌐 **Portfolio:** https://nithishedwardportfolio.vercel.app/
- 💻 **GitHub:** https://github.com/nithishedward
- 🔗 **LinkedIn:** https://www.linkedin.com/in/nithish-edward-521a692b5/

---

<p align="center">
  <strong>Built with curiosity. Improved through debugging. Driven by learning.</strong>
</p>

<p align="center">
  ⭐ If you find this project interesting, consider starring the repository!
</p>
