import { useEffect, useState } from "react";
import { useApp } from "../context/AppContext";

function Chat({ request, onClose }) {
  const { user } = useApp();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const chatKey = `bagsafeChat_${request.requestId}`;

  // ......................................... load the saved conversation for this request ................................

  const loadMessages = () => {
    try {
      const savedMessages = JSON.parse(localStorage.getItem(chatKey)) || [];
      setMessages(Array.isArray(savedMessages) ? savedMessages : []);
    } catch {
      setMessages([]);
    }
  };

  // ......................................... refresh chat when another user updates the conversation ................................

  useEffect(() => {
    loadMessages();

    const handleChatUpdate = () => loadMessages();
    const handleStorageUpdate = (event) => {
      if (event.key === chatKey) loadMessages();
    };

    window.addEventListener("bagsafeChatUpdated", handleChatUpdate);
    window.addEventListener("storage", handleStorageUpdate);

    // ......................................... render the conversation and message composer ................................

    return () => {
      window.removeEventListener("bagsafeChatUpdated", handleChatUpdate);
      window.removeEventListener("storage", handleStorageUpdate);
    };
  }, [chatKey]);

  // ........................ validate and save a new chat message ........................

  // ............ validate and save a new message before refreshing the chat .........................

  const sendMessage = (e) => {
    e.preventDefault();

    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      setError("Please enter a message.");
      return;
    }

    if (trimmedMessage.length > 500) {
      setError("Message must be 500 characters or less.");
      return;
    }

    if (!user?.id) {
      setError("You must be logged in to send a message.");
      return;
    }

    const newMessage = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      senderId: user.id,
      senderName: user.name,
      senderRole: user.role,
      message: trimmedMessage,
      createdAt: new Date().toISOString(),
    };

    const updatedMessages = [...messages, newMessage];
    localStorage.setItem(chatKey, JSON.stringify(updatedMessages));
    setMessages(updatedMessages);
    setMessage("");
    setError("");
    window.dispatchEvent(new Event("bagsafeChatUpdated"));
  };

  const otherPerson =
    user.role === "student"
      ? request.homeownerName || "Homeowner"
      : request.studentName || "Student";

  const requestStatus = request.status || "pending";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-3 sm:p-4 dark:bg-slate-900/80">
      <div className="flex h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-900">
        <div className="border-b border-slate-200 bg-white px-4 py-4 sm:px-5 dark:border-slate-700 dark:bg-slate-900">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="truncate text-lg font-bold text-slate-900 dark:text-slate-100 sm:text-xl">
                Chat with {otherPerson}
              </h3>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span>Request ID: {request.requestId}</span>
                <span className="hidden sm:inline">•</span>
                <span className="capitalize">{requestStatus}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close chat"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-50 text-3xl font-semibold 
              leading-none text-red-500 transition hover:bg-red-100 hover:text-red-700 dark:bg-red-950/40
               dark:text-red-400 dark:hover:bg-red-950/70"
            >
              ×
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-slate-50 p-3 dark:bg-slate-950 sm:p-6">
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center px-4 text-center">
              <div>
                <div className="text-5xl">💬</div>

                <h4 className="mt-4 text-lg font-semibold text-slate-800 dark:text-slate-200">
                  Start the conversation
                </h4>

                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Ask about arrival time, shelter details, location,
                  availability or any other booking questions.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((item) => {
                const isMine = item.senderId === user.id;

                return (
                  <div
                    key={item.id}
                    className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[88%] rounded-2xl px-4 py-3 sm:max-w-[78%] ${
                        isMine
                          ? "rounded-br-md bg-blue-600 text-white"
                          : "rounded-bl-md bg-white text-slate-800 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:ring-slate-700"
                      }`}
                    >
                      {!isMine && (
                        <p className="mb-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
                          {item.senderName || otherPerson}
                        </p>
                      )}

                      <p className="break-words text-sm leading-6">
                        {item.message}
                      </p>

                      <p
                        className={`mt-1 text-[10px] ${
                          isMine ? "text-blue-100" : "text-slate-400"
                        }`}
                      >
                        {new Date(item.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <form
          onSubmit={sendMessage}
          className="border-t border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900 sm:p-4"
        >
          {error && (
            <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600 dark:bg-red-950/40 dark:text-red-400">
              {error}
            </p>
          )}

          <div className="flex gap-2 sm:gap-3">
            <input
              type="text"
              value={message}
              maxLength={500}
              onChange={(e) => {
                setMessage(e.target.value);
                if (error) setError("");
              }}
              placeholder="Type your message..."
              className="min-w-0 flex-1 rounded-xl border border-slate-300 px-3 py-3 text-sm outline-none transition
               focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-950 dark:focus:ring-blue-900/50 dark:focus:border-blue-400"
            />

            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition
               hover:bg-blue-700 sm:px-5 dark:hover:bg-blue-500"
            >
              Send
            </button>
          </div>

          <p className="mt-2 text-right text-[10px] text-slate-400 dark:text-slate-500">
            {message.length}/500
          </p>
        </form>
      </div>
    </div>
  );
}

export default Chat;
