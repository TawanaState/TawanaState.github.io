# Meet by Tawananyasha

**Live Site:** [meet.tawananyasha.com](https://meet.tawananyasha.com)

## Overview

**Meet by Tawananyasha** is a free, open-source video conferencing tool built entirely with **HTML**, **CSS**, and **JavaScript**—no backend server required! This project demonstrates the power and flexibility of modern web technologies, enabling seamless peer-to-peer video calls directly in your browser.

## Key Features

- **Peer-to-Peer Video Conferencing:** Connect and communicate in real-time without any server relaying your video or audio streams.
- **No Backend Required:** All signaling and media exchange happens client-side, leveraging [PeerJS](https://peerjs.com/) and WebRTC.
- **Static Hosting:** The entire app can be hosted on any static file server or CDN—no server-side code or database needed.
- **Open Source:** Easily customizable and extensible for your own use cases.
- **Privacy-Friendly:** Since there is no backend, your video and audio never touch a third-party server.
- **Modern UI:** Clean, responsive interface with essential controls (camera, mic, screen sharing).

## How It Works

- **WebRTC** enables direct browser-to-browser communication for video and audio.
- **PeerJS** provides a simple API for establishing peer connections and exchanging signaling data.
- The app is a single-page application, loading all logic from static files.
- Users can join or host meetings instantly—no registration or installation required.

## Why This Is Cool

- **Truly Serverless:** Most video conferencing apps require complex backend infrastructure for signaling, authentication, and media relay. This project proves you can achieve robust video calls with just static files.
- **Ultra-Lightweight:** Deploy on GitHub Pages, Netlify, Vercel, or any static host—no backend maintenance, no server costs.
- **Great for Learning:** Explore the fundamentals of WebRTC, peer-to-peer networking, and modern web app architecture.
- **Privacy by Design:** No backend means no server logs, no data retention, and no risk of server-side breaches.

## Project Structure

```
/
├── index.html           # Main HTML file
├── assets/
│   ├── css/style.css    # Stylesheet
│   ├── js/main.js       # Application logic
│   ├── img/             # Icons and images
│   └── manifest.json    # PWA manifest
```

## Getting Started

1. **Clone or Download** this repository.
2. **Open `index.html`** in your browser, or deploy the folder to any static web host.
3. **Start a meeting** and share the link with others!

## Technologies Used

- [HTML5](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5)
- [CSS3](https://developer.mozilla.org/en-US/docs/Web/CSS)
- [JavaScript (ES6+)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [PeerJS](https://peerjs.com/) (for WebRTC signaling)

## License

MIT License

---

> Experience seamless, private, and free video conferencing—powered by the open web!
