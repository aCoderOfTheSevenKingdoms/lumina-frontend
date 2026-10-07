import { useEffect, useState } from "react";

const LOADING_PHRASES = [
  "Searching the live web…",
  "Reading the sources…",
  "Thinking it through…",
  "Writing the answer…",
];

const SparkIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
    <path
      d="M12 3v5m0 8v5m9-9h-5M8 12H3m14.5-6.5l-3.5 3.5m0 6l3.5 3.5m0-13L14 8.5m-6 7L4.5 19"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

const ChatLoader = () => {
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((index) => (index + 1) % LOADING_PHRASES.length);
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-end gap-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line bg-panel text-lumen">
        <SparkIcon />
      </span>

      <div className="flex items-center gap-3 rounded-2xl rounded-bl-md border border-line bg-panel px-4 py-3 text-sm text-mist">
        <span className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-lumen [animation-delay:-0.3s]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-lumen [animation-delay:-0.15s]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-lumen" />
        </span>
        <span aria-live="polite">{LOADING_PHRASES[phraseIndex]}</span>
      </div>
    </div>
  );
};

export default ChatLoader;
