
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MusicProvider } from "./contexts/MusicContext";
import { MessageProvider } from "./contexts/MessageContext";

import Home from "./pages/Index";
import Library from "./pages/Library";
import Artists from "./pages/Artists";
import Messages from "./pages/Messages";
import Playlists from "./pages/Playlists";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <MusicProvider>
      <MessageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner position="top-center" />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="/library" element={<Library />} />
                <Route path="/artists" element={<Artists />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/playlists" element={<Playlists />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </MessageProvider>
    </MusicProvider>
  </QueryClientProvider>
);

export default App;
