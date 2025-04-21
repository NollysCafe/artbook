# 🎨 ArtBook

![NFE-OSL License](https://img.shields.io/github/license/nollycafe/artbook)
![Stars](https://img.shields.io/github/stars/nollycafe/artbook?style=social)
![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen)
![Open Source](https://img.shields.io/badge/open--source-yes-brightgreen)
![Built with Love](https://img.shields.io/badge/built%20with-love-ff69b4.svg)
![Built by Nolly's Cafe](https://img.shields.io/badge/built%20by-Nolly's%20Cafe-ff69b4.svg)

A **modern, open-source portfolio & link-sharing platform** built specifically for **visual artists**. ArtBook helps you create stunning, public-facing artist pages with **drag & drop freedom**, real-time analytics, and the option to **sell your work** — all while keeping your creative control.

> 💡 Built with love by [Nolly's Cafe ☕](https://cafe.thenolle.com). Live instance: [artbook.thenolle.com](https://artbook.thenolle.com)

---

## 🚀 Features

- 🎨 **Fully customizable artist pages**
  Ultra-powerful builder inspired by Wix, Webflow & WordPress — no limits.

- 🔗 **Link sharing, galleries & portfolios**
  Perfect for social bios, project showcases, or personal artbooks.

- 🖼️ **Optimized media hosting**
  Images stored in PostgreSQL for now, with future CDN support planned.

- 🔐 **Secure Google OAuth login**
  Simplified access without compromising privacy or control.

- 📊 **Built-in real-time analytics**
  See who’s visiting your page, with no external trackers.

- 💬 **Public, discoverable profiles**
  Designed for exposure and discoverability for small/indie artists.

- 🛍️ **Sell art, prints, commissions** *(coming soon)*
  We handle transactions securely and take a small cut only to cover costs.

- 🆓 **Freemium-friendly, open-source forever**
  Core features will always remain free and open.

---

## 🛠️ Tech Stack

- **Frontend**: Vite + React + Axios
- **Backend**: Node.js + Express
- **Database**: PostgreSQL
- **Auth**: Google OAuth + JWT
- **Security**: Cloudflare + API rate limiting
- **Deployment**: Self-hosted

> Uses [`nolly-cli`](https://github.com/nollycafe/nolly-cli) under the hood.

---

## 📦 Getting Started

1. **Clone the repo**
   ```sh
   git clone https://github.com/nollycafe/artbook.git
   cd artbook
	 ```
2. **Install dependencies**
	 ```sh
	 pnpm install
	 ```
3. **Set up environment variables**
	 Create a `.env` file in the root folder and include all required keys.
	 (See `.env.example` for structure — values must be filled manually.)
4. **Start development**
	 ```sh
	 pnpm dev
	 ```

---

## ✨ Contributing

We welcome contributors — just follow the project's visible code style and formatting!
- No strict linting or testing setup yet
- Please be respectful and inclusive (use neutral pronouns, clear naming, etc.)
- Read the [CONTRIBUTING.md](./CONTRIBUTING.md) before opening a PR
- Roadmap and planning live in [ROADMAP.md](./ROADMAP.md)

---

## 🌟 Why ArtBook?

> "Why not just use Linktree, Carrd, or Behance?"

ArtBook is **built for artists**, not influencers or businesses:
- Powerful builder: Create custom layouts — not just links.
- Public-first: Designed for discoverability, not just bio links.
- Open-source: You control your data, your style, and your visibility.
- Sell your art: Built-in tools to showcase and sell, with you in charge.

---

## 📍 Live Site

> 🖥️ [https://artbook.thenolle.com](https://artbook.thenolle.com)

This is the **official instance**, maintained and hosted by the creators.
Feel free to self-host or fork it for personal use.

---

## 📜 License

Licensed under [NFE-OSL v1.0](./LICENSE).
Use it, fork it, share it — just don’t claim it as your own. ❤️
