
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
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleViewportChange = useCallback(() => {
    if (window.visualViewport) {
      const viewport = window.visualViewport;
      const currentHeight = viewport.height;
      const windowHeight = window.innerHeight;
      
      // Check if keyboard is likely open (viewport height significantly less than window height)
      const isKeyboardVisible = currentHeight < windowHeight * 0.8;
      setKeyboardOpen(isKeyboardVisible);

      if (chatBodyRef.current) {
        const headerHeight = 64; // Adjust based on your header height
        const inputHeight = 72; // Adjust based on your input container height
        const availableHeight = isKeyboardVisible ? currentHeight : windowHeight;
        const newHeight = availableHeight - headerHeight - inputHeight;
        
        chatBodyRef.current.style.height = `${newHeight}px`;
        chatBodyRef.current.style.maxHeight = `${newHeight}px`;
      }
    }
  }, []);

  useEffect(() => {
    if (isChatOpen && window.visualViewport) {
      // Initial setup
      handleViewportChange();
      
      window.visualViewport.addEventListener("resize", handleViewportChange);
      window.addEventListener("resize", handleViewportChange);
      
      return () => {
        window.visualViewport.removeEventListener("resize", handleViewportChange);
        window.removeEventListener("resize", handleViewportChange);
      };
    }
  }, [isChatOpen, handleViewportChange]);

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
        <div className="fixed inset-0 bg-background animate-fade-in">
          <div className="flex flex-col h-full">
            <div className="bg-white/5 backdrop-blur-xl border-b border-violet-500/10 p-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Chat Assistant</h2>
              <button
                onClick={() => setIsChatOpen(false)}
                className="p-2 hover:bg-violet-500/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div
              ref={chatBodyRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 transition-all duration-200"
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

            <form
              onSubmit={sendMessage}
              className={cn(
                "p-4 bg-white/5 backdrop-blur-xl border-t border-violet-500/10 transition-all duration-200",
                keyboardOpen ? "mb-0" : "mb-0"
              )}
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
        </div>
      )}
    </div>
  );
};

export default Index;
