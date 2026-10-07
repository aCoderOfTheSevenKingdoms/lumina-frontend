import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const RobotIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
    <path d="M12 2.5v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <circle cx="12" cy="2" r="1.1" fill="currentColor" />
    <rect x="4" y="6" width="16" height="12" rx="3.5" stroke="currentColor" strokeWidth="1.6" />
    <circle cx="9" cy="11.5" r="1.4" fill="currentColor" />
    <circle cx="15" cy="11.5" r="1.4" fill="currentColor" />
    <path d="M9 15.5h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const stripNode = (props) => {
  const { node: _node, ...rest } = props;
  return rest;
};

const markdownComponents = {
  p: (props) => <p className="mb-3 last:mb-0" {...stripNode(props)} />,
  a: (props) => (
    <a
      className="text-lumen underline underline-offset-2 hover:brightness-110"
      target="_blank"
      rel="noreferrer"
      {...stripNode(props)}
    />
  ),
  ul: (props) => <ul className="mb-3 list-disc space-y-1 pl-5 last:mb-0" {...stripNode(props)} />,
  ol: (props) => (
    <ol className="mb-3 list-decimal space-y-1 pl-5 last:mb-0" {...stripNode(props)} />
  ),
  li: (props) => <li className="marker:text-mist" {...stripNode(props)} />,
  h1: (props) => <h1 className="mb-3 mt-4 font-display text-xl first:mt-0" {...stripNode(props)} />,
  h2: (props) => <h2 className="mb-2 mt-4 font-display text-lg first:mt-0" {...stripNode(props)} />,
  h3: (props) => <h3 className="mb-2 mt-3 text-base font-semibold first:mt-0" {...stripNode(props)} />,
  blockquote: (props) => (
    <blockquote className="mb-3 border-l-2 border-line pl-3 text-mist last:mb-0" {...stripNode(props)} />
  ),
  hr: (props) => <hr className="my-4 border-line" {...stripNode(props)} />,
  table: (props) => (
    <div className="mb-3 overflow-x-auto last:mb-0">
      <table className="w-full border-collapse text-sm" {...stripNode(props)} />
    </div>
  ),
  th: (props) => (
    <th className="border border-line px-3 py-1.5 text-left font-semibold" {...stripNode(props)} />
  ),
  td: (props) => <td className="border border-line px-3 py-1.5" {...stripNode(props)} />,
  pre: (props) => (
    <pre
      className="mb-3 overflow-x-auto rounded-xl border border-line bg-ink p-3 text-[0.85rem] last:mb-0"
      {...stripNode(props)}
    />
  ),
  code: (props) => {
    const { node: _node, className, ...rest } = props;
    const isBlock = /language-/.test(className || "");
    return (
      <code
        className={isBlock ? className : "rounded bg-ink px-1.5 py-0.5 text-[0.85em] text-lumen"}
        {...rest}
      />
    );
  },
};

const MessageBubble = ({ message }) => {
  const isUser = message.role === "user";

  return (
    <div className={`flex items-end gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-medium ${
          isUser ? "bg-lumen/15 text-lumen" : "border border-line bg-panel text-lumen"
        }`}
      >
        {isUser ? "U" : <RobotIcon />}
      </span>

      <div
        className={`max-w-[75%] break-words rounded-2xl px-4 py-3 text-[0.95rem] leading-relaxed sm:max-w-[70%] ${
          isUser
            ? "whitespace-pre-wrap rounded-br-md bg-lumen text-ink"
            : "rounded-bl-md border border-line bg-panel text-frost"
        }`}
      >
        {isUser ? (
          message.content
        ) : (
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
            {message.content}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;

