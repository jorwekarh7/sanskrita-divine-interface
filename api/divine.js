    // api/divine.js
    const { callSanskrita } = require("../server/services/sanskritaService");

    module.exports = async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    try {
        const { prompt } = req.body || {};
        if (!prompt || !prompt.trim()) return res.status(400).json({ error: "Prompt is required" });

        const reply = await callSanskrita(prompt.trim());
        return res.status(200).json({ reply });
    } catch (err) {
        console.error("DIVINE_ERROR:", err);
        return res.status(500).json({ error: "Divine inference failed" });
    }
    };
