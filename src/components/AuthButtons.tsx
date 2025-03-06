
import React from "react";
import { Button } from "./ui/button";
import { useUser } from "@/contexts/UserContext";
import { SignInButton, UserButton } from "@clerk/clerk-react";

export const AuthButtons = () => {
  const { user } = useUser();

  if (user) {
    return (
      <UserButton
        appearance={{
          elements: {
            userButtonAvatarBox: "w-9 h-9",
          },
        }}
      />
    );
  }

  return (
    <SignInButton mode="modal">
      <Button variant="outline" size="sm">
        Sign In
      </Button>
    </SignInButton>
  );
};
