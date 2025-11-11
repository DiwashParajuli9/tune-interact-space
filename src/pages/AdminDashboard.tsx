import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { useMusic } from "@/contexts/MusicContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BarChart, Users, Music, MessageSquare, Bell, Settings, ShieldAlert, Plus, Trash2, Loader2, Upload, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { searchTracks } from "@/lib/api";

const AdminDashboard = () => {
  const { user } = useUser();
  const { songs, trendingSongs, isLoading, addSong, removeSong } = useMusic();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [newSong, setNewSong] = useState({
    title: "",
    artist: "",
    albumCover: "",
    audioSrc: "",
    duration: 180,
  });

  const [manageSongs, setManageSongs] = useState([]);
  const audioFileInputRef = useRef(null);
  const coverFileInputRef = useRef(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  useEffect(() => {
    if (songs?.length > 0) {
      setManageSongs(songs);
    }
  }, [songs]);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  const handleRemoveSong = async (songId) => {
    try {
      await removeSong(songId);
      
      setManageSongs(prev => prev.filter(song => song.id !== songId));
      
      toast.success("Song removed successfully");
    } catch (error) {
      console.error("Error removing song:", error);
      toast.error("Failed to remove song");
    }
  };

  const handleAddSong = async (e) => {
    e.preventDefault();
    
    if (!newSong.title || !newSong.artist || !newSong.albumCover || !newSong.audioSrc) {
      toast.error("Please fill all required fields");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const song = {
        id: `song-${Date.now()}`,
        title: newSong.title,
        artist: newSong.artist,
        albumCover: newSong.albumCover,
        audioSrc: newSong.audioSrc,
        duration: newSong.duration || 180,
        artistId: `artist-${Date.now()}`,
        albumId: `album-${Date.now()}`,
      };
      
      await addSong(song);
      
      setManageSongs(prev => [song, ...prev]);
      
      setNewSong({
        title: "",
        artist: "",
        albumCover: "",
        audioSrc: "",
        duration: 180,
      });
      
      setCoverPreview(null);
      
      toast.success("Song added successfully");
    } catch (error) {
      console.error("Error adding song:", error);
      toast.error("Failed to add song");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSearchSample = async () => {
    try {
      const results = await searchTracks("sample music");
      if (results && results.length > 0) {
        const sample = results[0];
        setNewSong({
          title: sample.title,
          artist: sample.artist,
          albumCover: sample.albumCover,
          audioSrc: sample.audioSrc,
          duration: sample.duration,
        });
        setCoverPreview(sample.albumCover);
        toast.success("Sample data loaded");
      }
    } catch (error) {
      console.error("Error fetching sample data:", error);
      toast.error("Failed to load sample data");
    }
  };

  const handleAudioFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('audio/')) {
      toast.error("Please select an audio file");
      return;
    }

    setIsSubmitting(true);
    
    const audioSrc = URL.createObjectURL(file);
    
    const fileName = file.name.replace(/\.[^/.]+$/, "");
    let title = fileName;
    let artist = "Unknown Artist";
    
    if (fileName.includes(" - ")) {
      const parts = fileName.split(" - ");
      artist = parts[0].trim();
      title = parts.slice(1).join(" - ").trim();
    }
    
    const defaultCover = "https://placehold.co/400x400/4338ca/ffffff?text=Music";
    
    const audio = new Audio(audioSrc);
    
    audio.addEventListener('loadedmetadata', async () => {
      try {
        const duration = Math.round(audio.duration);
        
        const song = {
          id: `song-${Date.now()}`,
          title,
          artist,
          albumCover: defaultCover,
          audioSrc,
          duration,
          artistId: `artist-${Date.now()}`,
          albumId: `album-${Date.now()}`,
        };
        
        setNewSong({
          title,
          artist,
          albumCover: defaultCover,
          audioSrc,
          duration,
        });
        
        setCoverPreview(defaultCover);
        
        toast.success("Audio file loaded successfully", {
          description: "You can edit the details before adding the song",
        });
      } catch (error) {
        console.error("Error processing audio file:", error);
        toast.error("Failed to process audio file");
        URL.revokeObjectURL(audioSrc);
      } finally {
        setIsSubmitting(false);
      }
    });
    
    audio.addEventListener('error', () => {
      console.error("Error loading audio file");
      toast.error("Failed to load audio file");
      URL.revokeObjectURL(audioSrc);
      setIsSubmitting(false);
    });
  };

  const handleCoverFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const coverDataUrl = event.target?.result as string;
      
      setNewSong(prev => ({
        ...prev,
        albumCover: coverDataUrl
      }));
      
      setCoverPreview(coverDataUrl);
      toast.success("Cover image uploaded");
    };
    
    reader.onerror = () => {
      toast.error("Failed to read image file");
    };
    
    reader.readAsDataURL(file);
  };

  const triggerAudioFileUpload = () => {
    audioFileInputRef.current.click();
  };

  const triggerCoverFileUpload = () => {
    coverFileInputRef.current.click();
  };

  if (!user) {
    return null;
  }

  const stats = [
    { title: "Total Users", value: "1,234", icon: Users, color: "bg-blue-500" },
    { title: "Total Songs", value: manageSongs.length.toString(), icon: Music, color: "bg-purple-500" },
    { title: "Messages", value: "932", icon: MessageSquare, color: "bg-green-500" },
    { title: "Reports", value: "28", icon: ShieldAlert, color: "bg-red-500" },
  ];

  const recentUsers = [
    { id: "1", name: "Jane Cooper", email: "jane@example.com", status: "active" },
    { id: "2", name: "Robert Fox", email: "robert@example.com", status: "inactive" },
    { id: "3", name: "Esther Howard", email: "esther@example.com", status: "active" },
    { id: "4", name: "Jenny Wilson", email: "jenny@example.com", status: "active" },
  ];

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your music platform</p>
        </div>
        <div className="flex items-center gap-4">
          <Button size="sm" variant="outline">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </Button>
          <Button size="sm" variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <h3 className="text-3xl font-bold mt-1">{stat.value}</h3>
                </div>
                <div className={`${stat.color} p-3 rounded-full`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="songs">Manage Songs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Platform Overview</CardTitle>
              <CardDescription>
                Key metrics and performance indicators for your music platform.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center border rounded-md">
                <div className="flex flex-col items-center text-center p-8">
                  <BarChart className="h-16 w-16 mb-2 text-muted-foreground" />
                  <h3 className="text-lg font-medium">Analytics Dashboard</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    View detailed analytics and insights about your platform's usage and performance.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                View and manage users of your platform.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md divide-y">
                {recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={`https://i.pravatar.cc/150?u=${user.id}`} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }`}>
                        {user.status}
                      </span>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Export Users</Button>
              <Button>Add New User</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Content Management</CardTitle>
              <CardDescription>
                Manage music, artists, and playlists on your platform.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center border rounded-md">
                <div className="flex flex-col items-center text-center p-8">
                  <Music className="h-16 w-16 mb-2 text-muted-foreground" />
                  <h3 className="text-lg font-medium">Music Content</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Manage songs, albums, artists, and other content. Review and moderate user-generated content.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reported Content</CardTitle>
              <CardDescription>
                Review and moderate reported content from users.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center border rounded-md">
                <div className="flex flex-col items-center text-center p-8">
                  <ShieldAlert className="h-16 w-16 mb-2 text-muted-foreground" />
                  <h3 className="text-lg font-medium">No Active Reports</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    There are currently no reported items requiring your attention.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="songs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add New Song</CardTitle>
              <CardDescription>
                Add a new song to your music platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <input 
                type="file" 
                ref={audioFileInputRef}
                accept="audio/*"
                onChange={handleAudioFileUpload}
                className="hidden"
              />
              
              <input 
                type="file" 
                ref={coverFileInputRef}
                accept="image/*"
                onChange={handleCoverFileUpload}
                className="hidden"
              />
              
              <div className="mb-6">
                <div className="border border-dashed rounded-md p-8 flex flex-col items-center justify-center">
                  <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Upload from your computer</h3>
                  <p className="text-sm text-muted-foreground text-center mb-4">
                    Upload MP3, WAV, or other audio files directly from your device
                  </p>
                  <Button 
                    type="button" 
                    onClick={triggerAudioFileUpload}
                    disabled={isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Select Audio File
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <form onSubmit={handleAddSong} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Song Title</Label>
                    <Input
                      id="title"
                      value={newSong.title}
                      onChange={(e) => setNewSong({ ...newSong, title: e.target.value })}
                      placeholder="Enter song title"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="artist">Artist</Label>
                    <Input
                      id="artist"
                      value={newSong.artist}
                      onChange={(e) => setNewSong({ ...newSong, artist: e.target.value })}
                      placeholder="Enter artist name"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="albumCover">Album Cover</Label>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                      <div className="flex-shrink-0">
                        <div className="w-24 h-24 border rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                          {coverPreview ? (
                            <img 
                              src={coverPreview} 
                              alt="Album cover preview" 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ImageIcon className="h-10 w-10 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                      <div className="flex-grow space-y-2">
                        <div className="flex gap-2">
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={triggerCoverFileUpload} 
                            className="flex-grow"
                          >
                            <ImageIcon className="mr-2 h-4 w-4" />
                            Upload Cover Image
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">Or enter URL below:</p>
                        <Input
                          id="albumCover"
                          value={newSong.albumCover}
                          onChange={(e) => {
                            setNewSong({ ...newSong, albumCover: e.target.value });
                            setCoverPreview(e.target.value);
                          }}
                          placeholder="Enter album cover URL"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="audioSrc">Audio Source URL</Label>
                    <Input
                      id="audioSrc"
                      value={newSong.audioSrc}
                      onChange={(e) => setNewSong({ ...newSong, audioSrc: e.target.value })}
                      placeholder="Enter audio source URL"
                      required
                      disabled={newSong.audioSrc && newSong.audioSrc.startsWith('blob:')}
                    />
                    {newSong.audioSrc && newSong.audioSrc.startsWith('blob:') && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Using uploaded audio file
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (seconds)</Label>
                    <Input
                      id="duration"
                      type="number"
                      min="1"
                      value={newSong.duration || ""}
                      onChange={(e) => setNewSong({ ...newSong, duration: Number(e.target.value) })}
                      placeholder="Enter duration in seconds"
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <Button type="button" variant="outline" onClick={handleSearchSample}>
                    Load Sample Data
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Song
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Manage Songs</CardTitle>
              <CardDescription>
                View and manage all songs on your platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md overflow-hidden">
                <div className="grid grid-cols-12 bg-muted p-4 font-medium text-sm">
                  <div className="col-span-1">Cover</div>
                  <div className="col-span-4">Title</div>
                  <div className="col-span-3">Artist</div>
                  <div className="col-span-2">Duration</div>
                  <div className="col-span-2">Actions</div>
                </div>
                
                <div className="divide-y">
                  {isLoading ? (
                    <div className="p-4 text-center">
                      <Loader2 className="h-6 w-6 animate-spin inline-block mr-2" />
                      Loading songs...
                    </div>
                  ) : manageSongs.length === 0 ? (
                    <div className="p-4 text-center">No songs available</div>
                  ) : (
                    manageSongs.map((song) => (
                      <div key={song.id} className="grid grid-cols-12 p-4 items-center">
                        <div className="col-span-1">
                          <img src={song.albumCover} alt={song.title} className="w-10 h-10 object-cover rounded" />
                        </div>
                        <div className="col-span-4 font-medium truncate">{song.title}</div>
                        <div className="col-span-3 text-muted-foreground truncate">{song.artist}</div>
                        <div className="col-span-2">
                          {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
                        </div>
                        <div className="col-span-2">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRemoveSong(song.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Export Songs List</Button>
              <div className="text-sm text-muted-foreground">
                Total: {manageSongs.length} songs
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
