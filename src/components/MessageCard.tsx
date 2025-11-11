import React from "react";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMessages } from "@/contexts/MessageContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Message {
  id: string;
  user_id: string;
  content: string;
  created_at: Date;
}

interface User {
  id: string;
  username: string;
  avatar_url: string;
}

interface Conversation {
  id: string;
  participants: User[];
  messages: Message[];
  last_message_at: Date;
}

interface MessageCardProps {
  conversation: Conversation;
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
    (p) => p.id !== currentUser?.id
  );

  // Get conversation name
  const getConversationName = (): string => {
    if (otherParticipants.length === 0) {
      return "Just you";
    } else if (otherParticipants.length === 1) {
      return otherParticipants[0].username;
    } else {
      return `${otherParticipants[0].username} and ${otherParticipants.length - 1} more`;
    }
  };

  // Get last message
  const lastMessage = conversation.messages[conversation.messages.length - 1];
  
  // Check if last message is from current user
  const isLastMessageFromCurrentUser = lastMessage?.user_id === currentUser?.id;

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
          <Avatar className="w-10 h-10">
            <AvatarImage src={otherParticipants[0].avatar_url} />
            <AvatarFallback>{otherParticipants[0].username[0].toUpperCase()}</AvatarFallback>
          </Avatar>
        ) : (
          <div className="relative w-10 h-10">
            <Avatar className="absolute top-0 left-0 w-7 h-7 border-2 border-background z-10">
              <AvatarImage src={otherParticipants[0]?.avatar_url} />
              <AvatarFallback>{otherParticipants[0]?.username[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <Avatar className="absolute bottom-0 right-0 w-7 h-7 border-2 border-background">
              {otherParticipants[1] ? (
                <>
                  <AvatarImage src={otherParticipants[1].avatar_url} />
                  <AvatarFallback>{otherParticipants[1].username[0].toUpperCase()}</AvatarFallback>
                </>
              ) : (
                <AvatarFallback>
                  <User size={14} />
                </AvatarFallback>
              )}
            </Avatar>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline">
          <h4 className="text-sm font-medium truncate">{getConversationName()}</h4>
          {lastMessage && (
            <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
              {formatRelativeTime(lastMessage.created_at)}
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
