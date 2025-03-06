
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MusicProvider } from "@/contexts/MusicContext";
import { MessageProvider } from "@/contexts/MessageContext";
import Layout from "@/components/Layout";
import Index from "@/pages/Index";
import Library from "@/pages/Library";
import Playlists from "@/pages/Playlists";
import Artists from "@/pages/Artists";
import Messages from "@/pages/Messages";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";
import Landing from "@/pages/Landing";
import AudioPlayer from "@/components/AudioPlayer";
import MusicPlayer from "@/components/MusicPlayer";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MusicProvider>
        <MessageProvider>
          <TooltipProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/landing" element={<Landing />} />
                <Route path="/" element={<Layout />}>
                  <Route index element={<Index />} />
                  <Route path="/library" element={<Library />} />
                  <Route path="/playlists" element={<Playlists />} />
                  <Route path="/artists" element={<Artists />} />
                  <Route path="/messages" element={<Messages />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
              <AudioPlayer />
              <MusicPlayer />
              <Toaster position="top-right" />
            </BrowserRouter>
          </TooltipProvider>
        </MessageProvider>
      </MusicProvider>
    </QueryClientProvider>
  );
}

export default App;
