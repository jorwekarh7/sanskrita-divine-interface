    import { useEffect, useMemo, useRef, useState } from "react";
    import ModeToggle from "./ModeToggle";

    export default function GPTLayout({ mode, onModeChange }) {
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState(() => [
        {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "Hi — I'm in GPT mode. Ask me anything.",
        },
    ]);

    const listRef = useRef(null);
    const canSend = useMemo(() => input.trim().length > 0 && !isLoading, [input, isLoading]);

    useEffect(() => {
        const el = listRef.current;
        if (!el) return;
        el.scrollTop = el.scrollHeight;
    }, [messages.length]);

    const send = async () => {
        const text = input.trim();
        if (!text || isLoading) return;

        setIsLoading(true);
        setInput("");

        const userMsg = { id: crypto.randomUUID(), role: "user", content: text };
        setMessages((prev) => [...prev, userMsg]);

        try {
        // TODO: Replace with your real GPT endpoint call.
        await new Promise((r) => setTimeout(r, 450));

        const assistantMsg = {
            id: crypto.randomUUID(),
            role: "assistant",
            content: `You said: ${text}`,
        };

        setMessages((prev) => [...prev, assistantMsg]);
        } catch (e) {
        console.error(e);
        setMessages((prev) => [
            ...prev,
            {
            id: crypto.randomUUID(),
            role: "assistant",
            content: "Something went wrong. Please try again.",
            },
        ]);
        } finally {
        setIsLoading(false);
        }
    };

    const onKeyDown = (e) => {
        // Enter sends, Shift+Enter newline
        if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        send();
        }
    };

    return (
        <div className="gpt-root">
        <div className="gpt-shell">
            <div className="gpt-topbar">
            <div className="gpt-title">GPT Mode</div>
            <ModeToggle mode={mode} onChange={onModeChange} />
            </div>

            <div className="gpt-card gpt-messages" ref={listRef}>
            {messages.length === 0 ? (
                <div className="gpt-empty">No messages yet.</div>
            ) : (
                messages.map((m) => (
                <div key={m.id} className={`gpt-row ${m.role === "user" ? "user" : "assistant"}`}>
                    <div className={`gpt-bubble ${m.role === "user" ? "user" : "assistant"}`}>
                    {m.content}
                    </div>
                </div>
                ))
            )}

            {isLoading && (
                <div className="gpt-row assistant">
                <div className="gpt-bubble assistant">Thinking…</div>
                </div>
            )}
            </div>

            <div className="gpt-card gpt-composer">
            <div className="gpt-composer-inner">
                <textarea
                className="gpt-input"
                placeholder="Message GPT…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                rows={1}
                />

                <button className="gpt-send" type="button" onClick={send} disabled={!canSend}>
                Send
                </button>
            </div>
            </div>
        </div>
        </div>
    );
    }
