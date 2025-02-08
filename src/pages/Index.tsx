
import { useState, useRef, useEffect, useCallback } from "react";
import { X, Send } from "lucide-react";
import { cn } from "@/lib/utils";

const Index = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! How can I help you today?", isSent: false },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatBodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isChatOpen) {
      document.body.classList.add('chat-open');
      return () => {
        document.body.classList.remove('chat-open');
      };
    }
  }, [isChatOpen]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      setMessages((prev) => [...prev, { text: inputMessage, isSent: true }]);
      setInputMessage("");
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { text: "Thank you for your message!", isSent: false },
        ]);
      }, 1000);
    }
    inputRef.current?.focus();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="px-6 py-3 bg-gradient-to-r from-violet-500 to-violet-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        >
          Start Chat
        </button>
      )}

      {isChatOpen && (
        <>
          {/* Fixed Header Layer */}
          <div className="fixed top-0 left-0 right-0 z-[70] bg-white/5 backdrop-blur-xl border-b border-violet-500/10">
            <div className="p-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Chat Assistant</h2>
              <button
                onClick={() => setIsChatOpen(false)}
                className="p-2 hover:bg-violet-500/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Chat Container */}
          <div className="fixed inset-0 bg-background" style={{ paddingTop: '64px' }}>
            <div 
              ref={chatBodyRef}
              className="h-[calc(100%-128px)] overflow-y-auto p-4 space-y-4 touch-none"
            >
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={cn(
                    "max-w-[70%] animate-fade-in",
                    msg.isSent ? "ml-auto" : "mr-auto"
                  )}
                >
                  <div
                    className={cn(
                      "px-4 py-2 rounded-2xl",
                      msg.isSent
                        ? "bg-violet-500 text-white"
                        : "bg-violet-100/10 backdrop-blur-sm border border-violet-500/10"
                    )}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Fixed Input Layer */}
            <form
              onSubmit={sendMessage}
              className="fixed bottom-0 left-0 right-0 z-[70] p-4 bg-white/5 backdrop-blur-xl border-t border-violet-500/10"
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type a message..."
                  ref={inputRef}
                  className="flex-1 px-4 py-2 rounded-full bg-violet-100/10 border border-violet-500/10 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all"
                  autoFocus
                />
                <button
                  type="submit"
                  className="p-2 bg-violet-500 text-white rounded-full hover:bg-violet-600 transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default Index;
