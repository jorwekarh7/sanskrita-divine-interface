import { useState } from "react";
import DivineLayout from "./components/DivineLayout";
import GPTLayout from "./components/GPTLayout";
import "./index.css";

export default function App() {
  const [mode, setMode] = useState("divine"); // 'divine' | 'gpt'

  // ✅ Keep BOTH UIs mounted so their local state persists when switching.
  return (
    <>
      <div style={{ display: mode === "divine" ? "block" : "none" }}>
        <DivineLayout mode={mode} onModeChange={setMode} />
      </div>

      <div style={{ display: mode === "gpt" ? "block" : "none" }}>
        <GPTLayout mode={mode} onModeChange={setMode} />
      </div>
    </>
  );
}
