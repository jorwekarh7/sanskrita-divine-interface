    // api/gpt.js
    const { callOpenAI } = require("../server/services/openaiService");

    module.exports = async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    try {
        const { messages } = req.body || {};
        if (!Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: "messages[] is required" });
        }

        const reply = await callOpenAI(messages);
        return res.status(200).json({ reply, text: reply });
    } catch (err) {
        console.error("GPT_ERROR:", err);
        return res.status(500).json({ error: "GPT request failed" });
    }
    };
