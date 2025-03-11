import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { useMusic } from "@/contexts/MusicContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BarChart, Users, Music, MessageSquare, Bell, Settings, ShieldAlert, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

const AdminDashboard = () => {
  const { user } = useUser();
  const { songs, trendingSongs, isLoading } = useMusic();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  
  const [newSong, setNewSong] = useState({
    title: "",
    artist: "",
    albumCover: "",
    audioSrc: "",
    duration: 0,
  });

  const [manageSongs, setManageSongs] = useState([...songs]);

  React.useEffect(() => {
    if (user && !user.isAdmin) {
      toast.error("You don't have permission to access the admin dashboard");
      navigate("/");
    } else if (!user) {
      navigate("/landing");
    }
  }, [user, navigate]);

  const handleRemoveSong = (songId: string) => {
    setManageSongs(prev => prev.filter(song => song.id !== songId));
    toast.success("Song removed successfully");
  };

  const handleAddSong = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newSong.title || !newSong.artist || !newSong.albumCover || !newSong.audioSrc) {
      toast.error("Please fill all required fields");
      return;
    }
    
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
    
    setManageSongs(prev => [song, ...prev]);
    
    setNewSong({
      title: "",
      artist: "",
      albumCover: "",
      audioSrc: "",
      duration: 0,
    });
    
    toast.success("Song added successfully");
  };

  if (!user || !user.isAdmin) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to access the admin dashboard.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => navigate("/")}>Return to Home</Button>
          </CardFooter>
        </Card>
      </div>
    );
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
                  <div className="space-y-2">
                    <Label htmlFor="albumCover">Album Cover URL</Label>
                    <Input
                      id="albumCover"
                      value={newSong.albumCover}
                      onChange={(e) => setNewSong({ ...newSong, albumCover: e.target.value })}
                      placeholder="Enter album cover URL"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="audioSrc">Audio Source URL</Label>
                    <Input
                      id="audioSrc"
                      value={newSong.audioSrc}
                      onChange={(e) => setNewSong({ ...newSong, audioSrc: e.target.value })}
                      placeholder="Enter audio source URL"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (seconds)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={newSong.duration || ""}
                      onChange={(e) => setNewSong({ ...newSong, duration: Number(e.target.value) })}
                      placeholder="Enter duration in seconds"
                    />
                  </div>
                </div>
                <Button type="submit" className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Song
                </Button>
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
                    <div className="p-4 text-center">Loading songs...</div>
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
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Remove</span>
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
