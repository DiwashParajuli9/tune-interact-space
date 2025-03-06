
import React from "react";
import { Button } from "./ui/button";
import { GoogleIcon } from "./icons/GoogleIcon";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useUser } from "@/contexts/UserContext";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "./ui/dropdown-menu";

export const AuthButtons = () => {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isSignUp, setIsSignUp] = React.useState(false);
  const { user, signInWithGoogle, signOut } = useUser();

  const handleGoogleAuth = async () => {
    try {
      await signInWithGoogle();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Google authentication failed:", error);
    }
  };

  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full overflow-hidden">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-primary/20 flex items-center justify-center text-primary">
                  {user.name.charAt(0)}
                </div>
              )}
            </div>
            <span className="hidden md:inline">{user.name}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={signOut}>Sign out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            {isSignUp ? "Sign Up" : "Sign In"}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isSignUp ? "Create an account" : "Sign in"}</DialogTitle>
            <DialogDescription>
              {isSignUp 
                ? "Join the music platform to save your playlists and favorite songs." 
                : "Sign in to your account to access your playlists and favorites."}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <Button 
              variant="outline" 
              className="flex items-center justify-center gap-2 w-full"
              onClick={handleGoogleAuth}
            >
              <GoogleIcon />
              Continue with Google
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with email
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="your.email@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" />
            </div>
            <Button type="submit" className="w-full">
              {isSignUp ? "Create account" : "Sign in"}
            </Button>
          </div>
          <div className="flex justify-center text-sm">
            <span className="text-muted-foreground">
              {isSignUp ? "Already have an account? " : "Don't have an account? "}
            </span>
            <button 
              className="text-primary hover:underline ml-1"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? "Sign in" : "Create one"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
