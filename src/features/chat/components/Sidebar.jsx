const formatTimestamp = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const diff = Date.now() - date.getTime();
  const day = 24 * 60 * 60 * 1000;

  if (diff < day) {
    return date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  }
  if (diff < 7 * day) {
    return date.toLocaleDateString(undefined, { weekday: "short" });
  }
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
    <path
      d="M6 6l12 12M18 6L6 18"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const ChatIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 shrink-0">
    <path
      d="M21 12a8.5 8.5 0 01-12.2 7.6L4 21l1.4-4.1A8.5 8.5 0 1121 12z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const TrashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
    <path
      d="M4 7h16M9 7V5.5A1.5 1.5 0 0110.5 4h3A1.5 1.5 0 0115 5.5V7m2 0v11a2 2 0 01-2 2H9a2 2 0 01-2-2V7m3 4v5m4-5v5"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const LogoutIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
    <path
      d="M15 12H4m0 0l3.5-3.5M4 12l3.5 3.5M10 5h5a2 2 0 012 2v10a2 2 0 01-2 2h-5"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Sidebar = ({
  user,
  chats = [],
  activeChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  onLogout,
  open = false,
  onClose,
}) => {
  const initial = (user?.username || user?.email || "U").charAt(0).toUpperCase();

  return (
    <>
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 z-30 bg-ink/70 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 shrink-0 flex-col border-r border-line bg-ink-2 transition-transform duration-300 lg:static lg:z-auto lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <div className="flex items-center gap-3">
            <span className="h-2.5 w-2.5 rounded-full bg-lumen shadow-[0_0_18px_5px_rgba(242,178,76,0.5)]" />
            <span className="font-display text-2xl tracking-tight text-frost">Lumina</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="text-mist transition-colors hover:text-frost lg:hidden"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="px-4">
          <button
            type="button"
            onClick={onNewChat}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-line bg-panel py-2.5 text-sm font-medium text-frost transition hover:border-lumen/50 hover:text-lumen focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lumen"
          >
            <PlusIcon />
            New chat
          </button>
        </div>

        <div className="mt-6 flex-1 overflow-y-auto px-2">
          <p className="px-3 pb-2 text-xs uppercase tracking-[0.14em] text-mist/60">Chats</p>

          {chats.length === 0 ? (
            <p className="px-3 py-6 text-sm leading-relaxed text-mist/70">
              No conversations yet. Start a new chat to see it here.
            </p>
          ) : (
            <ul className="space-y-1">
              {chats.map((chat) => {
                const active = chat._id === activeChatId;
                return (
                  <li key={chat._id}>
                    <div
                      className={`group flex w-full items-center gap-1 rounded-lg pr-1.5 transition ${
                        active
                          ? "bg-lumen/10 text-lumen"
                          : "text-mist hover:bg-panel hover:text-frost"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => onSelectChat?.(chat)}
                        className="flex min-w-0 flex-1 items-center gap-3 rounded-lg px-3 py-2.5 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lumen"
                      >
                        <ChatIcon />
                        <span className="flex-1 truncate text-left">{chat.title}</span>
                        <span
                          className={`shrink-0 text-[11px] ${active ? "text-lumen/80" : "text-mist/50"}`}
                        >
                          {formatTimestamp(chat.updatedAt)}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteChat?.(chat)}
                        aria-label={`Delete ${chat.title || "chat"}`}
                        className="shrink-0 rounded-md p-1.5 text-mist/50 transition hover:bg-rose/10 hover:text-rose focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="border-t border-line p-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-lumen/15 text-sm font-medium text-lumen">
              {initial}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm text-frost">{user?.username || "Guest"}</p>
              <p className="truncate text-xs text-mist">{user?.email || "Not signed in"}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-line py-2.5 text-sm text-mist transition hover:border-rose/40 hover:text-rose focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose"
          >
            <LogoutIcon />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
