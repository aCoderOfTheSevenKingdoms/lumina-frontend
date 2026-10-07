import { useRef, useState } from "react";

const SendIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
    <path
      d="M4.5 12h15m0 0l-6-6m6 6l-6 6"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ChatInput = ({ onSend, disabled = false }) => {
  const [value, setValue] = useState("");
  const textareaRef = useRef(null);
  const canSend = value.trim().length > 0 && !disabled;

  const submit = () => {
    const content = value.trim();
    if (!content || disabled) return;

    onSend?.(content);
    setValue("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleChange = (event) => {
    setValue(event.target.value);
    const el = event.target;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  };

  return (
    <div className="border-t border-line bg-ink-2 px-4 py-4 sm:px-6">
      <div className="mx-auto flex w-full max-w-3xl items-end gap-3 rounded-2xl border border-line bg-panel px-3 py-2 transition-colors focus-within:border-lumen/60">
        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          disabled={disabled}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Message Lumina…"
          className="max-h-40 flex-1 resize-none bg-transparent py-1.5 text-[0.95rem] leading-relaxed text-frost outline-none placeholder:text-mist/50 disabled:cursor-not-allowed"
        />
        <button
          type="button"
          onClick={submit}
          disabled={!canSend}
          aria-label="Send message"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-lumen text-ink transition hover:brightness-105 disabled:cursor-not-allowed disabled:bg-panel disabled:text-mist/40"
        >
          <SendIcon />
        </button>
      </div>

      <p className="mx-auto mt-2 max-w-3xl text-center text-xs text-mist/50">
        Lumina searches the live web as it answers. Press Enter to send, Shift + Enter for a new line.
      </p>
    </div>
  );
};

export default ChatInput;
