    // server/services/openaiService.js

    async function callOpenAI(messages) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("Missing OPENAI_API_KEY");

    // Safety: ensure messages is an array of { role, content }
    const input = Array.isArray(messages)
        ? messages.map((m) => ({
            role: m.role || "user",
            content: String(m.content ?? ""),
        }))
        : [{ role: "user", content: String(messages ?? "") }];

    const resp = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        },
        body: JSON.stringify({
        // If this model errors for you, switch to "gpt-4o-mini"
        model: process.env.OPENAI_MODEL || "gpt-4.1",
        input,
        }),
    });

    if (!resp.ok) {
        const t = await resp.text();
        throw new Error(`OpenAI error ${resp.status}: ${t}`);
    }

    const data = await resp.json();

    // Robust extraction across common response shapes
    if (typeof data.output_text === "string" && data.output_text.trim()) {
        return data.output_text.trim();
    }

    let text = "";

    const output = Array.isArray(data.output) ? data.output : [];
    for (const item of output) {
        const content = Array.isArray(item.content) ? item.content : [];
        for (const part of content) {
        if (typeof part?.text === "string") text += part.text;
        if (typeof part?.content === "string") text += part.content; // extra safety
        }
    }

    text = text.trim();
    return text || "No response text";
    }

    module.exports = { callOpenAI };