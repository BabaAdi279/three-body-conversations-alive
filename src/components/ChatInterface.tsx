
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

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
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showApiInput, setShowApiInput] = useState(!apiKey);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Initial message based on character
  useEffect(() => {
    const initialMessages: Record<string, string> = {
      'Ye Wenjie': "Hello, I am Ye Wenjie, an astrophysicist. My experiences during the Cultural Revolution shaped my worldview significantly. What would you like to know about the three-body problem or my involvement with it?",
      'Wang Miao': "Greetings, I'm Wang Miao, a nanomaterials researcher. I've been experiencing strange phenomena lately, including mysterious countdowns appearing in my photos. What would you like to discuss about my experiences?",
      'Da Shi': "I'm Da Shi, detective with the Battle Command Center. I take a practical approach to the threats we face. No need for fancy science talk with me - what do you want to know?"
    };
    
    if (apiKey) {
      const initialMessage = initialMessages[character] || initialMessages['Ye Wenjie'];
      setMessages([{ role: 'assistant', content: initialMessage }]);
    }
  }, [character, apiKey]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    if (!apiKey) {
      toast.error("Please enter your Claude API key first");
      setShowApiInput(true);
      return;
    }
    
    const userMessage = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setIsTyping(true);
    
    try {
      // Prepare system message and conversation history
      const systemMessage = {
        role: 'system',
        content: `You are ${character} from the science fiction novel "The Three-Body Problem" by Cixin Liu. 
        Answer questions in the first person as this character, with knowledge limited to what they would know 
        in the book. ${getCharacterPersonality(character)} Keep responses concise (under 200 words).`
      };
      
      // Format previous messages for the API
      const formattedMessages = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      // Add user's current message
      formattedMessages.push({
        role: 'user',
        content: input
      });
      
      // Make API request to Claude
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307',
          max_tokens: 1000,
          system: systemMessage.content,
          messages: formattedMessages
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('API Error:', response.status, errorData);
        throw new Error(`API request failed with status ${response.status}: ${errorData?.error?.message || 'Unknown error'}`);
      }
      
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.content[0].text }]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error("Failed to get a response. Please check your API key and try again.");
    } finally {
      setLoading(false);
      setIsTyping(false);
    }
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

  const handleApiKeySubmit = () => {
    if (apiKey.trim()) {
      setShowApiInput(false);
      toast.success("API key saved!");
    } else {
      toast.error("Please enter a valid API key");
    }
  };

  const getCharacterPersonality = (char: string) => {
    switch (char) {
      case 'Ye Wenjie':
        return "You witnessed the horrors of the Cultural Revolution and developed a cynical view of humanity. You are intellectual, traumatized, and determined. You believe contact with an alien civilization might save or judge humanity.";
      case 'Wang Miao':
        return "You are analytical, curious, and somewhat naive. As a scientist, you approach problems methodically and are disturbed by the strange phenomena you've been witnessing.";
      case 'Da Shi':
        return "You are direct, practical, and occasionally crude. You have street smarts and cut through academic pretension. You use simple language and focus on results.";
      default:
        return "";
    }
  };

  return (
    <div className="flex flex-col h-full">
      {showApiInput ? (
        <div className="flex flex-col gap-4 p-4 border border-space-teal/30 rounded-lg bg-space-blue-light mb-4">
          <h3 className="text-lg font-medium text-space-teal">Enter Claude API Key</h3>
          <p className="text-sm text-muted-foreground">This app uses Claude AI to generate character responses. Please enter your API key to continue.</p>
          <div className="flex gap-2">
            <Input
              type="password"
              placeholder="Enter your Claude API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="bg-space-blue border-space-purple/30"
            />
            <Button 
              onClick={handleApiKeySubmit}
              className="bg-space-purple hover:bg-space-purple/80"
            >
              Save
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">Your API key is stored locally in your browser and never sent to our servers.</p>
        </div>
      ) : (
        <Button 
          variant="outline" 
          className="mb-4 text-xs border-space-purple/30 self-end" 
          onClick={() => setShowApiInput(true)}
        >
          Change API Key
        </Button>
      )}
      
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
      </div>
      
      <div className="relative">
        <Input
          placeholder={loading ? "Waiting for response..." : `Ask ${character} a question...`}
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          disabled={loading || !apiKey}
          className="pr-12 bg-space-blue-light border-space-teal/30 focus-visible:ring-space-teal/50"
        />
        <Button
          size="icon"
          onClick={handleSendMessage}
          disabled={!input.trim() || loading || !apiKey}
          className="absolute right-1 top-1 h-8 w-8 bg-space-teal hover:bg-space-teal/80 text-space-blue"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatInterface;
