
import React, { useState, useRef, useEffect } from "react";
import { useMessages } from "@/contexts/MessageContext";
import MessageCard from "@/components/MessageCard";
import SearchInput from "@/components/SearchInput";
import { Send, User, UserPlus, X, MessageSquare } from "lucide-react";
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
  const isMobile = useIsMobile();

  // Sort conversations by last activity
  const sortedConversations = [...conversations].sort((a, b) =>
    b.last_message_at.getTime() - a.last_message_at.getTime()
  );

  // Scroll to bottom of messages when conversation changes or new message is added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConversation]);

  // Handle message input change
  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  // Handle message submit
  const handleMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(message);
      setMessage("");
    }
  };

  // Handle user search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const results = searchUsers(query);
    setSearchResults(results);
  };

  // Add user to selection
  const addUserToSelection = (user: any) => {
    if (!selectedUsers.some((u) => u.id === user.id)) {
      setSelectedUsers([...selectedUsers, user]);
    }
    setSearchQuery("");
    setSearchResults([]);
  };

  // Remove user from selection
  const removeUserFromSelection = (userId: string) => {
    setSelectedUsers(selectedUsers.filter((user) => user.id !== userId));
  };

  // Create a new conversation
  const handleCreateConversation = () => {
    if (selectedUsers.length > 0) {
      createConversation(selectedUsers.map((user) => user.id));
      setSelectedUsers([]);
      setDialogOpen(false);
    }
  };

  // Format time for messages
  const formatMessageTime = (date: Date) => {
    const now = new Date();
    const diffInDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffInDays === 0) {
      return format(date, "h:mm a");
    } else if (diffInDays === 1) {
      return "Yesterday";
    } else if (diffInDays < 7) {
      return format(date, "EEEE");
    } else {
      return format(date, "MMM d, yyyy");
    }
  };

  return (
    <div className="pb-20">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-display font-bold">Messages</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="flex items-center">
              <UserPlus size={16} className="mr-2" />
              New Conversation
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Start a conversation</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <SearchInput
                  placeholder="Search for users..."
                  onSearch={handleSearch}
                />
              </div>

              {/* Selected users */}
              {selectedUsers.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center bg-secondary text-secondary-foreground text-sm px-2 py-1 rounded-full"
                    >
                      <span className="mr-1">{user.name}</span>
                      <button
                        onClick={() => removeUserFromSelection(user.id)}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Search results */}
              {searchResults.length > 0 && (
                <div className="max-h-48 overflow-y-auto">
                  {searchResults.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center p-2 rounded-md hover:bg-secondary/50 transition-colors cursor-pointer"
                      onClick={() => addUserToSelection(user)}
                    >
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-muted mr-3">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-sm">{user.name}</span>
                    </div>
                  ))}
                </div>
              )}

              <Button
                onClick={handleCreateConversation}
                disabled={selectedUsers.length === 0}
              >
                Start Conversation
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Conversations list */}
        <div className="md:col-span-1 bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-4 border-b border-border">
            <SearchInput
              placeholder="Search messages..."
              onSearch={() => {}}
              className="w-full"
            />
          </div>
          <div className="max-h-[calc(100vh-16rem)] overflow-y-auto">
            {sortedConversations.length > 0 ? (
              sortedConversations.map((conversation) => (
                <MessageCard
                  key={conversation.id}
                  conversation={conversation}
                  isActive={
                    activeConversation
                      ? conversation.id === activeConversation.id
                      : false
                  }
                />
              ))
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                <p>No conversations yet</p>
                <p className="text-sm mt-1">
                  Start a new conversation to chat with others
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Active conversation */}
        <div className="md:col-span-2 bg-card border border-border rounded-xl overflow-hidden flex flex-col h-[calc(100vh-16rem)]">
          {activeConversation ? (
            <>
              {/* Conversation header */}
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center">
                  {activeConversation.participants.length > 2 ? (
                    <div className="relative w-10 h-10 mr-3">
                      <div className="absolute top-0 left-0 w-7 h-7 rounded-full overflow-hidden bg-muted border-2 border-card z-10">
                        <img
                          src={
                            activeConversation.participants.find(
                              (p) => p.id !== currentUser.id
                            )?.avatar_url || "/placeholder.svg"
                          }
                          alt="User"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute bottom-0 right-0 w-7 h-7 rounded-full overflow-hidden bg-muted border-2 border-card">
                        <div className="w-full h-full bg-primary flex items-center justify-center">
                          <User size={14} className="text-primary-foreground" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-muted mr-3">
                      <img
                        src={
                          activeConversation.participants.find(
                            (p) => p.id !== currentUser.id
                          )?.avatar_url || "/placeholder.svg"
                        }
                        alt="User"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <h3 className="font-medium">
                      {activeConversation.participants
                        .filter((p) => p.id !== currentUser?.id)
                        .map((p) => p.username)
                        .join(", ")}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {activeConversation.participants.length}{" "}
                      {activeConversation.participants.length > 1
                        ? "participants"
                        : "participant"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                  {activeConversation.messages.map((msg) => {
                    const sender = activeConversation.participants.find(
                      (p) => p.id === msg.user_id
                    );
                    const isCurrentUser = msg.user_id === currentUser?.id;

                    return (
                      <div
                        key={msg.id}
                        className={cn(
                          "flex",
                          isCurrentUser ? "justify-end" : "justify-start"
                        )}
                      >
                        <div
                          className={cn(
                            "max-w-[70%]",
                            isCurrentUser ? "order-2" : "order-1"
                          )}
                        >
                          {!isCurrentUser && (
                            <div className="flex items-center ml-2 mb-1">
                              <div className="w-6 h-6 rounded-full overflow-hidden bg-muted mr-2">
                                <img
                                  src={sender?.avatar_url || "/placeholder.svg"}
                                  alt={sender?.username || "User"}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <span className="text-xs font-medium">
                                {sender?.username || "User"}
                              </span>
                            </div>
                          )}
                          <div
                            className={cn(
                              "rounded-2xl p-3",
                              isCurrentUser
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary text-secondary-foreground"
                            )}
                          >
                            <p className="text-sm">{msg.content}</p>
                          </div>
                          <div
                            className={cn(
                              "text-xs text-muted-foreground mt-1",
                              isCurrentUser ? "text-right mr-2" : "ml-2"
                            )}
                          >
                            {formatMessageTime(msg.created_at)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Message input */}
              <div className="p-4 border-t border-border">
                <form
                  onSubmit={handleMessageSubmit}
                  className="flex items-center space-x-2"
                >
                  <input
                    type="text"
                    value={message}
                    onChange={handleMessageChange}
                    placeholder="Type a message..."
                    className="flex-1 bg-secondary border-none rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <Button type="submit" size="icon" className="rounded-full">
                    <Send size={18} />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                <MessageSquare size={24} className="text-muted-foreground" />
              </div>
              <h3 className="text-xl font-display font-medium mb-2">
                No conversation selected
              </h3>
              <p className="text-muted-foreground max-w-md mb-6">
                Select a conversation from the sidebar or start a new one to
                begin chatting.
              </p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus size={16} className="mr-2" />
                    Start a conversation
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Start a conversation</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <SearchInput
                      placeholder="Search for users..."
                      onSearch={handleSearch}
                    />
                    {/* Search results would go here */}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
