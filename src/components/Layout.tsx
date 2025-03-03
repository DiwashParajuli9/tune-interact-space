
import { Outlet } from 'react-router-dom';
import { Sidebar } from './ui/sidebar';
import MusicPlayer from './MusicPlayer';
import AudioPlayer from './AudioPlayer';
import { useMusic } from '@/contexts/MusicContext';
import ProfileDialog from './ProfileDialog';

const Layout = () => {
  const { currentSong, isPlaying, isMiniPlayer } = useMusic();

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-col flex-grow overflow-hidden">
        <div className="h-14 border-b flex items-center justify-end px-4">
          <ProfileDialog />
        </div>
        <main className="flex-grow overflow-y-auto">
          <Outlet />
        </main>
      </div>
      {currentSong && isPlaying && !isMiniPlayer && <MusicPlayer />}
      {currentSong && <AudioPlayer />}
    </div>
  );
};

export default Layout;
