import { useState } from "react";

const formatDuration = (ms) => {
  if (ms == null || ms < 0) return "";
  const seconds = ms / 1000;
  if (seconds < 10) return `${seconds.toFixed(1)}s`;
  const rounded = Math.round(seconds);
  if (rounded < 60) return `${rounded}s`;
  const minutes = Math.floor(rounded / 60);
  const rest = rounded % 60;
  return rest ? `${minutes}m ${rest}s` : `${minutes}m`;
};

const hostnameOf = (url) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
};

const ChevronIcon = ({ open }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={`h-3.5 w-3.5 shrink-0 transition-transform ${open ? "rotate-90" : ""}`}
  >
    <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const stageLabel = (entry) => {
  switch (entry.type) {
    case "thinking":
      return "Thinking";
    case "search":
      return entry.query ? `Searched the web for “${entry.query}”` : "Searched the web";
    case "sources": {
      const count = entry.sources?.length ?? 0;
      return `Read ${count} source${count === 1 ? "" : "s"}`;
    }
    case "writing":
      return "Writing the answer";
    default:
      return entry.type;
  }
};

const liveLabel = (timeline) => {
  const last = timeline[timeline.length - 1];
  switch (last?.type) {
    case "search":
      return "Searching the web…";
    case "sources":
      return "Reading the sources…";
    case "writing":
      return "Writing the answer…";
    default:
      return "Thinking…";
  }
};

const ThoughtThread = ({ message }) => {
  const timeline = message.metadata?.timeline ?? [];
  const durationMs = message.metadata?.durationMs;
  const isStreaming = Boolean(message.streaming);
  const [open, setOpen] = useState(false);

  if (!timeline.length) return null;

  // Hide empty "sources" stages (e.g. a tool error returned nothing).
  const stages = timeline.filter(
    (entry) => entry.type !== "sources" || (entry.sources?.length ?? 0) > 0
  );

  return (
    <div className="mb-3">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-1.5 text-xs font-medium text-mist transition-colors hover:text-frost"
        aria-expanded={open}
      >
        <ChevronIcon open={open} />
        <span>
          {isStreaming ? liveLabel(timeline) : `Thought ${formatDuration(durationMs)}`.trim()}
        </span>
      </button>

      {open && (
        <div className="mt-2 space-y-3 border-l border-line pl-3">
          {stages.map((entry, index) => (
            <div key={`${entry.type}-${index}`} className="text-xs text-mist">
              <p className={entry.type === "search" ? "text-frost" : undefined}>
                {stageLabel(entry)}
              </p>

              {entry.type === "sources" && (
                <ul className="mt-1.5 space-y-1.5">
                  {entry.sources.map((source) => (
                    <li key={source.url}>
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-start gap-2 text-mist transition-colors hover:text-frost"
                      >
                        {source.favicon ? (
                          <img
                            src={source.favicon}
                            alt=""
                            loading="lazy"
                            className="mt-0.5 h-4 w-4 shrink-0 rounded-sm"
                          />
                        ) : (
                          <span className="mt-0.5 h-4 w-4 shrink-0 rounded-sm bg-line" />
                        )}
                        <span className="min-w-0">
                          <span className="block truncate text-frost/90">{source.title}</span>
                          <span className="block truncate text-[0.7rem] text-mist/70">
                            {hostnameOf(source.url)}
                          </span>
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThoughtThread;
