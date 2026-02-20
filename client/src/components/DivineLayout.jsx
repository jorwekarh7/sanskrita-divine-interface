    import { useEffect, useRef } from "react";
    import GalaxyBackground from "./GalaxyBackground";
    import ModeToggle from "./ModeToggle";

    export default function DivineLayout() {
    const rootRef = useRef(null);

    useEffect(() => {
        const el = rootRef.current;

        function onMove(e) {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        el.style.setProperty("--mx", x.toFixed(3));
        el.style.setProperty("--my", y.toFixed(3));
        }

        window.addEventListener("mousemove", onMove);
        return () => window.removeEventListener("mousemove", onMove);
    }, []);

    return (
        <div ref={rootRef} className="scene-root">
        <GalaxyBackground />

        {/* Toggle top-left */}
        <div className="toggle-corner">
            <ModeToggle />
        </div>

        {/* Atmospheric Auras (behind figures) */}
        <div className="aura aura-seeker" />
        <div className="aura aura-divine" />
        <div className="aura aura-divine-core" />

        {/* Seeker bottom-left */}
        <img
            className="figure seeker-figure parallax-figure"
            src="/seeker.png"
            alt="Seeker"
            draggable="false"
        />

        {/* Divine right */}
        <img
            className="figure divine-figure parallax-figure"
            src="/divine.png"
            alt="Divine"
            draggable="false"
        />

        {/* Divine response bubble */}
        <div className="speech speech-divine parallax-ui">
            <div className="speech-title">DIVINE RESPONSE</div>
            <div className="speech-text">Your purpose unfolds through awareness.</div>
        </div>

        {/* User prompt bubble */}
        <div className="speech speech-user parallax-ui">
            <div className="speech-title">USER PROMPT</div>
            <div className="prompt-row">
            <input className="prompt-input2" placeholder="Ask the divine..." />
            <button className="send-btn2">Submit</button>
            </div>
        </div>
        </div>
    );
    }
