    // server/services/sanskritaService.js

    let gradioModulePromise = null;

    async function getGradioClient() {
    if (!gradioModulePromise) {
        gradioModulePromise = import("@gradio/client");
    }

    const mod = await gradioModulePromise;

    // Support both ESM export shapes:
    // 1) { client }
    // 2) default export that contains { client }
    const clientFn = mod?.client || mod?.default?.client;

    if (!clientFn) {
        throw new Error("Gradio client export not found. Check @gradio/client module exports.");
    }

    return clientFn;
    }

    async function callSanskrita(prompt) {
    const p = (prompt || "").trim();
    if (!p) throw new Error("Prompt is required");

    const client = await getGradioClient();

    const spaceId = process.env.HF_SPACE_ID || "harshalJk/sanskrita-rag-chat";

    // Connect to the Space
    const app = await client(spaceId);

    // Call the Space API by api_name from /config: "answer_query"
    const result = await app.predict("/answer_query", [p]);

    // Gradio usually returns { data: [...] }
    return result?.data?.[0] ?? JSON.stringify(result);
    }

    module.exports = { callSanskrita };