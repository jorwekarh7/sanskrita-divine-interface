    export default function ModeToggle({ mode, onChange }) {
    return (
        <div className="mode-toggle2" role="tablist" aria-label="Mode toggle">
        <button
            type="button"
            className={mode === "divine" ? "active" : ""}
            onClick={() => onChange?.("divine")}
        >
            Divine Mode
        </button>

        <button
            type="button"
            className={mode === "gpt" ? "active" : ""}
            onClick={() => onChange?.("gpt")}
        >
            GPT Mode
        </button>
        </div>
    );
    }
