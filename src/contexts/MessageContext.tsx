import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "./UserContext";

// Types
interface User {
  id: string;
  username: string;
  avatar_url: string;
}

interface Message {
  id: string;
  user_id: string;
  content: string;
  created_at: Date;
}

interface Conversation {
  id: string;
  participants: User[];
  messages: Message[];
  last_message_at: Date;
}

interface MessageContextType {
  currentUser: User | null;
  users: User[];
  conversations: Conversation[];
  activeConversation: Conversation | null;
  setActiveConversation: (conversation: Conversation) => void;
  sendMessage: (content: string) => void;
  createConversation: (participantIds: string[]) => void;
  searchUsers: (query: string) => User[];
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const MessageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user: authUser } = useUser();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversationState] = useState<Conversation | null>(null);

  // Fetch current user profile
  useEffect(() => {
    if (!authUser) return;

    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (data && !error) {
        setCurrentUser(data);
      }
    };

    fetchProfile();
  }, [authUser]);

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');

      if (data && !error) {
        setUsers(data);
      }
    };

    fetchUsers();
  }, []);

  // Fetch conversations
  useEffect(() => {
    if (!authUser) return;

    const fetchConversations = async () => {
      const { data: convData, error } = await supabase
        .from('conversation_participants')
        .select('conversation_id, conversations(id, last_message_at)')
        .eq('user_id', authUser.id);

      if (convData && !error) {
        const conversationsWithDetails = await Promise.all(
          convData.map(async (conv: any) => {
            // Get all participants for this conversation
            const { data: participantData } = await supabase
              .from('conversation_participants')
              .select('user_id')
              .eq('conversation_id', conv.conversation_id);

            const participantIds = participantData?.map(p => p.user_id) || [];

            // Get profiles for all participants
            const { data: profileData } = await supabase
              .from('profiles')
              .select('*')
              .in('id', participantIds);

            const { data: messages } = await supabase
              .from('messages')
              .select('*')
              .eq('conversation_id', conv.conversation_id)
              .order('created_at', { ascending: true });

            return {
              id: conv.conversation_id,
              participants: profileData || [],
              messages: messages?.map(m => ({ ...m, created_at: new Date(m.created_at) })) || [],
              last_message_at: new Date(conv.conversations.last_message_at),
            };
          })
        );

        setConversations(conversationsWithDetails);
      }
    };

    fetchConversations();

    // Subscribe to new messages
    const channel = supabase
      .channel('messages-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        () => {
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [authUser]);

  const setActiveConversation = (conversation: Conversation) => {
    setActiveConversationState(conversation);
  };

  const sendMessage = async (content: string) => {
    if (!activeConversation || !authUser) return;
    if (!content.trim()) return;

    const { error } = await supabase
      .from('messages')
      .insert({
        conversation_id: activeConversation.id,
        user_id: authUser.id,
        content
      });

    if (error) {
      toast.error("Failed to send message");
    }
  };

  const createConversation = async (participantIds: string[]) => {
    if (!authUser) return;

    // Ensure current user is included
    if (!participantIds.includes(authUser.id)) {
      participantIds.push(authUser.id);
    }

    // Check if conversation already exists
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
    const { data: convData, error } = await supabase
      .from('conversations')
      .insert({})
      .select()
      .single();

    if (error || !convData) {
      toast.error("Failed to create conversation");
      return;
    }

    // Add participants
    const participantInserts = participantIds.map(id => ({
      conversation_id: convData.id,
      user_id: id
    }));

    const { error: partError } = await supabase
      .from('conversation_participants')
      .insert(participantInserts);

    if (partError) {
      toast.error("Failed to add participants");
      return;
    }

    const participants = users.filter(user => participantIds.includes(user.id));

    const newConversation: Conversation = {
      id: convData.id,
      participants,
      messages: [],
      last_message_at: new Date(convData.created_at),
    };

    setConversations([...conversations, newConversation]);
    setActiveConversationState(newConversation);
    toast.success("Created new conversation");
  };

  const searchUsers = (query: string): User[] => {
    if (!query || !authUser) return [];
    const lowerQuery = query.toLowerCase();
    return users
      .filter((user) => user.id !== authUser.id)
      .filter((user) => user.username.toLowerCase().includes(lowerQuery));
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
