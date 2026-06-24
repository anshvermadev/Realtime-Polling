# Contributing to E-Cell Polling System

We are thrilled that you want to help improve the E-Cell Polling System! Contributing is a great way to learn, collaborate, and build useful tools for the E-Cell community.

Please take a moment to review this document to ensure a smooth and productive workflow.

---

## 🚦 Getting Started

1. **Fork the repository** on GitHub.
2. **Clone your fork** to your local machine:
   ```bash
   git clone https://github.com/YOUR_USERNAME/voting-system.git
   cd voting-system
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Configure your local environment**:
   - Create a `.env.local` file at the root.
   - Add your Firebase development keys (refer to [README.md](README.md) for details).
5. **Start the development server**:
   ```bash
   npm run dev
   ```

---

## 🐛 Reporting Bugs & Suggesting Features

We use GitHub Issues to track bugs and feature requests. Before opening a new issue:
- **Search existing issues** to make sure it hasn't already been reported or requested.
- If it's a bug, provide detailed steps to reproduce it, along with your system specs (OS, Node version, browser, etc.).
- If it's a feature request, clearly describe the use case, user flow, and why it benefits the E-Cell Club.

---

## 🛠️ Making Changes

To propose changes, please follow these steps:

1. **Create a new branch** for your feature or bug fix:
   ```bash
   git checkout -b feature/AmazingFeature
   # or
   git checkout -b fix/BugFixName
   ```
2. **Implement your changes**:
   - Make sure your code is clean, readable, and well-commented.
   - Follow standard React/Next.js conventions.
   - Do not commit secrets or environment variables.
3. **Run the linter** to check for potential issues:
   ```bash
   npm run lint
   ```
4. **Commit your changes**:
   - Write clear and descriptive commit messages (e.g., `feat: add toggle for result visibility` or `fix: handle missing email in auth callback`).
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
5. **Push your branch** to your GitHub fork:
   ```bash
   git push origin feature/AmazingFeature
   ```
6. **Open a Pull Request (PR)**:
   - Go to the original repository on GitHub.
   - Click the "Compare & pull request" button.
   - Fill out the PR template with details about what your changes accomplish.

---

## 📐 Code Style & Conventions

- **Framework**: Next.js App Router (TypeScript)
- **Formatting**: Code should be formatted consistently (Prettier configurations if provided).
- **Styling**: Use **Tailwind CSS v4** conventions. Keep components clean, visual, and responsive.
- **State Management**: Use React context hooks (`useAuth`, `usePolls`) for shared client states.
- **Firestore Operations**: Keep database queries and transactions in context providers or service modules. Always handle errors gracefully with notifications (e.g., `react-hot-toast`).

---

## 📜 Code of Conduct

As a contributor, you agree to uphold a friendly, collaborative, and inclusive environment. Please respect all fellow E-Cell members and developers. Constructive feedback is welcome, but personal attacks or harassment will not be tolerated.

Thank you for contributing to E-Cell BVUDET Navi Mumbai! 🚀
