    import { useEffect, useMemo, useRef, useState} from "react";
    import GalaxyBackground from "./GalaxyBackground";
    import ModeToggle from "./ModeToggle";
    
    function useTypewriter(text = "", { cps = 40, startDelayMs = 400 } = {}) {
    text = text ?? "";
    const [out, setOut] = useState("");

    //Health Check
    useEffect(() => {
        let raf = 0;
        let started = false;
        let t0 = 0;
        let lastChars = -1;

        const startAt = performance.now() + startDelayMs;

        const step = (now) => {
        if (!started && now >= startAt) {
            started = true;
            t0 = now;
        }

        if (!started) {
            raf = requestAnimationFrame(step);
            return;
        }

        const elapsed = now - t0;
        const chars = Math.min(text.length, Math.floor((elapsed / 1000) * cps));

        if (chars !== lastChars) {
            lastChars = chars;
            setOut(text.slice(0, chars));
        }

        if (chars < text.length) raf = requestAnimationFrame(step);
        };

        setOut("");
        lastChars = -1;
        raf = requestAnimationFrame(step);

        return () => cancelAnimationFrame(raf);
    }, [text, cps, startDelayMs]);

    return out;
    }

    
    export default function DivineLayout({ mode, onModeChange }) {
    const rootRef = useRef(null);
    const [entered, setEntered] = useState(false);
    const [seekerText, setSeekerText] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const [hasEnlightened, setHasEnlightened] = useState(false);
    const [divineText, setDivineText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [conversations, setConversations] = useState([]); 

    const divineLine = useMemo(
        () =>
        "Your purpose unfolds through awareness — and through the choices you dare to make while the universe watches.",
        []
    );

    const addConversation = (seeker, divine) => {
    setConversations((prev) => [
        {
        id: crypto.randomUUID(),
        ts: Date.now(),
        seeker,
        divine,
        },
        ...prev,
    ]);
    };


    const typed = useTypewriter(divineText, { cps: 42, startDelayMs: 150 });

    const handleEnlighten = async () => {
        const prompt = seekerText.trim();
        if (!prompt || isLoading) return;

        setHasEnlightened(true);
        setIsLoading(true);

        // reset so typewriter restarts when response lands
        setDivineText("");

        try {
        const resp = await fetch("/api/divine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
        });

        const data = await resp.json();
        const response = data.reply ?? data.text ?? "";

        // ✅ When response appears: show divine + clear seeker
        requestAnimationFrame(() => {
            setDivineText(response);
            setSeekerText("");
            setIsLoading(false);
        });

        addConversation(prompt, response);
        } catch (e) {
        console.error(e);
        setIsLoading(false);
        }

    };


    useEffect(() => {
        const el = rootRef.current;
        if (!el) return;

        // Scene reveal (entry animation)
        const id = requestAnimationFrame(() => setEntered(true));

        function onMove(e) {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        el.style.setProperty("--mx", x.toFixed(3));
        el.style.setProperty("--my", y.toFixed(3));
        }

        window.addEventListener("mousemove", onMove);
        return () => {
        cancelAnimationFrame(id);
        window.removeEventListener("mousemove", onMove);
        };
    }, []);

    const seekerAwaken = isFocused || isLoading; 

    return (
        <div ref={rootRef} className={`scene-root ${entered ? "scene-enter" : "scene-pre"}`}>
        <GalaxyBackground />

        {/* Mythic light rays (above galaxy, below vignette/UI) */}
        <div className="aura-rays" />

        {/* Film layers (above galaxy, below UI) */}
        <div className="cosmic-vignette" />
        <div className="cosmic-noise" />

        <div className="toggle-corner">
            <ModeToggle mode={mode} onChange={onModeChange} />
        </div>

        <div className="aura aura-seeker" />
        <div className="aura aura-divine" />
        <div className="aura aura-divine-core" />

        <div className={`seeker-wrap ${seekerAwaken ? "seeker-awaken" : ""}`}>
        <img
            className="figure seeker-figure parallax-figure"
            src="/seeker.png"
            alt="Seeker"
            draggable="false"
        />
        </div>

        <div className={`divine-wrap ${divineText ? "divine-awaken" : ""}`}>
        <div className="divine-glow" aria-hidden="true" />
        <img
            className="figure divine-figure parallax-figure"
            src="/divine.png"
            alt="Divine"
            draggable="false"
        />
        </div>


        <div className="seeker-prompt parallax-ui">
        <textarea
        className="seeker-prompt__input"
        placeholder="Ask the divine..."
        value={seekerText}
        onChange={(e) => {
        const value = e.target.value;
        setSeekerText(value);

        if (divineText) {
            setDivineText("");
            setHasEnlightened(false);
        }
        }}

        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        rows={3}
        />
        </div>

        {hasEnlightened && divineText && (
        <div className="divine-prompt parallax-ui">
            <div className="divine-prompt__text">
            {typed}
            <span className={typed.length < divineText.length ? "cursor" : "cursor done"}>▍</span>
            </div>
        </div>
        )}

        {/* ✅ Show Enlighten while typing OR loading, but hide once divineText exists */}
            {(seekerText.trim().length > 0 || isLoading) && !divineText && (
                <div
                className={`enlighten-text scene-button ${isLoading ? "loading" : ""}`}
                onClick={handleEnlighten}
                >
                Enlighten
                </div>
            )}

        <button
        className="history-fab"
        type="button"
        onClick={() => setIsHistoryOpen(true)}
        >
        Past conversations
        </button>

        <div
        className={`history-drawer ${isHistoryOpen ? "open" : ""}`}
        role="dialog"
        aria-label="Past conversations"
        >
        <div className="history-drawer__header">
            <div className="history-drawer__title">Past conversations</div>
            <button
            className="history-drawer__close"
            type="button"
            onClick={() => setIsHistoryOpen(false)}
            >
            ✕
            </button>
        </div>


        <div className="history-drawer__list">
            {conversations.length === 0 ? (
            <div className="history-drawer__empty">No conversations yet.</div>
            ) : (
            conversations.map((c) => (
                <button
                key={c.id}
                type="button"
                className="history-item"
                onClick={() => {
                    // Load conversation back into UI (recommended)
                    setSeekerText(c.seeker);
                    setDivineText(c.divine);
                    setHasEnlightened(true);
                    setIsHistoryOpen(false);
                }}
                >
                <div className="history-item__meta">
                    {new Date(c.ts).toLocaleString()}
                </div>
                <div className="history-item__q">
                    <span>Q:</span> {c.seeker}
                </div>
                <div className="history-item__a">
                    <span>A:</span> {c.divine}
                </div>
                </button>
            ))
            )}
        </div>
        </div>

        {/* optional overlay */}
        {isHistoryOpen && (
        <div className="history-overlay" onClick={() => setIsHistoryOpen(false)} />
        )}

        </div>
    );
    }
