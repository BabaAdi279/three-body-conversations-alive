
import React, { useState, useEffect } from 'react';
import CharacterDropdown from '@/components/CharacterDropdown';
import ChatInterface from '@/components/ChatInterface';
import ThreeBodySystem from '@/components/ThreeBodySystem';
import StarField from '@/components/StarField';
import { Toaster } from 'sonner';

const Index = () => {
  const [selectedCharacter, setSelectedCharacter] = useState<string>('Ye Wenjie');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string>('');

  // Load API key from localStorage if available
  useEffect(() => {
    const savedApiKey = localStorage.getItem('claude-api-key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  // Save API key to localStorage when changed
  useEffect(() => {
    if (apiKey) {
      localStorage.setItem('claude-api-key', apiKey);
    }
  }, [apiKey]);

  return (
    <>
      <Toaster position="top-center" />
      <StarField />
      
      <div className="container mx-auto p-4 min-h-screen flex flex-col">
        <header className="mb-6 text-center">
          <h1 className="text-4xl font-bold mb-2 text-gradient">Three-Body Conversations</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Interact with characters from Cixin Liu's "The Three-Body Problem" novel series.
          </p>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
          <div className="lg:col-span-1 order-1 lg:order-1">
            <div className="bg-space-blue-light border border-space-purple/30 p-6 rounded-lg h-full flex flex-col">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3 text-space-teal glow-text">Choose a Character</h2>
                <CharacterDropdown 
                  selected={selectedCharacter} 
                  onSelect={setSelectedCharacter} 
                />
              </div>
              
              <div className="h-80 lg:h-[500px] relative flex-1 border border-space-purple/20 rounded-lg overflow-hidden">
                <ThreeBodySystem 
                  characterMode={selectedCharacter} 
                  isTyping={isTyping}
                />
              </div>
              
              <div className="mt-4 text-sm text-muted-foreground">
                <h3 className="text-space-teal mb-1">About {selectedCharacter}</h3>
                <p>{getCharacterDescription(selectedCharacter)}</p>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-2 order-2 lg:order-2">
            <div className="bg-space-blue-light border border-space-purple/30 p-6 rounded-lg h-full">
              <h2 className="text-xl font-semibold mb-4 text-space-teal glow-text">
                Conversation with {selectedCharacter}
              </h2>
              <ChatInterface 
                character={selectedCharacter} 
                isTyping={isTyping} 
                setIsTyping={setIsTyping}
                apiKey={apiKey}
                setApiKey={setApiKey}
              />
            </div>
          </div>
        </div>
        
        <footer className="mt-6 text-center text-sm text-muted-foreground">
          <p>Based on "The Three-Body Problem" by Cixin Liu • Powered by Claude AI</p>
        </footer>
      </div>
    </>
  );
};

const getCharacterDescription = (character: string) => {
  switch (character) {
    case 'Ye Wenjie':
      return "An astrophysicist who witnessed her father's death during the Cultural Revolution. Her experiences led to her fateful decision to contact the Trisolarans, setting the story's events in motion.";
    case 'Wang Miao':
      return "A nanomaterials researcher who becomes involved in investigating a mysterious organization. Through a virtual reality game, he learns about the Three-Body Problem and the Trisolaran civilization.";
    case 'Da Shi':
      return "A detective with the Battle Command Center, known for his straightforward approach and practical problem-solving. He provides a grounded perspective amid scientific complexities.";
    default:
      return "";
  }
};

export default Index;
