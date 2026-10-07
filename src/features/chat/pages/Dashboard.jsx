import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useChat } from "../hooks/useChat";
import Sidebar from "../components/Sidebar";
import MessageBubble from "../components/MessageBubble";
import ChatInput from "../components/ChatInput";
import ChatLoader from "../components/ChatLoader";

const MenuIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
    <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);


const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const { chats, currentChatId, isLoading, error } = useSelector((state) => state.chat);

  const {
    initializeSocketConnection,
    handleGetChats,
    handleSelectChat,
    handleNewChat,
    handleSendMessage,
  } = useChat();

  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    initializeSocketConnection();
    handleGetChats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const chatList = Object.values(chats).sort(
    (a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0),
  );
  const activeChat = currentChatId ? chats[currentChatId] : null;
  const messages = activeChat?.messages ?? [];

  const onSelectChat = (chat) => {
    handleSelectChat(chat);
    setDrawerOpen(false);
  };

  const onNewChat = () => {
    handleNewChat();
    setDrawerOpen(false);
  };

  const onSend = (content) => {
    handleSendMessage({ message: content, chatId: currentChatId });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-ink font-sans text-frost">
      <Sidebar
        user={user}
        chats={chatList}
        activeChatId={currentChatId}
        onSelectChat={onSelectChat}
        onNewChat={onNewChat}
        onLogout={() => {}}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-line px-4 py-4 sm:px-6">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open navigation"
            className="text-mist transition-colors hover:text-frost lg:hidden"
          >
            <MenuIcon />
          </button>
          <div className="min-w-0">
            <h1 className="truncate font-display text-lg tracking-tight text-frost">
              {activeChat ? activeChat.title : "Lumina"}
            </h1>
            <p className="truncate text-xs text-mist">Web-aware answers, streamed live</p>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
          {messages.length === 0 && !isLoading ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-lumen/15 text-lumen">
                <span className="h-2.5 w-2.5 rounded-full bg-lumen shadow-[0_0_18px_5px_rgba(242,178,76,0.5)]" />
              </span>
              <h2 className="mt-5 font-display text-2xl tracking-tight">How can I help?</h2>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-mist">
                Ask anything — Lumina searches the live web and streams the answer back as it's
                generated.
              </p>
            </div>
          ) : (
            <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">
              {messages.map((message) => (
                <MessageBubble key={message._id} message={message} />
              ))}
              {isLoading && <ChatLoader />}
            </div>
          )}
        </section>

        {error && (
          <p
            role="alert"
            className="mx-auto mb-2 w-full max-w-3xl px-4 text-sm text-rose sm:px-6"
          >
            {error}
          </p>
        )}

        <ChatInput onSend={onSend} disabled={isLoading} />
      </main>
    </div>
  );
};

export default Dashboard;
