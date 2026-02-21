    // server/services/sanskritaService.js
    const { client } = require("@gradio/client");

    async function callSanskrita(prompt) {
    const spaceId = process.env.HF_SPACE_ID || "harshalJk/sanskrita-rag-chat";

    // Connect to the Space
    const app = await client(spaceId);

    // Call the Space API by api_name from /config: "answer_query"
    const result = await app.predict("/answer_query", [prompt]);

    // Gradio usually returns { data: [...] }
    return result?.data?.[0] ?? JSON.stringify(result);
    }

    module.exports = { callSanskrita };