# 📰 OROMO TIMES

**Bilingual News Platform — Oromo & English**

> Delivering trusted journalism, in-depth analysis, and community stories to the Oromo-speaking world and beyond.

---

## 🚀 Overview

Oromo Times is a modern, bilingual digital news platform built for speed, accessibility, and editorial excellence. It supports content in both **Afaan Oromoo** and **English**, with role-based dashboards for journalists, editors, and administrators.

## 🛠 Tech Stack

| Layer        | Technology                                |
| ------------ | ----------------------------------------- |
| **Frontend** | React 18 · TypeScript · Vite              |
| **Styling**  | Tailwind CSS · Custom design system       |
| **Backend**  | Supabase (Auth, Database, Storage)        |
| **Routing**  | React Router v6                           |
| **SEO**      | react-helmet-async                        |
| **Icons**    | lucide-react                              |
| **Dates**    | date-fns                                  |
| **Toasts**   | react-hot-toast                           |

## 📋 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** or **yarn**
- A **Supabase** project (free tier works)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/oromo-times.git
cd oromo-times

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase project URL and anon key

# Start the development server
npm run dev
```

The app will be available at **http://localhost:5173**.

## 📁 Project Structure

```
oromo-times/
├── public/                  # Static assets & favicon
├── src/
│   ├── components/          # Reusable UI & domain components
│   │   ├── ui/              # Button, Input, Card, Badge, Modal, Spinner, etc.
│   │   ├── layout/          # Navbar, Footer, Sidebar
│   │   ├── articles/        # ArticleCard, ArticleGrid, FeaturedArticle, etc.
│   │   ├── comments/        # CommentSection, CommentItem, CommentForm
│   │   ├── search/          # SearchBar, SearchResults
│   │   ├── qalaca/          # QalacaPanel (Oromo cultural section)
│   │   └── seo/             # SEOHead
│   ├── features/            # Feature modules
│   │   ├── auth/            # AuthContext, LoginForm, RegisterForm, ProtectedRoute
│   │   └── dashboard/       # Journalist, Editor, Admin dashboards
│   ├── hooks/               # Custom React hooks
│   ├── layouts/             # PublicLayout, DashboardLayout
│   ├── lib/                 # Supabase client, cache, constants
│   ├── pages/               # Route page components
│   ├── services/            # API service layer (articles, comments, auth, etc.)
│   ├── types/               # TypeScript type definitions
│   └── utils/               # SEO helpers, formatters, validators
├── supabase/                # Database migrations & RLS policies
├── index.html               # Vite entry HTML
├── tailwind.config.js       # Tailwind CSS configuration
├── vite.config.ts           # Vite build configuration
├── tsconfig.json            # TypeScript configuration
└── package.json
```

## 📜 Available Scripts

| Command          | Description                        |
| ---------------- | ---------------------------------- |
| `npm run dev`    | Start development server (Vite)    |
| `npm run build`  | Type-check and build for production|
| `npm run preview`| Preview the production build       |
| `npm run lint`   | Lint TypeScript/TSX files          |

## 🎨 Design System

- **Primary**: Navy blue palette (`#1a2744` → `#f0f4f8`)
- **Accent**: Gold (`#d69e2e`) for highlights and CTAs
- **Headlines**: Georgia serif for editorial authority
- **Body**: Inter sans-serif for readability
- **Responsive**: Mobile-first with 3-column desktop grid

## 🔐 User Roles

| Role           | Capabilities                                          |
| -------------- | ----------------------------------------------------- |
| **Reader**     | Browse articles, comment, search                      |
| **Journalist** | Create drafts, submit for review, manage own articles |
| **Editor**     | Review, edit, publish/reject articles                 |
| **Admin**      | Full access: user management, moderation, categories  |

## 🌍 Bilingual Support

Articles are created in either **Afaan Oromoo** (`om`) or **English** (`en`). The platform supports language-specific browsing and filtering.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

Please follow the existing code conventions (TypeScript strict mode, functional components, Tailwind CSS).

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

**Built with ❤️ for the Oromo community.**
