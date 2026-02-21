    // server/services/openaiService.js
    async function callOpenAI(messages) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("Missing OPENAI_API_KEY");

    // Minimal conversion for now
    const prompt = messages.map(m => `${m.role}: ${m.content}`).join("\n");

    const resp = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        },
        body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: prompt,
        }),
    });

    if (!resp.ok) {
        const t = await resp.text();
        throw new Error(`OpenAI error ${resp.status}: ${t}`);
    }

    const data = await resp.json();
    return data.output_text || "No response text";
    }

    module.exports = { callOpenAI };
