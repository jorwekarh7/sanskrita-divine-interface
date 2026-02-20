    export default function ChatArea() {
    return (
        <div className="chat-dock">
        <div className="bubbles">
            <div className="bubble seeker-bubble">What is my purpose?</div>
            <div className="bubble divine-bubble">
            Your purpose unfolds through awareness.
            </div>
        </div>

        <div className="input-row">
            <input className="prompt-input" placeholder="Ask the divine..." />
            <button className="send-btn">Send</button>
        </div>
        </div>
    );
    }
