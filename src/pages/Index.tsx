
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
    const handleResize = () => {
      if (chatBodyRef.current && window.visualViewport) {
        const headerHeight = 64;
        const inputHeight = 64; // Reduced input area height
        const availableHeight = window.visualViewport.height;
        chatBodyRef.current.style.height = `${availableHeight - (headerHeight + inputHeight)}px`;
      }
    };

    if (isChatOpen) {
      window.visualViewport?.addEventListener('resize', handleResize);
      handleResize();
    }

    return () => {
      window.visualViewport?.removeEventListener('resize', handleResize);
    };
  }, [isChatOpen]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      setMessages((prev) => [...prev, { text: inputMessage, isSent: true }]);
      setInputMessage("");
      // Blur input to close keyboard after sending
      inputRef.current?.blur();
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { text: "Thank you for your message!", isSent: false },
        ]);
      }, 1000);
    }
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
        <div className="fixed inset-0 flex flex-col bg-background">
          {/* Fixed Header */}
          <div className="fixed top-0 left-0 right-0 h-16 z-[70] bg-background/95 backdrop-blur-xl border-b border-violet-500/10">
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

          {/* Chat Body */}
          <div 
            ref={chatBodyRef}
            className="flex-1 overflow-y-auto pt-16 pb-16 px-4 space-y-4 touch-pan-y overscroll-contain"
            style={{ height: 'calc(100vh - 128px)' }}
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
                    "px-4 py-2 rounded-lg",
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

          {/* Fixed Input Area */}
          <form
            onSubmit={sendMessage}
            className="fixed bottom-0 left-0 right-0 h-16 z-[70] bg-background border-t border-violet-500/10"
          >
            <div className="h-full px-4 flex gap-2 items-center">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type a message..."
                ref={inputRef}
                className="flex-1 h-10 px-4 rounded-lg bg-violet-100/10 border border-violet-500/10 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all"
              />
              <button
                type="submit"
                className="h-10 w-10 flex items-center justify-center bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Index;
