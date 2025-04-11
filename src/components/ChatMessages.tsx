
import React, { useRef, useEffect } from 'react';
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Message } from '@/hooks/useClaudeApi';

interface ChatMessagesProps {
  messages: Message[];
  loading: boolean;
  error: string | null;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ 
  messages, 
  loading, 
  error 
}) => {
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, error]);

  return (
    <div
      ref={chatContainerRef}
      className="flex-1 overflow-y-auto mb-4 px-1 chat-container"
      style={{ maxHeight: 'calc(100vh - 250px)' }}
    >
      {messages.map((message, index) => (
        <div
          key={index}
          className={message.role === 'user' ? 'chat-message-user' : 'chat-message-bot'}
        >
          <div className="prose prose-invert">
            {message.content.split('\n').map((paragraph, i) => (
              <p key={i} className={i === 0 ? "mt-0" : ""}>{paragraph}</p>
            ))}
          </div>
        </div>
      ))}
      
      {loading && (
        <div className="chat-message-bot flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Thinking...</span>
        </div>
      )}

      {error && (
        <Alert variant="destructive" className="mt-2 bg-red-900/20 border-red-500/50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="ml-2">
            {error}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default ChatMessages;
