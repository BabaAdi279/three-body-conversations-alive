
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => Promise<boolean>;
  disabled: boolean;
  isTyping: boolean;
  setIsTyping: (typing: boolean) => void;
  placeholder: string;
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  disabled, 
  isTyping, 
  setIsTyping,
  placeholder
}) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim() || disabled) return;
    
    setLoading(true);
    setIsTyping(true);
    
    const success = await onSendMessage(input);
    
    if (success) {
      setInput('');
    }
    
    setLoading(false);
    setIsTyping(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    setIsTyping(e.target.value.length > 0);
  };

  return (
    <div className="relative">
      <Input
        placeholder={loading ? "Waiting for response..." : placeholder}
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        disabled={disabled || loading}
        className="pr-12 bg-space-blue-light border-space-teal/30 focus-visible:ring-space-teal/50"
      />
      <Button
        size="icon"
        onClick={handleSendMessage}
        disabled={!input.trim() || disabled || loading}
        className="absolute right-1 top-1 h-8 w-8 bg-space-teal hover:bg-space-teal/80 text-space-blue"
      >
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ChatInput;
