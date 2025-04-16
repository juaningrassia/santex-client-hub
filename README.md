# Strategic Client Hub

Internal platform for account intelligence and strategic insights, combining external signals (via Perplexity API) with internal context (uploaded CSVs, TXT notes, tickets, etc.). Built using `React + Vite + TypeScript + Tailwind + shadcn/ui`.

---

## 🚀 Tech Stack

- **Frontend:** React + Vite + TypeScript  
- **UI Framework:** shadcn/ui + TailwindCSS  
- **Dev Tools:** ESLint, Prettier  
- **Target Deployment:** Vercel / AWS / Railway  
- **Integrated APIs:** OpenAI, Perplexity (optional)

---

## 📦 Local Setup

1. Clone the repository

```bash
git clone https://github.com/juaningrassia/strategic-client-hub.git
cd strategic-client-hub
```

2. Install dependencies

```bash
npm install
```

3. Create a `.env` file in the root with the following variables:

```env
VITE_OPENAI_API_KEY=your-api-key
VITE_PERPLEXITY_API_KEY=your-api-key
```

4. Run the development server

```bash
npm run dev
```

---

## 🧠 Project Structure

```
/src
  /pages              # Main views (Internal & External Analysis)
  /components         # Reusable UI components
  /contexts           # React context for shared state
  /auth               # Login / Signup / Protected Routes
  /utils              # Helpers and utilities
```

---

## 🧪 Current Status

✅ Functional editor for internal and external analysis  
✅ Basic auth system in place  
⏳ In progress: real API integration, UI/UX polish, deployment

---

## 🤝 Contributing

Want to collaborate?

1. Fork the repo
2. Create a new branch (`git checkout -b feature-name`)
3. Commit your changes (`git commit -am 'add feature'`)
4. Push to your branch (`git push origin feature-name`)
5. Open a Pull Request

---

## 🛡️ License

Private use only / Internal at Santex.
