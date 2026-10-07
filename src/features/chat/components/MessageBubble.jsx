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

const MessageBubble = ({ message }) => {
  const isUser = message.role === "user";

  return (
    <div className={`flex items-end gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-medium ${
          isUser ? "bg-lumen/15 text-lumen" : "border border-line bg-panel text-lumen"
        }`}
      >
        {isUser ? "U" : <SparkIcon />}
      </span>

      <div
        className={`max-w-[75%] whitespace-pre-wrap break-words rounded-2xl px-4 py-3 text-[0.95rem] leading-relaxed sm:max-w-[70%] ${
          isUser
            ? "rounded-br-md bg-lumen text-ink"
            : "rounded-bl-md border border-line bg-panel text-frost"
        }`}
      >
        {message.content}
      </div>
    </div>
  );
};

export default MessageBubble;
