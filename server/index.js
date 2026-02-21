    const express = require("express");
    const cors = require("cors");
    const path = require("path");
    require("dotenv").config({ path: path.join(__dirname, "..", ".env") }); // loads root .env

    const { callSanskrita } = require("./services/sanskritaService");
    const { callOpenAI } = require("./services/openaiService");

    const app = express();
    app.use(cors());
    app.use(express.json());

    app.get("/health", (req, res) => res.json({ ok: true }));
    app.get("/api/ping", (req, res) => res.json({ ok: true, msg: "pong" }));

    app.post("/api/divine", async (req, res) => {
    try {
        const { prompt } = req.body;
        const out = await callSanskrita(prompt || "");
        res.json({ text: out });
    } catch (e) {
        console.error("DIVINE ERROR:", e);
        res.status(500).json({ error: String(e.message || e) });
    }
    });

    app.post("/api/gpt", async (req, res) => {
    try {
        const { messages } = req.body;
        const out = await callOpenAI(messages || []);
        res.json({ text: out });
    } catch (e) {
        console.error("GPT ERROR:", e);
        res.status(500).json({ error: String(e.message || e) });
    }
    });

    const port = process.env.PORT || 5000;
    app.listen(port, () => console.log(`Server running on http://localhost:${port}`));