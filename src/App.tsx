
import { Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MusicProvider } from "@/contexts/MusicContext";
import { MessageProvider } from "@/contexts/MessageContext";
import Layout from "@/components/Layout";
import Index from "@/pages/Index";
import Library from "@/pages/Library";
import Playlists from "@/pages/Playlists";
import Artists from "@/pages/Artists";
import Messages from "@/pages/Messages";
import NotFound from "@/pages/NotFound";
import "./App.css";

function App() {
  return (
    <MusicProvider>
      <MessageProvider>
        <TooltipProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Index />} />
              <Route path="/library" element={<Library />} />
              <Route path="/playlists" element={<Playlists />} />
              <Route path="/artists" element={<Artists />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
          <Toaster position="top-right" />
        </TooltipProvider>
      </MessageProvider>
    </MusicProvider>
  );
}

export default App;
