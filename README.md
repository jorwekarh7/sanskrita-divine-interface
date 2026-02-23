# 🌌 Sanskrita: Divine Interface  
## A Dual-Mode LLM Interface for IAST-Transliterated Sanskrit

**Sanskrita** is a cinematic dual-mode AI interface that allows users to interact with:

- 🕉 **Divine Mode** → A custom Sanskrit-focused model (HuggingFace Space)  
- 🤖 **GPT Mode** → OpenAI’s GPT model for general language understanding  

The system enables seamless switching between a Sanskrit RAG-based model and a general-purpose LLM, allowing users to translate prompts into IAST transliterated Sanskrit before invoking the Divine model.

---



## ✨ Features

### 🔁 Dual Mode Architecture

Toggle between:

- **Divine Mode** (Sanskrita model)  
- **GPT Mode** (OpenAI model)  

Clean separation of model responsibilities.

---

### 🕉 Divine Mode

- Connects to a HuggingFace Gradio Space  
- Optimized for IAST-transliterated Sanskrit  
- Typewriter animation response effect  
- Cinematic glowing UI  
- Past conversation history drawer  

---

### 🤖 GPT Mode

- Uses OpenAI Responses API  
- General-purpose English processing  
- Used to translate prompts before Divine invocation  

---



## 🎨 Cinematic UI

- Galaxy background  
- Floating aura effects  
- Glow animations on interaction  
- Word-by-word typewriter rendering  
- Responsive clamp-based layout



## 🏗 System Architecture

### Development (Localhost)

```text
Vite (Frontend)
    ↓ proxy
Express Server (localhost:5000)
    ↓
 ├── /api/divine → HuggingFace Space
 └── /api/gpt     → OpenAI API
  ```

### Production (Vercel)

```text
Frontend (Static build)
    ↓
Vercel Serverless Functions
    ├── /api/divine.js
    └── /api/gpt.js
```

#### Shared business logic lives inside:

```text
/server/services/
    ├── sanskritaService.js
    └── openaiService.js
```

- Same logic locally & in production
- Thin routing layer
- Clean separation of concerns



## 🧠 Model Integrations

### Divine Mode Model

- Hosted on HuggingFace Spaces
- Connected via @gradio/client
- Endpoint: /answer_query

####Environment variable:

```text
HF_SPACE_ID=your-space-id
```

### GPT Mode Model

- Uses OpenAI Responses API
- Default model configurable via env variable

####Environment variable:

```text
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-4.1-mini (or any supported model)
```


## 📁 Project Structure

```text
root/
│
├── api/
│   ├── divine.js         # Vercel serverless route
│   └── gpt.js
│
├── server/
│   ├── index.js          # Express server (local dev)
│   └── services/
│       ├── sanskritaService.js
│       └── openaiService.js
│
├── client/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── DivineLayout.jsx
│   │   ├── GPTLayout.jsx
│   │   ├── GalaxyBackground.jsx
│   │   ├── ModeToggle.jsx
│   │   └── index.css
│
├── vite.config.js
├── vercel.json
└── package.json
```



## 🚀 Getting Started

### 1️⃣ Clone the repository

```text
git clone https://github.com/yourusername/sanskrita.git
cd sanskrita
```

### 2️⃣ Install dependencies

#### Root (server + shared services)

```text
npm install
```

#### Client

```text
cd client
npm install
```

### 3️⃣ Environment Variables

##### Create a .env file in the root directory:

```text
OPENAI_API_KEY=your_openai_key
OPENAI_MODEL=gpt-4.1-mini
HF_SPACE_ID=your_huggingface_space
```

### 4️⃣ Run Locally

#### Start Express backend:

```text
node server/index.js
```

#### Start Frontend (Vite):

```text
cd client
npm run dev
```

#### Open:

```text
http://localhost:5173
```



## 🌍 Deployment (Vercel)

### 🚀 Deployment Steps

1. Push to GitHub  
2. Import project into Vercel  
3. Add environment variables in Vercel dashboard:

   - `OPENAI_API_KEY`
   - `OPENAI_MODEL`
   - `HF_SPACE_ID`

#### ⚙️ vercel.json Handles

- Static build of client  
- Serverless routing for `/api/*`  

---



## 🎨 UI Design Philosophy

The interface is intentionally immersive:

- No scroll-based layout (locked cinematic viewport)  
- Absolute-positioned spiritual elements  
- Clamp-based responsive scaling  
- Aura & glow-based interaction feedback  
- Typewriter reveal effect for divine responses  

#### 🌅 The Goal

> A seeker approaching enlightenment.

---



## 📦 Conversation History

- Stored in `localStorage`  
- Key: `divine_conversations_v1`  
- Click **“Past Conversations”** to view history  
- Selecting a conversation reloads it into UI  

---



## ⚙️ Performance Notes

- Lazy-loaded Gradio client  
- Shared service layer for dev/prod parity  
- Clamp-based CSS scaling  
- Reduced heavy blur filters for GPU performance  
- Word-based typewriter effect tuned for smooth animation  

---



## 🛡 Error Handling

- Graceful fallback on API failure  
- Defensive extraction of OpenAI response text  
- Handles varying Gradio return formats  
- Prevents UI state desync between modes  

---



## 💡 This Project Demonstrates

- Dual LLM orchestration  
- Clean separation of routing and service layers  
- Production-ready serverless deployment  
- High-performance animated UI  
- Sanskrit-focused AI interface design



## 🧭 Future Improvements

- Streaming GPT responses  
- Conversation persistence in database  
- Multi-turn context memory  
- Sanskrit transliteration auto-detection  
- Enhanced mobile layout  
- Model performance optimization  

---



## 👨‍💻 Author

### Harshal Jorwekar  
**Software Engineer | AI Engineer | Full-Stack Developer | Systems Builder**

---
