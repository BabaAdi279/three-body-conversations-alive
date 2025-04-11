
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface ApiKeyInputProps {
  apiKey: string;
  setApiKey: (key: string) => void;
  onApiKeySubmit: () => void;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({
  apiKey,
  setApiKey,
  onApiKeySubmit
}) => {
  const handleApiKeySubmit = () => {
    if (apiKey.trim()) {
      if (!apiKey.startsWith('sk-ant-')) {
        toast.error("Please enter a valid Claude API key (should start with 'sk-ant-')");
        return;
      }
      
      onApiKeySubmit();
      toast.success("API key saved!");
    } else {
      toast.error("Please enter a valid API key");
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 border border-space-teal/30 rounded-lg bg-space-blue-light mb-4">
      <h3 className="text-lg font-medium text-space-teal">Enter Claude API Key</h3>
      <p className="text-sm text-muted-foreground">This app uses Claude AI to generate character responses. Please enter your API key to continue.</p>
      <div className="flex gap-2">
        <Input
          type="password"
          placeholder="Enter your Claude API key (starts with sk-ant-)"
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
      <p className="text-xs text-muted-foreground">
        Get your API key from <a href="https://console.anthropic.com/" target="_blank" rel="noopener noreferrer" className="text-space-teal hover:underline">console.anthropic.com</a>.
      </p>
    </div>
  );
};

export default ApiKeyInput;
