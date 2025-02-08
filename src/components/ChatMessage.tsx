
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  text: string;
  isSent: boolean;
}

export const ChatMessage = ({ text, isSent }: ChatMessageProps) => {
  return (
    <div
      className={cn(
        "max-w-[70%] animate-fade-in",
        isSent ? "ml-auto" : "mr-auto"
      )}
    >
      <div
        className={cn(
          "px-4 py-2 rounded-lg",
          isSent
            ? "bg-violet-500 text-white"
            : "bg-violet-100/10 backdrop-blur-sm border border-violet-500/10"
        )}
      >
        {text}
      </div>
    </div>
  );
};
