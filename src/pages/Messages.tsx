
import React, { useState, useRef, useEffect } from "react";
import { useMessages } from "@/contexts/MessageContext";
import MessageCard from "@/components/MessageCard";
import SearchInput from "@/components/SearchInput";
import { Send, User, UserPlus, X } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

const Messages = () => {
  const {
    conversations,
    activeConversation,
    setActiveConversation,
    sendMessage,
    currentUser,
    users,
    searchUsers,
    createConversation,
  } = useMessages();
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMobile = use