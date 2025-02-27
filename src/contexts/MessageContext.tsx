
import React, { createContext, useContext, useState } from "react";
import { toast } from "sonner";

// Types
interface User {
  id: string;
  name: string;
  avatar: string;
}

interface Message {
  id: string;
  userId: string;
  content: string;
  timestamp: Date;
}

interface Conversation {
  id: string;
  participants: User[];
  messages: Message[];
  lastActivity: Date;
}

interface MessageContextType {
  currentUser: User;
  users: User[];
  conversations: Conversation[];
  activeConversation: Conversation | null;
  setActiveConversation: (conversation: Conversation) => void;
  sendMessage: (content: string) => void;
  createConversation: (participantIds: string[]) => void;
  searchUsers: (query: string) => User[];
}

// Mock data
const mockUsers: User[] = [
  {
    id: "user-1",
    name: "You",
    avatar: "/placeholder.svg",
  },
  {
    id: "user-2",
    name: "Alex Kim",
    avatar: "/placeholder.svg",
  },
  {
    id: "user-3",
    name: "Jordan Taylor",
    avatar: "/placeholder.svg",
  },
  {
    id: "user-4",
    name: "Morgan Lee",
    avatar: "/placeholder.svg",
  },
  {
    id: "user-5",
    name: "Riley Johnson",
    avatar: "/placeholder.svg",
  },
];

const generateMockMessages = (userIds: string[]): Message[] => {
  const messages = [];
  const now = new Date();
  
  // Generate 3-5 messages for this conversation
  const count = Math.floor(Math.random() * 3) + 3;
  
  for (let i = 0; i < count; i++) {
    const userId = userIds[Math.floor(Math.random() * userIds.length)];
    const timestamp = new Date(now.getTime() - (count - i) * 3600000 * Math.random());
    
    messages.push({
      id: `msg-${Date.now()}-${i}`,
      userId,
      content: getRandomMessage(),
      timestamp,
    });
  }
  
  // Sort by timestamp
  return messages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
};

const getRandomMessage = (): string => {
  const messages = [
    "Hey, have you listened to the new album?",
    "This playlist is amazing!",
    "I'm going to their concert next month.",
    "What's your favorite track?",
    "The bridge in that song is incredible.",
    "I've been looking for this artist for ages!",
    "Their live performances are even better than the recordings.",
    "The percussion on this track is so unique.",
    "I can't stop listening to this on repeat.",
    "Do you have any similar recommendations?",
  ];
  return messages[Math.floor(Math.random() * messages.length)];
};

const generateMockConversations = (users: User[]): Conversation[] => {
  const currentUserId = users[0].id;
  return [
    {
      id: "conv-1",
      participants: [users[0], users[1]],
      messages: generateMockMessages([currentUserId, users[1].id]),
      lastActivity: new Date(),
    },
    {
      id: "conv-2",
      participants: [users[0], users[2]],
      messages: generateMockMessages([currentUserId, users[2].id]),
      lastActivity: new Date(Date.now() - 86400000), // 1 day ago
    },
    {
      id: "conv-3",
      participants: [users[0], users[3], users[4]],
      messages: generateMockMessages([currentUserId, users[3].id, users[4].id]),
      lastActivity: new Date(Date.now() - 172800000), // 2 days ago
    },
  ];
};

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const MessageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users] = useState<User[]>(mockUsers);
  const [conversations, setConversations] = useState<Conversation[]>(
    generateMockConversations(mockUsers)
  );
  const [activeConversation, setActiveConversationState] = useState<Conversation | null>(null);
  const currentUser = users[0]; // First user is the current user

  const setActiveConversation = (conversation: Conversation) => {
    setActiveConversationState(conversation);
  };

  const sendMessage = (content: string) => {
    if (!activeConversation) return;
    if (!content.trim()) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      userId: currentUser.id,
      content,
      timestamp: new Date(),
    };

    const updatedConversation: Conversation = {
      ...activeConversation,
      messages: [...activeConversation.messages, newMessage],
      lastActivity: new Date(),
    };

    setConversations(
      conversations.map((conv) => 
        conv.id === activeConversation.id ? updatedConversation : conv
      )
    );

    setActiveConversationState(updatedConversation);
  };

  const createConversation = (participantIds: string[]) => {
    // Ensure current user is included
    if (!participantIds.includes(currentUser.id)) {
      participantIds.push(currentUser.id);
    }

    // Get participant users
    const participants = users.filter((user) => participantIds.includes(user.id));

    // Check if conversation already exists with these exact participants
    const participantIdsSet = new Set(participantIds);
    const existingConversation = conversations.find((conv) => {
      const convParticipantIds = new Set(conv.participants.map((p) => p.id));
      return (
        participantIdsSet.size === convParticipantIds.size &&
        [...participantIdsSet].every((id) => convParticipantIds.has(id))
      );
    });

    if (existingConversation) {
      setActiveConversationState(existingConversation);
      toast.info("Opened existing conversation");
      return;
    }

    // Create new conversation
    const newConversation: Conversation = {
      id: `conv-${Date.now()}`,
      participants,
      messages: [],
      lastActivity: new Date(),
    };

    setConversations([...conversations, newConversation]);
    setActiveConversationState(newConversation);
    toast.success("Created new conversation");
  };

  const searchUsers = (query: string): User[] => {
    if (!query) return [];
    const lowerQuery = query.toLowerCase();
    // Don't include current user in search results
    return users
      .filter((user) => user.id !== currentUser.id)
      .filter((user) => user.name.toLowerCase().includes(lowerQuery));
  };

  return (
    <MessageContext.Provider
      value={{
        currentUser,
        users,
        conversations,
        activeConversation,
        setActiveConversation,
        sendMessage,
        createConversation,
        searchUsers,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export const useMessages = () => {
  const context = useContext(MessageContext);
  if (context === undefined) {
    throw new Error("useMessages must be used within a MessageProvider");
  }
  return context;
};
