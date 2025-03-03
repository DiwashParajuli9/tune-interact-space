
import { useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useUserProfile } from "@/hooks/use-user-profile";
import { toast } from "sonner";

const ProfileDialog = () => {
  const { profile, updateProfile } = useUserProfile();
  const [name, setName] = useState(profile.name || "");
  const [imagePreview, setImagePreview] = useState<string | null>(profile.avatarUrl || null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check if file is an image
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    
    // Check if file is too large (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB");
      return;
    }
    
    setImageFile(file);
    const url = URL.createObjectURL(file);
    setImagePreview(url);
  };

  const handleSave = () => {
    // Convert image file to base64 if it exists
    if (imageFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateProfile({
          name: name.trim() || "User",
          avatarUrl: reader.result as string
        });
        setOpen(false);
        toast.success("Profile updated successfully");
      };
      reader.readAsDataURL(imageFile);
    } else {
      updateProfile({
        name: name.trim() || "User",
        avatarUrl: profile.avatarUrl
      });
      setOpen(false);
      toast.success("Profile updated successfully");
    }
  };

  // Reset form when dialog opens
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      setName(profile.name || "");
      setImagePreview(profile.avatarUrl || null);
      setImageFile(null);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
          <Avatar className="h-8 w-8 border border-border">
            {profile.avatarUrl ? (
              <AvatarImage src={profile.avatarUrl} alt={profile.name || "User"} />
            ) : (
              <AvatarFallback>{getInitials(profile.name || "User")}</AvatarFallback>
            )}
          </Avatar>
          <span className="text-sm font-medium hidden md:block">{profile.name || "User"}</span>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your profile information here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col items-center gap-4">
            <div 
              className="relative cursor-pointer group" 
              onClick={handleImageClick}
            >
              <Avatar className="h-24 w-24 border-2 border-border">
                {imagePreview ? (
                  <AvatarImage src={imagePreview} alt={name || "User"} />
                ) : (
                  <AvatarFallback className="text-lg">{getInitials(name || "User")}</AvatarFallback>
                )}
              </Avatar>
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-xs">Change Photo</span>
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileDialog;
