import React from 'react';
import { AlertCircle, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

const YouTubeSetup: React.FC = () => {
  const openYouTubeConsole = () => {
    window.open('https://console.developers.google.com/', '_blank');
  };

  return (
    <Alert className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>YouTube Integration Setup Required</AlertTitle>
      <AlertDescription className="mt-2">
        <p className="mb-3">
          To enable YouTube music streaming, you need to set up a YouTube Data API v3 key:
        </p>
        <ol className="list-decimal list-inside mb-3 space-y-1 text-sm">
          <li>Visit the Google Developers Console</li>
          <li>Create a new project or select an existing one</li>
          <li>Enable the "YouTube Data API v3"</li>
          <li>Create credentials (API key)</li>
          <li>Replace 'YOUR_YOUTUBE_API_KEY_HERE' in src/lib/api.ts</li>
        </ol>
        <Button onClick={openYouTubeConsole} variant="outline" size="sm" className="mt-2">
          <ExternalLink className="h-4 w-4 mr-2" />
          Open Google Console
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default YouTubeSetup;