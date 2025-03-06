
import React from "react";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { AuthButtons } from "@/components/AuthButtons";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

const Profile = () => {
  const { user } = useUser();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Sign In Required</CardTitle>
            <CardDescription>
              Please sign in to view your profile
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <AuthButtons />
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-16 w-16 border border-white/10">
            <AvatarImage src={user.photoURL || ""} alt={user.name} />
            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
              {user.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl">{user.name}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Account Information</h3>
              <div className="text-sm text-muted-foreground">
                Manage your account settings and preferences
              </div>
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between py-2 border-b">
                <span className="font-medium">Account ID</span>
                <span className="text-muted-foreground">{user.id}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="font-medium">Email</span>
                <span className="text-muted-foreground">{user.email}</span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <AuthButtons />
        </CardFooter>
      </Card>
    </div>
  );
};

export default Profile;
