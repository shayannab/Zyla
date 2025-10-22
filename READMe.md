# 💰 Zyla - AI-Powered Financial Intelligence

![Zyla Banner](https://via.placeholder.com/1200x400/6366f1/ffffff?text=Zyla+-+Smart+Money+Management)

> **Transform your financial future with AI-driven insights, automated tracking, and personalized recommendations.**

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://zyla-demo.vercel.app)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

---

## 🚀 Quick Start

### **Try the Demo**

**Demo Credentials:**
- **Email:** `demo@zyla.com`
- **Password:** `demo123`

👉 [**Launch Demo**](https://zyla-demo.vercel.app/login)

*Pre-loaded with sample data to explore all features without connecting real bank accounts.*

---

## ✨ Features

### 🧠 **AI-Powered Intelligence**
- Smart transaction categorization using machine learning
- Personalized spending insights and recommendations
- Predictive budget alerts and savings opportunities
- Fraud detection and unusual activity monitoring

### 🏦 **Bank Integration**
- Secure connection via Plaid API
- Real-time transaction syncing
- Support for 10,000+ financial institutions
- Multi-account aggregation

### 📊 **Financial Management**
- Interactive dashboard with real-time stats
- Custom budget creation and tracking
- Transaction search, filter, and export
- Spending analytics by category

### 📱 **Modern User Experience**
- Responsive design (mobile, tablet, desktop)
- Dark mode optimized interface
- Real-time data updates
- Intuitive navigation and workflows

---

## 🎯 Tech Stack

### **Frontend**
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Recharts** - Data visualization
- **Axios** - HTTP client

### **Backend**
- **Node.js** - Runtime
- **Express** - Web framework
- **TypeScript** - Type safety
- **Prisma** - ORM
- **PostgreSQL** - Database (Neon)
- **JWT** - Authentication

### **Integrations**
- **Plaid** - Banking API
- **OpenAI GPT** - AI insights (optional)
- **Vercel** - Frontend hosting
- **Railway** - Backend hosting

---

## 📦 Installation

### **Prerequisites**
- Node.js 18+ and npm
- PostgreSQL database (or Neon account)
- Plaid API credentials (free sandbox)

### **1. Clone Repository**
```bash
git clone https://github.com/yourusername/zyla.git
cd zyla
```

### **2. Backend Setup**
```bash
cd zyla-backend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local

# Edit .env.local with your credentials:
# DATABASE_URL=your_neon_postgres_url
# PLAID_CLIENT_ID=your_plaid_client_id
# PLAID_SECRET=your_plaid_sandbox_secret
# JWT_SECRET=your_random_secret_key

# Run database migrations
npx prisma db push
npx prisma generate

# Start backend server
npm run dev
```

Backend runs on `http://localhost:5000`

### **3. Frontend Setup**
```bash
cd zyla-web

# Install dependencies
npm install

# Configure environment (optional)
echo "REACT_APP_API_URL=http://localhost:5000" > .env.local

# Start development server
npm start
```

Frontend runs on `http://localhost:3000`

---

## 🔐 Environment Variables

### **Backend (.env.local)**
```env
# Database
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"

# Plaid API
PLAID_CLIENT_ID=your_client_id
PLAID_SECRET=your_sandbox_secret
PLAID_ENV=sandbox

# Authentication
JWT_SECRET=your_super_secret_jwt_key

# Server
PORT=5000
NODE_ENV=development
```

### **Frontend (.env.local)**
```env
REACT_APP_API_URL=http://localhost:5000
```

---

## 🧪 Getting Plaid Credentials

1. Go to [Plaid Dashboard](https://dashboard.plaid.com/signup)
2. Create a free account (Sandbox is free forever)
3. Copy your **Client ID** and **Sandbox Secret**
4. Add them to backend `.env.local`

**Test Credentials for Plaid Sandbox:**
- Institution: Search for "Chase" or any bank
- Username: `user_good`
- Password: `pass_good`
- MFA Code: `1234`

---

## 📖 Project Structure

```
zyla/
├── zyla-backend/              # Backend API
│   ├── src/
│   │   ├── routes/            # API endpoints
│   │   │   ├── auth.routes.ts
│   │   │   ├── plaid.routes.ts
│   │   │   ├── user.routes.ts
│   │   │   └── ai.routes.ts
│   │   ├── middleware/        # Auth middleware
│   │   └── services/          # Business logic
│   ├── prisma/
│   │   └── schema.prisma      # Database schema
│   └── package.json
│
└── zyla-web/                  # Frontend React App
    ├── src/
    │   ├── pages/             # Route pages
    │   │   ├── Dashboard.tsx
    │   │   ├── Transactions.tsx
    │   │   ├── Budgets.tsx
    │   │   ├── Accounts.tsx
    │   │   └── Insights.tsx
    │   ├── components/        # Reusable components
    │   ├── services/          # API client
    │   │   └── api.ts
    │   └── App.tsx
    └── package.json
```

---

## 🎨 Screenshots

### Dashboard
![Dashboard](https://via.placeholder.com/800x500/1f2937/ffffff?text=Dashboard+Screenshot)

### Transactions
![Transactions](https://via.placeholder.com/800x500/1f2937/ffffff?text=Transactions+Screenshot)

### Budgets
![Budgets](https://via.placeholder.com/800x500/1f2937/ffffff?text=Budgets+Screenshot)

---

## 🚢 Deployment

### **Frontend (Vercel)**
```bash
cd zyla-web
vercel deploy

# Set environment variables in Vercel dashboard:
# REACT_APP_API_URL=https://your-backend.railway.app
```

### **Backend (Railway)**
```bash
cd zyla-backend
railway login
railway init
railway up

# Set environment variables in Railway dashboard
```

---

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) first.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Shayan Behera**
- Email: shayannabehera23@gmail.com
- X: [@shayanna_0](https://x.com/shayanna_0)
- Portfolio: [your-portfolio.com](https://your-portfolio.com)

---

## 🙏 Acknowledgments

- [Plaid](https://plaid.com) - Banking API
- [Neon](https://neon.tech) - Serverless Postgres
- [Vercel](https://vercel.com) - Hosting platform
- [Tailwind CSS](https://tailwindcss.com) - Styling framework

---

## 📞 Support

Have questions or need help?

- 📧 Email: shayannabehera23@gmail.com
- 🐛 Issues: [@shayannab](https://github.com/shayannab)
- 💬 Discussions: [@shayanna_0](https://x.com/shayanna_0)

---

## 🗺️ Roadmap

See our [Product Roadmap](https://zyla-demo.vercel.app/roadmap) for upcoming features.

**Current Focus (Q2 2025):**
- [ ] Mobile app (iOS & Android)
- [ ] Advanced analytics dashboard
- [ ] Bill payment automation
- [ ] Multi-currency support

---

## ⭐ Show Your Support

If you find Zyla useful, please consider giving it a ⭐ on GitHub!

---

<div align="center">
  <strong>Built with ❤️ by Shayanna Behera</strong>
  <br />
  <sub>Making financial management accessible to everyone</sub>
</div>