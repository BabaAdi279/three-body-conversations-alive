
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useClaudeApi } from '@/hooks/useClaudeApi';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import ApiKeyInput from './ApiKeyInput';

interface ChatInterfaceProps {
  character: string;
  isTyping: boolean;
  setIsTyping: (typing: boolean) => void;
  apiKey: string;
  setApiKey: (key: string) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  character, 
  isTyping, 
  setIsTyping,
  apiKey,
  setApiKey
}) => {
  const [showApiInput, setShowApiInput] = useState(!apiKey);
  
  const { 
    messages, 
    loading, 
    error, 
    sendMessage, 
    initializeChat 
  } = useClaudeApi({ 
    apiKey, 
    character 
  });

  // Initialize chat with character's initial message
  useEffect(() => {
    if (apiKey) {
      initializeChat();
    }
  }, [character, apiKey]);

  const handleApiKeySubmit = () => {
    setShowApiInput(false);
  };

  return (
    <div className="flex flex-col h-full">
      {showApiInput ? (
        <ApiKeyInput 
          apiKey={apiKey} 
          setApiKey={setApiKey} 
          onApiKeySubmit={handleApiKeySubmit} 
        />
      ) : (
        <Button 
          variant="outline" 
          className="mb-4 text-xs border-space-purple/30 self-end" 
          onClick={() => setShowApiInput(true)}
        >
          Change API Key
        </Button>
      )}
      
      <ChatMessages 
        messages={messages} 
        loading={loading} 
        error={error} 
      />
      
      <ChatInput 
        onSendMessage={sendMessage} 
        disabled={!apiKey} 
        isTyping={isTyping} 
        setIsTyping={setIsTyping}
        placeholder={`Ask ${character} a question...`}
      />
    </div>
  );
};

export default ChatInterface;
