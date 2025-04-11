
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useClaudeApi } from '@/hooks/useClaudeApi';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import ApiKeyInput from './ApiKeyInput';
import { Wifi, WifiOff } from "lucide-react";

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
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
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

  // Track online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

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
      <div className="flex justify-between items-center mb-4">
        {isOnline ? (
          <div className="flex items-center text-green-500 text-xs">
            <Wifi size={16} className="mr-1" />
            <span>Connected</span>
          </div>
        ) : (
          <div className="flex items-center text-red-500 text-xs">
            <WifiOff size={16} className="mr-1" />
            <span>Offline - Check connection</span>
          </div>
        )}
        
        {!showApiInput && (
          <Button 
            variant="outline" 
            className="text-xs border-space-purple/30 self-end" 
            onClick={() => setShowApiInput(true)}
          >
            Change API Key
          </Button>
        )}
      </div>
      
      {showApiInput ? (
        <ApiKeyInput 
          apiKey={apiKey} 
          setApiKey={setApiKey} 
          onApiKeySubmit={handleApiKeySubmit} 
        />
      ) : null}
      
      <ChatMessages 
        messages={messages} 
        loading={loading} 
        error={error} 
      />
      
      <ChatInput 
        onSendMessage={sendMessage} 
        disabled={!apiKey || !isOnline} 
        isTyping={isTyping} 
        setIsTyping={setIsTyping}
        placeholder={isOnline ? `Ask ${character} a question...` : "You're offline. Reconnect to continue..."}
      />
    </div>
  );
};

export default ChatInterface;
