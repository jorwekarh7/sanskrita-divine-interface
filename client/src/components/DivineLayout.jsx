    import { useEffect, useMemo, useRef, useState } from "react";
    import GalaxyBackground from "./GalaxyBackground";
    import ModeToggle from "./ModeToggle";

    function useTypewriter(text, { cps = 40, startDelayMs = 400 } = {}) {
    const [out, setOut] = useState("");

    useEffect(() => {
        let raf = 0;
        let t0 = 0;
        let started = false;
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
        setOut(text.slice(0, chars));

        if (chars < text.length) raf = requestAnimationFrame(step);
        };

        setOut("");
        raf = requestAnimationFrame(step);
        return () => cancelAnimationFrame(raf);
    }, [text, cps, startDelayMs]);

    return out;
    }

    export default function DivineLayout() {
    const rootRef = useRef(null);
    const [entered, setEntered] = useState(false);

    const divineLine = useMemo(
        () =>
        "Your purpose unfolds through awareness — and through the choices you dare to make while the universe watches.",
        []
    );

    const typed = useTypewriter(divineLine, { cps: 42, startDelayMs: 650 });

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

    return (
        <div ref={rootRef} className={`scene-root ${entered ? "scene-enter" : "scene-pre"}`}>
        <GalaxyBackground />

        {/* Mythic light rays (above galaxy, below vignette/UI) */}
        <div className="aura-rays" />

        {/* Film layers (above galaxy, below UI) */}
        <div className="cosmic-vignette" />
        <div className="cosmic-noise" />

        <div className="toggle-corner">
            <ModeToggle />
        </div>

        <div className="aura aura-seeker" />
        <div className="aura aura-divine" />
        <div className="aura aura-divine-core" />

        <img className="figure seeker-figure parallax-figure" src="/seeker.png" alt="Seeker" draggable="false" />
        <img className="figure divine-figure parallax-figure" src="/divine.png" alt="Divine" draggable="false" />

        <div className="seeker-prompt parallax-ui">
        <input
            className="seeker-prompt__input"
            placeholder="Ask the divine..."
        />
        </div>

        <div className="divine-prompt parallax-ui">
        <input
            className="seeker-prompt__input"
            placeholder="Speak as the divine..."
        />
        </div>

        </div>
    );
    }
