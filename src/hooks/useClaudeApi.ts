
import { useState } from 'react';
import { toast } from "sonner";

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface UseClaudeApiProps {
  apiKey: string;
  character: string;
}

export const useClaudeApi = ({ apiKey, character }: UseClaudeApiProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getInitialMessage = () => {
    const initialMessages: Record<string, string> = {
      'Ye Wenjie': "Hello, I am Ye Wenjie, an astrophysicist. My experiences during the Cultural Revolution shaped my worldview significantly. What would you like to know about the three-body problem or my involvement with it?",
      'Wang Miao': "Greetings, I'm Wang Miao, a nanomaterials researcher. I've been experiencing strange phenomena lately, including mysterious countdowns appearing in my photos. What would you like to discuss about my experiences?",
      'Da Shi': "I'm Da Shi, detective with the Battle Command Center. I take a practical approach to the threats we face. No need for fancy science talk with me - what do you want to know?"
    };
    
    return initialMessages[character] || initialMessages['Ye Wenjie'];
  };

  const initializeChat = () => {
    if (apiKey) {
      const initialMessage = getInitialMessage();
      setMessages([{ role: 'assistant', content: initialMessage }]);
      setError(null);
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

  const sendMessage = async (userInput: string) => {
    if (!userInput.trim()) return;
    if (!apiKey) {
      toast.error("Please enter your Claude API key first");
      return false;
    }
    
    const userMessage = { role: 'user' as const, content: userInput };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    setError(null);
    
    try {
      // Prepare conversation history
      const formattedMessages = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      // Add user's current message
      formattedMessages.push({
        role: 'user',
        content: userInput
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
          system: `You are ${character} from the science fiction novel "The Three-Body Problem" by Cixin Liu. 
                  Answer questions in the first person as this character, with knowledge limited to what they would know 
                  in the book. ${getCharacterPersonality(character)} Keep responses concise (under 200 words).`,
          messages: formattedMessages
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('API Error:', response.status, errorData);
        
        // Extract more specific error message if available
        let errorMessage = `API request failed with status ${response.status}`;
        if (errorData?.error?.message) {
          errorMessage += `: ${errorData.error.message}`;
        }
        
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.content[0].text }]);
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      
      let errorMessage = "Failed to get a response. Please check your API key and try again.";
      
      if (error instanceof Error) {
        // Check for common API key errors
        if (error.message.includes('401') || error.message.includes('403')) {
          errorMessage = "Invalid API key. Please check your Claude API key and try again.";
        } else if (error.message.includes('429')) {
          errorMessage = "Rate limit exceeded. Please wait a moment and try again.";
        } else if (error.message.includes('Failed to fetch')) {
          errorMessage = "Network error. Please check your internet connection and try again.";
        }
        
        // Display more detailed error message for debugging
        setError(errorMessage);
      }
      
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    messages,
    loading,
    error,
    sendMessage,
    initializeChat
  };
};
