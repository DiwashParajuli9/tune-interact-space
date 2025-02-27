
import React from "react";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMessages } from "@/contexts/MessageContext";

interface MessageCardProps {
  conversation: {
    id: string;
    participants: {
      id: string;
      name: string;
      avatar: string;
    }[];
    messages: {
      id: string;
      userId: string;
      content: string;
      timestamp: Date;
    }[];
    lastActivity: Date;
  };
  isActive?: boolean;
}

const MessageCard: React.FC<MessageCardProps> = ({ conversation, isActive }) => {
  const { currentUser, setActiveConversation } = useMessages();

  // Format timestamp to relative time
  const formatRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return "just now";
    } else if (diffInSeconds < 3600) {
      const mins = Math.floor(diffInSeconds / 60);
      return `${mins}m ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}h ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return days === 1 ? "yesterday" : `${days}d ago`;
    }
  };

  // Get other participants (excluding current user)
  const otherParticipants = conversation.participants.filter(
    (p) => p.id !== currentUser.id
  );

  // Get conversation name
  const getConversationName = (): string => {
    if (otherParticipants.length === 0) {
      return "Just you";
    } else if (otherParticipants.length === 1) {
      return otherParticipants[0].name;
    } else {
      return `${otherParticipants[0].name} and ${otherParticipants.length - 1} more`;
    }
  };

  // Get last message
  const lastMessage = conversation.messages[conversation.messages.length - 1];
  
  // Check if last message is from current user
  const isLastMessageFromCurrentUser = lastMessage?.userId === currentUser.id;

  // Truncate message content
  const truncateContent = (content: string, maxLength: number = 40): string => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  return (
    <div
      className={cn(
        "flex items-start p-3 rounded-md cursor-pointer transition-colors",
        isActive
          ? "bg-secondary"
          : "hover:bg-secondary/50"
      )}
      onClick={() => setActiveConversation(conversation)}
    >
      {/* Avatar or group avatar */}
      <div className="relative mr-3 flex-shrink-0">
        {otherParticipants.length === 1 ? (
          <div className="w-10 h-10 rounded-full overflow-hidden bg-muted">
            <img
              src={otherParticipants[0].avatar}
              alt={otherParticipants[0].name}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="relative w-10 h-10">
            <div className="absolute top-0 left-0 w-7 h-7 rounded-full overflow-hidden bg-muted border-2 border-background z-10">
              <img
                src={otherParticipants[0]?.avatar || "/placeholder.svg"}
                alt={otherParticipants[0]?.name || "User"}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-0 right-0 w-7 h-7 rounded-full overflow-hidden bg-muted border-2 border-background">
              {otherParticipants[1] ? (
                <img
                  src={otherParticipants[1].avatar}
                  alt={otherParticipants[1].name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-primary flex items-center justify-center">
                  <User size={14} className="text-primary-foreground" />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline">
          <h4 className="text-sm font-medium truncate">{getConversationName()}</h4>
          {lastMessage && (
            <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
              {formatRelativeTime(lastMessage.timestamp)}
            </span>
          )}
        </div>
        {lastMessage && (
          <p className="text-xs text-muted-foreground truncate mt-1">
            {isLastMessageFromCurrentUser && <span className="font-medium">You: </span>}
            {truncateContent(lastMessage.content)}
          </p>
        )}
      </div>
    </div>
  );
};

export default MessageCard;
