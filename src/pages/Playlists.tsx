
import React, { useState } from "react";
import { useMusic } from "@/contexts/MusicContext";
import PlaylistCard from "@/components/PlaylistCard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Music } from "lucide-react";
import SongCard from "@/components/SongCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Playlists = () => {
  const { playlists, createPlaylist } = useMusic();
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [selectedPlaylist, setSelectedPlaylist] = useState(playlists[0] || null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      createPlaylist(newPlaylistName.trim());
      setNewPlaylistName("");
    }
  };

  return (
    <div className="pb-20">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-display font-bold">Your Playlists</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center">
              <Plus size={16} className="mr-2" />
              New Playlist
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create new playlist</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="playlist-name">Playlist name</Label>
                <Input
                  id="playlist-name"
                  placeholder="My awesome playlist"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                />
              </div>
              <Button onClick={handleCreatePlaylist}>Create</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {playlists.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-secondary mx-auto flex items-center justify-center mb-4">
            <Music size={24} className="text-muted-foreground" />
          </div>
          <h3 className="text-xl font-display font-medium mb-2">No playlists yet</h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            Create your first playlist to organize your favorite songs.
          </p>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus size={16} className="mr-2" />
                Create your first playlist
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create new playlist</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="playlist-name">Playlist name</Label>
                  <Input
                    id="playlist-name"
                    placeholder="My awesome playlist"
                    value={newPlaylistName}
                    onChange={(e) => setNewPlaylistName(e.target.value)}
                  />
                </div>
                <Button onClick={handleCreatePlaylist}>Create</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <>
          {/* Playlist grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {playlists.map((playlist) => (
              <div
                key={playlist.id}
                onClick={() => {
                  setSelectedPlaylist(playlist);
                  setIsDetailsOpen(true);
                }}
                className="cursor-pointer"
              >
                <PlaylistCard playlist={playlist} />
              </div>
            ))}
          </div>

          {/* Playlist details dialog */}
          {selectedPlaylist && (
            <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
              <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                  <DialogTitle>{selectedPlaylist.name}</DialogTitle>
                </DialogHeader>
                <Tabs defaultValue="songs" className="py-4">
                  <TabsList>
                    <TabsTrigger value="songs">Songs</TabsTrigger>
                    <TabsTrigger value="details">Details</TabsTrigger>
                  </TabsList>
                  <TabsContent value="songs">
                    {selectedPlaylist.songs.length > 0 ? (
                      <div className="space-y-2">
                        {selectedPlaylist.songs.map((song) => (
                          <SongCard key={song.id} song={song} variant="list" />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No songs in this playlist yet</p>
                      </div>
                    )}
                  </TabsContent>
                  <TabsContent value="details">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-1">Created</h4>
                        <p className="text-muted-foreground">
                          {new Intl.DateTimeFormat("en-US", {
                            dateStyle: "long",
                            timeStyle: "short",
                          }).format(selectedPlaylist.createdAt)}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-1">Songs</h4>
                        <p className="text-muted-foreground">
                          {selectedPlaylist.songs.length} {selectedPlaylist.songs.length === 1 ? "song" : "songs"}
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>
          )}
        </>
      )}
    </div>
  );
};

export default Playlists;
