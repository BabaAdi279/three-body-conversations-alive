
import React from 'react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, User, BookOpen, Shield } from "lucide-react";

interface CharacterDropdownProps {
  selected: string;
  onSelect: (character: string) => void;
}

const characters = [
  { id: 'Ye Wenjie', name: 'Ye Wenjie', icon: <User className="h-4 w-4 mr-2" />, description: 'Astrophysicist & Key Figure' },
  { id: 'Wang Miao', name: 'Wang Miao', icon: <BookOpen className="h-4 w-4 mr-2" />, description: 'Nanomaterials Researcher' },
  { id: 'Da Shi', name: 'Da Shi', icon: <Shield className="h-4 w-4 mr-2" />, description: 'Police Detective' }
];

const CharacterDropdown: React.FC<CharacterDropdownProps> = ({ selected, onSelect }) => {
  const selectedCharacter = characters.find(c => c.id === selected) || characters[0];
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="border-space-teal/50 bg-space-blue hover:bg-space-blue-light hover:text-space-teal flex items-center w-full sm:w-auto justify-between gap-2"
        >
          <div className="flex items-center">
            {selectedCharacter.icon}
            <span>{selectedCharacter.name}</span>
          </div>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-space-blue-light border-space-teal/30 text-foreground">
        {characters.map((character) => (
          <DropdownMenuItem
            key={character.id}
            onClick={() => onSelect(character.id)}
            className={`flex items-center cursor-pointer ${
              selected === character.id ? 'bg-space-teal/20 text-space-teal' : 'hover:bg-space-blue hover:text-space-teal'
            }`}
          >
            <div className="flex flex-col">
              <div className="flex items-center">
                {character.icon}
                <span>{character.name}</span>
              </div>
              <span className="text-xs text-muted-foreground pl-6">{character.description}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CharacterDropdown;
